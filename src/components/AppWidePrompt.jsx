import { useState, useEffect, useRef } from 'react';

export default function AppWidePrompt({ children }) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showPrompt, setShowPrompt] = useState(() => !document.fullscreenElement);
  const [skipRotation, setSkipRotation] = useState(false);
  const hasDismissedRef = useRef(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setIsPortrait(window.innerHeight > window.innerWidth);
      
      if (!document.fullscreenElement && !hasDismissedRef.current) {
        setShowPrompt(true);
      } else if (document.fullscreenElement) {
        setShowPrompt(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    document.addEventListener("fullscreenchange", checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
      document.removeEventListener("fullscreenchange", checkDevice);
    };
  }, []);

  const enterExperience = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock('landscape').catch(() => {});
    }
    hasDismissedRef.current = true;
    setShowPrompt(false);
    window.dispatchEvent(new Event('app-started'));
  };

  const dismissPrompt = () => {
    hasDismissedRef.current = true;
    setShowPrompt(false);
    window.dispatchEvent(new Event('app-started'));
  };

  if (isMobile && isPortrait && !skipRotation) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#facc15', fontFamily: "'Noto Serif Sinhala', serif", textAlign: 'center',
        padding: 20
      }}>
        <div style={{
           width: 60, height: 100, border: '2px solid #facc15', borderRadius: 10,
           position: 'relative', animation: 'rotateDevice 2s infinite ease-in-out'
        }}>
           <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', width: 20, height: 4, background: '#facc15', borderRadius: 2 }} />
        </div>
        <style>{`
          @keyframes rotateDevice {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(-90deg); }
            100% { transform: rotate(-90deg); }
          }
        `}</style>
        <h2 style={{ marginTop: 40, marginBottom: 10 }}>Rotate Device / උපාංගය හරවන්න</h2>
        <p style={{ color: '#c4b8a0', maxWidth: 300, marginBottom: 20 }}>
          Please rotate your device horizontally for the best experience.
          <br/><br/>
          වඩාත් හොඳ අත්දැකීමක් සඳහා ඔබගේ දුරකථනය හරස් අතට හරවන්න.
        </p>
        <button 
          onClick={() => {
            setSkipRotation(true);
            window.dispatchEvent(new Event('app-started'));
          }}
          style={{
            background: "transparent", border: "1px solid rgba(212,160,23,0.5)",
            color: "#c4b8a0", padding: "10px 24px", borderRadius: 8, cursor: "pointer",
            marginTop: 10,
          }}
        >
          Skip
        </button>
      </div>
    );
  }

  return (
    <>
      {children}
      {showPrompt && (
        <div 
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", pointerEvents: "auto",
          }}
        >
          <div style={{
            background: "rgba(15,5,32,0.8)", border: "1px solid rgba(212,160,23,0.5)",
            borderRadius: 16, padding: "40px", maxWidth: 500, textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8)", margin: 20
          }}>
            <h2 style={{ color: "#facc15", fontFamily: "'Noto Serif Sinhala', serif", marginBottom: 20 }}>
              Full Screen Mode
            </h2>
            <p style={{ color: "#c4b8a0", fontFamily: "'Noto Serif Sinhala', serif", lineHeight: 1.6, marginBottom: 10 }}>
              ඩිජිටල් තොරණේ වඩාත් හොඳ අත්දැකීමක් සඳහා Full Screen භාවිතා කරන්න.
            </p>
            <p style={{ color: "#c4b8a0", fontFamily: "sans-serif", lineHeight: 1.6, marginBottom: 15, fontSize: "0.9rem", opacity: 0.8 }}>
              For the best immersive experience, please enable Fullscreen.
            </p>
            <div style={{ background: "rgba(212,160,23,0.1)", padding: "12px", borderRadius: "8px", border: "1px dashed rgba(212,160,23,0.3)", marginBottom: 30 }}>
              <p style={{ color: "#facc15", fontFamily: "'Noto Serif Sinhala', serif", lineHeight: 1.6, margin: 0, fontSize: "0.95rem" }}>
                මුල සිට නැරඹීමට බුදු රුව මත click කරන්න.
              </p>
              <p style={{ color: "#c4b8a0", fontFamily: "sans-serif", lineHeight: 1.6, margin: 0, marginTop: "4px", fontSize: "0.8rem", opacity: 0.8 }}>
                Click on the Buddha statue to view from the beginning.
              </p>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={dismissPrompt}
                style={{
                  background: "transparent", border: "1px solid rgba(212,160,23,0.5)",
                  color: "#c4b8a0", padding: "10px 24px", borderRadius: 8, cursor: "pointer",
                }}
              >
                Later
              </button>
              <button
                onClick={enterExperience}
                style={{
                  background: "linear-gradient(135deg, #b8860b, #d4af37)", border: "none",
                  color: "#000", fontWeight: "bold", padding: "10px 24px", borderRadius: 8, cursor: "pointer",
                }}
              >
                Enter Fullscreen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
