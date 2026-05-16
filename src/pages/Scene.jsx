import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import scenes from "../data/scenes";
import { Led, LedStrip, LedRing, LED_SEQ, TICK_INTERVAL, TICK_MOD } from "../components/LedEffects";
import { useMute } from "../context/MuteContext";

// Nav button helper
const NavBtn = ({ onClick, children, gold = false, onMouseEnter, onMouseLeave, style = {} }) => (
  <button onClick={onClick} style={{
    background: gold
      ? "linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))"
      : "linear-gradient(135deg, rgba(30,10,51,0.8), rgba(15,5,32,0.9))",
    border: `1px solid rgba(212,160,23,${gold ? 0.25 : 0.3})`,
    borderRadius: 12, padding: "10px 20px",
    color: gold ? "#c4b8a0" : "#facc15",
    fontFamily: "'Noto Serif Sinhala', serif",
    fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
    cursor: "pointer", transition: "all 0.3s ease",
    letterSpacing: "0.1em", ...style,
  }}
    onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
  >{children}</button>
);

export default function Scene() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSinhala, setIsSinhala] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const { isMuted, toggleMute } = useMute();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tick, setTick] = useState(0);
  const audioRef = useRef(null);

  const sceneIndex = scenes.findIndex((s) => s.id === Number(id));
  const scene = scenes[sceneIndex];

  // LED tick — uses shared constants for consistency
  useEffect(() => {
    const iv = setInterval(() => setTick(t => (t + 1) % TICK_MOD), TICK_INTERVAL);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    setIsLoaded(false);
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, [id]);

  // Typewriter
  useEffect(() => {
    if (!scene) return;
    const txt = isSinhala ? scene.text : scene.textEn;
    setDisplayedText("");
    let i = 0;
    const iv = setInterval(() => {
      i++; setDisplayedText(txt.slice(0, i));
      if (i >= txt.length) { setDisplayedText(txt); clearInterval(iv); }
    }, 40);
    return () => clearInterval(iv);
  }, [scene, isSinhala]);

  // Audio
  useEffect(() => {
    if (!scene || !scene.audio) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (!isSinhala) return;
    const audio = new Audio(scene.audio);
    audio.muted = isMuted;
    audioRef.current = audio;
    const onEnd = () => { 
      if (sceneIndex < scenes.length - 1) {
        navigate(`/scene/${scenes[sceneIndex + 1].id}`); 
      } else {
        navigate('/', { state: { showCredits: true } });
      }
    };
    audio.addEventListener("ended", onEnd);
    const t = setTimeout(() => audio.play().catch(() => {}), 500);
    return () => { clearTimeout(t); audio.removeEventListener("ended", onEnd); audio.pause(); audio.src = ""; audioRef.current = null; };
  }, [scene?.id, sceneIndex, navigate, isSinhala]);

  useEffect(() => { if (audioRef.current) audioRef.current.muted = isMuted; }, [isMuted]);

  // Fullscreen
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);
  const toggleFs = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen().catch(() => {});
  };

  // Keyboard
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" && sceneIndex < scenes.length - 1) navigate(`/scene/${scenes[sceneIndex + 1].id}`);
      else if (e.key === "ArrowLeft" && sceneIndex > 0) navigate(`/scene/${scenes[sceneIndex - 1].id}`);
      else if (e.key === "Escape") navigate("/");
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sceneIndex, navigate]);

  const [windowSize, setWindowSize] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1024,
    h: typeof window !== "undefined" ? window.innerHeight : 768
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.w < 768 && windowSize.h > windowSize.w;

  if (!scene) {
    return (
      <div style={{ minHeight: "100vh", background: "#050208", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#c4b8a0", fontFamily: "'Cinzel Decorative', serif", gap: 20 }}>
        <span style={{ fontSize: "3rem" }}>🦚</span>
        <p>Scene not found</p>
        <button onClick={() => navigate("/")} style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.1))", border: "1px solid rgba(212,160,23,0.4)", borderRadius: 12, padding: "12px 28px", color: "#fde047", cursor: "pointer" }}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0f0520 40%, #050208 80%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes thoranaGlow {
          0%,19%{border-color:#0000FF;filter:drop-shadow(0 0 10px #0000FF)}
          20%,39%{border-color:#FFFF00;filter:drop-shadow(0 0 10px #FFFF00)}
          40%,59%{border-color:#FF0000;filter:drop-shadow(0 0 10px #FF0000)}
          60%,79%{border-color:#FFFFFF;filter:drop-shadow(0 0 10px #FFFFFF)}
          80%,100%{border-color:#FF6600;filter:drop-shadow(0 0 10px #FF6600)}
        }
        #scene-thumb-bar::-webkit-scrollbar{display:none}
        @media(max-width:767px) and (orientation: portrait){
          .scene-sidebar{display:none !important}
          .scene-main-layout{flex-direction:column !important; gap:20px !important; padding:10px !important}
          .scene-img-col{max-width:280px !important; flex:none !important}
          .scene-text-col{flex:none !important; max-width:100% !important}
        }
        @media(max-height:500px) and (orientation: landscape){
          .scene-main-layout{gap:10px !important; padding:10px 40px !important; align-items:center !important;}
          .scene-img-col{max-width:160px !important; flex:none !important}
          .scene-text-col{flex:1 !important; max-width:100% !important; gap:8px !important;}
        }
        @media(min-width:768px) and (max-width:1023px) and (min-height:501px){
          .scene-main-layout{gap:30px !important}
          .scene-img-col{max-width:350px !important}
        }
      `}</style>
      {/* Background Image — transparent */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: "url('/bg_vesakKudu.png')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
        opacity: 0.1,
      }} />

      {/* Ambient glow */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: "50%", background: "radial-gradient(ellipse, rgba(212,160,23,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ═══ TOP LED BORDER ═══ */}
      <div style={{ padding: "6px 0", display: "flex", justifyContent: "center" }}>
        <LedStrip count={Math.min(Math.floor(window.innerWidth / 14), 80)} tick={tick} offset={0} size={4} />
      </div>

      {/* ═══ LEFT SIDEBAR (desktop) ═══ */}
      <div className="scene-sidebar" id="scene-thumb-bar" style={{
        position: "fixed", left: 12, top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 6, padding: "10px 6px",
        background: "rgba(15,5,32,0.5)", backdropFilter: "blur(12px)",
        borderRadius: 18, border: "1px solid rgba(212,160,23,0.15)",
        maxHeight: "80vh", overflowY: "auto", zIndex: 100,
        scrollbarWidth: "none", msOverflowStyle: "none",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>
        {scenes.map((s, i) => (
          <div key={s.id} onClick={() => navigate(`/scene/${s.id}`)} style={{
            width: windowSize.h <= 500 ? 30 : 40, height: windowSize.h <= 500 ? 30 : 40, borderRadius: 10, overflow: "hidden",
            border: i === sceneIndex ? "2px solid #facc15" : "1px solid rgba(212,160,23,0.2)",
            cursor: "pointer", opacity: i === sceneIndex ? 1 : 0.55, flexShrink: 0,
            transition: "all 0.3s ease",
            boxShadow: i === sceneIndex ? "0 0 12px rgba(250,204,21,0.3)" : "none",
            transform: i === sceneIndex ? "scale(1.1)" : "scale(1)",
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { if (i !== sceneIndex) { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.transform = "scale(1)"; } }}
          >
            <img src={s.image} alt={s.titleEn} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>

      {/* ═══ LEFT LED COLUMN (desktop) ═══ */}
      <div className="scene-sidebar" style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 14,
        display: "flex", flexDirection: "column", justifyContent: "space-around",
        alignItems: "center", padding: "40px 2px", zIndex: 50, pointerEvents: "none",
      }}>
        {[...Array(20)].map((_, i) => (
          <Led key={i} color={LED_SEQ[i % 5]} isOn={(i - Math.floor(tick / 2) + 70000) % 7 < 3} size={windowSize.h <= 500 ? 2 : 4} />
        ))}
      </div>

      {/* ═══ RIGHT LED COLUMN (desktop) ═══ */}
      <div className="scene-sidebar" style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 14,
        display: "flex", flexDirection: "column", justifyContent: "space-around",
        alignItems: "center", padding: "40px 2px", zIndex: 50, pointerEvents: "none",
      }}>
        {[...Array(20)].map((_, i) => (
          <Led key={i} color={LED_SEQ[(i + 2) % 5]} isOn={(i + 2 - Math.floor(tick / 2) + 70000) % 7 < 3} size={windowSize.h <= 500 ? 2 : 4} />
        ))}
      </div>

      {/* ═══ TOP NAV ═══ */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px clamp(12px, 3vw, 20px)", position: "relative", zIndex: 20,
        flexWrap: "wrap", gap: 8,
      }}>
        <button onClick={() => navigate("/")} style={{
          background: "none", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10,
          padding: "6px 12px", color: "#c4b8a0",
          fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
          fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)", cursor: "pointer", transition: "all 0.3s ease",
        }}
          onMouseEnter={e => { e.target.style.borderColor = "rgba(212,160,23,0.5)"; e.target.style.color = "#fde047"; }}
          onMouseLeave={e => { e.target.style.borderColor = "rgba(212,160,23,0.2)"; e.target.style.color = "#c4b8a0"; }}
        >
          {isSinhala ? "◁ මුලට" : "◁ HOME"}
        </button>

        <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)", color: "rgba(212,160,23,0.5)", letterSpacing: "0.2em" }}>
          {String(sceneIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </span>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Audio */}
          <button onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"} style={{
            background: "none", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10,
            padding: "6px 10px", color: "#c4b8a0", cursor: "pointer", transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.5)"; e.currentTarget.style.color = "#fde047"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.2)"; e.currentTarget.style.color = "#c4b8a0"; }}
          >{isMuted ? "🔇" : "🔊"}</button>

          {/* Fullscreen */}
          <button onClick={toggleFs} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} style={{
            background: "none", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10,
            padding: "6px 10px", color: "#c4b8a0", cursor: "pointer", transition: "all 0.3s ease",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", lineHeight: 1,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.5)"; e.currentTarget.style.color = "#fde047"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(212,160,23,0.2)"; e.currentTarget.style.color = "#c4b8a0"; }}
          >⛶</button>

          {/* Language */}
          <button onClick={() => setIsSinhala(!isSinhala)} style={{
            background: "none", border: "1px solid rgba(212,160,23,0.2)", borderRadius: 10,
            padding: "6px 12px", color: "#c4b8a0",
            fontFamily: isSinhala ? "'Cinzel Decorative', serif" : "'Noto Serif Sinhala', serif",
            fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)", cursor: "pointer", transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(212,160,23,0.5)"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(212,160,23,0.2)"; }}
          >{isSinhala ? "EN" : "සිං"}</button>
        </div>
      </nav>

      {/* ═══ LED divider under nav ═══ */}
      <div style={{ padding: "2px 0", display: "flex", justifyContent: "center" }}>
        <LedStrip count={Math.min(Math.floor(window.innerWidth / 18), 60)} tick={tick} offset={4} size={3} />
      </div>

      {/* ═══ MOBILE THUMBNAIL STRIP ═══ */}
      <div style={{
        display: isMobile ? "flex" : "none",
        gap: 6, padding: "8px 12px", overflowX: "auto",
        scrollbarWidth: "none", msOverflowStyle: "none",
        justifyContent: "center", flexWrap: "wrap",
      }}>
        {scenes.map((s, i) => (
          <div key={s.id} onClick={() => navigate(`/scene/${s.id}`)} style={{
            width: 34, height: 34, borderRadius: 8, overflow: "hidden", flexShrink: 0,
            border: i === sceneIndex ? "2px solid #facc15" : "1px solid rgba(212,160,23,0.2)",
            cursor: "pointer", opacity: i === sceneIndex ? 1 : 0.5,
          }}>
            <img src={s.image} alt={s.titleEn} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="scene-main-layout" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "10px clamp(10px, 3vw, 30px)",
        opacity: isLoaded ? 1 : 0, transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        maxWidth: 1400, margin: "0 auto", width: "100%",
        gap: 40,
      }}>
        {/* ═══ IMAGE COLUMN ═══ */}
        <div className="scene-img-col" style={{
          flex: "1 1 350px", maxWidth: 450, display: "flex", justifyContent: "center", position: "relative",
        }}>
          <div style={{ position: "relative", width: "100%", maxWidth: 400, aspectRatio: "1/1" }}>
            {/* Thorana glow ring */}
            <div style={{
              position: "absolute", inset: -14, borderRadius: "50%",
              border: "6px dotted transparent", animation: "thoranaGlow 1.5s infinite",
              pointerEvents: "none", zIndex: 1,
            }} />

            {/* LED Ring around image */}
            <LedRing count={24} radius={isMobile ? 130 : 190} tick={tick} offset={sceneIndex} size={isMobile ? 4 : 5} />

            {/* Second outermost LED ring */}
            <LedRing count={40} radius={isMobile ? 164 : 230} tick={tick} offset={sceneIndex + 6} size={isMobile ? 3 : 4} />

            <img src={scene.image} alt={scene.titleEn} style={{
              width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)", display: "block",
              position: "relative", zIndex: 2,
            }} />
          </div>
        </div>

        {/* ═══ TEXT COLUMN ═══ */}
        <div className="scene-text-col" style={{
          flex: "2 1 400px", maxWidth: 750, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 18,
        }}>
          <h1 style={{
            fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
            fontSize: isSinhala ? (windowSize.h <= 500 ? "1.1rem" : "clamp(1.2rem, 3.5vw, 2rem)") : (windowSize.h <= 500 ? "0.9rem" : "clamp(1rem, 3vw, 1.6rem)"),
            fontWeight: 700,
            background: "linear-gradient(135deg, #fde047, #facc15, #d4a017)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            textAlign: "center", lineHeight: 1.4, margin: 0,
          }}>
            {isSinhala ? scene.title : scene.titleEn}
          </h1>

          {/* Divider with LEDs */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 350 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.4))" }} />
            <LedStrip count={5} tick={tick} offset={sceneIndex} size={4} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(212,160,23,0.4), transparent)" }} />
          </div>

          <p style={{
            fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cormorant Garamond', serif",
            fontSize: isSinhala ? (windowSize.h <= 500 ? "0.85rem" : "clamp(0.85rem, 2vw, 1.15rem)") : (windowSize.h <= 500 ? "0.9rem" : "clamp(0.95rem, 2vw, 1.3rem)"),
            color: "#c4b8a0", textAlign: "center", lineHeight: windowSize.h <= 500 ? 1.5 : 1.9,
            maxWidth: 700, padding: "0 8px", whiteSpace: "pre-wrap",
            minHeight: isMobile ? (windowSize.h <= 500 ? "70px" : "120px") : "160px", margin: 0,
          }}>
            {displayedText}
            <span style={{
              opacity: displayedText.length < (isSinhala ? scene.text.length : scene.textEn.length) ? 1 : 0,
              animation: "blink 1s step-end infinite",
            }}>|</span>
          </p>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
            {sceneIndex > 0 && (
              <NavBtn onClick={() => navigate(`/scene/${scenes[sceneIndex - 1].id}`)}>
                {isSinhala ? "◁ පෙර" : "◁ PREV"}
              </NavBtn>
            )}
            <NavBtn gold onClick={() => navigate("/")}>
              {isSinhala ? "✦ තොරණ" : "✦ THORANA"}
            </NavBtn>
            {sceneIndex < scenes.length - 1 && (
              <NavBtn onClick={() => navigate(`/scene/${scenes[sceneIndex + 1].id}`)}>
                {isSinhala ? "මීළඟ ▷" : "NEXT ▷"}
              </NavBtn>
            )}
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM LED BORDERS ═══ */}
      <div style={{ padding: "4px 0 8px", display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        <LedStrip count={Math.min(Math.floor(window.innerWidth / 16), 70)} tick={tick} offset={6} size={4} />
        <LedStrip count={Math.min(Math.floor(window.innerWidth / 12), 80)} tick={tick} offset={2} size={5} />
      </div>
    </div>
  );
}