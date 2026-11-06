import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as Clapperboard, b as ArrowDown, c as Sun, d as Moon, f as Lock, g as Copy, h as Film, i as Volume2, l as Shield, m as Gauge, n as X, o as Trash2, p as History, r as VolumeX, s as Timer, t as Zap, u as Play, v as Check, x as Activity, y as ArrowUp } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CEGtUc6C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "flixspeed.history.v2";
function loadHistory() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
		if (!Array.isArray(raw)) return [];
		return raw.filter(isEntry).slice(0, 20);
	} catch {
		return [];
	}
}
function saveHistory(entry) {
	const next = [entry, ...loadHistory()].slice(0, 20);
	localStorage.setItem(KEY, JSON.stringify(next));
}
function clearHistory() {
	localStorage.removeItem(KEY);
}
function isEntry(value) {
	if (!value || typeof value !== "object") return false;
	const v = value;
	return typeof v.t === "number" && typeof v.d === "number" && typeof v.u === "number" && typeof v.p === "number" && typeof v.demo === "boolean";
}
function HistoryDialog({ open, onOpenChange }) {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (open) setItems(loadHistory());
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "modal-back" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "modal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-head",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Önceki testler" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "icon-x",
						"aria-label": "Kapat",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "muted",
					children: "Son 20 sonuç bu cihazda saklanır. Hesabın yoktur, başka telefona geçmez."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hist-list",
					children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted",
						children: "Henüz kayıtlı test yok."
					}) : items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hist-item",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [new Date(item.t).toLocaleString("tr-TR"), item.demo ? " · demo" : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"↓ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.d.toFixed(1) }),
							" ↑ ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.u.toFixed(1) }),
							" Mbps · ",
							item.p.toFixed(0),
							" ms"
						] })]
					}, item.t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn",
						onClick: () => {
							clearHistory();
							setItems([]);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {}), "Geçmişi temizle"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
						className: "btn primary",
						children: "Tamam"
					})]
				})
			]
		})] })
	});
}
var CF = "https://speed.cloudflare.com";
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError" || error instanceof Error && error.name === "AbortError";
}
function sleep(ms, signal) {
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
function formatMbps(value) {
	if (value == null || Number.isNaN(value)) return "--";
	return value.toFixed(1);
}
function formatBytes(bytes) {
	if (bytes < 1e6) return `${Math.max(1, Math.round(bytes / 1e3))} KB`;
	if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
	return `${(bytes / 1e9).toFixed(2)} GB`;
}
function qualityText(down, up, ping) {
	const d = `${down.toFixed(1)} Mbps`;
	const u = `${up.toFixed(1)} Mbps`;
	if (down >= 100 && ping <= 40) return `Mükemmel bağlantı. ${d} indirme ve ${u} yükleme; 4K yayın, çevrimiçi oyun ve görüntülü görüşme rahat akar.`;
	if (down >= 40) return `İyi bağlantı. ${d} indirme hızı HD yayın ve toplantılar için yeterli. Yükleme ${u}.`;
	if (down >= 10) return `Orta seviye bağlantı (${d}). Günlük kullanım sorunsuz; 4K yayında takılma olabilir.`;
	return `Düşük bağlantı (${d}). Video görüşmesi ve yayınlarda takılma yaşanabilir.`;
}
async function probe(signal) {
	const timeout = new AbortController();
	const timer = setTimeout(() => timeout.abort(), 12e3);
	const linked = linkSignals([signal, timeout.signal]);
	try {
		return (await fetch(`${CF}/__down?bytes=0&r=${Math.random()}`, {
			cache: "no-store",
			signal: linked
		})).ok;
	} catch (error) {
		if (signal.aborted) throw error;
		return false;
	} finally {
		clearTimeout(timer);
	}
}
async function fetchIsp(signal) {
	let lastError;
	for (let attempt = 0; attempt < 2; attempt += 1) try {
		const res = await fetch(`${CF}/meta`, {
			cache: "no-store",
			signal
		});
		if (!res.ok) throw new Error("meta");
		const meta = await res.json();
		const org = meta.asOrganization || "Bilinmeyen sağlayıcı";
		const place = [meta.city, meta.country].filter(Boolean).join(", ");
		const ip = meta.clientIp ? ` · ${meta.clientIp}` : "";
		return place ? `${org}${ip} · ${place}` : `${org}${ip}`;
	} catch (error) {
		if (signal.aborted || isAbortError(error)) throw error;
		lastError = error;
		await sleep(350, signal);
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("meta");
}
function browserHint() {
	const link = navigator.connection;
	if (!link) return null;
	const parts = [
		link.effectiveType ? link.effectiveType.toUpperCase() : null,
		typeof link.downlink === "number" && link.downlink > 0 ? `~${link.downlink} Mbps` : null,
		typeof link.rtt === "number" && link.rtt > 0 ? `${Math.round(link.rtt)} ms` : null
	].filter(Boolean);
	return parts.length ? parts.join(" · ") : null;
}
async function measurePing(signal, onTick) {
	const rtts = [];
	let fails = 0;
	const rounds = 8;
	for (let i = 0; i < rounds; i += 1) {
		const started = performance.now();
		try {
			if (!(await fetch(`${CF}/__down?bytes=0&r=${Math.random()}`, {
				cache: "no-store",
				signal
			})).ok) throw new Error("ping");
			rtts.push(performance.now() - started);
		} catch (error) {
			if (isAbortError(error)) throw error;
			fails += 1;
		}
		const settled = rtts.length > 1 ? rtts.slice(1) : rtts;
		onTick({
			ping: settled.length ? Math.min(...settled) : 0,
			jitter: jitterOf(rtts),
			loss: fails / (i + 1) * 100,
			step: i + 1
		});
		await sleep(60, signal);
	}
	if (!rtts.length) throw new Error("Ping ölçülemedi");
	const settled = rtts.length > 1 ? rtts.slice(1) : rtts;
	return {
		ping: Math.min(...settled),
		jitter: jitterOf(rtts),
		loss: fails / rounds * 100
	};
}
async function measureDownload(opts) {
	const started = performance.now();
	const gate = {
		bytes: 0,
		stop: false,
		errors: 0
	};
	const shouldStop = () => {
		if (gate.stop || opts.signal.aborted) return true;
		const elapsed = performance.now() - started;
		if (elapsed >= opts.maxMs) return true;
		if (elapsed >= opts.minMs && gate.bytes >= opts.maxBytes) return true;
		return false;
	};
	async function worker(id) {
		while (!shouldStop()) try {
			const res = await fetch(`${CF}/__down?bytes=25000000&r=${id}-${Math.random()}`, {
				cache: "no-store",
				signal: opts.signal
			});
			if (!res.ok || !res.body) throw new Error("İndirme ölçümü başarısız");
			const reader = res.body.getReader();
			try {
				while (!shouldStop()) {
					const { done, value } = await reader.read();
					if (done) break;
					gate.bytes += value.byteLength;
					const elapsed = (performance.now() - started) / 1e3;
					if (elapsed > .2) opts.onSample(gate.bytes * 8 / elapsed / 1e6, elapsed, gate.bytes);
				}
			} finally {
				await reader.cancel().catch(() => void 0);
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
	await Promise.all(Array.from({ length: opts.streams }, (_, id) => worker(id)));
	const elapsed = (performance.now() - started) / 1e3;
	if (gate.bytes < 32e3 || elapsed <= 0) throw new Error("İndirme verisi alınamadı");
	return {
		mbps: gate.bytes * 8 / elapsed / 1e6,
		bytes: gate.bytes
	};
}
async function measureUpload(opts) {
	const started = performance.now();
	const streams = opts.streams ?? 2;
	const gate = {
		bytes: 0,
		stop: false,
		errors: 0
	};
	const shouldStop = () => {
		if (gate.stop || opts.signal.aborted) return true;
		const elapsed = performance.now() - started;
		if (elapsed >= opts.maxMs) return true;
		if (elapsed >= opts.minMs && gate.bytes >= opts.maxBytes) return true;
		return false;
	};
	async function worker() {
		const payload = /* @__PURE__ */ new Uint8Array(1e6);
		while (!shouldStop()) try {
			if (!(await fetch(`${CF}/__up?r=${Math.random()}`, {
				method: "POST",
				body: payload,
				cache: "no-store",
				signal: opts.signal,
				headers: { "content-type": "application/octet-stream" }
			})).ok) throw new Error("Yükleme ölçümü başarısız");
			gate.bytes += payload.byteLength;
			const elapsed = (performance.now() - started) / 1e3;
			if (elapsed > .15) opts.onSample(gate.bytes * 8 / elapsed / 1e6, elapsed, gate.bytes);
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
	await Promise.all(Array.from({ length: streams }, () => worker()));
	const elapsed = (performance.now() - started) / 1e3;
	if (gate.bytes < 32e3 || elapsed <= 0) throw new Error("Yükleme verisi alınamadı");
	return {
		mbps: gate.bytes * 8 / elapsed / 1e6,
		bytes: gate.bytes
	};
}
function demoPeaks() {
	const nav = navigator;
	const hint = nav.connection?.downlink;
	const down = hint && hint > 1 ? hint : 42;
	return {
		down,
		up: Math.max(2, down * .32),
		ping: nav.connection?.rtt && nav.connection.rtt > 0 ? nav.connection.rtt : 22
	};
}
async function simulateMbps(ms, peak, signal, onSample) {
	const started = performance.now();
	while (performance.now() - started < ms) {
		const p = (performance.now() - started) / ms;
		const ramp = peak * (1 - Math.exp(-p * 3.2));
		onSample(Math.max(.2, ramp + Math.sin(p * 28) * ramp * .05));
		await sleep(90, signal);
	}
	return peak * .94;
}
function jitterOf(rtts) {
	if (rtts.length < 2) return 0;
	let total = 0;
	for (let i = 1; i < rtts.length; i += 1) total += Math.abs(rtts[i] - rtts[i - 1]);
	return total / (rtts.length - 1);
}
function linkSignals(signals) {
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
var CX = 170;
var CY = 158;
var R = 120;
var A0 = 135;
var SWEEP = 270;
var TICKS = [
	0,
	10,
	25,
	50,
	100,
	250,
	500,
	1e3,
	2e3
];
var SpeedVisual = (0, import_react.forwardRef)(function SpeedVisual({ unit, graphLabel }, ref) {
	const speedRef = (0, import_react.useRef)(null);
	const arcRef = (0, import_react.useRef)(null);
	const needleRef = (0, import_react.useRef)(null);
	const lineRef = (0, import_react.useRef)(null);
	const fillRef = (0, import_react.useRef)(null);
	const dotRef = (0, import_react.useRef)(null);
	const tickRefs = (0, import_react.useRef)([]);
	const model = (0, import_react.useRef)({
		display: 0,
		target: 0,
		has: false,
		recording: false,
		ang: A0,
		samples: [],
		dirty: true
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
			const x = index / (samples.length - 1) * width;
			const y = 54 - sample / maxV * 46;
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
	(0, import_react.useImperativeHandle)(ref, () => ({
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
		}
	}));
	(0, import_react.useEffect)(() => {
		let frame = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const state = model.current;
			const k = 1 - Math.exp(-dt * 6);
			state.display += (state.target - state.display) * k;
			if (Math.abs(state.target - state.display) < .04) state.display = state.target;
			const targetAng = A0 + SWEEP * fracFor(state.display);
			state.ang += (targetAng - state.ang) * k;
			if (Math.abs(targetAng - state.ang) < .04) state.ang = targetAng;
			const speed = speedRef.current;
			if (speed) {
				speed.textContent = state.has ? state.display >= 2e3 ? "2000+" : state.display.toFixed(1) : "--";
				speed.classList.toggle("idle", !state.has);
			}
			const frac = state.has ? Math.max(0, Math.min(1, (state.ang - A0) / SWEEP)) : 0;
			arcRef.current?.setAttribute("d", frac > .002 ? arcPath(R, A0, A0 + SWEEP * frac) : "");
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
		const [x1, y1] = polar(114, ang);
		const [x2, y2] = polar(126, ang);
		minor.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1,
			y1,
			x2,
			y2,
			className: "tick-minor"
		}, `m${i}`));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gauge-wrap",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				className: "gauge-svg",
				viewBox: "0 0 340 268",
				role: "img",
				"aria-label": "Hız göstergesi",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "ggrad",
							x1: "0%",
							y1: "0%",
							x2: "100%",
							y2: "0%",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "#00e5cf"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "55%",
									stopColor: "#00a3ff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "#8b3dff"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
							id: "ngrad",
							gradientUnits: "userSpaceOnUse",
							cx: CX,
							cy: CY,
							r: R,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#ffffff"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#00e5cf"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("filter", {
							id: "glow",
							x: "-60%",
							y: "-60%",
							width: "220%",
							height: "220%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feGaussianBlur", {
								stdDeviation: "3.5",
								result: "b"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "b" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("feMergeNode", { in: "SourceGraphic" })] })]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: arcPath(R, A0, 405),
						className: "track"
					}),
					minor,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						ref: arcRef,
						d: "",
						className: "arc",
						filter: "url(#glow)"
					}),
					TICKS.map((tick, index) => {
						const ang = A0 + SWEEP * (index / (TICKS.length - 1));
						const [x1, y1] = polar(108, ang);
						const [x2, y2] = polar(132, ang);
						const [tx, ty] = polar(148, ang);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1,
							y1,
							x2,
							y2,
							className: "tick-major"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							ref: (node) => {
								tickRefs.current[index] = node;
							},
							x: tx,
							y: ty + 4,
							textAnchor: "middle",
							children: tick === 2e3 ? "2000+" : tick
						})] }, tick);
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
						ref: needleRef,
						points: needlePoints(A0),
						className: "needle",
						filter: "url(#glow)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: CX,
						cy: CY,
						r: "8",
						className: "hub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: CX,
						cy: CY,
						r: "3.2",
						className: "hub-core"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hub-pulse" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "gauge-value",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					ref: speedRef,
					className: "gauge-num idle",
					children: "--"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: unit })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "graph-box",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "graph-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Anlık grafik" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: graphLabel })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "spark",
			viewBox: "0 0 300 60",
			preserveAspectRatio: "none",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "sparkGrad",
					x1: "0",
					y1: "0",
					x2: "1",
					y2: "0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#00e5cf"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#8b3dff"
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
					ref: fillRef,
					className: "spark-fill"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					ref: lineRef,
					className: "spark-line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					ref: dotRef,
					r: "2.4",
					className: "spark-dot",
					opacity: "0"
				})
			]
		})]
	})] });
});
function polar(r, ang) {
	const a = ang * Math.PI / 180;
	return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
}
function arcPath(r, a0, a1) {
	const [x0, y0] = polar(r, a0);
	const [x1, y1] = polar(r, a1);
	const large = a1 - a0 > 180 ? 1 : 0;
	return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
function fracFor(value) {
	const cap = TICKS[TICKS.length - 1] ?? 2e3;
	const v = Math.max(0, Math.min(cap, value));
	for (let i = 0; i < TICKS.length - 1; i += 1) {
		const start = TICKS[i] ?? 0;
		const end = TICKS[i + 1] ?? cap;
		if (v <= end) return (i + (v - start) / (end - start)) / (TICKS.length - 1);
	}
	return 1;
}
function needlePoints(ang) {
	const a = ang * Math.PI / 180;
	const ca = Math.cos(a);
	const sa = Math.sin(a);
	const tx = CX + ca * 104;
	const ty = CY + sa * 104;
	const bx = CX - ca * 13;
	const by = CY - sa * 13;
	const px = -sa;
	const py = ca;
	const w = 4.2;
	const wt = 1.2;
	return [
		[bx + px * w, by + py * w],
		[tx + px * wt, ty + py * wt],
		[tx - px * wt, ty - py * wt],
		[bx - px * w, by - py * w]
	].map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}
function SpeedPanel() {
	const visual = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const runningRef = (0, import_react.useRef)(false);
	const uiAt = (0, import_react.useRef)(0);
	const [phase, setPhase] = (0, import_react.useState)("down");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Teste hazır");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [ping, setPing] = (0, import_react.useState)(null);
	const [jitter, setJitter] = (0, import_react.useState)(null);
	const [loss, setLoss] = (0, import_react.useState)(null);
	const [down, setDown] = (0, import_react.useState)(null);
	const [up, setUp] = (0, import_react.useState)(null);
	const [quality, setQuality] = (0, import_react.useState)("Test bitince bağlantın burada özetlenir.");
	const [isp, setIsp] = (0, import_react.useState)("Bağlantı bilgisi alınıyor…");
	const [hint, setHint] = (0, import_react.useState)(null);
	const [demo, setDemo] = (0, import_react.useState)(false);
	const [used, setUsed] = (0, import_react.useState)(null);
	const [graphLabel, setGraphLabel] = (0, import_react.useState)("Bekleniyor");
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const ac = new AbortController();
		setHint(browserHint());
		fetchIsp(ac.signal).then(setIsp).catch(() => {
			if (!ac.signal.aborted) setIsp("Sağlayıcı bilgisi alınamadı");
		});
		return () => ac.abort();
	}, []);
	function bump(value) {
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
			if (!await probe(ac.signal)) await runDemo(ac.signal);
			else await runLive(ac.signal);
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
	async function runLive(signal) {
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
			maxMs: 1e4,
			maxBytes: 8e7,
			streams: 4,
			onSample: (mbps, elapsed, bytes) => {
				visual.current?.setTarget(mbps);
				const byTime = elapsed / 10;
				const byBytes = bytes / 8e7;
				bump(14 + Math.min(1, Math.max(byTime, byBytes)) * 54);
			}
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
			maxMs: 8e3,
			maxBytes: 24e6,
			onSample: (mbps, elapsed, bytes) => {
				visual.current?.setTarget(mbps);
				const byTime = elapsed / 8;
				const byBytes = bytes / 24e6;
				bump(70 + Math.min(1, Math.max(byTime, byBytes)) * 28);
			}
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
			demo: false
		});
	}
	async function runDemo(signal) {
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
			bump(14 + (performance.now() - started) / 6200 * 50);
		});
		setDown(downPeak);
		visual.current?.setTarget(downPeak);
		await sleep(450, signal);
		visual.current?.setTarget(null);
		setPhase("up");
		const upStarted = performance.now();
		const upPeak = await simulateMbps(5200, peaks.up, signal, (value) => {
			visual.current?.setTarget(value);
			bump(70 + (performance.now() - upStarted) / 5200 * 28);
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
			demo: true
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
			demo ? "Not: demo modu" : ""
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stack",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			"aria-busy": running,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-title",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "phase-icon",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(phase === "up" ? ArrowUp : phase === "ping" ? Timer : ArrowDown, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stats",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							kind: "ping",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, {}),
							label: "Ping",
							value: ping == null ? "--" : ping.toFixed(0),
							unit: "ms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							kind: "jitter",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {}),
							label: "Jitter",
							value: jitter == null ? "--" : jitter.toFixed(1),
							unit: "ms"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							kind: "loss",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, {}),
							label: "Kayıp",
							value: loss == null ? "--" : loss.toFixed(1),
							unit: "%"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedVisual, {
					ref: visual,
					unit,
					graphLabel
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "finals",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Final, {
							label: "İndirme",
							value: formatMbps(down),
							unit: "Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Final, {
							label: "Yükleme",
							value: formatMbps(up),
							unit: "Mbps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Final, {
							label: "Ping",
							value: ping == null ? "--" : ping.toFixed(0),
							unit: "ms"
						})
					]
				}),
				demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "callout",
					children: "Canlı ölçüm sunucusuna bağlanılamadı. Gösterge demo modunda; yayınladığın sitede gerçek ağın ölçülür."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "actions",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "start",
						onClick: () => void run(),
						children: running ? "Durdur" : down != null ? "Yeniden ölç" : "Hız testini başlat"
					}), down != null && up != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn",
						onClick: () => void copyResult(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {}), copied ? "Kopyalandı" : "Sonucu kopyala"]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "status",
					role: "status",
					children: status
				}),
				used != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "foot-note center",
					children: [
						"Bu test yaklaşık ",
						formatBytes(used),
						" veri kullandı."
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "progress-line",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` } })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bağlantı özeti" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted",
					children: quality
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "meta-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "meta",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Sağlayıcı" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isp }),
							hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "hint",
								children: ["Tarayıcı tahmini: ", hint]
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "meta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Nasıl ölçülür" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Cloudflare uç noktalarına paralel indirme ve yükleme. Tek sonuç; Wi-Fi, sunucu yükü ve tarayıcı fark yaratır." })]
					})]
				})
			]
		})]
	});
}
function Metric({ kind, icon, label, value, unit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `chip ${kind}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ic",
			"aria-hidden": true,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
			className: "num",
			children: [value, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { children: unit })]
		})] })]
	});
}
function Final({ label, value, unit }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: label }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
			className: "num",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: unit })
	] });
}
function round1(value) {
	return Math.round(value * 10) / 10;
}
var _virtual_flix_videos_default = [];
var bundled = /* #__PURE__ */ Object.assign({});
function projectVideos() {
	const fromSrc = Object.entries(bundled).map(([path, url]) => ({
		name: decodeURIComponent(path.split("/").pop() || "video"),
		url
	}));
	const map = /* @__PURE__ */ new Map();
	for (const video of [..._virtual_flix_videos_default, ...fromSrc]) map.set(`${video.name}:${video.url}`, video);
	return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "tr"));
}
function resolutionLabel(height) {
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
var RES = [
	{
		n: "144p",
		req: .3,
		blur: 7
	},
	{
		n: "240p",
		req: .7,
		blur: 5
	},
	{
		n: "360p",
		req: 1.5,
		blur: 3.5
	},
	{
		n: "480p",
		req: 2.5,
		blur: 2.5
	},
	{
		n: "720p",
		req: 5,
		blur: 1.5
	},
	{
		n: "1080p",
		req: 10,
		blur: .8
	},
	{
		n: "1440p",
		req: 18,
		blur: .3
	},
	{
		n: "4K UHD",
		req: 35,
		blur: 0
	},
	{
		n: "8K",
		req: 80,
		blur: 0
	}
];
var VIDEO_SEC = 16;
function VideoPanel() {
	const library = projectVideos();
	const videoRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const runningRef = (0, import_react.useRef)(false);
	const mutedRef = (0, import_react.useRef)(true);
	const objectUrl = (0, import_react.useRef)(null);
	const captured = (0, import_react.useRef)(false);
	const uiAt = (0, import_react.useRef)(0);
	const [pick, setPick] = (0, import_react.useState)(0);
	const [fileUrl, setFileUrl] = (0, import_react.useState)(null);
	const [meta, setMeta] = (0, import_react.useState)(null);
	const [poster, setPoster] = (0, import_react.useState)(null);
	const [broken, setBroken] = (0, import_react.useState)(false);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("Teste hazır");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [bitrate, setBitrate] = (0, import_react.useState)(null);
	const [levels, setLevels] = (0, import_react.useState)(() => RES.map(() => "lock"));
	const [blur, setBlur] = (0, import_react.useState)(0);
	const [buffering, setBuffering] = (0, import_react.useState)(false);
	const [badge, setBadge] = (0, import_react.useState)("—");
	const [result, setResult] = (0, import_react.useState)(null);
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(true);
	const active = fileUrl ?? library[pick] ?? null;
	const src = active?.url ?? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
	const kind = fileUrl ? "dosya" : library.length ? "proje" : "ornek";
	(0, import_react.useEffect)(() => {
		mutedRef.current = muted;
		if (videoRef.current) videoRef.current.muted = muted;
	}, [muted]);
	(0, import_react.useEffect)(() => {
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
				dur: Number.isFinite(video.duration) ? video.duration : 0
			});
			if (captured.current || runningRef.current || !video.videoWidth || video.readyState < 2) return;
			try {
				const canvas = document.createElement("canvas");
				canvas.width = 320;
				canvas.height = 180;
				const ctx = canvas.getContext("2d");
				if (!ctx) return;
				ctx.drawImage(video, 0, 0, 320, 180);
				setPoster(canvas.toDataURL("image/jpeg", .72));
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
	(0, import_react.useEffect)(() => {
		return () => {
			if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
		};
	}, []);
	function takeFile(file) {
		if (runningRef.current) return;
		if (!(file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name))) {
			setStatus("Bu dosya video değil. MP4, WebM veya MOV seç.");
			return;
		}
		if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
		const url = URL.createObjectURL(file);
		objectUrl.current = url;
		setFileUrl({
			name: file.name,
			url
		});
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
	function pushSample(mbps, elapsed, total) {
		const now = performance.now();
		if (now - uiAt.current < 100 && elapsed < total - .25) return;
		uiAt.current = now;
		setBitrate(mbps);
		let current = -1;
		RES.forEach((tier, index) => {
			if (mbps >= tier.req) current = index;
		});
		const stall = current >= 0 && mbps < RES[current].req * .82;
		setLevels(RES.map((tier, index) => {
			if (index === current && !stall) return "current";
			if (mbps >= tier.req) return "ok";
			return "lock";
		}));
		setBlur(stall || current < 0 ? 8 : RES[current].blur);
		setBuffering(stall || current < 0);
		setBadge(current < 0 ? "—" : RES[current].n);
		setProgress(Math.min(100, elapsed / total * 100));
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
		const samples = [];
		const video = videoRef.current;
		if (video && !broken) try {
			video.currentTime = 0;
			video.muted = true;
			await video.play();
			video.muted = mutedRef.current;
		} catch {}
		let demo = false;
		let bytes = 0;
		try {
			if (!await probe(ac.signal)) {
				demo = true;
				const peaks = demoPeaks();
				const started = performance.now();
				await simulateMbps(VIDEO_SEC * 1e3, peaks.down, ac.signal, (value) => {
					samples.push(value);
					pushSample(value, (performance.now() - started) / 1e3, VIDEO_SEC);
				});
			} else {
				const measured = await measureDownload({
					signal: ac.signal,
					minMs: 4e3,
					maxMs: VIDEO_SEC * 1e3,
					maxBytes: 7e7,
					streams: 3,
					onSample: (mbps, elapsed) => {
						samples.push(mbps);
						pushSample(mbps, elapsed, VIDEO_SEC);
					}
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
	function finish(samples, demo, bytes) {
		const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
		const peak = samples.length ? Math.max(...samples) : avg;
		let maxIdx = -1;
		RES.forEach((tier, index) => {
			if (avg >= tier.req) maxIdx = index;
		});
		const supported = RES.filter((tier) => avg >= tier.req).map((tier) => tier.n);
		const risk = avg < 5 ? "Yüksek" : avg < 15 ? "Orta" : "Düşük";
		const startup = (10 / Math.max(avg, .4)).toFixed(1);
		const maxName = maxIdx < 0 ? "—" : RES[maxIdx].n;
		let note;
		if (maxIdx < 0) note = `Ortalama akış ${avg.toFixed(1)} Mbps. 144p bile rahat oynatılmıyor.`;
		else if (maxIdx === RES.length - 1) note = `Ortalama akış ${avg.toFixed(1)} Mbps. 8K dahil listedeki tüm çözünürlükler rahat.`;
		else note = `Ortalama akış ${avg.toFixed(1)} Mbps. ${RES[maxIdx].n} akıcı; bir üstü (${RES[maxIdx + 1].n}) takılabilir.`;
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
			bytes
		});
		setLevels(RES.map((tier) => avg >= tier.req ? "ok" : "lock"));
		setBlur(maxIdx < 0 ? 8 : RES[maxIdx].blur);
		setBadge(maxName);
		setBitrate(avg);
		setBuffering(false);
		setProgress(100);
		setStatus(demo ? "Demo video testi bitti" : "Video testi tamamlandı");
	}
	const sourceLine = kind === "dosya" && fileUrl ? `Seçilen dosya: ${fileUrl.name}` : kind === "proje" && active ? library.length > 1 ? `Otomatik seçilen video: ${active.name}` : `Otomatik video: ${active.name}` : "Henüz proje videosu yok. MP4 dosyasını public/videos klasörüne bırak; adı ve çözünürlüğü kendiliğinden okunur.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card",
		"aria-busy": running,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-title",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "phase-icon",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Video akış testi" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted center",
				children: "Seçilen video oynarken bağlantı doyurulur. Hıza göre 144p’den 8K’ya hangi yayınların takılmadan izleneceği hesaplanır."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "source-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "source-note",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { "aria-hidden": true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [sourceLine, meta && meta.h > 0 ? ` · ${meta.w}×${meta.h} · ${resolutionLabel(meta.h)}${meta.dur > 0 ? ` · ${Math.round(meta.dur)} sn` : ""}` : ""] })]
					}),
					library.length > 1 && !fileUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "source-picks",
						role: "listbox",
						"aria-label": "Proje videoları",
						children: library.map((video, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: index === pick ? "on" : "",
							disabled: running,
							onClick: () => {
								setPick(index);
								setResult(null);
							},
							children: video.name
						}, video.url))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "file-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: running,
								onClick: () => fileRef.current?.click(),
								children: "Cihazdan seç"
							}),
							fileUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								disabled: running,
								onClick: clearFile,
								children: "Proje videosuna dön"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v",
								hidden: true,
								onChange: (event) => {
									const file = event.target.files?.[0];
									if (file) takeFile(file);
									event.target.value = "";
								}
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: dragOver ? "player drop-on" : "player",
				onDragOver: (event) => {
					event.preventDefault();
					setDragOver(true);
				},
				onDragLeave: () => setDragOver(false),
				onDrop: (event) => {
					event.preventDefault();
					setDragOver(false);
					const file = event.dataTransfer.files[0];
					if (file) takeFile(file);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "player-screen",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								src: broken ? void 0 : src,
								muted,
								loop: true,
								playsInline: true,
								preload: "metadata",
								onError: () => setBroken(true),
								style: { filter: blur > 0 ? `blur(${blur}px)` : "none" }
							}),
							broken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "player-fallback",
								children: "Video açılamadı, ölçüm yine de yapılır."
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge",
								children: badge
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: running && !buffering ? "p-ov gone" : kind === "ornek" || broken || buffering ? "p-ov" : "p-ov gone",
								children: [buffering && running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-ring" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-status",
									children: buffering && running ? "Tamponlanıyor…" : kind === "ornek" ? "Örnek video" : "Hazır"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "player-bar",
						"aria-hidden": true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "player-res",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: dragOver ? "MP4’ü bırak" : "FlixSpeed video akışı" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-btn",
							onClick: () => setMuted((value) => !value),
							"aria-label": muted ? "Sesi aç" : "Sesi kapat",
							children: [muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}), muted ? "Sessiz" : "Ses açık"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "bitrate-row",
				children: [
					"Anlık akış: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "num",
						children: bitrate == null ? "--" : bitrate.toFixed(1)
					}),
					" Mbps"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "res-grid",
				children: RES.map((tier, index) => {
					const state = levels[index] ?? "lock";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `res-card${state === "lock" ? "" : " ok"}${state === "current" ? " current" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "thumb",
							children: [
								poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: poster,
									alt: "",
									style: { filter: state === "lock" ? `blur(${tier.blur}px) grayscale(0.65) brightness(0.7)` : `blur(${tier.blur}px)` }
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "qbadge",
									children: tier.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rov",
									"aria-hidden": true,
									children: state === "lock" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {}) : state === "current" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rinfo",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: tier.n }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [tier.req, " Mbps"] })]
						})]
					}, tier.n);
				})
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "video-result",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Desteklenen: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: result.supported })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Maksimum: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: result.maxName })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Ortalama: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [result.avg.toFixed(1), " Mbps"] }),
						" · tepe ",
						result.peak.toFixed(1),
						" Mbps"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Tahmini açılış: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [result.startup, " sn"] }),
						" · takılma riski ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: result.risk })
					] }),
					result.bytes > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Kullanılan veri: ", formatBytes(result.bytes)] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "muted",
						children: result.note
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "start",
					onClick: () => void run(),
					children: running ? "Durdur" : result ? "Video testini tekrarla" : "Video testini başlat"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "status",
				role: "status",
				children: status
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "foot-note center",
				children: [
					"Test bağlantını yaklaşık ",
					VIDEO_SEC,
					" saniye doyurur. Hızlı hatlarda yeterli örnek alınınca daha erken biter. Mobil veride kullanım yüksek olabilir."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "progress-line",
				"aria-hidden": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { transform: `scaleX(${Math.max(0, Math.min(1, progress / 100))})` } })
			})
		]
	});
}
function Shell() {
	const [tab, setTab] = (0, import_react.useState)("speed");
	const [theme, setTheme] = (0, import_react.useState)("dark");
	const [themeReady, setThemeReady] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const saved = localStorage.getItem("flixspeed-theme");
		if (saved === "light" || saved === "dark") setTheme(saved);
		setThemeReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.classList.toggle("light", theme === "light");
		if (themeReady) localStorage.setItem("flixspeed-theme", theme);
	}, [theme, themeReady]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg",
			"aria-hidden": true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "head-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "logo",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "logo-ic",
					"aria-hidden": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["FLIX", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "SPEED" })] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hactions",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn",
					"aria-label": "Test geçmişi",
					onClick: () => setHistoryOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hist-label",
						children: "Geçmiş"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: theme === "dark" ? "theme-pill dark" : "theme-pill",
					role: "group",
					"aria-label": "Tema",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: theme === "light" ? "active" : "",
						"aria-pressed": theme === "light",
						"aria-label": "Aydınlık tema",
						onClick: () => setTheme("light"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: theme === "dark" ? "active" : "",
						"aria-pressed": theme === "dark",
						"aria-label": "Karanlık tema",
						onClick: () => setTheme("dark"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {})
					})]
				})]
			})]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "tabs",
				role: "tablist",
				"aria-label": "Test türü",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					className: tab === "speed" ? "tab active" : "tab",
					"aria-selected": tab === "speed",
					onClick: () => setTab("speed"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {}), "Hız testi"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					role: "tab",
					className: tab === "video" ? "tab active" : "tab",
					"aria-selected": tab === "video",
					onClick: () => setTab("video"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {}), "Video testi"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				hidden: tab !== "speed",
				role: "tabpanel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpeedPanel, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				hidden: tab !== "video",
				role: "tabpanel",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPanel, {})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", { children: "FlixSpeed Pro · Gelişmiş internet hız testi" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryDialog, {
			open: historyOpen,
			onOpenChange: setHistoryOpen
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {});
}
//#endregion
export { Home as component };
