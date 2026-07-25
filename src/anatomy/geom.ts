/**
 * Geometry helpers for authoring the anatomical body map.
 *
 * Muscles are defined as ordered landmark points rather than raw bezier control
 * points: a rhomboid is "medial border of scapula, T2 spinous, T5 spinous, back
 * to the scapula", which is something you can check against an anatomy atlas.
 * These helpers turn that into smooth SVG path data, mirror it across the body's
 * midline, and generate the fibre striations that make the drawing read as
 * anatomy rather than as a diagram.
 */

export type Pt = readonly [number, number];

/** Body midline in the shared 600x1400 viewBox. */
export const MIDLINE = 300;

const r = (n: number) => Math.round(n * 10) / 10;
const fmt = (p: Pt) => `${r(p[0])} ${r(p[1])}`;

/**
 * Catmull-Rom spline through every point, emitted as cubic beziers.
 * `tension` 0 gives straight lines, 1 gives the standard rounded curve.
 */
export function smooth(points: Pt[], closed = true, tension = 1): string {
  const n = points.length;
  if (n < 2) return "";
  if (n === 2) return `M ${fmt(points[0])} L ${fmt(points[1])}${closed ? " Z" : ""}`;

  const at = (i: number): Pt =>
    closed
      ? points[((i % n) + n) % n]
      : points[Math.max(0, Math.min(n - 1, i))];

  const k = tension / 6;
  let d = `M ${fmt(points[0])}`;
  const segments = closed ? n : n - 1;

  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C ${fmt(c1)} ${fmt(c2)} ${fmt(p2)}`;
  }

  return d + (closed ? " Z" : "");
}

/** Straight polygon, for bone and other hard-edged structures. */
export function poly(points: Pt[], closed = true): string {
  if (!points.length) return "";
  return (
    `M ${fmt(points[0])}` +
    points.slice(1).map((p) => ` L ${fmt(p)}`).join("") +
    (closed ? " Z" : "")
  );
}

/** Reflect points across the midline to produce the opposite side. */
export function mirror(points: Pt[], axis = MIDLINE): Pt[] {
  return points.map(([x, y]) => [2 * axis - x, y] as Pt);
}

export function centroid(points: Pt[]): Pt {
  let x = 0;
  let y = 0;
  for (const p of points) {
    x += p[0];
    y += p[1];
  }
  return [x / points.length, y / points.length];
}

export function bbox(points: Pt[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

export function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/**
 * Build a closed outline from a centreline and a width at each point — the
 * natural way to describe strap muscles (levator scapulae, sartorius, the
 * erector spinae columns) and nerve trunks.
 */
export function ribbon(
  centre: Pt[],
  widths: number | number[],
  /**
   * Muscles narrow to a tendon at each end. Without this the closed spline
   * rounds the flat end into a semicircle and every strap muscle reads as a
   * capsule. Long bones want "none"; almost everything else wants "both".
   */
  taper: "both" | "start" | "end" | "none" = "both",
): Pt[] {
  const n = centre.length;
  const w = (i: number) =>
    typeof widths === "number" ? widths : widths[Math.min(i, widths.length - 1)];

  const left: Pt[] = [];
  const right: Pt[] = [];

  for (let i = 0; i < n; i++) {
    const prev = centre[Math.max(0, i - 1)];
    const next = centre[Math.min(n - 1, i + 1)];
    let tx = next[0] - prev[0];
    let ty = next[1] - prev[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    // Normal is the tangent rotated 90 degrees.
    const nx = -ty;
    const ny = tx;
    const h = w(i) / 2;
    left.push([centre[i][0] + nx * h, centre[i][1] + ny * h]);
    right.push([centre[i][0] - nx * h, centre[i][1] - ny * h]);
  }

  const capStart = taper === "both" || taper === "start";
  const capEnd = taper === "both" || taper === "end";

  return [
    ...(capStart ? [centre[0]] : []),
    ...left,
    ...(capEnd ? [centre[n - 1]] : []),
    ...right.reverse(),
  ];
}

/**
 * Parallel fibre striations across a shape, at `angleDeg` measured clockwise
 * from the +x axis (SVG's y grows downward, so 90 points straight down).
 * Lines are generated across the whole bounding circle and clipped to the
 * muscle at render time.
 */
export function parallelStriations(
  shape: Pt[],
  angleDeg: number,
  count: number,
): string[] {
  const b = bbox(shape);
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  const radius = Math.hypot(b.w, b.h) / 2 + 2;

  const a = (angleDeg * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;

  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = -radius + (2 * radius * (i + 0.5)) / count;
    const px = cx + nx * t;
    const py = cy + ny * t;
    out.push(
      `M ${r(px - ux * radius)} ${r(py - uy * radius)} L ${r(px + ux * radius)} ${r(py + uy * radius)}`,
    );
  }
  return out;
}

/**
 * Fibres radiating from a focal point — how trapezius, gluteus maximus,
 * pectoralis major and deltoid actually converge on their insertions.
 * The fan is fitted to the angular span the shape occupies as seen from
 * the focus, so it never sprays lines into empty space.
 */
export function fanStriations(
  shape: Pt[],
  focus: Pt,
  count: number,
): string[] {
  const angles = shape.map((p) =>
    Math.atan2(p[1] - focus[1], p[0] - focus[0]),
  );
  const maxDist =
    Math.max(...shape.map((p) => Math.hypot(p[0] - focus[0], p[1] - focus[1]))) *
    1.08;

  // Find the widest angular gap; the fan spans everything except that gap.
  const sorted = [...angles].sort((x, y) => x - y);
  let gapStart = sorted[sorted.length - 1];
  let gapSize = sorted[0] + 2 * Math.PI - sorted[sorted.length - 1];
  for (let i = 1; i < sorted.length; i++) {
    const g = sorted[i] - sorted[i - 1];
    if (g > gapSize) {
      gapSize = g;
      gapStart = sorted[i - 1];
    }
  }

  const from = gapStart + gapSize;
  const span = 2 * Math.PI - gapSize;

  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const ang = from + (span * (i + 0.5)) / count;
    out.push(
      `M ${fmt(focus)} L ${r(focus[0] + Math.cos(ang) * maxDist)} ${r(focus[1] + Math.sin(ang) * maxDist)}`,
    );
  }
  return out;
}

/**
 * Striations that follow a curved centreline — for muscles whose fibres bend,
 * such as the obliques wrapping the trunk. Each striation is a short segment
 * perpendicular to the given spine, extended well past the shape and clipped.
 */
export function ribbedStriations(
  centre: Pt[],
  count: number,
  reach: number,
): string[] {
  const out: string[] = [];
  const n = centre.length;
  for (let i = 0; i < count; i++) {
    const t = ((i + 0.5) / count) * (n - 1);
    const i0 = Math.floor(t);
    const i1 = Math.min(n - 1, i0 + 1);
    const f = t - i0;
    const p = lerp(centre[i0], centre[i1], f);
    const prev = centre[Math.max(0, i0 - 1)];
    const next = centre[Math.min(n - 1, i1 + 1)];
    let tx = next[0] - prev[0];
    let ty = next[1] - prev[1];
    const len = Math.hypot(tx, ty) || 1;
    tx /= len;
    ty /= len;
    out.push(
      `M ${r(p[0] + ty * reach)} ${r(p[1] - tx * reach)} L ${r(p[0] - ty * reach)} ${r(p[1] + tx * reach)}`,
    );
  }
  return out;
}

/** Point-in-polygon, used by the dev hitbox inspector and referral lookups. */
export function contains(shape: Pt[], pt: Pt): boolean {
  let inside = false;
  for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
    const [xi, yi] = shape[i];
    const [xj, yj] = shape[j];
    const hit =
      yi > pt[1] !== yj > pt[1] &&
      pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (hit) inside = !inside;
  }
  return inside;
}
