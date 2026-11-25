export type MediaType = "image" | "video";

export const MEDIA_BUCKETS = {
  image: "sslta-media-staging",
  video: "sslta-videos",
} as const;

export const MEDIA_LIMITS = {
  image: 10 * 1024 * 1024,
  video: 50 * 1024 * 1024,
} as const;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export function validateMediaFile(file: File) {
  const mediaType: MediaType | null =
    IMAGE_TYPES.includes(file.type)
      ? "image"
      : VIDEO_TYPES.includes(file.type)
        ? "video"
        : null;

  if (!mediaType) {
    return { valid: false, error: "Unsupported file type." } as const;
  }

  if (file.size <= 0 || file.size > MEDIA_LIMITS[mediaType]) {
    return {
      valid: false,
      error: `File exceeds the ${mediaType} size limit or is empty.`,
    } as const;
  }

  return { valid: true, mediaType } as const;
}