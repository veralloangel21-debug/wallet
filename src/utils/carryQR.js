export function parseCarryQR(value) {
  const text = String(value || "").trim();

  // QR format used by Carry's Receive Money screen
  const match = /^carry:wallet:([a-zA-Z0-9_.-]{3,40})$/i.exec(text);

  return match ? match[1] : null;
}
