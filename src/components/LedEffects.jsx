// Shared LED lighting effects — Buddhist Flag Colors
// Used by both Thorana (home) and Scene pages

export const LED_COLORS = {
  blue:   { off: "#000033", on: "#0000FF", shadow: "#0000FF" },
  yellow: { off: "#333300", on: "#FFFF00", shadow: "#FFFF00" },
  red:    { off: "#330000", on: "#FF0000", shadow: "#FF0000" },
  white:  { off: "#222222", on: "#FFFFFF", shadow: "#FFFFFF" },
  orange: { off: "#331100", on: "#FF6600", shadow: "#FF6600" },
};

export const LED_SEQ = ["blue", "yellow", "red", "white", "orange"];

// Tick interval (ms) — shared so animations stay in sync
export const TICK_INTERVAL = 140;
export const TICK_MOD = 160;

/* ═══ Single LED Bulb ═══ */
export const Led = ({ color, isOn, size = 6 }) => {
  const s = LED_COLORS[color] || LED_COLORS.blue;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: isOn ? s.on : s.off,
        boxShadow: isOn ? `0 0 ${size + 2}px ${Math.ceil(size / 2)}px ${s.shadow}` : "none",
        transition: "all 0.25s ease",
        flexShrink: 0,
      }}
    />
  );
};

/* ═══ Horizontal / Vertical LED Strip ═══ */
export const LedStrip = ({ count, tick, offset = 0, size = 5, vertical = false }) => (
  <div
    style={{
      display: "flex",
      flexDirection: vertical ? "column" : "row",
      gap: 5,
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
    }}
  >
    {[...Array(count)].map((_, i) => (
      <Led
        key={i}
        color={LED_SEQ[(i + offset) % 5]}
        isOn={(i + offset - Math.floor(tick / 2) + 80000) % 8 < 3}
        size={size}
      />
    ))}
  </div>
);

/* ═══ Circular LED Ring (absolute-positioned) ═══ */
export const LedRing = ({ count, radius, tick, offset = 0, size = 5 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    }}
  >
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          transform: `rotate(${(i / count) * 360}deg) translate(${radius}px)`,
        }}
      >
        <Led
          color={LED_SEQ[(i + offset) % 5]}
          isOn={(i + offset - Math.floor(tick / 2) + 60000) % 6 < 2}
          size={size}
        />
      </div>
    ))}
  </div>
);
