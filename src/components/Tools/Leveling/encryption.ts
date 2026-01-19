const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;
const ALGORITHM = "AES-GCM";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const getCrypto = (): Crypto => {
  const cryptoObject = globalThis.crypto as Crypto | undefined;
  if (!cryptoObject || !cryptoObject.subtle) {
    throw new Error("Web Crypto API with SubtleCrypto support is required");
  }
  return cryptoObject;
};

const toBase64 = (buffer: ArrayBuffer): string => {
  if (typeof globalThis.btoa === "function") {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i += 1) {
      binary += String.fromCharCode(bytes[i] ?? 0);
    }
    return globalThis.btoa(binary);
  }

  const maybeBuffer = (globalThis as { Buffer?: { from: (input: ArrayBuffer | Uint8Array) => { toString: (encoding: string) => string } } }).Buffer;
  if (maybeBuffer) {
    return maybeBuffer.from(buffer).toString("base64");
  }

  throw new Error("No base64 encoder available in this environment");
};

const fromBase64 = (value: string): ArrayBuffer => {
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i) & 0xff;
    }
    return bytes.buffer;
  }

  const maybeBuffer = (globalThis as { Buffer?: { from: (input: string, encoding: string) => Uint8Array } }).Buffer;
  if (maybeBuffer) {
    const buffer = maybeBuffer.from(value, "base64");
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i += 1) {
      view[i] = buffer[i] ?? 0;
    }
    return arrayBuffer;
  }

  throw new Error("No base64 decoder available in this environment");
};

const importKeyMaterial = async (password: string): Promise<CryptoKey> => {
  const cryptoObject = getCrypto();
  return cryptoObject.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
};

const deriveEncryptionKey = async (keyMaterial: CryptoKey, salt: ArrayBuffer): Promise<CryptoKey> => {
  const cryptoObject = getCrypto();
  return cryptoObject.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: ALGORITHM,
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
};

const concatBuffers = (parts: Uint8Array[]): ArrayBuffer => {
  const totalLength = parts.reduce((length, part) => length + part.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    merged.set(part, offset);
    offset += part.length;
  }

  return merged.buffer;
};

export const encryptPayload = async (plaintext: string, password: string): Promise<string> => {
  if (!password) {
    throw new Error("A password is required to encrypt data");
  }

  const cryptoObject = getCrypto();
  const salt = cryptoObject.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = cryptoObject.getRandomValues(new Uint8Array(IV_LENGTH));
  const keyMaterial = await importKeyMaterial(password);
  const encryptionKey = await deriveEncryptionKey(keyMaterial, salt.buffer);

  const ciphertext = await cryptoObject.subtle.encrypt(
    {
      name: ALGORITHM,
      iv,
    },
    encryptionKey,
    encoder.encode(plaintext)
  );

  return toBase64(concatBuffers([salt, iv, new Uint8Array(ciphertext)]));
};

export const decryptPayload = async (payload: string, password: string): Promise<string> => {
  if (!password) {
    throw new Error("A password is required to decrypt data");
  }

  const binaryPayload = new Uint8Array(fromBase64(payload));

  const salt = binaryPayload.slice(0, SALT_LENGTH);
  const iv = binaryPayload.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = binaryPayload.slice(SALT_LENGTH + IV_LENGTH);

  const keyMaterial = await importKeyMaterial(password);
  const encryptionKey = await deriveEncryptionKey(keyMaterial, salt.buffer);

  const cryptoObject = getCrypto();
  const plaintextBuffer = await cryptoObject.subtle.decrypt(
    {
      name: ALGORITHM,
      iv,
    },
    encryptionKey,
    ciphertext
  );

  return decoder.decode(plaintextBuffer);
};
