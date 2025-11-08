export function getTransparentFill(color) {
  const map = {
    red: "rgba(255, 0, 0, 0.3)",
    blue: "rgba(0, 0, 255, 0.3)",
    green: "rgba(0, 128, 0, 0.3)",
    yellow: "rgba(255, 255, 0, 0.3)",
    orange: "rgba(255, 165, 0, 0.3)",
    purple: "rgba(128, 0, 128, 0.3)",
    pink: "rgba(255, 192, 203, 0.3)",
    brown: "rgba(165, 42, 42, 0.3)",
    black: "rgba(0, 0, 0, 0.3)",
    white: "rgba(255, 255, 255, 0.3)",
    gray: "rgba(128, 128, 128, 0.3)",
    cyan: "rgba(0, 255, 255, 0.3)",
    magenta: "rgba(255, 0, 255, 0.3)",
    lime: "rgba(0, 255, 0, 0.3)",
    teal: "rgba(0, 128, 128, 0.3)",
    navy: "rgba(0, 0, 128, 0.3)",
    maroon: "rgba(128, 0, 0, 0.3)",
    olive: "rgba(128, 128, 0, 0.3)",
  };

  if (!color) return "rgba(0, 0, 0, 0.3)";
  const key = color.toLowerCase();
  if (map[key]) return map[key];

  // support hex colors like #rrggbb or #rgb
  if (key[0] === "#") {
    // normalize
    let hex = key.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, 0.25)`;
    }
  }

  return "rgba(0, 0, 0, 0.3)";
}
