export async function validateMediaSignature(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const startsWith = (...signature: number[]) =>
    signature.every((value, index) => bytes[index] === value);

  if (startsWith(0xff, 0xd8, 0xff)) return file.type === "image/jpeg";

  if (
    startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
  ) return file.type === "image/png";

  if (startsWith(0x47, 0x49, 0x46, 0x38)) {
    return file.type === "image/gif";
  }

  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 && bytes[9] === 0x45 &&
    bytes[10] === 0x42 && bytes[11] === 0x50
  ) return file.type === "image/webp";

  if (
    bytes[4] === 0x66 && bytes[5] === 0x74 &&
    bytes[6] === 0x79 && bytes[7] === 0x70
  ) {
    return file.type === "video/mp4" || file.type === "video/quicktime";
  }

  if (startsWith(0x1a, 0x45, 0xdf, 0xa3)) {
    return file.type === "video/webm";
  }

  return false;
}