export const chartColors = {
  line: "#d6672a",
  lineFill: "rgba(214, 103, 42, 0.12)",
  grid: "#eee6dc",
  text: "#3a2a20",
  muted: "#8a7b6f",
};

export function getChartFont() {
  if (typeof window === "undefined") return "sans-serif";
  const font = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-plex-thai")
    .trim();
  return font || "sans-serif";
}

export const tooltipStyle = {
  backgroundColor: "#ffffff",
  titleColor: chartColors.text,
  bodyColor: chartColors.text,
  borderColor: chartColors.grid,
  borderWidth: 1,
  padding: 10,
  cornerRadius: 12,
  displayColors: false,
};
