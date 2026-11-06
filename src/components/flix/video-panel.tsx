import { useEffect, useRef, useState } from "react";
import { Check, Clapperboard, Film, Lock, Play, Volume2, VolumeX } from "lucide-react";
import {
  demoPeaks,
  formatBytes,
  isAbortError,
  measureDownload,
  probe,
  simulateMbps,
} from "@/lib/measure";
import { projectVideos, resolutionLabel, SAMPLE_VIDEO } from "@/lib/videos";

const RES = [
  { n: "144p", req: 0.3, blur: 7 },
  { n: "240p", req: 0.7, blur: 5 },
  { n: "360p", req: 1.5, blur: 3.5 },
  { n: "480p", req: 2.5, blur: 2.5 },
  { n: "720p", req: 5, blur: 1.5 },
  { n: "1080p", req: 10, blur: 0.8 },
  { n: "1440p", req: 18, blur: 0.3 },
  { n: "4K UHD", req: 35, blur: 0 },
  { n: "8K", req: 80, blur: 0 },
] as const;

const VIDEO_SEC = 16;

type Level = "lock" | "ok" | "current";

type VideoResult = {
  avg: number;
  peak: number;
  maxName: string;
  supported: string;
  risk: string;
  startup: string;
  note: string;
  demo: boolean;
  bytes: number;
};

export function VideoPanel() {
  const library = projectVideos();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runningRef = useRef(false);
  const mutedRef = useRef(true);
  const objectUrl = useRef<string | null>(null);
  const captured = useRef(false);
  const uiAt = useRef(0);
  const [pick, setPick] = useState(0);
  const [fileUrl, setFileUrl] = useState<{ name: string; url: string } | null>(null);
  const [meta, setMeta] = useState<{ w: number; h: number; dur: number } | null>(null);
  const [poster, setPoster] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Teste hazır");
  const [progress, setProgress] = useState(0);
  const [bitrate, setBitrate] = useState<number | null>(null);
  const [levels, setLevels] = useState<Level[]>(() => RES.map(() => "lock"));
  const [blur, setBlur] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [badge, setBadge] = useState("—");
  const [result, setResult] = useState<VideoResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [muted, setMuted] = useState(true);

  const active = fileUrl ?? library[pick] ?? null;
  const src = active?.url ?? SAMPLE_VIDEO;
  const kind = fileUrl ? "dosya" : library.length ? "proje" : "ornek";

  useEffect(() => {
    mutedRef.current = muted;
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    captured.current = false;
    setBroken(false);
    setMeta(null);
    setPoster(null);

    const read = () => {
      if (video.readyState < 1) return;
      setMeta({
        w: video.videoWidth,
        h: video.videoHeight,
        dur: Number.isFinite(video.duration) ? video.duration : 0,
      });
      if (captured.current || runningRef.current || !video.videoWidth || video.readyState < 2) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, 320, 180);
        setPoster(canvas.toDataURL("image/jpeg", 0.72));
        captured.current = true;
      } catch {
        captured.current = true;
      }
    };

    read();
    video.addEventListener("loadedmetadata", read);
    video.addEventListener("loadeddata", read);
    return () => {
      video.removeEventListener("loadedmetadata", read);
      video.removeEventListener("loadeddata", read);
    };
  }, [src]);

  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  function takeFile(file: File) {
    if (runningRef.current) return;
    const looksVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if (!looksVideo) {
      setStatus("Bu dosya video değil. MP4, WebM veya MOV seç.");
      return;
    }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setFileUrl({ name: file.name, url });
    setResult(null);
    setStatus(`${file.name} hazır`);
  }

  function clearFile() {
    if (runningRef.current) return;
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setFileUrl(null);
    setResult(null);
  }

  function pushSample(mbps: number, elapsed: number, total: number) {
    const now = performance.now();
    if (now - uiAt.current < 100 && elapsed < total - 0.25) return;
    uiAt.current = now;
    setBitrate(mbps);
    let current = -1;
    RES.forEach((tier, index) => {
      if (mbps >= tier.req) current = index;
    });
    const stall = current >= 0 && mbps < RES[current]!.req * 0.82;
    setLevels(
      RES.map((tier, index) => {
        if (index === current && !stall) return "current";
        if (mbps >= tier.req) return "ok";
        return "lock";
      }),
    );
    setBlur(stall || current < 0 ? 8 : RES[current]!.blur);
    setBuffering(stall || current < 0);
    setBadge(current < 0 ? "—" : RES[current]!.n);
    setProgress(Math.min(100, (elapsed / total) * 100));
    const left = Math.max(0, Math.ceil(total - elapsed));
    setStatus(left > 0 ? `Video oynuyor · kalan ${left} sn` : "Hesaplanıyor…");
  }

  async function run() {
    if (runningRef.current) {
      abortRef.current?.abort();
      return;
    }
    const ac = new AbortController();
    abortRef.current = ac;
    runningRef.current = true;
    setRunning(true);
    setResult(null);
    setLevels(RES.map(() => "lock"));
    setBitrate(null);
    setProgress(0);
    setBuffering(true);
    setBadge("—");
    setBlur(6);
    setStatus("Video açılıyor…");
    const samples: number[] = [];
    const video = videoRef.current;
    if (video && !broken) {
      try {
        video.currentTime = 0;
        video.muted = true;
        await video.play();
        video.muted = mutedRef.current;
      } catch {
        /* autoplay can fail; the bandwidth test still runs */
      }
    }

    let demo = false;
    let bytes = 0;
    try {
      const live = await probe(ac.signal);
      if (!live) {
        demo = true;
        const peaks = demoPeaks();
        const started = performance.now();
        await simulateMbps(VIDEO_SEC * 1000, peaks.down, ac.signal, (value) => {
          samples.push(value);
          pushSample(value, (performance.now() - started) / 1000, VIDEO_SEC);
        });
      } else {
        const measured = await measureDownload({
          signal: ac.signal,
          minMs: 4000,
          maxMs: VIDEO_SEC * 1000,
          maxBytes: 70_000_000,
          streams: 3,
          onSample: (mbps, elapsed) => {
            samples.push(mbps);
            pushSample(mbps, elapsed, VIDEO_SEC);
          },
        });
        bytes = measured.bytes;
        if (!samples.length) samples.push(measured.mbps);
      }
      finish(samples, demo, bytes);
    } catch (error) {
      video?.pause();
      if (isAbortError(error)) setStatus("Video testi durduruldu");
      else setStatus(error instanceof Error ? error.message : "Video testi başarısız");
    } finally {
      runningRef.current = false;
      setRunning(false);
      setBuffering(false);
      abortRef.current = null;
    }
  }

  function finish(samples: number[], demo: boolean, bytes: number) {
    const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const peak = samples.length ? Math.max(...samples) : avg;
    let maxIdx = -1;
    RES.forEach((tier, index) => {
      if (avg >= tier.req) maxIdx = index;
    });
    const supported = RES.filter((tier) => avg >= tier.req).map((tier) => tier.n);
    const risk = avg < 5 ? "Yüksek" : avg < 15 ? "Orta" : "Düşük";
    const startup = (10 / Math.max(avg, 0.4)).toFixed(1);
    const maxName = maxIdx < 0 ? "—" : RES[maxIdx]!.n;
    let note: string;
    if (maxIdx < 0) {
      note = `Ortalama akış ${avg.toFixed(1)} Mbps. 144p bile rahat oynatılmıyor.`;
    } else if (maxIdx === RES.length - 1) {
      note = `Ortalama akış ${avg.toFixed(1)} Mbps. 8K dahil listedeki tüm çözünürlükler rahat.`;
    } else {
      note = `Ortalama akış ${avg.toFixed(1)} Mbps. ${RES[maxIdx]!.n} akıcı; bir üstü (${RES[maxIdx + 1]!.n}) takılabilir.`;
    }
    if (demo) note += " Ölçüm demo modunda.";
    setResult({
      avg,
      peak,
      maxName,
      supported: supported.length ? supported.join(", ") : "—",
      risk,
      startup,
      note,
      demo,
      bytes,
    });
    setLevels(RES.map((tier) => (avg >= tier.req ? "ok" : "lock")));
    setBlur(maxIdx < 0 ? 8 : RES[maxIdx]!.blur);
    setBadge(maxName);
    setBitrate(avg);
    setBuffering(false);
    setProgress(100);
    setStatus(demo ? "Demo video testi bitti" : "Video testi tamamlandı");
  }

  const sourceLine =
    kind === "dosya" && fileUrl
      ? `Seçilen dosya: ${fileUrl.name}`
      : kind === "proje" && active
        ? library.length > 1
          ? `Otomatik seçilen video: ${active.name}`
          : `Otomatik video: ${active.name}`
        : "Henüz proje videosu yok. MP4 dosyasını public/videos klasörüne bırak; adı ve çözünürlüğü kendiliğinden okunur.";

  return (
    <section className="card" aria-busy={running}>
      <div className="card-title">
        <span className="phase-icon" aria-hidden>
          <Clapperboard />
        </span>
        <span>Video akış testi</span>
      </div>
      <p className="muted center">
        Seçilen video oynarken bağlantı doyurulur. Hıza göre 144p’den 8K’ya hangi yayınların takılmadan
        izleneceği hesaplanır.
      </p>

      <div className="source-row">
        <p className="source-note">
          <Film aria-hidden />
          <span>
            {sourceLine}
            {meta && meta.h > 0
              ? ` · ${meta.w}×${meta.h} · ${resolutionLabel(meta.h)}${meta.dur > 0 ? ` · ${Math.round(meta.dur)} sn` : ""}`
              : ""}
          </span>
        </p>
        {library.length > 1 && !fileUrl ? (
          <div className="source-picks" role="listbox" aria-label="Proje videoları">
            {library.map((video, index) => (
              <button
                key={video.url}
                type="button"
                className={index === pick ? "on" : ""}
                disabled={running}
                onClick={() => {
                  setPick(index);
                  setResult(null);
                }}
              >
                {video.name}
              </button>
            ))}
          </div>
        ) : null}
        <div className="file-row">
          <button type="button" className="btn" disabled={running} onClick={() => fileRef.current?.click()}>
            Cihazdan seç
          </button>
          {fileUrl ? (
            <button type="button" className="btn" disabled={running} onClick={clearFile}>
              Proje videosuna dön
            </button>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) takeFile(file);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      <div
        className={dragOver ? "player drop-on" : "player"}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          const file = event.dataTransfer.files[0];
          if (file) takeFile(file);
        }}
      >
        <div className="player-screen">
          <video
            ref={videoRef}
            src={broken ? undefined : src}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onError={() => setBroken(true)}
            style={{ filter: blur > 0 ? `blur(${blur}px)` : "none" }}
          />
          {broken ? <div className="player-fallback">Video açılamadı, ölçüm yine de yapılır.</div> : null}
          <span className="badge">{badge}</span>
          <div className={running && !buffering ? "p-ov gone" : kind === "ornek" || broken || buffering ? "p-ov" : "p-ov gone"}>
            {buffering && running ? <div className="p-ring" /> : <Play />}
            <div className="p-status">{buffering && running ? "Tamponlanıyor…" : kind === "ornek" ? "Örnek video" : "Hazır"}</div>
          </div>
        </div>
        <div className="player-bar" aria-hidden>
          <i style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }} />
        </div>
        <div className="player-res">
          <span>{dragOver ? "MP4’ü bırak" : "FlixSpeed video akışı"}</span>
          <button
            type="button"
            className="text-btn"
            onClick={() => setMuted((value) => !value)}
            aria-label={muted ? "Sesi aç" : "Sesi kapat"}
          >
            {muted ? <VolumeX /> : <Volume2 />}
            {muted ? "Sessiz" : "Ses açık"}
          </button>
        </div>
      </div>

      <p className="bitrate-row">
        Anlık akış: <b className="num">{bitrate == null ? "--" : bitrate.toFixed(1)}</b> Mbps
      </p>

      <div className="res-grid">
        {RES.map((tier, index) => {
          const state = levels[index] ?? "lock";
          return (
            <div key={tier.n} className={`res-card${state === "lock" ? "" : " ok"}${state === "current" ? " current" : ""}`}>
              <div className="thumb">
                {poster ? (
                  <img
                    src={poster}
                    alt=""
                    style={{
                      filter:
                        state === "lock"
                          ? `blur(${tier.blur}px) grayscale(0.65) brightness(0.7)`
                          : `blur(${tier.blur}px)`,
                    }}
                  />
                ) : null}
                <span className="qbadge">{tier.n}</span>
                <span className="rov" aria-hidden>
                  {state === "lock" ? <Lock /> : state === "current" ? <Play /> : <Check />}
                </span>
              </div>
              <div className="rinfo">
                <b>{tier.n}</b>
                <span>{tier.req} Mbps</span>
              </div>
            </div>
          );
        })}
      </div>

      {result ? (
        <div className="video-result">
          <p>
            Desteklenen: <b>{result.supported}</b>
          </p>
          <p>
            Maksimum: <b>{result.maxName}</b>
          </p>
          <p>
            Ortalama: <b>{result.avg.toFixed(1)} Mbps</b> · tepe {result.peak.toFixed(1)} Mbps
          </p>
          <p>
            Tahmini açılış: <b>{result.startup} sn</b> · takılma riski <b>{result.risk}</b>
          </p>
          {result.bytes > 0 ? <p>Kullanılan veri: {formatBytes(result.bytes)}</p> : null}
          <p className="muted">{result.note}</p>
        </div>
      ) : null}

      <div className="actions">
        <button type="button" className="start" onClick={() => void run()}>
          {running ? "Durdur" : result ? "Video testini tekrarla" : "Video testini başlat"}
        </button>
      </div>
      <p className="status" role="status">
        {status}
      </p>
      <p className="foot-note center">
        Test bağlantını yaklaşık {VIDEO_SEC} saniye doyurur. Hızlı hatlarda yeterli örnek alınınca daha erken biter.
        Mobil veride kullanım yüksek olabilir.
      </p>
      <div className="progress-line" aria-hidden>
        <i style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }} />
      </div>
    </section>
  );
}
