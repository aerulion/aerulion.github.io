import {type Box, type Capsule, distToSegment2, type Hull, pointInPolygon} from './geometry';

const CELL_PX = 8;
const INV_CELL = 1 / CELL_PX;

export const BAND = 34;

export interface Obstacles {
    boxes: Box[];
    capsules: Capsule[];
    hulls: Hull[];
}

export const emptyObstacles = (): Obstacles => ({boxes: [], capsules: [], hulls: []});

export class DistanceField {
    private readonly n: number;
    private readonly half: number;
    private readonly d: Float32Array;
    private ox = 0;
    private oy = 0;
    empty = true;

    value = 0;
    gx = 0;
    gy = 0;

    constructor(halfSpan: number) {
        this.half = halfSpan;
        this.n = Math.ceil((halfSpan * 2) * INV_CELL) + 3;
        this.d = new Float32Array(this.n * this.n);
    }

    begin(centreX: number, centreY: number) {
        this.ox = Math.round((centreX - this.half) * INV_CELL) * CELL_PX;
        this.oy = Math.round((centreY - this.half) * INV_CELL) * CELL_PX;
        this.empty = true;
    }

    add(obstacles: Obstacles, offsetX: number, offsetY: number) {
        for (const b of obstacles.boxes) {
            if (this.reaches(b[0], b[1], b[2], b[3], b[4], offsetX, offsetY)) this.stampBox(b, offsetX, offsetY);
        }
        for (const c of obstacles.capsules) {
            const x0 = Math.min(c[0], c[2]), x1 = Math.max(c[0], c[2]);
            const y0 = Math.min(c[1], c[3]), y1 = Math.max(c[1], c[3]);
            if (this.reaches(x0, y0, x1, y1, c[4], offsetX, offsetY)) this.stampCapsule(c, offsetX, offsetY);
        }
        for (const h of obstacles.hulls) {
            const [x0, y0, x1, y1] = h.bbox;
            if (this.reaches(x0, y0, x1, y1, h.pad, offsetX, offsetY)) this.stampHull(h, offsetX, offsetY);
        }
    }

    private reaches(x0: number, y0: number, x1: number, y1: number, pad: number, dx: number, dy: number) {
        const reach = pad + BAND;
        const span = (this.n - 1) * CELL_PX;
        if (x1 + dx + reach < this.ox || x0 + dx - reach > this.ox + span) return false;
        if (y1 + dy + reach < this.oy || y0 + dy - reach > this.oy + span) return false;

        if (this.empty) {
            this.empty = false;
            this.d.fill(BAND);
        }
        return true;
    }

    private stampBox([x0, y0, x1, y1, pad]: Box, dx: number, dy: number) {
        const cx = (x0 + x1) * 0.5 + dx, cy = (y0 + y1) * 0.5 + dy;
        const hx = (x1 - x0) * 0.5, hy = (y1 - y0) * 0.5;
        const reach = pad + BAND;

        const c0 = this.cellOf(cx - hx - reach, 1), c1 = this.cellOf(cx + hx + reach, -1);
        const r0 = this.cellOf(cy - hy - reach, 1, true), r1 = this.cellOf(cy + hy + reach, -1, true);
        if (c0 > c1 || r0 > r1) return;

        const {n, d, ox, oy} = this;
        for (let r = r0; r <= r1; r++) {
            const qy = Math.abs(oy + r * CELL_PX - cy) - hy;
            const ay = qy > 0 ? qy : 0;
            const row = r * n;
            for (let c = c0; c <= c1; c++) {
                const qx = Math.abs(ox + c * CELL_PX - cx) - hx;
                const ax = qx > 0 ? qx : 0;
                const inner = qx > qy ? qx : qy;
                let v = Math.sqrt(ax * ax + ay * ay) + (inner < 0 ? inner : 0) - pad;
                if (v < -BAND) v = -BAND;
                const i = row + c;
                if (v < d[i]) d[i] = v;
            }
        }
    }

    private stampCapsule([x0, y0, x1, y1, pad]: Capsule, dx: number, dy: number) {
        const ax = x0 + dx, ay = y0 + dy, bx = x1 + dx, by = y1 + dy;
        const reach = pad + BAND;

        const c0 = this.cellOf(Math.min(ax, bx) - reach, 1), c1 = this.cellOf(Math.max(ax, bx) + reach, -1);
        const r0 = this.cellOf(Math.min(ay, by) - reach, 1, true), r1 = this.cellOf(Math.max(ay, by) + reach, -1, true);
        if (c0 > c1 || r0 > r1) return;

        const {n, d, ox, oy} = this;
        for (let r = r0; r <= r1; r++) {
            const py = oy + r * CELL_PX;
            const row = r * n;
            for (let c = c0; c <= c1; c++) {
                let v = Math.sqrt(distToSegment2(ox + c * CELL_PX, py, ax, ay, bx, by)) - pad;
                if (v < -BAND) v = -BAND;
                const i = row + c;
                if (v < d[i]) d[i] = v;
            }
        }
    }

    private stampHull(hull: Hull, dx: number, dy: number) {
        const pts = hull.points;
        const reach = hull.pad + BAND;
        const [bx0, by0, bx1, by1] = hull.bbox;

        const c0 = this.cellOf(bx0 + dx - reach, 1), c1 = this.cellOf(bx1 + dx + reach, -1);
        const r0 = this.cellOf(by0 + dy - reach, 1, true), r1 = this.cellOf(by1 + dy + reach, -1, true);
        if (c0 > c1 || r0 > r1) return;

        const {n, d, ox, oy} = this;
        for (let r = r0; r <= r1; r++) {
            const py = oy + r * CELL_PX - dy;
            const row = r * n;
            for (let c = c0; c <= c1; c++) {
                const px = ox + c * CELL_PX - dx;

                let best = Infinity;
                for (let k = 0; k < pts.length; k++) {
                    const a = pts[k], b = pts[(k + 1) % pts.length];
                    const d2 = distToSegment2(px, py, a[0], a[1], b[0], b[1]);
                    if (d2 < best) best = d2;
                }
                const dist = Math.sqrt(best);
                let v = (pointInPolygon(px, py, pts) ? -dist : dist) - hull.pad;
                if (v < -BAND) v = -BAND;

                const i = row + c;
                if (v < d[i]) d[i] = v;
            }
        }
    }

    private cellOf(world: number, round: 1 | -1, vertical = false) {
        const origin = vertical ? this.oy : this.ox;
        const raw = (world - origin) * INV_CELL;
        const idx = round === 1 ? Math.ceil(raw) : Math.floor(raw);
        return idx < 0 ? 0 : idx > this.n - 1 ? this.n - 1 : idx;
    }

    probe(x: number, y: number) {
        const {n, d} = this;
        const edge = n - 1.0001;

        let u = (x - this.ox) * INV_CELL;
        let v = (y - this.oy) * INV_CELL;
        u = u < 0 ? 0 : u > edge ? edge : u;
        v = v < 0 ? 0 : v > edge ? edge : v;

        const c = u | 0, r = v | 0;
        const fu = u - c, fv = v - r;
        const i = r * n + c;

        const a = d[i], b = d[i + 1], e = d[i + n], f = d[i + n + 1];
        const top = a + (b - a) * fu;
        const bottom = e + (f - e) * fu;

        this.value = top + (bottom - top) * fv;
        this.gx = ((b - a) * (1 - fv) + (f - e) * fv) * INV_CELL;
        this.gy = ((e - a) * (1 - fu) + (f - b) * fu) * INV_CELL;
    }

    distance(x: number, y: number): number {
        const {n, d} = this;
        const edge = n - 1.0001;

        let u = (x - this.ox) * INV_CELL;
        let v = (y - this.oy) * INV_CELL;
        u = u < 0 ? 0 : u > edge ? edge : u;
        v = v < 0 ? 0 : v > edge ? edge : v;

        const c = u | 0, r = v | 0;
        const fu = u - c, fv = v - r;
        const i = r * n + c;

        const a = d[i], b = d[i + 1], e = d[i + n], f = d[i + n + 1];
        const top = a + (b - a) * fu;
        const bottom = e + (f - e) * fu;
        return top + (bottom - top) * fv;
    }
}
