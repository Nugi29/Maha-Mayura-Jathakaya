import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import scenes from "../data/scenes";
import { Led, LED_SEQ, TICK_INTERVAL, TICK_MOD } from "./LedEffects";
import LiveChat from "./LiveChat";
import Credits from "./Credits";
import { useMute } from "../context/MuteContext";

function useViewport() {
  const getSize = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (h < 400) return "xs";
    if (h < 550) return "sm";
    if (w < 400) return "xs";
    if (w < 640) return "sm";
    if (w < 1024) return "md";
    return "lg";
  }, []);

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const handler = () => setSize(getSize());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [getSize]);

  return size;
}

// Per-breakpoint config
const CONFIG = {
  xs: {
    sceneCount: 6,
    sceneRadius: 140,
    sceneSize: 64,
    ledRingRadius: 42,
    ledRingCount: 10,
    ledSize: 4,
    rings: [28, 48, 68, 90],
    ringDotCount: 14,
    ringDotSize: 4,
    centerImg: 100,
    sceneFontSize: "1.8rem",
  },
  sm: {
    sceneCount: 6,
    sceneRadius: 190,
    sceneSize: 96,
    ledRingRadius: 56,
    ledRingCount: 12,
    ledSize: 5,
    rings: [36, 62, 88, 114],
    ringDotCount: 16,
    ringDotSize: 5,
    centerImg: 130,
    sceneFontSize: "2.2rem",
  },
  md: {
    sceneCount: 8,
    sceneRadius: 270,
    sceneSize: 128,
    ledRingRadius: 72,
    ledRingCount: 14,
    ledSize: 5,
    rings: [50, 80, 110, 140, 170],
    ringDotCount: 18,
    ringDotSize: 5,
    centerImg: 160,
    sceneFontSize: "2.2rem",
  },
  lg: {
    sceneCount: 8,
    sceneRadius: 310,
    sceneSize: 144,
    ledRingRadius: 85,
    ledRingCount: 16,
    ledSize: 6,
    rings: [50, 85, 120, 155, 190],
    ringDotCount: 20,
    ringDotSize: 6,
    centerImg: 200,
    sceneFontSize: "3rem",
  },
};

export default function Thorana() {
  const navigate = useNavigate();
  const location = useLocation();
  const showCredits = location.state?.showCredits || false;
  const [tick, setTick] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isMuted, toggleMute } = useMute();
  const audioRef = useRef(null);
  const viewport = useViewport();
  const cfg = CONFIG[viewport];

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => (t + 1) % TICK_MOD), TICK_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStart = () => {
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener('app-started', handleStart);
    document.addEventListener('click', handleStart, { once: true });
    // Attempt play immediately in case audio is unlocked
    audioRef.current?.play().catch(() => {});
    return () => {
      window.removeEventListener('app-started', handleStart);
      document.removeEventListener('click', handleStart);
    };
  }, []);

  // Fullscreen sync
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  const displayScenes = scenes.slice(0, cfg.sceneCount);

  // Clear the location state so credits don't re-open on page refresh
  useEffect(() => {
    if (showCredits) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [showCredits, navigate, location.pathname]);

  return (
    <div 
      onClick={() => navigate('/scene/1')}
      style={{
      position: "relative", width: "100%", height: "100vh",
      background: "#000", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Cinzel Decorative', serif", userSelect: "none",
      cursor: "pointer",
    }}>
      {/* Background Audio */}
      <audio ref={audioRef} src="/bg-music.mp3" autoPlay loop muted={isMuted} />

      {/* Background Image — transparent */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "url('/bg_vesakKudu.png')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: 0.1,
      }} />

      {/* ═══ TITLE — Center Left ═══ */}
      <style>{`
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(212,160,23,0.5), 0 0 40px rgba(212,160,23,0.2); }
          50% { text-shadow: 0 0 30px rgba(250,204,21,0.8), 0 0 60px rgba(212,160,23,0.4), 0 0 80px rgba(212,160,23,0.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .thorana-title:hover {
          transform: scale(1.05) !important;
          filter: brightness(1.3) !important;
        }
      `}</style>
      <div className="thorana-title" style={{
        position: "absolute",
        top: "clamp(12px, 3vw, 30px)", left: "clamp(16px, 4vw, 50px)",
        zIndex: 60, pointerEvents: "auto",
        display: "flex", flexDirection: "column", gap: 8,
        transition: "transform 0.4s ease, filter 0.4s ease",
        cursor: "default",
        animation: "fadeSlideIn 1s ease-out both",
      }}>
        {/* Decorative top line */}
        <div style={{
          width: "clamp(40px, 8vw, 80px)", height: 2,
          background: "linear-gradient(90deg, #facc15, rgba(212,160,23,0.1))",
          borderRadius: 2,
        }} />

        <h2 style={{
          fontFamily: "'Noto Serif Sinhala', serif",
          fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)",
          fontWeight: 900,
          background: "linear-gradient(90deg, #b8860b, #facc15, #fde047, #facc15, #b8860b)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 4s linear infinite, titleGlow 3s ease-in-out infinite",
          margin: 0, lineHeight: 1.2, letterSpacing: "0.05em",
          filter: "drop-shadow(0 4px 12px rgba(212,160,23,0.4))",
        }}>
          මහා මයුර ජාතකය
        </h2>

        {/* English subtitle */}
        <p style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "clamp(0.5rem, 1.2vw, 0.7rem)",
          color: "rgba(196,184,160,0.5)",
          letterSpacing: "0.3em", textTransform: "uppercase",
          margin: 0, animation: "fadeSlideIn 1.5s ease-out both",
        }}>
          The Great Peacock
        </p>

        {/* Decorative bottom line */}
        <div style={{
          width: "clamp(30px, 6vw, 60px)", height: 2,
          background: "linear-gradient(90deg, #facc15, rgba(212,160,23,0.1))",
          borderRadius: 2,
        }} />
      </div>

      {/* Sound Toggle - Top Right */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        title={isMuted ? "Unmute" : "Mute"}
        style={{
          position: "absolute", top: 16, right: 64, zIndex: 100,
          background: "rgba(15,5,32,0.5)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10,
          padding: "8px 10px", cursor: "pointer", color: "#c4b8a0",
          fontSize: "1.1rem", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "all 0.3s ease", lineHeight: 1,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.7)"; e.currentTarget.style.color = "#fde047"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)"; e.currentTarget.style.color = "#c4b8a0"; }}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Fullscreen Toggle - Top Right */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 100,
          background: "rgba(15,5,32,0.5)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(212,160,23,0.3)", borderRadius: 10,
          padding: "8px 10px", cursor: "pointer", color: "#c4b8a0",
          fontSize: "1.1rem", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "all 0.3s ease", lineHeight: 1,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.7)"; e.currentTarget.style.color = "#fde047"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)"; e.currentTarget.style.color = "#c4b8a0"; }}
      >
        ⛶
      </button>

      {/* Buddhist Flag */}
      <img
        src="/Buddhist_flag.gif"
        alt="Buddhist Flag"
        style={{
          position: "absolute",
          top: 64, right: 16, zIndex: 100,
          height: "60px",
          opacity: 0.9,
          pointerEvents: "none",
        }}
      />

      {/* Concentric LED Rings */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        {cfg.rings.map((radius, rIdx) => (
          <div key={rIdx} style={{ position: "absolute" }}>
            {[...Array(cfg.ringDotCount)].map((_, i) => {
              const angle = (i / cfg.ringDotCount) * 360;
              return (
                <div key={i} style={{ position: "absolute", transform: `rotate(${angle}deg) translate(${radius}px)` }}>
                  <Led
                    color={LED_SEQ[(i + rIdx) % 5]}
                    isOn={(i + rIdx - Math.floor(tick / 2) + 100000) % 10 < 3}
                    size={cfg.ringDotSize}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Outer Scene Panels */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
        {displayScenes.map((scene, idx) => {
          const angle = (idx / cfg.sceneCount) * 360 - 90;
          return (
            <div key={scene.id} style={{
              position: "absolute", pointerEvents: "auto",
              transform: `rotate(${angle}deg) translate(${cfg.sceneRadius}px) rotate(${-angle}deg)`,
            }}>
              {/* Per-scene LED ring */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {[...Array(cfg.ledRingCount)].map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    transform: `rotate(${(i / cfg.ledRingCount) * 360}deg) translate(${cfg.ledRingRadius}px)`,
                  }}>
                    <Led
                      color={LED_SEQ[(i + idx) % 5]}
                      isOn={(i - tick + 60000) % 6 < 2}
                      size={cfg.ledSize}
                    />
                  </div>
                ))}
              </div>

              {/* Scene circle */}
              <div
                onClick={(e) => { e.stopPropagation(); navigate(`/scene/${scene.id}`); }}
                style={{
                  position: "relative",
                  width: cfg.sceneSize, height: cfg.sceneSize,
                  borderRadius: "50%", overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.2)",
                  cursor: "pointer", transition: "all 0.3s ease",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                <img src={scene.image} alt={`Scene ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75)" }} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: cfg.sceneFontSize, fontWeight: 900, opacity: 0.2,
                }}>{idx + 1}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Background Image */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 50 }}>
        <img src="/budd.png" alt="Thorana Background" style={{ height: cfg.centerImg, objectFit: "contain" }} />
      </div>

      {/* Live Chat Component */}
      <LiveChat />

      {/* Credits Component */}
      <Credits initialOpen={showCredits} />
    </div>
  );
}