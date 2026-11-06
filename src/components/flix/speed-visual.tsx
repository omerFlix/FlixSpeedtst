import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const CX = 170;
const CY = 158;
const R = 120;
const A0 = 135;
const SWEEP = 270;
const TICKS = [0, 10, 25, 50, 100, 250, 500, 1000, 2000];

export type SpeedVisualHandle = {
  reset: () => void;
  setRecording: (on: boolean) => void;
  setTarget: (mbps: number | null) => void;
};

type Props = {
  unit: string;
  graphLabel: string;
};

export const SpeedVisual = forwardRef<SpeedVisualHandle, Props>(function SpeedVisual(
  { unit, graphLabel },
  ref,
) {
  const speedRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGPolygonElement>(null);
  const lineRef = useRef<SVGPolylineElement>(null);
  const fillRef = useRef<SVGPolygonElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const tickRefs = useRef<Array<SVGTextElement | null>>([]);
  const model = useRef({
    display: 0,
    target: 0,
    has: false,
    recording: false,
    ang: A0,
    samples: [] as number[],
    dirty: true,
  });

  function paintGraph() {
    const samples = model.current.samples;
    const line = lineRef.current;
    const fill = fillRef.current;
    const dot = dotRef.current;
    if (!line || !fill || !dot) return;
    if (samples.length < 2) {
      line.setAttribute("points", "");
      fill.setAttribute("points", "");
      dot.setAttribute("opacity", "0");
      return;
    }
    const width = 300;
    const height = 60;
    const maxV = Math.max(10, ...samples);
    const pts = samples.map((sample, index) => {
      const x = (index / (samples.length - 1)) * width;
      const y = height - 6 - (sample / maxV) * (height - 14);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    line.setAttribute("points", pts.join(" "));
    const firstX = pts[0]?.split(",")[0] ?? "0";
    fill.setAttribute("points", `${firstX},${height} ${pts.join(" ")} ${width},${height}`);
    const last = pts[pts.length - 1]?.split(",") ?? ["0", "0"];
    dot.setAttribute("cx", last[0] ?? "0");
    dot.setAttribute("cy", last[1] ?? "0");
    dot.setAttribute("opacity", "1");
  }

  useImperativeHandle(ref, () => ({
    reset() {
      const state = model.current;
      state.display = 0;
      state.target = 0;
      state.has = false;
      state.recording = false;
      state.ang = A0;
      state.samples = [];
      state.dirty = true;
      paintGraph();
    },
    setRecording(on) {
      model.current.recording = on;
      model.current.dirty = true;
    },
    setTarget(mbps) {
      if (mbps == null) {
        model.current.has = false;
        model.current.target = 0;
        return;
      }
      model.current.has = true;
      model.current.target = mbps;
    },
  }));

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const state = model.current;
      const k = 1 - Math.exp(-dt * 6);
      state.display += (state.target - state.display) * k;
      if (Math.abs(state.target - state.display) < 0.04) state.display = state.target;
      const targetAng = A0 + SWEEP * fracFor(state.display);
      state.ang += (targetAng - state.ang) * k;
      if (Math.abs(targetAng - state.ang) < 0.04) state.ang = targetAng;

      const speed = speedRef.current;
      if (speed) {
        speed.textContent = state.has
          ? state.display >= 2000
            ? "2000+"
            : state.display.toFixed(1)
          : "--";
        speed.classList.toggle("idle", !state.has);
      }
      const frac = state.has ? Math.max(0, Math.min(1, (state.ang - A0) / SWEEP)) : 0;
      arcRef.current?.setAttribute("d", frac > 0.002 ? arcPath(R, A0, A0 + SWEEP * frac) : "");
      needleRef.current?.setAttribute("points", needlePoints(state.ang));
      const near = Math.round(fracFor(state.display) * (TICKS.length - 1));
      tickRefs.current.forEach((node, index) => {
        node?.classList.toggle("on", state.has && index === near);
      });

      if (state.recording) {
        state.samples.push(state.display);
        if (state.samples.length > 240) state.samples.shift();
        state.dirty = true;
      }
      if (state.dirty) {
        paintGraph();
        if (!state.recording) state.dirty = false;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const minor = [];
  const steps = (TICKS.length - 1) * 4;
  for (let i = 0; i <= steps; i += 1) {
    const ang = A0 + SWEEP * (i / steps);
    const [x1, y1] = polar(R - 6, ang);
    const [x2, y2] = polar(R + 6, ang);
    minor.push(
      <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className="tick-minor" />,
    );
  }

  return (
    <>
      <div className="gauge-wrap">
        <svg className="gauge-svg" viewBox="0 0 340 268" role="img" aria-label="Hız göstergesi">
          <defs>
            <linearGradient id="ggrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5cf" />
              <stop offset="55%" stopColor="#00a3ff" />
              <stop offset="100%" stopColor="#8b3dff" />
            </linearGradient>
            <radialGradient id="ngrad" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={R}>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#00e5cf" />
            </radialGradient>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={arcPath(R, A0, A0 + SWEEP)} className="track" />
          {minor}
          <path ref={arcRef} d="" className="arc" filter="url(#glow)" />
          {TICKS.map((tick, index) => {
            const ang = A0 + SWEEP * (index / (TICKS.length - 1));
            const [x1, y1] = polar(R - 12, ang);
            const [x2, y2] = polar(R + 12, ang);
            const [tx, ty] = polar(R + 28, ang);
            return (
              <g key={tick}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="tick-major" />
                <text
                  ref={(node) => {
                    tickRefs.current[index] = node;
                  }}
                  x={tx}
                  y={ty + 4}
                  textAnchor="middle"
                >
                  {tick === 2000 ? "2000+" : tick}
                </text>
              </g>
            );
          })}
          <polygon ref={needleRef} points={needlePoints(A0)} className="needle" filter="url(#glow)" />
          <circle cx={CX} cy={CY} r="8" className="hub" />
          <circle cx={CX} cy={CY} r="3.2" className="hub-core" />
        </svg>
        <div className="hub-pulse" />
        <div className="gauge-value">
          <span ref={speedRef} className="gauge-num idle">
            --
          </span>
          <small>{unit}</small>
        </div>
      </div>
      <div className="graph-box">
        <div className="graph-head">
          <span>Anlık grafik</span>
          <b>{graphLabel}</b>
        </div>
        <svg className="spark" viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00e5cf" />
              <stop offset="100%" stopColor="#8b3dff" />
            </linearGradient>
          </defs>
          <polygon ref={fillRef} className="spark-fill" />
          <polyline ref={lineRef} className="spark-line" />
          <circle ref={dotRef} r="2.4" className="spark-dot" opacity="0" />
        </svg>
      </div>
    </>
  );
});

function polar(r: number, ang: number): [number, number] {
  const a = (ang * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}

function arcPath(r: number, a0: number, a1: number): string {
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

function fracFor(value: number): number {
  const cap = TICKS[TICKS.length - 1] ?? 2000;
  const v = Math.max(0, Math.min(cap, value));
  for (let i = 0; i < TICKS.length - 1; i += 1) {
    const start = TICKS[i] ?? 0;
    const end = TICKS[i + 1] ?? cap;
    if (v <= end) return (i + (v - start) / (end - start)) / (TICKS.length - 1);
  }
  return 1;
}

function needlePoints(ang: number): string {
  const a = (ang * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const tx = CX + ca * (R - 16);
  const ty = CY + sa * (R - 16);
  const bx = CX - ca * 13;
  const by = CY - sa * 13;
  const px = -sa;
  const py = ca;
  const w = 4.2;
  const wt = 1.2;
  const pts: Array<[number, number]> = [
    [bx + px * w, by + py * w],
    [tx + px * wt, ty + py * wt],
    [tx - px * wt, ty - py * wt],
    [bx - px * w, by - py * w],
  ];
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}
