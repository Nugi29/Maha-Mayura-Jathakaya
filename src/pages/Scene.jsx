import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import scenes from "../data/scenes";

export default function Scene() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSinhala, setIsSinhala] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const sceneIndex = scenes.findIndex((s) => s.id === Number(id));
  const scene = scenes[sceneIndex];

  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [id]);

  // Typewriter effect
  useEffect(() => {
    if (!scene) return;
    const currentText = isSinhala ? scene.text : scene.textEn;
    setDisplayedText("");
    let i = 0;
    // Slow typing speed
    const charsPerTick = 1; 
    const interval = setInterval(() => {
      i += charsPerTick;
      setDisplayedText(currentText.slice(0, i));
      if (i >= currentText.length) {
        setDisplayedText(currentText);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [scene, isSinhala]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" && sceneIndex < scenes.length - 1) {
        navigate(`/scene/${scenes[sceneIndex + 1].id}`);
      } else if (e.key === "ArrowLeft" && sceneIndex > 0) {
        navigate(`/scene/${scenes[sceneIndex - 1].id}`);
      } else if (e.key === "Escape") {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sceneIndex, navigate]);

  if (!scene) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050208",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#c4b8a0",
        fontFamily: "'Cinzel Decorative', serif",
        gap: 20,
      }}>
        <span style={{ fontSize: "3rem" }}>🦚</span>
        <p style={{ fontSize: "1.2rem" }}>Scene not found</p>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.1))",
            border: "1px solid rgba(212,160,23,0.4)",
            borderRadius: 12,
            padding: "12px 28px",
            color: "#fde047",
            fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
            fontSize: "0.8rem",
            cursor: "pointer",
            letterSpacing: "0.1em",
          }}
        >
          {isSinhala ? "මුල් පිටුවට" : "Return Home"}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 30%, #1a0a2e 0%, #0f0520 40%, #050208 80%)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow behind image */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: "50%",
        background: "radial-gradient(ellipse, rgba(212,160,23,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Vertical Scene thumbnails strip - Left side */}
      <div 
        id="scene-thumbnail-sidebar"
        style={{
          position: "fixed",
          left: 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "12px 8px",
          background: "rgba(15,5,32,0.4)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          border: "1px solid rgba(212,160,23,0.15)",
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 100,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <style>{`
          #scene-thumbnail-sidebar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {scenes.map((s, i) => (
          <div
            key={s.id}
            onClick={() => navigate(`/scene/${s.id}`)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              overflow: "hidden",
              border: i === sceneIndex
                ? "2px solid #facc15"
                : "1px solid rgba(212,160,23,0.2)",
              cursor: "pointer",
              opacity: i === sceneIndex ? 1 : 0.6,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              flexShrink: 0,
              boxShadow: i === sceneIndex ? "0 0 15px rgba(250, 204, 21, 0.3)" : "none",
              transform: i === sceneIndex ? "scale(1.1)" : "scale(1)",
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.8)";
            }}
            onMouseLeave={(e) => { 
              if (i !== sceneIndex) {
                e.currentTarget.style.opacity = "0.6";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.borderColor = "rgba(212,160,23,0.2)";
              } else {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.borderColor = "#facc15";
              }
            }}
          >
            <img
              src={s.image}
              alt={s.titleEn}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* Top nav bar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        position: "relative",
        zIndex: 20,
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "1px solid rgba(212,160,23,0.2)",
            borderRadius: 10,
            padding: "8px 16px",
            color: "#c4b8a0",
            fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
            fontSize: "0.7rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            letterSpacing: "0.1em",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "rgba(212,160,23,0.5)";
            e.target.style.color = "#fde047";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "rgba(212,160,23,0.2)";
            e.target.style.color = "#c4b8a0";
          }}
        >
          {isSinhala ? "◁ මුලට" : "◁ HOME"}
        </button>

        <span style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "0.7rem",
          color: "rgba(212,160,23,0.5)",
          letterSpacing: "0.2em",
        }}>
          {String(sceneIndex + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
        </span>

        <button
          onClick={() => setIsSinhala(!isSinhala)}
          style={{
            background: "none",
            border: "1px solid rgba(212,160,23,0.2)",
            borderRadius: 10,
            padding: "8px 16px",
            color: "#c4b8a0",
            fontFamily: isSinhala ? "'Cinzel Decorative', serif" : "'Noto Serif Sinhala', serif",
            fontSize: "0.7rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "rgba(212,160,23,0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "rgba(212,160,23,0.2)";
          }}
        >
          {isSinhala ? "EN" : "සිං"}
        </button>
      </nav>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes thoranaGlow {
            0%, 19% { border-color: #0000FF; filter: drop-shadow(0 0 10px #0000FF); }
            20%, 39% { border-color: #FFFF00; filter: drop-shadow(0 0 10px #FFFF00); }
            40%, 59% { border-color: #FF0000; filter: drop-shadow(0 0 10px #FF0000); }
            60%, 79% { border-color: #FFFFFF; filter: drop-shadow(0 0 10px #FFFFFF); }
            80%, 100% { border-color: #FF6600; filter: drop-shadow(0 0 10px #FF6600); }
          }
        `}
      </style>

      {/* Main content wrapper */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 10px",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        maxWidth: "96%",
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: 60,
          width: "100%",
        }}>
          {/* Left Column - Scene Image */}
          <div style={{
            flex: "1 1 400px",
            maxWidth: 500,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
            }}>
              {/* Thorana-style Light Effect */}
              <div style={{
                position: "absolute",
                inset: -16,
                borderRadius: "50%",
                border: "8px dotted transparent",
                animation: "thoranaGlow 1.5s infinite",
                pointerEvents: "none",
                zIndex: 1,
              }} />

              <img
                src={scene.image}
                alt={scene.titleEn}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                  display: "block",
                  position: "relative",
                  zIndex: 2,
                }}
              />
            </div>
          </div>

          {/* Right Column - Text & Controls */}
          <div style={{
            flex: "2 1 600px",
            maxWidth: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}>
            {/* Title */}
            <h1 style={{
              fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
              fontSize: isSinhala ? "clamp(1.5rem, 4vw, 2.2rem)" : "clamp(1.2rem, 3.5vw, 1.8rem)",
              fontWeight: 700,
              background: "linear-gradient(135deg, #fde047, #facc15, #d4a017)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
              lineHeight: 1.4,
              margin: 0,
            }}>
              {isSinhala ? scene.title : scene.titleEn}
            </h1>

            {/* Decorative divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              maxWidth: 300,
            }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.4))" }} />
              <span style={{ color: "#d4a017", fontSize: "0.8rem" }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(212,160,23,0.4), transparent)" }} />
            </div>

            {/* Description with Typewriter Effect */}
            <p style={{
              fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cormorant Garamond', serif",
              fontSize: isSinhala ? "clamp(0.95rem, 2.5vw, 1.25rem)" : "clamp(1.1rem, 2.5vw, 1.4rem)",
              color: "#c4b8a0",
              textAlign: "center",
              lineHeight: 1.9,
              maxWidth: 750,
              padding: "0 12px",
              whiteSpace: "pre-wrap",
              minHeight: "180px", // Reserve space to avoid layout shift while typing
              margin: 0,
            }}>
              {displayedText}
              <span style={{
                opacity: displayedText.length < (isSinhala ? scene.text.length : scene.textEn.length) ? 1 : 0,
                animation: "blink 1s step-end infinite"
              }}>|</span>
            </p>

            {/* Navigation buttons */}
            <div style={{
              display: "flex",
              gap: 12,
              marginTop: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              {sceneIndex > 0 && (
                <button
                  onClick={() => navigate(`/scene/${scenes[sceneIndex - 1].id}`)}
                  style={{
                    background: "linear-gradient(135deg, rgba(30,10,51,0.8), rgba(15,5,32,0.9))",
                    border: "1px solid rgba(212,160,23,0.3)",
                    borderRadius: 12,
                    padding: "12px 24px",
                    color: "#facc15",
                    fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(212,160,23,0.6)";
                    e.target.style.boxShadow = "0 4px 16px rgba(212,160,23,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(212,160,23,0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {isSinhala ? "◁ පෙර" : "◁ PREV"}
                </button>
              )}

              <button
                onClick={() => navigate("/")}
                style={{
                  background: "linear-gradient(135deg, rgba(212,160,23,0.15), rgba(212,160,23,0.05))",
                  border: "1px solid rgba(212,160,23,0.25)",
                  borderRadius: 12,
                  padding: "12px 24px",
                  color: "#c4b8a0",
                  fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.1em",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(212,160,23,0.5)";
                  e.target.style.color = "#fde047";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(212,160,23,0.25)";
                  e.target.style.color = "#c4b8a0";
                }}
              >
                {isSinhala ? "✦ තොරණ" : "✦ THORANA"}
              </button>

              {sceneIndex < scenes.length - 1 && (
                <button
                  onClick={() => navigate(`/scene/${scenes[sceneIndex + 1].id}`)}
                  style={{
                    background: "linear-gradient(135deg, rgba(30,10,51,0.8), rgba(15,5,32,0.9))",
                    border: "1px solid rgba(212,160,23,0.3)",
                    borderRadius: 12,
                    padding: "12px 24px",
                    color: "#facc15",
                    fontFamily: isSinhala ? "'Noto Serif Sinhala', serif" : "'Cinzel Decorative', serif",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(212,160,23,0.6)";
                    e.target.style.boxShadow = "0 4px 16px rgba(212,160,23,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "rgba(212,160,23,0.3)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {isSinhala ? "මීළඟ ▷" : "NEXT ▷"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}