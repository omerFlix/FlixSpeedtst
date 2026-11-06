import discovered from "virtual:flix-videos";

export type ProjectVideo = {
  name: string;
  url: string;
};

const bundled = import.meta.glob("../videos/*.{mp4,webm,mov,m4v}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export function projectVideos(): ProjectVideo[] {
  const fromSrc = Object.entries(bundled).map(([path, url]) => ({
    name: decodeURIComponent(path.split("/").pop() || "video"),
    url,
  }));
  const map = new Map<string, ProjectVideo>();
  for (const video of [...discovered, ...fromSrc]) {
    map.set(`${video.name}:${video.url}`, video);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

export function resolutionLabel(height: number): string {
  if (height >= 4320) return "8K";
  if (height >= 2160) return "4K UHD";
  if (height >= 1440) return "1440p";
  if (height >= 1080) return "1080p";
  if (height >= 720) return "720p";
  if (height >= 480) return "480p";
  if (height >= 360) return "360p";
  if (height >= 240) return "240p";
  if (height > 0) return "144p";
  return "—";
}
