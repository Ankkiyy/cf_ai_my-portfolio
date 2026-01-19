
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Link2,
  LockKeyhole,
  PlugZap,
  Plus,
  RefreshCcw,
  Send,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { io, type Socket } from "socket.io-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import GameProfile from "./GameProfile";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { importLevelingState } from "@reducers/levelingSlice";

const STORAGE_KEY = "leveling.entries";
const SIGNAL_KIND = "leveling-webrtc";
const SIGNAL_VERSION = 1;
const STUN_SERVERS: RTCConfiguration["iceServers"] = [
  { urls: "stun:stun.l.google.com:19302" },
];

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const SOCKET_ROOM = "leveling-default";

const generateDisplayName = () => {
  const fragments = ["Vertex", "Pixel", "Flux", "Nova", "Orbit", "Quill", "Pulse"];
  const fragment = fragments[Math.floor(Math.random() * fragments.length)] ?? "Peer";
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${fragment}-${suffix}`;
};

type LevelingEntry = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
};

type StorageMeta = {
  keys: number;
  size: number;
};

type SignalPayload = {
  kind: typeof SIGNAL_KIND;
  version: number;
  type: "offer" | "answer";
  role: "host" | "client";
  sdp: string;
  createdAt: number;
};

type PeerRole = "host" | "client";
type ConnectionState = "disconnected" | "connecting" | "connected" | "failed";

type SyncMessage =
  | { type: "snapshot"; data: Record<string, string> }
  | { type: "request-snapshot" };

type PeerSummary = {
  sid: string;
  name: string;
};

type IncomingOffer = {
  fromSid: string;
  fromName: string;
  payload: string;
};

type SignalingCandidate = {
  requested: string;
  resolved: string;
  forced: boolean;
};

const encodeSignal = (payload: SignalPayload): string => {
  const json = JSON.stringify(payload);
  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(json);
  }

  const maybeBuffer = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  if (maybeBuffer) {
    return maybeBuffer.from(json, "utf-8").toString("base64");
  }

  return json;
};

const decodeSignal = (encoded: string): SignalPayload => {
  const trimmed = encoded.trim();
  const maybeBuffer = (globalThis as { Buffer?: typeof Buffer }).Buffer;
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  let json = trimmed;

  if (base64Pattern.test(trimmed) && trimmed.length % 4 === 0) {
    try {
      if (typeof globalThis.atob === "function") {
        json = globalThis.atob(trimmed);
      } else if (maybeBuffer) {
        json = maybeBuffer.from(trimmed, "base64").toString("utf-8");
      }
    } catch {
      json = trimmed;
    }
  }

  return JSON.parse(json) as SignalPayload;
};

const generateId = () => {
  const cryptoObject = globalThis.crypto as Crypto | undefined;
  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `leveling-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const formatRelativeTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;

  if (Number.isNaN(diff) || !Number.isFinite(diff)) {
    return "Unknown";
  }

  if (diff < 60_000) {
    return "moments ago";
  }

  if (diff < 3_600_000) {
    const mins = Math.max(1, Math.floor(diff / 60_000));
    return `${mins} min ago`;
  }

  if (diff < 86_400_000) {
    const hours = Math.max(1, Math.floor(diff / 3_600_000));
    return `${hours} hr ago`;
  }

  const date = new Date(timestamp);
  return date.toLocaleString();
};

const formatBytes = (size: number) => {
  if (!Number.isFinite(size) || size <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"] as const;
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(size) / Math.log(1024)),
  );
  const value = size / 1024 ** index;

  return `${value.toFixed(value < 10 && index > 0 ? 1 : 0)} ${units[index] ?? "B"}`;
};

const LevelingTool = () => {
  const dispatch = useAppDispatch();
  const levelingState = useAppSelector((state) => state.leveling);
  
  const [entries, setEntries] = useState<LevelingEntry[]>([]);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSavePending, setAutoSavePending] = useState(false);

  const [storageMeta, setStorageMeta] = useState<StorageMeta>({ keys: 0, size: 0 });

  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [peerListModalOpen, setPeerListModalOpen] = useState(false);

  const [hostSignal, setHostSignal] = useState<string | null>(null);
  const [hostError, setHostError] = useState<string | null>(null);
  const [hostSessionStarted, setHostSessionStarted] = useState(false);

  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinGeneratingAnswer, setJoinGeneratingAnswer] = useState(false);
  const [joinAwaitingHost, setJoinAwaitingHost] = useState(false);

  const [displayName, setDisplayName] = useState(() => generateDisplayName());
  const displayNameRef = useRef(displayName);
  const [customServerUrl, setCustomServerUrl] = useState<string | null>(() => {
    if (!isBrowser) {
      return null;
    }
    return window.localStorage.getItem("leveling.signalingUrl");
  });
  const [signalingUrlIndex, setSignalingUrlIndex] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [peerList, setPeerList] = useState<PeerSummary[]>([]);
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [incomingOffer, setIncomingOffer] = useState<IncomingOffer | null>(null);
  const [offerStatusMessage, setOfferStatusMessage] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>("disconnected");
  const [peerRole, setPeerRole] = useState<PeerRole | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const peerRoleRef = useRef<PeerRole | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const autoOfferRequestedRef = useRef(false);
  const previousHostModalOpenRef = useRef(false);
  const requestPeerList = useCallback(() => {
    const socket = socketRef.current;
    if (socket && socketConnected) {
      socket.emit("list_peers", { room: SOCKET_ROOM });
    }
  }, [socketConnected]);

  useEffect(() => {
    displayNameRef.current = displayName;
  }, [displayName]);

  const collectLocalStorageSnapshot = useCallback(() => {
    if (!isBrowser) {
      return {} as Record<string, string>;
    }

    const snapshot: Record<string, string> = {};

    // Include the leveling state from Redux persist
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      if (!key) {
        continue;
      }
      // Prioritize syncing the leveling data
      if (key === 'persist:root' || key.startsWith('leveling')) {
        const value = window.localStorage.getItem(key);
        snapshot[key] = value ?? "";
      }
    }

    return snapshot;
  }, []);

  const refreshStorageMeta = useCallback(() => {
    const snapshot = collectLocalStorageSnapshot();
    const raw = JSON.stringify(snapshot);
    setStorageMeta({
      keys: Object.keys(snapshot).length,
      size: raw.length,
    });
  }, [collectLocalStorageSnapshot]);

  const loadEntriesFromStorage = useCallback(() => {
    if (!isBrowser) {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setEntries([]);
        setActiveEntryId(null);
        setDraftTitle("");
        setDraftContent("");
        refreshStorageMeta();
        return;
      }

      const parsed = JSON.parse(raw) as LevelingEntry[] | undefined;
      if (!Array.isArray(parsed)) {
        setEntries([]);
        setActiveEntryId(null);
        setDraftTitle("");
        setDraftContent("");
        refreshStorageMeta();
        return;
      }

      const normalized = parsed.map((entry) => ({
        id: entry.id ?? generateId(),
        title: entry.title ?? "Untitled entry",
        content: entry.content ?? "",
        updatedAt: entry.updatedAt ?? Date.now(),
      }));

      setEntries(normalized);
      const firstEntry = normalized[0];
      setActiveEntryId((prev) =>
        prev && normalized.some((entry) => entry.id === prev)
          ? prev
          : firstEntry?.id ?? null,
      );
      refreshStorageMeta();
    } catch (error) {
      console.error("Failed to load Leveling entries", error);
      setEntries([]);
      setActiveEntryId(null);
      setDraftTitle("");
      setDraftContent("");
      refreshStorageMeta();
    }
  }, [refreshStorageMeta]);

  useEffect(() => {
    loadEntriesFromStorage();
  }, [loadEntriesFromStorage]);

  const activeEntry = useMemo(
    () => entries.find((entry) => entry.id === activeEntryId) ?? null,
    [entries, activeEntryId],
  );

  useEffect(() => {
    if (activeEntry) {
      setDraftTitle(activeEntry.title);
      setDraftContent(activeEntry.content);
    } else {
      setDraftTitle("");
      setDraftContent("");
    }
  }, [activeEntry]);

  const sendSnapshotToPeer = useCallback(() => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open") {
      return;
    }

    try {
      const snapshot = collectLocalStorageSnapshot();
      const message: SyncMessage = { type: "snapshot", data: snapshot };
      channel.send(JSON.stringify(message));
    } catch (error) {
      console.error("Failed to send snapshot", error);
    }
  }, [collectLocalStorageSnapshot]);

  const applySnapshot = useCallback(
    (snapshot: Record<string, string>) => {
      if (!isBrowser) {
        return;
      }

      try {
        const existingKeys: string[] = [];
        for (let index = 0; index < window.localStorage.length; index += 1) {
          const key = window.localStorage.key(index);
          if (key) {
            existingKeys.push(key);
          }
        }

        const nextKeys = new Set(Object.keys(snapshot));
        existingKeys.forEach((key) => {
          if (!nextKeys.has(key)) {
            window.localStorage.removeItem(key);
          }
        });

        Object.entries(snapshot).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });

        loadEntriesFromStorage();
      } catch (error) {
        console.error("Failed to apply snapshot", error);
      } finally {
        refreshStorageMeta();
      }
    },
    [loadEntriesFromStorage, refreshStorageMeta]
  );

  const handleDataChannelMessage = useCallback(
    (raw: string) => {
      try {
        const message = JSON.parse(raw) as SyncMessage;
        if (message.type === "snapshot" && message.data) {
          applySnapshot(message.data);
        } else if (message.type === "request-snapshot") {
          sendSnapshotToPeer();
        }
      } catch (error) {
        console.error("Invalid sync message", error);
      }
    },
    [applySnapshot, sendSnapshotToPeer]
  );

  const cleanupPeerConnection = useCallback(() => {
    const channel = dataChannelRef.current;
    dataChannelRef.current = null;
    if (channel) {
      try {
        if (channel.readyState === "open" || channel.readyState === "connecting") {
          channel.close();
        }
      } catch (error) {
        console.error("Failed to close data channel", error);
      }
    }

    const peer = peerRef.current;
    peerRef.current = null;
    if (peer) {
      peer.onconnectionstatechange = null;
      peer.onicecandidate = null;
      peer.ondatachannel = null;
      try {
        peer.close();
      } catch (error) {
        console.error("Failed to close peer connection", error);
      }
    }

    peerRoleRef.current = null;
    setPeerRole(null);
    setConnectionStatus("disconnected");
  }, []);

  const setupDataChannel = useCallback(
    (channel: RTCDataChannel) => {
      dataChannelRef.current = channel;

      channel.onopen = () => {
        setConnectionStatus("connected");
        setJoinAwaitingHost(false);
        if (peerRoleRef.current === "client") {
          try {
            const request: SyncMessage = { type: "request-snapshot" };
            channel.send(JSON.stringify(request));
          } catch (error) {
            console.error("Failed to request snapshot", error);
          }
        } else {
          sendSnapshotToPeer();
        }
      };

      channel.onmessage = (event) => {
        if (typeof event.data === "string") {
          handleDataChannelMessage(event.data);
        }
      };

      channel.onclose = () => {
        if (dataChannelRef.current === null) {
          return;
        }
        cleanupPeerConnection();
      };

      channel.onerror = (event) => {
        console.error("Data channel error", event);
        setConnectionStatus("failed");
      };
    },
    [cleanupPeerConnection, handleDataChannelMessage, sendSnapshotToPeer]
  );

  const createPeerConnection = useCallback(
    (role: PeerRole) => {
      if (peerRoleRef.current && peerRoleRef.current !== role) {
        throw new Error(`Session already initialised as ${peerRoleRef.current}. Disconnect first.`);
      }

      if (peerRef.current) {
        return peerRef.current;
      }

      const peer = new RTCPeerConnection({ iceServers: STUN_SERVERS });
      peerRef.current = peer;
      peerRoleRef.current = role;
      setPeerRole(role);
      setConnectionStatus("connecting");

      peer.onconnectionstatechange = () => {
        const state = peer.connectionState;
        if (state === "connected") {
          setConnectionStatus("connected");
        } else if (state === "failed") {
          setConnectionStatus("failed");
        } else if (state === "disconnected") {
          setConnectionStatus("disconnected");
        } else if (state === "connecting") {
          setConnectionStatus("connecting");
        }
      };

      peer.oniceconnectionstatechange = () => {
        if (peer.iceConnectionState === "failed") {
          setConnectionStatus("failed");
        }
      };

      if (role === "host") {
        const channel = peer.createDataChannel("leveling-sync", { ordered: true });
        setupDataChannel(channel);
      } else {
        peer.ondatachannel = (event) => {
          setupDataChannel(event.channel);
        };
      }

      return peer;
    },
    [setupDataChannel]
  );

  const waitForIceGathering = (peer: RTCPeerConnection) =>
    new Promise<void>((resolve) => {
      if (peer.iceGatheringState === "complete") {
        resolve();
        return;
      }

      const checkState = () => {
        if (peer.iceGatheringState === "complete") {
          peer.removeEventListener("icegatheringstatechange", checkState);
          resolve();
        }
      };

      peer.addEventListener("icegatheringstatechange", checkState);
    });

  const resetHostHandshake = useCallback(() => {
    setHostSignal(null);
    setHostError(null);
    setHostSessionStarted(false);
    setSelectedPeerId(null);
    setOfferStatusMessage(null);
  }, []);

  const resetJoinHandshake = useCallback(() => {
    setJoinError(null);
    setJoinGeneratingAnswer(false);
    setIncomingOffer(null);
    setJoinAwaitingHost(false);
  }, []);

  const startHostingSession = useCallback(async () => {
    if (connectionStatus === "connected") {
      setHostError("Already connected to a peer. Disconnect first.");
      return;
    }

    if (peerRoleRef.current === "client") {
      setHostError("Currently joined as a client. Disconnect before hosting.");
      return;
    }

    setHostSessionStarted(true);
    setHostError(null);
    setOfferStatusMessage(null);

    try {
      cleanupPeerConnection();
      const peer = createPeerConnection("host");
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await waitForIceGathering(peer);

      const description = peer.localDescription;
      if (!description?.sdp) {
        throw new Error("Offer missing SDP");
      }

      const signal = encodeSignal({
        kind: SIGNAL_KIND,
        version: SIGNAL_VERSION,
        type: "offer",
        role: "host",
        sdp: description.sdp,
        createdAt: Date.now(),
      });

      setHostSignal(signal);
    } catch (error) {
      console.error("Failed to start hosting session", error);
      setHostError(error instanceof Error ? error.message : "Unable to create offer");
      cleanupPeerConnection();
      setHostSessionStarted(false);
    }
  }, [cleanupPeerConnection, connectionStatus, createPeerConnection]);

  const handleHostAnswerSignal = useCallback(
    async (encoded: string) => {
      try {
        const signal = decodeSignal(encoded);
        if (signal.kind !== SIGNAL_KIND || signal.type !== "answer") {
          throw new Error("Scanned code is not a Leveling answer");
        }

        const peer = peerRef.current;
        if (!peer) {
          throw new Error("Session is no longer active");
        }

        await peer.setRemoteDescription({ type: "answer", sdp: signal.sdp });
        setHostModalOpen(false);
        setHostSignal(null);
        setHostSessionStarted(false);
      } catch (error) {
        console.error("Failed to apply answer", error);
        setHostError(error instanceof Error ? error.message : "Unable to apply answer");
      }
    },
    []
  );

  const processJoinOffer = useCallback(
    async (encoded: string, options?: { onAnswerReady?: (answer: string) => void }) => {
      setJoinGeneratingAnswer(true);
      try {
        const signal = decodeSignal(encoded);
        if (signal.kind !== SIGNAL_KIND || signal.type !== "offer") {
          throw new Error("Scanned code is not a Leveling offer");
        }

        const peer = createPeerConnection("client");
        await peer.setRemoteDescription({ type: "offer", sdp: signal.sdp });
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await waitForIceGathering(peer);

        const description = peer.localDescription;
        if (!description?.sdp) {
          throw new Error("Answer missing SDP");
        }

        const encodedAnswer = encodeSignal({
          kind: SIGNAL_KIND,
          version: SIGNAL_VERSION,
          type: "answer",
          role: "client",
          sdp: description.sdp,
          createdAt: Date.now(),
        });

        options?.onAnswerReady?.(encodedAnswer);
      } catch (error) {
        console.error("Failed to process offer", error);
        setJoinError(error instanceof Error ? error.message : "Unable to process offer");
        cleanupPeerConnection();
      } finally {
        setJoinGeneratingAnswer(false);
      }
    },
    [cleanupPeerConnection, createPeerConnection]
  );

  const selectedPeerName = useMemo(() => {
    if (!selectedPeerId) {
      return null;
    }
    return peerList.find((peer) => peer.sid === selectedPeerId)?.name ?? null;
  }, [peerList, selectedPeerId]);

  const handleSendOfferToPeer = useCallback(
    (targetPeerId?: string) => {
      const socket = socketRef.current;
      if (!socket || !socketConnected) {
        setHostError("Connect to the signaling server before sending offers.");
        return;
      }
      if (!hostSignal) {
        setHostError("Generate an offer before sending it to a peer.");
        return;
      }
      const peerId = targetPeerId ?? selectedPeerId;
      if (!peerId) {
        setHostError("Select a peer to deliver the offer to.");
        return;
      }
      const peerName = peerList.find((peer) => peer.sid === peerId)?.name ?? "Peer";
      setHostError(null);
      setOfferStatusMessage(`Sending offer to ${peerName}…`);
      socket.emit("offer", {
        room: SOCKET_ROOM,
        target: peerId,
        payload: hostSignal,
      });
    },
    [hostSignal, peerList, selectedPeerId, socketConnected],
  );

  const openHostModal = useCallback(() => {
    setHostError(null);
    setOfferStatusMessage(null);

    if (!hostSignal && !hostSessionStarted) {
      void startHostingSession();
    }

    setHostModalOpen(true);
  }, [hostSignal, hostSessionStarted, startHostingSession]);

  const handleDeclineIncomingOffer = useCallback(() => {
    const offer = incomingOffer;
    if (!offer) {
      return;
    }
    const socket = socketRef.current;
    if (socket && socketConnected) {
      socket.emit("offer_response", {
        room: SOCKET_ROOM,
        target: offer.fromSid,
        accepted: false,
      });
    }
    setIncomingOffer(null);
    setJoinError(null);
    setJoinAwaitingHost(false);
  }, [incomingOffer, socketConnected]);

  const handleAcceptIncomingOffer = useCallback(() => {
    const offer = incomingOffer;
    console.log("Accepting incoming offer");
    if (!offer) {
      return;
    }
    const socket = socketRef.current;
    if (!socket || !socketConnected) {
      setJoinError("Connect to the signaling server before accepting offers.");
      return;
    }
    console.log("Socket connected, processing offer");

    if (peerRoleRef.current === "host") {
      if (connectionStatus === "connected") {
        setJoinError("Disconnect from your current session before joining a new one.");
        return;
      }
      cleanupPeerConnection();
      resetHostHandshake();
    }

    console.log("Processing join offer");

    setJoinError(null);
    setJoinAwaitingHost(false);
    void (async () => {
      try {
        await processJoinOffer(offer.payload, {
          onAnswerReady: (answer) => {
            socket.emit("offer_response", {
              room: SOCKET_ROOM,
              target: offer.fromSid,
              accepted: true,
              payload: answer,
              offer: offer.payload,
            });
            setIncomingOffer(null);
            setJoinAwaitingHost(true);
          },
        });
      } catch (error) {
        console.error("Failed to accept offer", error);
        setJoinError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to accept offer",
        );
        setJoinAwaitingHost(false);
      }
    })();

  }, [incomingOffer, processJoinOffer, socketConnected]);

  const persistEntries = useCallback(
    (nextEntries: LevelingEntry[]) => {
      setEntries(nextEntries);
      if (isBrowser) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEntries));
      }
      refreshStorageMeta();
      sendSnapshotToPeer();
    },
    [refreshStorageMeta, sendSnapshotToPeer]
  );

  const handleAddEntry = () => {
    const newEntry: LevelingEntry = {
      id: generateId(),
      title: "Untitled entry",
      content: "",
      updatedAt: Date.now(),
    };

    const nextEntries = [newEntry, ...entries];
    persistEntries(nextEntries);
    setActiveEntryId(newEntry.id);
    setDraftTitle(newEntry.title);
    setDraftContent(newEntry.content);
  };

  const handleSelectEntry = (entryId: string) => {
    setActiveEntryId(entryId);
  };

  const handleDeleteEntry = () => {
    if (!activeEntryId) {
      return;
    }

    const nextEntries = entries.filter((entry) => entry.id !== activeEntryId);
    persistEntries(nextEntries);

    if (nextEntries.length === 0) {
      setActiveEntryId(null);
      setDraftTitle("");
      setDraftContent("");
      return;
    }

    setActiveEntryId(nextEntries[0]?.id ?? null);
  };

  const handleSaveEntry = useCallback(() => {
    if (!activeEntryId) {
      return;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
    setAutoSavePending(false);

    const nextEntries = entries.map((entry) => {
      if (entry.id !== activeEntryId) {
        return entry;
      }

      return {
        ...entry,
        title: draftTitle.trim() ? draftTitle.trim() : "Untitled entry",
        content: draftContent,
        updatedAt: Date.now(),
      };
    });

    persistEntries(nextEntries);
  }, [activeEntryId, draftContent, draftTitle, entries, persistEntries]);

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSavePending(true);
    autoSaveTimerRef.current = setTimeout(() => {
      autoSaveTimerRef.current = null;
      handleSaveEntry();
    }, 3000);
  }, [handleSaveEntry]);

  useEffect(() => () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  const handleDisconnect = () => {
    cleanupPeerConnection();
    resetHostHandshake();
    resetJoinHandshake();
    setHostModalOpen(false);
    setJoinModalOpen(false);
  };

  const storageKeysPreview = useMemo(() => {
    const snapshot = collectLocalStorageSnapshot();
    const keys = Object.keys(snapshot);
    return keys.slice(0, 6);
  }, [collectLocalStorageSnapshot]);

  const signalingConfig = useMemo(() => {
    const candidates: SignalingCandidate[] = [];

    const registerCandidate = (candidate: string) => {
      const trimmed = candidate.trim();
      if (!trimmed) {
        return;
      }

      let resolved = trimmed;
      let forced = false;

      if (isBrowser) {
        const pageProtocol = window.location.protocol;
        if (pageProtocol === "https:" || pageProtocol === "wss:") {
          const hasScheme = /^[A-Za-z][A-Za-z0-9+.-]*:/.test(trimmed);
          if (hasScheme) {
            try {
              const parsed = new URL(trimmed);
              if (parsed.protocol === "http:") {
                parsed.protocol = "https:";
                resolved = parsed.toString();
                forced = true;
              } else if (parsed.protocol === "ws:") {
                parsed.protocol = "wss:";
                resolved = parsed.toString();
                forced = true;
              }
            } catch (error) {
              console.warn("Unable to normalise signaling URL", error);
            }
          }
        }
      }

      if (candidates.some((entry) => entry.resolved === resolved)) {
        return;
      }

      candidates.push({ requested: trimmed, resolved, forced });
    };

    if (customServerUrl && customServerUrl.trim()) {
      registerCandidate(customServerUrl);
    } else {
      let envUrl: string | undefined;
      if (typeof import.meta !== "undefined") {
        const fromEnv =
          import.meta.env?.VITE_LEVELING_SIGNALING_URL ??
          import.meta.env?.VITE_SIGNALING_URL;
        if (typeof fromEnv === "string" && fromEnv.trim()) {
          envUrl = fromEnv.trim();
        }
      }

      if (envUrl) {
        registerCandidate(envUrl);
      } else {
        const defaultPorts = ["8000", "10001"] as const;
        const host =
          isBrowser && window.location.hostname
            ? window.location.hostname
            : "localhost";

        defaultPorts.forEach((port) => {
          registerCandidate(`http://${host}:${port}`);
        });

        if (host !== "localhost") {
          defaultPorts.forEach((port) => {
            registerCandidate(`http://localhost:${port}`);
          });
        }
      }
    }

    if (candidates.length === 0) {
      registerCandidate("http://localhost:8000");
      registerCandidate("http://localhost:10001");
    }

    return { candidates } as const;
  }, [customServerUrl]);

  const signalingCandidates = signalingConfig.candidates;
  const totalSignalingCandidates = signalingCandidates.length;
  const signalingUrl =
    signalingCandidates[signalingUrlIndex]?.resolved ??
    signalingCandidates[0]?.resolved ??
    "";
  const signalingUrlForcedSecure =
    signalingCandidates[signalingUrlIndex]?.forced ??
    signalingCandidates[0]?.forced ??
    false;
  const requestedSignalingUrl =
    signalingCandidates[signalingUrlIndex]?.requested ??
    signalingCandidates[0]?.requested ??
    "";
  const canAdvanceSignalingUrl =
    totalSignalingCandidates > 1 && signalingUrlIndex < totalSignalingCandidates - 1;

  useEffect(() => {
    setSignalingUrlIndex(0);
  }, [signalingConfig]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    if (!signalingUrl) {
      const existingSocket = socketRef.current;
      if (existingSocket) {
        existingSocket.disconnect();
        socketRef.current = null;
      }
      setSocketConnected(false);
      setPeerList([]);
      return;
    }

    const socket = io(signalingUrl, {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: !canAdvanceSignalingUrl,
    });

    socketRef.current = socket;

    const advanceSignalingUrl = () => {
      setSignalingUrlIndex((previous) => {
        if (previous >= totalSignalingCandidates - 1) {
          return previous;
        }
        return previous + 1;
      });
    };

    const handleConnectionIssue = () => {
      setSocketConnected(false);
      setPeerList([]);
      if (canAdvanceSignalingUrl) {
        advanceSignalingUrl();
        socket.off("connect_error", handleConnectionIssue);
        socket.off("connect_timeout", handleConnectionIssue);
        socket.disconnect();
        if (socketRef.current === socket) {
          socketRef.current = null;
        }
      }
    };

    const requestPeers = () => {
      socket.emit("list_peers", { room: SOCKET_ROOM });
    };

    const handlePeerList = (data: { peers?: Array<{ sid?: string; name?: string }> }) => {
      if (!data || !Array.isArray(data.peers)) {
        setPeerList([]);
        return;
      }

      const peers = data.peers
        .filter((peer): peer is { sid: string; name?: string } => Boolean(peer?.sid))
        .map((peer) => ({
          sid: peer.sid,
          name:
            typeof peer.name === "string" && peer.name.trim()
              ? peer.name.trim()
              : peer.sid,
        }));

      const selfId = socket.id;
      const filtered = selfId ? peers.filter((peer) => peer.sid !== selfId) : peers;
      setPeerList(filtered);
    };

    const handleOffer = (data: { from?: string; name?: string; payload?: unknown }) => {
      if (!data || typeof data.from !== "string" || typeof data.payload !== "string") {
        return;
      }

      setIncomingOffer({
        fromSid: data.from,
        fromName:
          typeof data.name === "string" && data.name.trim() ? data.name.trim() : "Peer",
        payload: data.payload,
      });
      setJoinModalOpen(true);
      setJoinGeneratingAnswer(false);
      setJoinAwaitingHost(false);
      setJoinError(null);
    };

    const handleOfferResponse = (data: {
      from?: string;
      name?: string;
      accepted?: boolean;
      payload?: unknown;
      offer?: unknown;
    }) => {
      if (!data) {
        return;
      }

      const responderName =
        typeof data.name === "string" && data.name.trim() ? data.name.trim() : "Peer";

      if (data.accepted && typeof data.payload === "string") {
        setOfferStatusMessage(`${responderName} accepted. Applying answer…`);
        void handleHostAnswerSignal(data.payload);
        if (typeof data.offer === "string" && data.offer.trim()) {
          setHostSignal(data.offer.trim());
        }
        setJoinAwaitingHost(false);
      } else if (data.accepted === false) {
        setOfferStatusMessage(`${responderName} declined the offer.`);
        cleanupPeerConnection();
      }
    };

    const handleConnect = () => {
      setSocketConnected(true);
      const safeName = displayNameRef.current.trim() || "Anonymous";
      socket.emit("join", { room: SOCKET_ROOM, name: safeName });
      requestPeers();
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
      setPeerList([]);
      setOfferStatusMessage(null);
    };

    const handlePeerActivity = () => {
      requestPeers();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("peer-list", handlePeerList);
    socket.on("peer-joined", handlePeerActivity);
    socket.on("peer-left", handlePeerActivity);
    socket.on("offer", handleOffer);
    socket.on("offer-response", handleOfferResponse);
    socket.on("connect_error", handleConnectionIssue);
    socket.on("connect_timeout", handleConnectionIssue);

    socket.connect();

    return () => {
      socket.off("connect_error", handleConnectionIssue);
      socket.off("connect_timeout", handleConnectionIssue);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("peer-list", handlePeerList);
      socket.off("peer-joined", handlePeerActivity);
      socket.off("peer-left", handlePeerActivity);
      socket.off("offer", handleOffer);
      socket.off("offer-response", handleOfferResponse);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [
    cleanupPeerConnection,
    handleHostAnswerSignal,
    signalingUrl,
    totalSignalingCandidates,
    canAdvanceSignalingUrl,
  ]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    if (customServerUrl && customServerUrl.trim()) {
      window.localStorage.setItem("leveling.signalingUrl", customServerUrl.trim());
    } else {
      window.localStorage.removeItem("leveling.signalingUrl");
    }
  }, [customServerUrl]);

  useEffect(() => {
    if (!socketConnected) {
      return;
    }
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    const safeName = displayName.trim() || "Anonymous";
    socket.emit("rename", { name: safeName });
    requestPeerList();
  }, [displayName, requestPeerList, socketConnected]);

  useEffect(() => {
    setSelectedPeerId((previous) =>
      previous && peerList.some((peer) => peer.sid === previous)
        ? previous
        : null,
    );
  }, [peerList]);

  useEffect(() => {
    if (!hostModalOpen) {
      return;
    }
    requestPeerList();
  }, [hostModalOpen, requestPeerList]);

  useEffect(() => {
    if (!peerListModalOpen) {
      return;
    }
    requestPeerList();
  }, [peerListModalOpen, requestPeerList]);


  useEffect(() => {
    if (hostModalOpen && !hostSessionStarted) {
      void startHostingSession();
    }
  }, [hostModalOpen, hostSessionStarted, startHostingSession]);

  useEffect(() => {
    if (autoOfferRequestedRef.current) {
      return;
    }
    if (connectionStatus === "connected") {
      return;
    }
    if (peerRoleRef.current === "client") {
      return;
    }
    autoOfferRequestedRef.current = true;
    void startHostingSession();
  }, [connectionStatus, startHostingSession]);

  useEffect(() => {
    const wasOpen = previousHostModalOpenRef.current;
    if (!hostModalOpen && wasOpen) {
      if (!hostSessionStarted && connectionStatus !== "connected") {
        resetHostHandshake();
        if (peerRoleRef.current === "host") {
          cleanupPeerConnection();
        }
      }
    }
    previousHostModalOpenRef.current = hostModalOpen;
  }, [cleanupPeerConnection, connectionStatus, hostModalOpen, hostSessionStarted, resetHostHandshake]);

  useEffect(() => {
    if (!joinModalOpen) {
      if (joinGeneratingAnswer || joinAwaitingHost) {
        return;
      }
      resetJoinHandshake();
      if (connectionStatus !== "connected" && peerRoleRef.current === "client") {
        cleanupPeerConnection();
      }
    }
  }, [cleanupPeerConnection, connectionStatus, joinAwaitingHost, joinGeneratingAnswer, joinModalOpen, resetJoinHandshake]);

  useEffect(() => {
    if (connectionStatus === "connected") {
      setHostModalOpen(false);
      setJoinModalOpen(false);
      resetHostHandshake();
      resetJoinHandshake();
    }
  }, [connectionStatus, resetHostHandshake, resetJoinHandshake]);

  useEffect(() => {
    if (connectionStatus === "failed" || connectionStatus === "disconnected") {
      setJoinAwaitingHost(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (connectionStatus === "connected" || connectionStatus === "connecting") {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
      return undefined;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [connectionStatus]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorage = () => {
      sendSnapshotToPeer();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [sendSnapshotToPeer]);

  useEffect(() => () => {
    cleanupPeerConnection();
  }, [cleanupPeerConnection]);

  const isConnected = connectionStatus === "connected";

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <LockKeyhole className="h-3.5 w-3.5" />
            Client-side workspace
          </div>
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">Leveling</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Game profile with skill leveling system and peer-to-peer sync
            </p>
          </div>
        </div>
        <div className="flex w-full max-w-sm flex-col gap-4 sm:items-end md:max-w-xs">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Display name
              </label>
              <Input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value.slice(0, 48))}
                placeholder="Visible to other peers"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Signaling server
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={customServerUrl ?? ""}
                  onChange={(event) => setCustomServerUrl(event.target.value)}
                  placeholder="http://localhost:8000"
                  className="sm:flex-1"
                />
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => setCustomServerUrl(null)}
                >
                  Use default
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${socketConnected ? "bg-emerald-500" : "bg-destructive"}`}
                />
                {socketConnected ? `Connected: ${signalingUrl}` : `Offline: ${signalingUrl}`}
              </div>
              {signalingUrlForcedSecure && (
                <div className="rounded-md border border-amber-300/60 bg-amber-200/20 px-3 py-2 text-[11px] text-amber-900">
                  HTTPS pages require secure signaling. Upgraded {requestedSignalingUrl} to {signalingUrl}. Provide an HTTPS/WSS endpoint or load Leveling over HTTP to use insecure signaling.
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 px-2 sm:w-auto"
                onClick={() => setPeerListModalOpen(true)}
              >
                <Users className="h-4 w-4" />
                {socketConnected
                  ? `View peers (${peerList.length})`
                  : "View peers"}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                resetJoinHandshake();
                setJoinModalOpen(true);
              }}
              disabled={isConnected}
            >
              <Link2 className="h-4 w-4" />
              Join session
            </Button>
            <Button
              onClick={() => {
                openHostModal();
              }}
              disabled={isConnected && peerRole !== "host"}
            >
              <Copy className="h-4 w-4" />
              Host session
            </Button>
          </div>
        </div>
      </div>

      <GameProfile />

      <div className="mt-10 rounded-2xl border border-border/70 bg-card/80 p-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-foreground">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Peer-to-peer sync</span>
          </div>
          <Separator orientation="vertical" className="hidden h-6 md:block" />
          <Badge variant={isConnected ? "default" : "outline"}>{connectionStatus}</Badge>
          {peerRole && (
            <span className="text-xs text-muted-foreground">
              Role: {peerRole === "host" ? "Host" : "Client"}
            </span>
          )}
          {isConnected && (
            <span className="text-xs text-muted-foreground">
              Your skills and progress sync automatically
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetJoinHandshake();
              setJoinModalOpen(true);
            }}
            disabled={isConnected}
          >
            <Link2 className="h-4 w-4" />
            Join session
          </Button>
          <Button
            size="sm"
            onClick={() => {
              openHostModal();
            }}
            disabled={isConnected && peerRole !== "host"}
          >
            <Copy className="h-4 w-4" />
            Host session
          </Button>
          {isConnected && (
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              <PlugZap className="h-4 w-4" />
              Disconnect
            </Button>
          )}
        </div>
      </div>

      <Dialog open={peerListModalOpen} onOpenChange={setPeerListModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Connected peers
            </DialogTitle>
            <DialogDescription>
              Devices discovered via {signalingUrl}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className={`h-2 w-2 rounded-full ${socketConnected ? "bg-emerald-500" : "bg-destructive"}`}
              />
              {socketConnected
                ? "Signaling link active"
                : "Not connected to signaling server"}
            </div>
            {socketConnected ? (
              peerList.length > 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {peerList.map((peer) => {
                      const isSelected = peer.sid === selectedPeerId;
                      return (
                        <div
                          key={peer.sid}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                            isSelected
                              ? "border-primary/60 bg-primary/10"
                              : "border-border/70 bg-background/60"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedPeerId(peer.sid)}
                            className="flex-1 text-left"
                          >
                            <div className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {peer.name}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground">
                              {peer.sid.slice(0, 8)}
                            </div>
                          </button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPeerId(peer.sid);
                              handleSendOfferToPeer(peer.sid);
                            }}
                            disabled={!hostSignal || !socketConnected}
                            className="flex items-center gap-1"
                          >
                            <Send className="h-4 w-4" />
                            Send
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="space-y-2">
                    {hostSignal ? (
                      <div className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                        Offer ready. Tap send next to a peer to deliver it instantly.
                      </div>
                    ) : hostSessionStarted ? (
                      <div className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                        Generating offer…
                      </div>
                    ) : (
                      <div className="rounded-md border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                        Start a new offer to share through signaling.
                      </div>
                    )}
                    {hostError && (
                      <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                        {hostError}
                      </div>
                    )}
                    {offerStatusMessage && (
                      <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
                        {offerStatusMessage}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHostSessionStarted(false);
                        void startHostingSession();
                      }}
                      className="flex-1 min-w-[140px]"
                      disabled={hostSessionStarted && !hostSignal}
                    >
                      <RefreshCcw className="h-4 w-4" />
                      {hostSignal ? "Regenerate" : "Generate offer"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-4 text-xs text-muted-foreground">
                  No peers online right now.
                </div>
              )
            ) : (
              <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-4 text-xs text-muted-foreground">
                Connect to the signaling server to view peers.
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={requestPeerList}
              disabled={!socketConnected}
              className="sm:flex-1"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setPeerListModalOpen(false)} className="sm:flex-1">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={hostModalOpen} onOpenChange={setHostModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Copy className="h-5 w-5" />
              Host a sync session
            </DialogTitle>
            <DialogDescription>
              Deliver offers through the signaling hub and wait for automatic answers from your peers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {hostError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {hostError}
              </div>
            )}
            {!hostSignal && !hostError && (
              <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                Generating offer…
              </div>
            )}
            {hostSignal && (
              <div className="space-y-3 rounded-xl border border-border/70 bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Send offer via signaling hub
                </p>
                {socketConnected ? (
                  peerList.length > 0 ? (
                    <div className="space-y-2">
                      {peerList.map((peer) => {
                        const isSelected = peer.sid === selectedPeerId;
                        return (
                          <div
                            key={peer.sid}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                              isSelected
                                ? "border-primary/60 bg-primary/10"
                                : "border-border/70 bg-background/60"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedPeerId(peer.sid)}
                              className="flex-1 text-left"
                            >
                              <div className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                                {peer.name}
                              </div>
                              <div className="text-[11px] font-mono text-muted-foreground">
                                {peer.sid.slice(0, 8)}
                              </div>
                            </button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedPeerId(peer.sid);
                                handleSendOfferToPeer(peer.sid);
                              }}
                              disabled={!hostSignal || !socketConnected}
                              className="flex items-center gap-1"
                            >
                              <Send className="h-4 w-4" />
                              Send
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      No peers online yet. Ask another device to open Leveling.
                    </div>
                  )
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Connect to the signaling server to target peers directly.
                  </div>
                )}
                <Button
                  onClick={() => handleSendOfferToPeer()}
                  disabled={!hostSignal || !selectedPeerId || !socketConnected}
                  className="w-full sm:w-auto"
                >
                  {selectedPeerName ? `Send offer to ${selectedPeerName}` : "Send offer"}
                </Button>
                {offerStatusMessage && (
                  <div className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-primary">
                    {offerStatusMessage}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setHostModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={joinModalOpen} onOpenChange={setJoinModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Link2 className="h-5 w-5" />
              Join a sync session
            </DialogTitle>
            <DialogDescription>
              Accept invites pushed through the signaling hub to generate an answer automatically and complete the link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {joinError && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {joinError}
              </div>
            )}
            {incomingOffer && (
              <div className="space-y-3 rounded-xl border border-border/70 bg-background/60 p-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Offer from {incomingOffer.fromName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accept to generate an answer automatically or decline to ignore it.
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-[11px] text-muted-foreground">
                  Payload received via signaling. No manual steps needed.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={handleAcceptIncomingOffer}
                    className="flex-1 min-w-[140px]"
                    disabled={joinGeneratingAnswer}
                  >
                    {joinGeneratingAnswer ? "Processing…" : "Accept offer"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeclineIncomingOffer}
                    className="flex-1 min-w-[140px]"
                    disabled={joinGeneratingAnswer}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}
            {!incomingOffer && !joinGeneratingAnswer && !joinAwaitingHost && (
              <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                Waiting for an offer from your host. Ask them to send an invite via the signaling list.
              </div>
            )}
            {joinAwaitingHost && !incomingOffer && (
              <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                Answer sent. Waiting for the host to finalise the connection…
              </div>
            )}
            {joinGeneratingAnswer && !incomingOffer && (
              <div className="rounded-xl border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                Building answer…
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setJoinModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LevelingTool;
