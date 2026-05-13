import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import scenes from "../data/scenes";
import backImg from "../assets/budd.png";

// Strictly Buddhist Flag Colors (Blue, Yellow, Red, White, Orange)
const LED_COLORS = {
  blue: { off: "#000033", on: "#0000FF", shadow: "#0000FF" },
  yellow: { off: "#333300", on: "#FFFF00", shadow: "#FFFF00" },
  red: { off: "#330000", on: "#FF0000", shadow: "#FF0000" },
  white: { off: "#222222", on: "#FFFFFF", shadow: "#FFFFFF" },
  orange: { off: "#331100", on: "#FF6600", shadow: "#FF6600" },
};

const LED_SEQUENCE = ["blue", "yellow", "red", "white", "orange"];

const Led = ({ color, isOn, size = "w-2 h-2" }) => {
  const styles = LED_COLORS[color] || LED_COLORS.blue;
  return (
    <div
      className={`${size} rounded-full transition-all duration-300`}
      style={{
        backgroundColor: isOn ? styles.on : styles.off,
        boxShadow: isOn ? `0 0 10px 2px ${styles.shadow}` : "none",
      }}
    />
  );
};

export default function Thorana() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => (t + 1) % 120);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const displayScenes = scenes.slice(0, 8);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-display select-none">

      {/* Middle Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[50, 85, 120, 155, 190].map((radius, rIdx) => (
          <div key={rIdx} className="absolute">
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * 360;
              const color = LED_SEQUENCE[(i + rIdx) % 5];
              // Sequential pulse
              const isOn = (i + rIdx + Math.floor(tick / 2)) % 10 < 3;
              return (
                <div key={i} className="absolute" style={{ transform: `rotate(${angle}deg) translate(${radius}px)` }}>
                  <Led color={color} isOn={isOn} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Outer Scenes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {displayScenes.map((scene, idx) => {
          const angle = (idx / 8) * 360 - 90;
          const radius = 300;
          return (
            <div key={scene.id} className="absolute pointer-events-auto" style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)` }}>
              {/* LED Ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="absolute" style={{ transform: `rotate(${(i / 16) * 360}deg) translate(85px)` }}>
                    <Led color={LED_SEQUENCE[(i + idx) % 5]} isOn={(i + tick) % 6 < 2} size="w-1.5 h-1.5" />
                  </div>
                ))}
              </div>
              {/* Scene Circle */}
              <div onClick={() => navigate(`/scene/${scene.id}`)} className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-white/20 hover:border-white transition-all duration-300 hover:scale-105 group cursor-pointer shadow-2xl">
                <img src={scene.image} className="w-full h-full object-cover brightness-75 group-hover:brightness-100" />
                <div className="absolute inset-0 flex items-center justify-center text-white text-5xl font-black opacity-20 group-hover:opacity-100">{idx + 1}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ Middle Background Image (Moved Forward) ═══ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 z-50">
        <img
          src={backImg}
          alt="Thorana Background"
          className=" h-[200px] object-contain "
        />
      </div>

    </div>
  );
}