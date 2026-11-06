import { useEffect, useState } from "react";
import { Clapperboard, Gauge, History, Moon, Sun, Zap } from "lucide-react";
import { HistoryDialog } from "@/components/flix/history-dialog";
import { SpeedPanel } from "@/components/flix/speed-panel";
import { VideoPanel } from "@/components/flix/video-panel";

type Tab = "speed" | "video";
type Theme = "dark" | "light";

export function Shell() {
  const [tab, setTab] = useState<Tab>("speed");
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("flixspeed-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    if (themeReady) localStorage.setItem("flixspeed-theme", theme);
  }, [theme, themeReady]);

  return (
    <>
      <div className="bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <header>
        <div className="head-in">
          <h1 className="logo">
            <span className="logo-ic" aria-hidden>
              <Zap />
            </span>
            <span>
              FLIX<b>SPEED</b>
            </span>
          </h1>
          <div className="hactions">
            <button type="button" className="btn" aria-label="Test geçmişi" onClick={() => setHistoryOpen(true)}>
              <History />
              <span className="hist-label">Geçmiş</span>
            </button>
            <div className={theme === "dark" ? "theme-pill dark" : "theme-pill"} role="group" aria-label="Tema">
              <button
                type="button"
                className={theme === "light" ? "active" : ""}
                aria-pressed={theme === "light"}
                aria-label="Aydınlık tema"
                onClick={() => setTheme("light")}
              >
                <Sun />
              </button>
              <button
                type="button"
                className={theme === "dark" ? "active" : ""}
                aria-pressed={theme === "dark"}
                aria-label="Karanlık tema"
                onClick={() => setTheme("dark")}
              >
                <Moon />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="tabs" role="tablist" aria-label="Test türü">
          <button
            type="button"
            role="tab"
            className={tab === "speed" ? "tab active" : "tab"}
            aria-selected={tab === "speed"}
            onClick={() => setTab("speed")}
          >
            <Gauge />
            Hız testi
          </button>
          <button
            type="button"
            role="tab"
            className={tab === "video" ? "tab active" : "tab"}
            aria-selected={tab === "video"}
            onClick={() => setTab("video")}
          >
            <Clapperboard />
            Video testi
          </button>
        </div>
        <div hidden={tab !== "speed"} role="tabpanel">
          <SpeedPanel />
        </div>
        <div hidden={tab !== "video"} role="tabpanel">
          <VideoPanel />
        </div>
      </main>
      <footer>FlixSpeed Pro · Gelişmiş internet hız testi</footer>
      <HistoryDialog open={historyOpen} onOpenChange={setHistoryOpen} />
    </>
  );
}
