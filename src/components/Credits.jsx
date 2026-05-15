import { useState } from "react";

export default function Credits({ initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <>
      {/* Credits Button */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        style={{
          position: "absolute",
          bottom: "clamp(12px, 3vw, 30px)",
          left: "clamp(16px, 4vw, 50px)",
          zIndex: 100,
          background: "rgba(15,5,32,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(212,160,23,0.3)",
          borderRadius: "10px",
          padding: "8px 16px",
          cursor: "pointer",
          color: "#c4b8a0",
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: "0.9rem",
          transition: "all 0.3s ease",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,160,23,0.7)";
          e.currentTarget.style.color = "#fde047";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)";
          e.currentTarget.style.color = "#c4b8a0";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Credits
      </button>

      {/* Floating Page / Modal */}
      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          style={{
          position: "absolute", inset: 0, zIndex: 1000,
          background: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(10px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column",
          pointerEvents: "auto",
        }}>
          {/* Close Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{
              position: "absolute", top: 24, right: 24,
              background: "rgba(15,5,32,0.5)", border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "50%", color: "#c4b8a0", width: "40px", height: "40px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", cursor: "pointer", zIndex: 1010,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.7)";
              e.currentTarget.style.color = "#fde047";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)";
              e.currentTarget.style.color = "#c4b8a0";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>

          {/* Credits Container */}
          <div style={{
            position: "relative",
            width: "90%", maxWidth: "800px",
            height: "70vh",
            overflow: "hidden",
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          }}>
            <style>{`
              @keyframes creditsScroll {
                0% { transform: translateY(100%); }
                100% { transform: translateY(-100%); }
              }
              .credits-content p {
                margin: 8px 0;
                font-size: 1.1rem;
              }
              .credits-content h3 {
                color: #fde047;
                margin-top: 50px;
                margin-bottom: 15px;
                font-size: 1.5rem;
                letter-spacing: 0.1em;
              }
            `}</style>

            <div className="credits-content" style={{
              animation: "creditsScroll 25s linear infinite",
              textAlign: "center",
              color: "#c4b8a0",
              fontFamily: "'Cinzel Decorative', serif",
              padding: "20px 0",
              height: "100%",
            }}
              onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
              onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
            >
              <h2 style={{
                color: "#facc15",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                marginBottom: "80px",
                fontFamily: "'Noto Serif Sinhala', serif",
                textShadow: "0 0 20px rgba(212,160,23,0.5)"
              }}>
                මහා මයුර ජාතකය
              </h2>
              <p style={{ letterSpacing: "0.2em", color: "rgba(196,184,160,0.7)" }}>THE GREAT PEACOCK</p>

              <h3>Concept & Direction</h3>
              <p>Nugitha Disas</p>

              <h3>Lead Developer & Designer</h3>
              <p>Nugitha Disas</p>
              <a href="https://github.com/nugi29" target="_blank">@nugi29</a>

              <h3>Narrative Translation & Content</h3>
              <p>Chatgpt</p>

              <h3>Digital Assets</h3>
              <p>Google Search Engine and Images</p>

              <h3>Story Voice and audio source</h3>
              <a href="https://www.youtube.com/@apadakinnalokaya" target="_blank">අප දකින ලෝකය | Apa Dakina Lokaya (Youtube Channel)</a>

              <h3>Background Music</h3>
              <a href="https://www.youtube.com/watch?v=c5DlIdv9lhc" target="_blank">GeemathBeats (Youtube Channel)</a>

              <h3>Special Thanks</h3>
              <p>Open Source Community</p>
              <p>All Devotees who supported this project</p>

              <div style={{ marginTop: "80px", opacity: 0.6 }}>
                <p>May the merit of this Dhamma Dana</p>
                <p>bring peace and happiness to all beings.</p>
                <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>© 2026 Maha Mayura Jathakaya Digital Thorana</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
