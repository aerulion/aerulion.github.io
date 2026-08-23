export type Point = [x: number, y: number];
export type Rect = [x0: number, y0: number, x1: number, y1: number];
export type Segment = [x0: number, y0: number, x1: number, y1: number];

export type Box = [x0: number, y0: number, x1: number, y1: number, pad: number];

export type Capsule = [x0: number, y0: number, x1: number, y1: number, pad: number];

export interface Hull {
    points: Point[];
    bbox: Rect;
    pad: number;
}

export const hash = (a: number, b: number): number => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
};

export const boundsOf = (points: Point[]): Rect => {
    let x0 = Infinity,
        y0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity;
    for (const [x, y] of points) {
        if (x < x0) x0 = x;
        if (y < y0) y0 = y;
        if (x > x1) x1 = x;
        if (y > y1) y1 = y;
    }
    return [x0, y0, x1, y1];
};

export const distToSegment2 = (x: number, y: number, ax: number, ay: number, bx: number, by: number): number => {
    const dx = bx - ax,
        dy = by - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 ? ((x - ax) * dx + (y - ay) * dy) / len2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ox = x - (ax + t * dx),
        oy = y - (ay + t * dy);
    return ox * ox + oy * oy;
};

export const pointInPolygon = (x: number, y: number, pts: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const a = pts[i],
            b = pts[j];
        if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
};
