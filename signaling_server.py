"""Minimal Socket.IO signaling server for Leveling tool."""
from __future__ import annotations

import logging
from collections import defaultdict
from typing import Any, Dict

import socketio
import uvicorn

LOGGER = logging.getLogger("signaling_server")

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
app = socketio.ASGIApp(sio)

rooms: Dict[str, set[str]] = defaultdict(set)
peer_meta: Dict[str, Dict[str, str]] = {}


async def broadcast_peer_list(room: str) -> None:
    peer_ids = list(rooms.get(room, set()))
    payload = {
        "peers": [
            {"sid": sid, "name": peer_meta.get(sid, {}).get("name", sid)}
            for sid in peer_ids
        ]
    }
    await sio.emit("peer-list", payload, room=room)


@sio.event
async def connect(sid: str, environ: Dict[str, Any]) -> None:
    LOGGER.info("Client connected: %s", sid)


@sio.event
async def disconnect(sid: str) -> None:
    LOGGER.info("Client disconnected: %s", sid)
    info = peer_meta.pop(sid, None)
    if info:
        room = info.get("room")
        if room:
            rooms[room].discard(sid)
            await sio.emit("peer-left", {"sid": sid}, room=room)
            await broadcast_peer_list(room)


@sio.event
async def join(sid: str, data: Dict[str, Any]) -> None:
    room = (data or {}).get("room")
    name = (data or {}).get("name") or sid
    if not room:
        LOGGER.warning("Join request missing room from %s", sid)
        return
    await sio.enter_room(sid, room)
    rooms[room].add(sid)
    peer_meta[sid] = {"name": name, "room": room}
    LOGGER.info("%s joined room %s", sid, room)
    await sio.emit("peer-joined", {"sid": sid}, room=room, skip_sid=sid)
    await broadcast_peer_list(room)


@sio.event
async def leave(sid: str, data: Dict[str, Any]) -> None:
    room = (data or {}).get("room")
    if not room:
        return
    await sio.leave_room(sid, room)
    rooms[room].discard(sid)
    meta = peer_meta.get(sid)
    if meta and meta.get("room") == room:
        peer_meta.pop(sid, None)
    LOGGER.info("%s left room %s", sid, room)
    await sio.emit("peer-left", {"sid": sid}, room=room)
    await broadcast_peer_list(room)


@sio.event
async def rename(sid: str, data: Dict[str, Any]) -> None:
    name = (data or {}).get("name")
    if not name:
        return
    info = peer_meta.get(sid)
    if not info:
        return
    info["name"] = str(name)
    room = info.get("room")
    if room:
        await broadcast_peer_list(room)


@sio.event
async def list_peers(sid: str, data: Dict[str, Any]) -> None:
    room = (data or {}).get("room")
    if not room:
        return
    await broadcast_peer_list(room)


@sio.event
async def signal(sid: str, data: Dict[str, Any]) -> None:
    if not data:
        return
    room = data.get("room")
    payload = data.get("payload")
    if not room:
        LOGGER.warning("Signal request missing room from %s", sid)
        return
    await sio.emit(
        "signal",
        {"from": sid, "payload": payload},
        room=room,
        skip_sid=sid,
    )


@sio.event
async def offer(sid: str, data: Dict[str, Any]) -> None:
    if not data:
        return
    room = data.get("room")
    target = data.get("target")
    payload = data.get("payload")
    if not room or not target or payload is None:
        LOGGER.warning("Offer missing fields from %s", sid)
        return
    sender_name = peer_meta.get(sid, {}).get("name", sid)
    await sio.emit(
        "offer",
        {"from": sid, "name": sender_name, "payload": payload},
        to=target,
    )


@sio.event
async def offer_response(sid: str, data: Dict[str, Any]) -> None:
    if not data:
        return
    room = data.get("room")
    target = data.get("target")
    accepted = bool(data.get("accepted"))
    payload = data.get("payload")
    offer_payload = data.get("offer")
    if not room or not target:
        LOGGER.warning("Offer response missing fields from %s", sid)
        return
    sender_name = peer_meta.get(sid, {}).get("name", sid)
    await sio.emit(
        "offer-response",
        {
            "from": sid,
            "name": sender_name,
            "accepted": accepted,
            "payload": payload,
            "offer": offer_payload,
        },
        to=target,
    )


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")


if __name__ == "__main__":
    main()
