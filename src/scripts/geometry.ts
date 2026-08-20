export type Point = [x: number, y: number];
export type Rect = [x0: number, y0: number, x1: number, y1: number];
export type Segment = [x0: number, y0: number, x1: number, y1: number];

export interface Polygon {
    bbox: Rect;
    points: Point[];
}

export const hash = (a: number, b: number): number => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
};

export const centroid = (points: Point[]): Point => {
    let x = 0, y = 0;
    for (const p of points) {
        x += p[0];
        y += p[1];
    }
    return [x / points.length, y / points.length];
};

export const boundsOf = (points: Point[]): Rect => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of points) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
    }
    return [x0, y0, x1, y1];
};

export const pointInRect = (x: number, y: number, r: Rect): boolean =>
    x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];

export const rectsOverlap = (a: Rect, b: Rect): boolean =>
    a[2] >= b[0] && a[0] <= b[2] && a[3] >= b[1] && a[1] <= b[3];

export const pointInPolygon = (x: number, y: number, poly: Polygon): boolean => {
    if (!pointInRect(x, y, poly.bbox)) return false;

    const pts = poly.points;
    let sign = 0;
    for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        const cross = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
        if (cross === 0) continue;
        const s = cross > 0 ? 1 : -1;
        if (sign === 0) sign = s;
        else if (s !== sign) return false;
    }
    return true;
};

export const closestPointOnSegment = (x: number, y: number, s: Segment): [number, number, number] => {
    const dx = s[2] - s[0], dy = s[3] - s[1];
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((x - s[0]) * dx + (y - s[1]) * dy) / len2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const cx = s[0] + t * dx, cy = s[1] + t * dy;
    return [cx, cy, Math.hypot(x - cx, y - cy)];
};

export const segmentHitsRect = (x1: number, y1: number, x2: number, y2: number, r: Rect): boolean => {
    if (Math.max(x1, x2) < r[0] || Math.min(x1, x2) > r[2]) return false;
    if (Math.max(y1, y2) < r[1] || Math.min(y1, y2) > r[3]) return false;

    const dx = x2 - x1, dy = y2 - y1;
    const edge = [-dx, dx, -dy, dy];
    const slack = [x1 - r[0], r[2] - x1, y1 - r[1], r[3] - y1];
    let t0 = 0, t1 = 1;

    for (let i = 0; i < 4; i++) {
        if (edge[i] === 0) {
            if (slack[i] < 0) return false;
            continue;
        }
        const t = slack[i] / edge[i];
        if (edge[i] < 0) {
            if (t > t1) return false;
            if (t > t0) t0 = t;
        } else {
            if (t < t0) return false;
            if (t < t1) t1 = t;
        }
    }
    return true;
};

export const segmentsIntersect = (
    ax: number, ay: number, bx: number, by: number,
    cx: number, cy: number, dx: number, dy: number
): boolean => {
    const d1 = (dx - cx) * (ay - cy) - (dy - cy) * (ax - cx);
    const d2 = (dx - cx) * (by - cy) - (dy - cy) * (bx - cx);
    const d3 = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    const d4 = (bx - ax) * (dy - ay) - (by - ay) * (dx - ax);
    return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0));
};
