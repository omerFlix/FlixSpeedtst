const CF = "https://speed.cloudflare.com";

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

export function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function formatMbps(value: number | null): string {
  if (value == null || Number.isNaN(value)) return "--";
  return value.toFixed(1);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1000))} KB`;
  if (bytes < 1_000_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
}

export function qualityText(down: number, up: number, ping: number): string {
  const d = `${down.toFixed(1)} Mbps`;
  const u = `${up.toFixed(1)} Mbps`;
  if (down >= 100 && ping <= 40) {
    return `Mükemmel bağlantı. ${d} indirme ve ${u} yükleme; 4K yayın, çevrimiçi oyun ve görüntülü görüşme rahat akar.`;
  }
  if (down >= 40) {
    return `İyi bağlantı. ${d} indirme hızı HD yayın ve toplantılar için yeterli. Yükleme ${u}.`;
  }
  if (down >= 10) {
    return `Orta seviye bağlantı (${d}). Günlük kullanım sorunsuz; 4K yayında takılma olabilir.`;
  }
  return `Düşük bağlantı (${d}). Video görüşmesi ve yayınlarda takılma yaşanabilir.`;
}

export async function probe(signal: AbortSignal): Promise<boolean> {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), 12000);
  const linked = linkSignals([signal, timeout.signal]);
  try {
    const res = await fetch(`${CF}/__down?bytes=0&r=${Math.random()}`, {
      cache: "no-store",
      signal: linked,
    });
    return res.ok;
  } catch (error) {
    if (signal.aborted) throw error;
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchIsp(signal: AbortSignal): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch(`${CF}/meta`, { cache: "no-store", signal });
      if (!res.ok) throw new Error("meta");
      const meta = (await res.json()) as {
        asOrganization?: string;
        clientIp?: string;
        city?: string;
        country?: string;
      };
      const org = meta.asOrganization || "Bilinmeyen sağlayıcı";
      const place = [meta.city, meta.country].filter(Boolean).join(", ");
      const ip = meta.clientIp ? ` · ${meta.clientIp}` : "";
      return place ? `${org}${ip} · ${place}` : `${org}${ip}`;
    } catch (error) {
      if (signal.aborted || isAbortError(error)) throw error;
      lastError = error;
      await sleep(350, signal);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("meta");
}

export function browserHint(): string | null {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string; downlink?: number; rtt?: number };
  };
  const link = nav.connection;
  if (!link) return null;
  const parts = [
    link.effectiveType ? link.effectiveType.toUpperCase() : null,
    typeof link.downlink === "number" && link.downlink > 0 ? `~${link.downlink} Mbps` : null,
    typeof link.rtt === "number" && link.rtt > 0 ? `${Math.round(link.rtt)} ms` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export async function measurePing(
  signal: AbortSignal,
  onTick: (info: { ping: number; jitter: number; loss: number; step: number }) => void,
): Promise<{ ping: number; jitter: number; loss: number }> {
  const rtts: number[] = [];
  let fails = 0;
  const rounds = 8;
  for (let i = 0; i < rounds; i += 1) {
    const started = performance.now();
    try {
      const res = await fetch(`${CF}/__down?bytes=0&r=${Math.random()}`, {
        cache: "no-store",
        signal,
      });
      if (!res.ok) throw new Error("ping");
      rtts.push(performance.now() - started);
    } catch (error) {
      if (isAbortError(error)) throw error;
      fails += 1;
    }
    const settled = rtts.length > 1 ? rtts.slice(1) : rtts;
    onTick({
      ping: settled.length ? Math.min(...settled) : 0,
      jitter: jitterOf(rtts),
      loss: (fails / (i + 1)) * 100,
      step: i + 1,
    });
    await sleep(60, signal);
  }
  if (!rtts.length) throw new Error("Ping ölçülemedi");
  const settled = rtts.length > 1 ? rtts.slice(1) : rtts;
  return {
    ping: Math.min(...settled),
    jitter: jitterOf(rtts),
    loss: (fails / rounds) * 100,
  };
}

type StreamOpts = {
  signal: AbortSignal;
  minMs: number;
  maxMs: number;
  maxBytes: number;
  streams: number;
  onSample: (mbps: number, elapsedSec: number, bytes: number) => void;
};

export async function measureDownload(opts: StreamOpts): Promise<{ mbps: number; bytes: number }> {
  const started = performance.now();
  const gate = { bytes: 0, stop: false, errors: 0 };

  const shouldStop = () => {
    if (gate.stop || opts.signal.aborted) return true;
    const elapsed = performance.now() - started;
    if (elapsed >= opts.maxMs) return true;
    if (elapsed >= opts.minMs && gate.bytes >= opts.maxBytes) return true;
    return false;
  };

  async function worker(id: number) {
    while (!shouldStop()) {
      try {
        const res = await fetch(`${CF}/__down?bytes=25000000&r=${id}-${Math.random()}`, {
          cache: "no-store",
          signal: opts.signal,
        });
        if (!res.ok || !res.body) throw new Error("İndirme ölçümü başarısız");
        const reader = res.body.getReader();
        try {
          while (!shouldStop()) {
            const { done, value } = await reader.read();
            if (done) break;
            gate.bytes += value.byteLength;
            const elapsed = (performance.now() - started) / 1000;
            if (elapsed > 0.2) {
              opts.onSample((gate.bytes * 8) / elapsed / 1e6, elapsed, gate.bytes);
            }
          }
        } finally {
          await reader.cancel().catch(() => undefined);
        }
      } catch (error) {
        if (isAbortError(error)) throw error;
        gate.errors += 1;
        if (gate.errors >= opts.streams) {
          gate.stop = true;
          return;
        }
        await sleep(180, opts.signal);
      }
    }
  }

  await Promise.all(Array.from({ length: opts.streams }, (_, id) => worker(id)));
  const elapsed = (performance.now() - started) / 1000;
  if (gate.bytes < 32_000 || elapsed <= 0) {
    throw new Error("İndirme verisi alınamadı");
  }
  return { mbps: (gate.bytes * 8) / elapsed / 1e6, bytes: gate.bytes };
}

export async function measureUpload(opts: Omit<StreamOpts, "streams"> & { streams?: number }): Promise<{
  mbps: number;
  bytes: number;
}> {
  const started = performance.now();
  const streams = opts.streams ?? 2;
  const gate = { bytes: 0, stop: false, errors: 0 };
  const shouldStop = () => {
    if (gate.stop || opts.signal.aborted) return true;
    const elapsed = performance.now() - started;
    if (elapsed >= opts.maxMs) return true;
    if (elapsed >= opts.minMs && gate.bytes >= opts.maxBytes) return true;
    return false;
  };

  async function worker() {
    const payload = new Uint8Array(1_000_000);
    while (!shouldStop()) {
      try {
        const res = await fetch(`${CF}/__up?r=${Math.random()}`, {
          method: "POST",
          body: payload,
          cache: "no-store",
          signal: opts.signal,
          headers: { "content-type": "application/octet-stream" },
        });
        if (!res.ok) throw new Error("Yükleme ölçümü başarısız");
        gate.bytes += payload.byteLength;
        const elapsed = (performance.now() - started) / 1000;
        if (elapsed > 0.15) {
          opts.onSample((gate.bytes * 8) / elapsed / 1e6, elapsed, gate.bytes);
        }
      } catch (error) {
        if (isAbortError(error)) throw error;
        gate.errors += 1;
        if (gate.errors >= streams) {
          gate.stop = true;
          return;
        }
        await sleep(180, opts.signal);
      }
    }
  }

  await Promise.all(Array.from({ length: streams }, () => worker()));
  const elapsed = (performance.now() - started) / 1000;
  if (gate.bytes < 32_000 || elapsed <= 0) throw new Error("Yükleme verisi alınamadı");
  return { mbps: (gate.bytes * 8) / elapsed / 1e6, bytes: gate.bytes };
}

export function demoPeaks(): { down: number; up: number; ping: number } {
  const nav = navigator as Navigator & {
    connection?: { downlink?: number; rtt?: number };
  };
  const hint = nav.connection?.downlink;
  const down = hint && hint > 1 ? hint : 42;
  const up = Math.max(2, down * 0.32);
  const ping = nav.connection?.rtt && nav.connection.rtt > 0 ? nav.connection.rtt : 22;
  return { down, up, ping };
}

export async function simulateMbps(
  ms: number,
  peak: number,
  signal: AbortSignal,
  onSample: (mbps: number) => void,
): Promise<number> {
  const started = performance.now();
  while (performance.now() - started < ms) {
    const p = (performance.now() - started) / ms;
    const ramp = peak * (1 - Math.exp(-p * 3.2));
    onSample(Math.max(0.2, ramp + Math.sin(p * 28) * ramp * 0.05));
    await sleep(90, signal);
  }
  return peak * 0.94;
}

function jitterOf(rtts: number[]): number {
  if (rtts.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < rtts.length; i += 1) total += Math.abs(rtts[i]! - rtts[i - 1]!);
  return total / (rtts.length - 1);
}

function linkSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  const abort = () => controller.abort();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener("abort", abort, { once: true });
  }
  return controller.signal;
}
