export type LiftIconKind =
  | "squat-back"
  | "squat-front"
  | "bench-flat"
  | "bench-incline"
  | "deadlift"
  | "press-overhead";

// Consistent barbell grammar across all six: a bar (line) + two end plates
// (rounded rects), positioned/oriented differently per lift, plus a minimal
// body-axis line so the bar's position actually reads as a stance.
const PLATE = (x: number, y: number) =>
  `<rect x="${x}" y="${y - 4}" width="3" height="8" rx="1" fill="COLOR"/>`;
const BAR = (y: number) =>
  `<line x1="5" y1="${y}" x2="19" y2="${y}" stroke="COLOR" stroke-width="2.5" stroke-linecap="round"/>${PLATE(2, y)}${PLATE(19, y)}`;
const LINE = (x1: number, y1: number, x2: number, y2: number, w = 2) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="COLOR" stroke-width="${w}" stroke-linecap="round"/>`;
const HEAD = (cy: number, r = 2) =>
  `<circle cx="12" cy="${cy}" r="${r}" fill="none" stroke="COLOR" stroke-width="2"/>`;

const ICON_BODY: Record<LiftIconKind, string> = {
  "squat-back": [
    BAR(7),
    LINE(12, 8.5, 12, 15),
    LINE(12, 15, 8, 21),
    LINE(12, 15, 16, 21),
  ].join(""),
  "squat-front": [
    HEAD(4),
    LINE(12, 6, 12, 9.5),
    BAR(10),
    LINE(12, 11.5, 8, 21),
    LINE(12, 11.5, 16, 21),
  ].join(""),
  "bench-flat": [BAR(9), LINE(4, 18, 20, 18)].join(""),
  "bench-incline": [BAR(9), LINE(5, 21, 16, 13)].join(""),
  deadlift: [BAR(19), HEAD(5, 2.5), LINE(12, 8, 12, 17)].join(""),
  "press-overhead": [
    BAR(5),
    LINE(12, 6.5, 12, 19),
    LINE(12, 19, 9, 23),
    LINE(12, 19, 15, 23),
  ].join(""),
};

function svgDataUri(kind: LiftIconKind, color: string): string {
  const body = ICON_BODY[kind].replaceAll("COLOR", color);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createLiftIcon(
  kind: LiftIconKind,
  color: string,
  size = 28,
): HTMLImageElement {
  const img = new Image(size, size);
  img.src = svgDataUri(kind, color);
  return img;
}
