import { useEffect, useRef, useState, type ReactNode } from "react";
import { Activity, ArrowDown, ArrowUp, Copy, Shield, Timer } from "lucide-react";
import { saveHistory } from "@/lib/history";
import {
  browserHint,
  demoPeaks,
  fetchIsp,
  formatBytes,
  formatMbps,
  isAbortError,
  measureDownload,
  measurePing,
  measureUpload,
  probe,
  qualityText,
  simulateMbps,
  sleep,
} from "@/lib/measure";
import { SpeedVisual, type SpeedVisualHandle } from "@/components/flix/speed-visual";

type Phase = "ping" | "down" | "up";

export function SpeedPanel() {
  const visual = useRef<SpeedVisualHandle>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runningRef = useRef(false);
  const uiAt = useRef(0);
  const [phase, setPhase] = useState<Phase>("down");
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Teste hazır");
  const [progress, setProgress] = useState(0);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [loss, setLoss] = useState<number | null>(null);
  const [down, setDown] = useState<number | null>(null);
  const [up, setUp] = useState<number | null>(null);
  const [quality, setQuality] = useState("Test bitince bağlantın burada özetlenir.");
  const [isp, setIsp] = useState("Bağlantı bilgisi alınıyor…");
  const [hint, setHint] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const [used, setUsed] = useState<number | null>(null);
  const [graphLabel, setGraphLabel] = useState("Bekleniyor");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    setHint(browserHint());
    fetchIsp(ac.signal)
      .then(setIsp)
      .catch(() => {
        if (!ac.signal.aborted) setIsp("Sağlayıcı bilgisi alınamadı");
      });
    return () => ac.abort();
  }, []);

  function bump(value: number) {
    const now = performance.now();
    if (now - uiAt.current < 90 && value < 99) return;
    uiAt.current = now;
    setProgress(value);
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
    setDemo(false);
    setCopied(false);
    setDown(null);
    setUp(null);
    setPing(null);
    setJitter(null);
    setLoss(null);
    setUsed(null);
    setProgress(3);
    setQuality("Ölçüm sürüyor…");
    setGraphLabel("Aktif");
    setPhase("ping");
    visual.current?.reset();
    visual.current?.setRecording(true);

    try {
      setStatus("Ölçüm sunucusuna bağlanılıyor…");
      const live = await probe(ac.signal);
      if (!live) {
        await runDemo(ac.signal);
      } else {
        await runLive(ac.signal);
      }
    } catch (error) {
      if (isAbortError(error)) {
        setStatus("Test durduruldu");
        setGraphLabel("Durduruldu");
      } else {
        setStatus(error instanceof Error ? error.message : "Ölçüm başarısız");
        setGraphLabel("Hata");
        setQuality("Ölçüm tamamlanamadı. Bağlantını kontrol edip yeniden dene.");
      }
    } finally {
      visual.current?.setRecording(false);
      runningRef.current = false;
      setRunning(false);
      abortRef.current = null;
    }
  }

  async function runLive(signal: AbortSignal) {
    setStatus("Gecikme ölçülüyor…");
    const lat = await measurePing(signal, (info) => {
      setPing(info.ping);
      setJitter(info.jitter);
      setLoss(info.loss);
      bump(4 + info.step * 1.2);
    });
    setPhase("down");
    setStatus("İndirme hızı ölçülüyor…");
    const dl = await measureDownload({
      signal,
      minMs: 3200,
      maxMs: 10000,
      maxBytes: 80_000_000,
      streams: 4,
      onSample: (mbps, elapsed, bytes) => {
        visual.current?.setTarget(mbps);
        const byTime = elapsed / 10;
        const byBytes = bytes / 80_000_000;
        bump(14 + Math.min(1, Math.max(byTime, byBytes)) * 54);
      },
    });
    setDown(dl.mbps);
    visual.current?.setTarget(dl.mbps);
    setStatus(`İndirme tamam: ${dl.mbps.toFixed(1)} Mbps`);
    await sleep(600, signal);
    visual.current?.setRecording(false);
    visual.current?.setTarget(null);
    await sleep(280, signal);
    visual.current?.setRecording(true);
    setPhase("up");
    setStatus("Yükleme hızı ölçülüyor…");
    const ul = await measureUpload({
      signal,
      minMs: 2200,
      maxMs: 8000,
      maxBytes: 24_000_000,
      onSample: (mbps, elapsed, bytes) => {
        visual.current?.setTarget(mbps);
        const byTime = elapsed / 8;
        const byBytes = bytes / 24_000_000;
        bump(70 + Math.min(1, Math.max(byTime, byBytes)) * 28);
      },
    });
    setUp(ul.mbps);
    visual.current?.setTarget(ul.mbps);
    setUsed(dl.bytes + ul.bytes);
    setProgress(100);
    setQuality(qualityText(dl.mbps, ul.mbps, lat.ping));
    setStatus("Test tamamlandı");
    setGraphLabel("Tamamlandı");
    saveHistory({
      t: Date.now(),
      d: round1(dl.mbps),
      u: round1(ul.mbps),
      p: Math.round(lat.ping),
      demo: false,
    });
  }

  async function runDemo(signal: AbortSignal) {
    setDemo(true);
    const peaks = demoPeaks();
    setPing(peaks.ping);
    setJitter(1.6);
    setLoss(0);
    setStatus("Demo modu — canlı ölçüm sunucusuna ulaşılamadı");
    setPhase("down");
    const started = performance.now();
    const downPeak = await simulateMbps(6200, peaks.down, signal, (value) => {
      visual.current?.setTarget(value);
      bump(14 + ((performance.now() - started) / 6200) * 50);
    });
    setDown(downPeak);
    visual.current?.setTarget(downPeak);
    await sleep(450, signal);
    visual.current?.setTarget(null);
    setPhase("up");
    const upStarted = performance.now();
    const upPeak = await simulateMbps(5200, peaks.up, signal, (value) => {
      visual.current?.setTarget(value);
      bump(70 + ((performance.now() - upStarted) / 5200) * 28);
    });
    setUp(upPeak);
    visual.current?.setTarget(upPeak);
    setProgress(100);
    setQuality(`${qualityText(downPeak, upPeak, peaks.ping)} Bu ekran demo modunda; sayılar gerçek ölçüm değil.`);
    setStatus("Demo tamamlandı");
    setGraphLabel("Demo");
    saveHistory({
      t: Date.now(),
      d: round1(downPeak),
      u: round1(upPeak),
      p: Math.round(peaks.ping),
      demo: true,
    });
  }

  async function copyResult() {
    if (down == null || up == null || ping == null) return;
    const lines = [
      "FlixSpeed Pro",
      `İndirme: ${down.toFixed(1)} Mbps`,
      `Yükleme: ${up.toFixed(1)} Mbps`,
      `Ping: ${ping.toFixed(0)} ms`,
      jitter != null ? `Jitter: ${jitter.toFixed(1)} ms` : "",
      loss != null ? `Kayıp: ${loss.toFixed(1)}%` : "",
      demo ? "Not: demo modu" : "",
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
    } catch {
      setStatus("Sonuç kopyalanamadı");
    }
  }

  const title = phase === "up" ? "Yükleme hızı" : phase === "ping" ? "Gecikme" : "İndirme hızı";
  const unit = phase === "up" ? "Mbps yükleme" : phase === "ping" ? "ping" : "Mbps indirme";
  const PhaseIcon = phase === "up" ? ArrowUp : phase === "ping" ? Timer : ArrowDown;

  return (
    <div className="stack">
      <section className="card" aria-busy={running}>
        <div className="card-title">
          <span className="phase-icon" aria-hidden>
            <PhaseIcon />
          </span>
          <span>{title}</span>
        </div>
        <div className="stats">
          <Metric kind="ping" icon={<Timer />} label="Ping" value={ping == null ? "--" : ping.toFixed(0)} unit="ms" />
          <Metric
            kind="jitter"
            icon={<Activity />}
            label="Jitter"
            value={jitter == null ? "--" : jitter.toFixed(1)}
            unit="ms"
          />
          <Metric
            kind="loss"
            icon={<Shield />}
            label="Kayıp"
            value={loss == null ? "--" : loss.toFixed(1)}
            unit="%"
          />
        </div>
        <SpeedVisual ref={visual} unit={unit} graphLabel={graphLabel} />
        <div className="finals">
          <Final label="İndirme" value={formatMbps(down)} unit="Mbps" />
          <Final label="Yükleme" value={formatMbps(up)} unit="Mbps" />
          <Final label="Ping" value={ping == null ? "--" : ping.toFixed(0)} unit="ms" />
        </div>
        {demo ? (
          <p className="callout">
            Canlı ölçüm sunucusuna bağlanılamadı. Gösterge demo modunda; yayınladığın sitede gerçek ağın ölçülür.
          </p>
        ) : null}
        <div className="actions">
          <button type="button" className="start" onClick={() => void run()}>
            {running ? "Durdur" : down != null ? "Yeniden ölç" : "Hız testini başlat"}
          </button>
          {down != null && up != null ? (
            <button type="button" className="btn" onClick={() => void copyResult()}>
              <Copy />
              {copied ? "Kopyalandı" : "Sonucu kopyala"}
            </button>
          ) : null}
        </div>
        <p className="status" role="status">
          {status}
        </p>
        {used != null ? <p className="foot-note center">Bu test yaklaşık {formatBytes(used)} veri kullandı.</p> : null}
        <div className="progress-line" aria-hidden>
          <i style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` }} />
        </div>
      </section>

      <section className="card">
        <h2>Bağlantı özeti</h2>
        <p className="muted">{quality}</p>
        <div className="meta-row">
          <div className="meta">
            <h3>Sağlayıcı</h3>
            <p>{isp}</p>
            {hint ? <p className="hint">Tarayıcı tahmini: {hint}</p> : null}
          </div>
          <div className="meta">
            <h3>Nasıl ölçülür</h3>
            <p>Cloudflare uç noktalarına paralel indirme ve yükleme. Tek sonuç; Wi-Fi, sunucu yükü ve tarayıcı fark yaratır.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({
  kind,
  icon,
  label,
  value,
  unit,
}: {
  kind: "ping" | "jitter" | "loss";
  icon: ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className={`chip ${kind}`}>
      <span className="ic" aria-hidden>
        {icon}
      </span>
      <div>
        <small>{label}</small>
        <b className="num">
          {value}
          <i>{unit}</i>
        </b>
      </div>
    </div>
  );
}

function Final({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <small>{label}</small>
      <b className="num">{value}</b>
      <span>{unit}</span>
    </div>
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
