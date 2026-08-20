import {
    centroid,
    closestPointOnSegment,
    hash,
    pointInPolygon,
    pointInRect,
    type Polygon,
    type Rect,
    rectsOverlap,
    type Segment,
    segmentHitsRect,
    segmentsIntersect
} from './geometry';
import {LINE_PAD, ObstacleIndex} from './lattice-obstacles';
import {logoReach} from './logo-shape';

const CELL = 40;
const ROW = CELL * Math.sin(Math.PI / 3);
const RADIUS = 420;
const PULL = 26;
const EASE = 0.12;
const MARGIN = 2;
const MAX_PUSH = 26;
const OFF_POINTER = -9999;
const MAX_DPR = 2;
const RESURVEY_DELAY = 2200;

export function mountLatticeField(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const obstacles = new ObstacleIndex();

    let width = 0, height = 0;
    let pointerX = OFF_POINTER, pointerY = OFF_POINTER;
    let targetX = OFF_POINTER, targetY = OFF_POINTER;
    let strength = 0, targetStrength = 0;
    let frame = 0;

    let allRects: Rect[] = [], allPolys: Polygon[] = [], allLines: Segment[] = [];
    let rects: Rect[] = [], polys: Polygon[] = [], lines: Segment[] = [];
    let stale = true;
    let lastScrollY = -1;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const collect = () => {
        stale = false;
        ({rects: allRects, polygons: allPolys, lines: allLines} = obstacles.collect(height, width));
    };

    const filterActive = () => {
        const reach: Rect = [pointerX - RADIUS, pointerY - RADIUS, pointerX + RADIUS, pointerY + RADIUS];

        rects = allRects.filter((r) => rectsOverlap(r, reach));
        polys = allPolys.filter((p) => rectsOverlap(p.bbox, reach));
        lines = allLines.filter((s) => rectsOverlap(
            [Math.min(s[0], s[2]), Math.min(s[1], s[3]), Math.max(s[0], s[2]), Math.max(s[1], s[3])],
            reach
        ));
    };

    const rectAt = (x: number, y: number) => {
        for (let i = 0; i < rects.length; i++) if (pointInRect(x, y, rects[i])) return i;
        return -1;
    };
    const polyAt = (x: number, y: number) => {
        for (let i = 0; i < polys.length; i++) if (pointInPolygon(x, y, polys[i])) return i;
        return -1;
    };
    const lineAt = (x: number, y: number) => {
        for (let i = 0; i < lines.length; i++) {
            if (closestPointOnSegment(x, y, lines[i])[2] < LINE_PAD) return i;
        }
        return -1;
    };

    const obstructed = (x: number, y: number) => rectAt(x, y) >= 0 || polyAt(x, y) >= 0 || lineAt(x, y) >= 0;

    const escapePolygon = (x: number, y: number, poly: Polygon): [number, number, number] => {
        const pts = poly.points;
        const [gx, gy] = centroid(pts);

        let bestNeed = Infinity, bx = x, by = y;
        for (let i = 0; i < pts.length; i++) {
            const a = pts[i], b = pts[(i + 1) % pts.length];
            let nx = b[1] - a[1], ny = -(b[0] - a[0]);
            if ((gx - a[0]) * nx + (gy - a[1]) * ny > 0) {
                nx = -nx;
                ny = -ny;
            }
            const len = Math.hypot(nx, ny) || 1;
            nx /= len;
            ny /= len;

            const need = -((x - a[0]) * nx + (y - a[1]) * ny) + MARGIN;
            if (need < bestNeed) {
                bestNeed = need;
                bx = x + nx * need;
                by = y + ny * need;
            }
        }
        return [bx, by, bestNeed];
    };

    const escapeLine = (x: number, y: number, s: Segment): [number, number, number] => {
        const [cx, cy, d] = closestPointOnSegment(x, y, s);
        let nx = x - cx, ny = y - cy;

        if (d < 0.001) {
            const dx = s[2] - s[0], dy = s[3] - s[1];
            const len = Math.hypot(dx, dy) || 1;
            nx = -dy / len;
            ny = dx / len;
        } else {
            nx /= d;
            ny /= d;
        }
        return [cx + nx * LINE_PAD, cy + ny * LINE_PAD, LINE_PAD - d];
    };

    const exitX = new Float64Array(4), exitY = new Float64Array(4), exitDepth = new Float64Array(4);
    let escapedX = 0, escapedY = 0;

    const escape = (startX: number, startY: number): boolean => {
        let x = startX, y = startY;

        for (let step = 0; step < 4; step++) {
            const poly = polyAt(x, y);
            if (poly >= 0) {
                const [nx, ny, need] = escapePolygon(x, y, polys[poly]);
                if (need > MAX_PUSH) return false;
                x = nx;
                y = ny;
                continue;
            }

            const line = lineAt(x, y);
            if (line >= 0) {
                const [nx, ny, need] = escapeLine(x, y, lines[line]);
                if (need > MAX_PUSH) return false;
                x = nx;
                y = ny;
                continue;
            }

            const rect = rectAt(x, y);
            if (rect < 0) {
                escapedX = x;
                escapedY = y;
                return true;
            }

            const r = rects[rect];
            exitX[0] = r[0] - MARGIN;
            exitY[0] = y;
            exitDepth[0] = x - r[0];
            exitX[1] = r[2] + MARGIN;
            exitY[1] = y;
            exitDepth[1] = r[2] - x;
            exitX[2] = x;
            exitY[2] = r[1] - MARGIN;
            exitDepth[2] = y - r[1];
            exitX[3] = x;
            exitY[3] = r[3] + MARGIN;
            exitDepth[3] = r[3] - y;

            let best = -1, bestDepth = Infinity, nearest = 0, nearestDepth = Infinity;
            for (let i = 0; i < 4; i++) {
                if (exitDepth[i] < nearestDepth) {
                    nearestDepth = exitDepth[i];
                    nearest = i;
                }
                if (exitDepth[i] <= MAX_PUSH && exitDepth[i] < bestDepth && !obstructed(exitX[i], exitY[i])) {
                    bestDepth = exitDepth[i];
                    best = i;
                }
            }

            if (best >= 0) {
                escapedX = exitX[best];
                escapedY = exitY[best];
                return true;
            }
            if (nearestDepth > MAX_PUSH) return false;
            x = exitX[nearest];
            y = exitY[nearest];
        }

        escapedX = x;
        escapedY = y;
        return !obstructed(x, y);
    };

    const blocked = (x1: number, y1: number, x2: number, y2: number): boolean => {
        for (const r of rects) {
            if (segmentHitsRect(x1, y1, x2, y2, r)) return true;
        }
        for (const s of lines) {
            if (Math.max(x1, x2) < Math.min(s[0], s[2]) - LINE_PAD) continue;
            if (Math.min(x1, x2) > Math.max(s[0], s[2]) + LINE_PAD) continue;
            if (Math.max(y1, y2) < Math.min(s[1], s[3]) - LINE_PAD) continue;
            if (Math.min(y1, y2) > Math.max(s[1], s[3]) + LINE_PAD) continue;
            if (segmentsIntersect(x1, y1, x2, y2, s[0], s[1], s[2], s[3])) return true;
        }
        for (const p of polys) {
            const b = p.bbox;
            if (Math.max(x1, x2) < b[0] || Math.min(x1, x2) > b[2]) continue;
            if (Math.max(y1, y2) < b[1] || Math.min(y1, y2) > b[3]) continue;
            if (pointInPolygon(x1, y1, p) || pointInPolygon(x2, y2, p)) return true;

            const pts = p.points;
            for (let i = 0; i < pts.length; i++) {
                const a = pts[i], c = pts[(i + 1) % pts.length];
                if (segmentsIntersect(x1, y1, x2, y2, a[0], a[1], c[0], c[1])) return true;
            }
        }
        return false;
    };

    const wellAt = (u: number) => 6.75 * u * (1 - u) * (1 - u);

    const influenceAt = (u: number) => {
        if (u > 1) return 0;
        const t = 1 - u;
        return t * t * (3 - 2 * t) * strength;
    };

    let vx = new Float32Array(0), vy = new Float32Array(0);
    let alive = new Uint8Array(0), influence = new Float32Array(0);

    const drawLattice = () => {
        const scrollY = window.scrollY;
        if (scrollY !== lastScrollY) {
            lastScrollY = scrollY;
            stale = true;
        }
        if (stale) collect();
        filterActive();

        const pad = RADIUS + CELL;
        const rowStart = Math.floor((pointerY - pad) / ROW);
        const rowEnd = Math.ceil((pointerY + pad) / ROW) + 1;
        const colStart = Math.floor((pointerX - pad) / CELL) - 1;
        const colEnd = Math.ceil((pointerX + pad) / CELL) + 1;

        const cols = colEnd - colStart + 1;
        const total = cols * (rowEnd - rowStart + 1);

        if (vx.length < total) {
            vx = new Float32Array(total);
            vy = new Float32Array(total);
            alive = new Uint8Array(total);
            influence = new Float32Array(total);
        }

        const half = CELL / 2;

        for (let r = rowStart; r <= rowEnd; r++) {
            const baseY = r * ROW;
            const offset = (r & 1) ? half : 0;
            const rowIdx = (r - rowStart) * cols;

            for (let c = colStart; c <= colEnd; c++) {
                const i = rowIdx + (c - colStart);
                const baseX = c * CELL + offset;

                const dx = pointerX - baseX, dy = pointerY - baseY;
                const dist = Math.hypot(dx, dy);
                const u = dist / (RADIUS * logoReach(Math.atan2(-dy, -dx)));

                const inf = influenceAt(u);
                influence[i] = inf;

                if (inf <= 0.02) {
                    alive[i] = 0;
                    continue;
                }

                let x = baseX, y = baseY;
                if (dist > 0.001 && u <= 1) {
                    const amount = wellAt(u) * PULL * strength;
                    x += (dx / dist) * amount;
                    y += (dy / dist) * amount;
                }

                alive[i] = escape(x, y) ? 1 : 0;
                vx[i] = escapedX;
                vy[i] = escapedY;
            }
        }

        ctx.beginPath();

        const link = (i: number, j: number, gx: number, gy: number, salt: number) => {
            if (!alive[i] || !alive[j]) return;

            const mid = (influence[i] + influence[j]) * 0.5;
            if (mid <= 0.03) return;
            if (Math.min(1, mid * 1.7) < hash(gx + salt * 17.3, gy - salt * 8.9)) return;
            if (blocked(vx[i], vy[i], vx[j], vy[j])) return;

            ctx.moveTo(vx[i], vy[i]);
            ctx.lineTo(vx[j], vy[j]);
        };

        for (let r = rowStart; r < rowEnd; r++) {
            const rowIdx = (r - rowStart) * cols;
            const nextIdx = (r + 1 - rowStart) * cols;
            const even = (r & 1) === 0;

            for (let c = colStart; c < colEnd; c++) {
                const i = rowIdx + (c - colStart);
                if (!alive[i]) continue;

                link(i, rowIdx + (c + 1 - colStart), c, r, 1);

                const belowLeft = even ? c - 1 : c;
                const belowRight = even ? c : c + 1;
                if (belowLeft >= colStart) link(i, nextIdx + (belowLeft - colStart), c, r, 2);
                if (belowRight <= colEnd) link(i, nextIdx + (belowRight - colStart), c, r, 3);
            }
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    const tick = () => {
        ctx.clearRect(0, 0, width, height);
        if (strength > 0.004) drawLattice();

        pointerX += (targetX - pointerX) * EASE;
        pointerY += (targetY - pointerY) * EASE;
        strength += (targetStrength - strength) * EASE;

        frame = requestAnimationFrame(tick);
    };

    let sighted = false;

    const onPointer = (e: PointerEvent) => {
        if (!sighted) {
            sighted = true;
            pointerX = e.clientX;
            pointerY = e.clientY;
        }
        targetX = e.clientX;
        targetY = e.clientY;
        targetStrength = 1;
    };

    const retreat = () => {
        targetStrength = 0;
    };

    const resurvey = () => {
        obstacles.survey();
        stale = true;
    };

    window.addEventListener('pointermove', onPointer, {passive: true});
    window.addEventListener('pointerdown', onPointer, {passive: true});
    document.addEventListener('pointerleave', retreat);
    window.addEventListener('blur', retreat);
    window.addEventListener('scroll', () => {
        stale = true;
    }, {passive: true});
    window.addEventListener('resize', () => {
        resize();
        resurvey();
    }, {passive: true});

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
        } else if (!frame) {
            frame = requestAnimationFrame(tick);
        }
    });

    document.fonts?.ready.then(resurvey);
    window.setTimeout(resurvey, RESURVEY_DELAY);

    resize();
    resurvey();
    frame = requestAnimationFrame(tick);
}
