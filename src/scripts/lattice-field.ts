import {hash} from './geometry';
import {BAND, DistanceField} from './distance-field';
import {ObstacleIndex, REMEASURE_STEP} from './lattice-obstacles';
import {markReach} from './mark-hull';

const CELL = 40;
const ROW = CELL * Math.sin(Math.PI / 3);
const RADIUS = 420;
const PULL = 26;
const EASE = 0.12;
const OFF_POINTER = -9999;
const MAX_DPR = 2;
const RESURVEY_DELAY = 2200;
const SCAN_GAP = 400;
const MEASURE_GAP = 120;

const BURST_MS = 1150;
const RING_WIDTH = 0.42;
const RING_PUSH = 1.25;
const TAP_SLOP = 12;

const MAX_PUSH = 26;
const CLEAR = 2;
const FADE = 30;

const VERTEX_REACH = RADIUS + CELL;
const FIELD_SLACK = 16;
const FIELD_HALF = RADIUS + PULL + MAX_PUSH + FIELD_SLACK;

const TRACE_STEP = 4;
const TRACE_LIMIT = 24;

export function mountLatticeField(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const obstacles = new ObstacleIndex();
    const field = new DistanceField(FIELD_HALF);

    let width = 0,
        height = 0;
    let pointerX = OFF_POINTER,
        pointerY = OFF_POINTER;
    let targetX = OFF_POINTER,
        targetY = OFF_POINTER;
    let strength = 0,
        targetStrength = 0;
    let frame = 0;

    let needScan = true,
        needMeasure = true,
        fieldStale = true;
    let front = 0,
        burstAt = 0,
        tapX = 0,
        tapY = 0;
    let fieldX = NaN,
        fieldY = NaN,
        fieldScrollX = NaN,
        fieldScrollY = NaN;
    let scannedAt = -Infinity,
        measuredAt = -Infinity;

    const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const syncField = (now: number, scrollX: number, scrollY: number): boolean => {
        if (needScan && now - scannedAt >= SCAN_GAP) {
            needScan = false;
            needMeasure = true;
            scannedAt = now;
            obstacles.scan();
        }
        const drifted =
            Math.abs(scrollX - obstacles.scrollX) > REMEASURE_STEP ||
            Math.abs(scrollY - obstacles.scrollY) > REMEASURE_STEP;
        if ((needMeasure || drifted) && now - measuredAt >= MEASURE_GAP) {
            needMeasure = false;
            measuredAt = now;
            fieldStale = true;
            obstacles.measure();
        }

        if (
            !fieldStale &&
            scrollX === fieldScrollX &&
            scrollY === fieldScrollY &&
            Math.abs(pointerX - fieldX) <= FIELD_SLACK &&
            Math.abs(pointerY - fieldY) <= FIELD_SLACK
        )
            return false;

        field.begin(pointerX, pointerY);
        field.add(obstacles.flow, -scrollX, -scrollY);
        field.add(obstacles.pinned, 0, 0);

        fieldStale = false;
        fieldX = pointerX;
        fieldY = pointerY;
        fieldScrollX = scrollX;
        fieldScrollY = scrollY;
        return true;
    };

    let escapedX = 0,
        escapedY = 0;

    const escape = (x: number, y: number): boolean => {
        if (field.empty) {
            escapedX = x;
            escapedY = y;
            return true;
        }

        field.probe(x, y);
        if (field.value >= CLEAR) {
            escapedX = x;
            escapedY = y;
            return true;
        }

        let budget = MAX_PUSH;
        for (let step = 0; step < 3; step++) {
            const need = CLEAR - field.value;
            if (need <= 0.05) break;
            if (need > budget) return false;

            const g = Math.sqrt(field.gx * field.gx + field.gy * field.gy);
            if (g < 1e-4) return false;

            x += (field.gx / g) * need;
            y += (field.gy / g) * need;
            budget -= need;
            field.probe(x, y);
        }

        if (field.value < 0) return false;
        escapedX = x;
        escapedY = y;
        return true;
    };

    const traceClear = (x1: number, y1: number, x2: number, y2: number): number => {
        if (field.empty) return BAND;

        const dx = x2 - x1,
            dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1e-4) return field.distance(x1, y1);

        const ix = dx / len,
            iy = dy / len;
        let t = 0,
            min = Infinity;

        for (let i = 0; i < TRACE_LIMIT; i++) {
            const d = field.distance(x1 + ix * t, y1 + iy * t);
            if (d < 0) return -1;
            if (d < min) min = d;
            if (t >= len) return min;
            t += d > TRACE_STEP ? d : TRACE_STEP;
            if (t > len) t = len;
        }
        return -1;
    };

    const wellAt = (u: number) => 6.75 * u * (1 - u) * (1 - u);

    const discAt = (u: number) => {
        if (u > 1) return 0;
        const t = 1 - u;
        return t * t * (3 - 2 * t);
    };

    const ringAt = (u: number) => {
        const d = Math.abs(u - front) / RING_WIDTH;
        if (d >= 1) return 0;
        const t = 1 - d;
        return t * t * (3 - 2 * t);
    };

    const fadeAt = (clearance: number) => {
        if (clearance >= FADE) return 1;
        const t = clearance / FADE;
        return 0.28 + 0.72 * t * t;
    };

    let vx = new Float32Array(0),
        vy = new Float32Array(0);
    let alive = new Uint8Array(0),
        influence = new Float32Array(0);
    let segments = new Float32Array(0);
    let segmentCount = 0;

    const buildPath = () => {
        const rowStart = Math.floor((pointerY - VERTEX_REACH) / ROW);
        const rowEnd = Math.ceil((pointerY + VERTEX_REACH) / ROW) + 1;
        const colStart = Math.floor((pointerX - VERTEX_REACH) / CELL) - 1;
        const colEnd = Math.ceil((pointerX + VERTEX_REACH) / CELL) + 1;

        const cols = colEnd - colStart + 1;
        const total = cols * (rowEnd - rowStart + 1);

        if (vx.length < total) {
            vx = new Float32Array(total);
            vy = new Float32Array(total);
            alive = new Uint8Array(total);
            influence = new Float32Array(total);
            segments = new Float32Array(total * 12);
        }

        const half = CELL / 2;

        for (let r = rowStart; r <= rowEnd; r++) {
            const baseY = r * ROW;
            const offset = r & 1 ? half : 0;
            const rowIdx = (r - rowStart) * cols;

            for (let c = colStart; c <= colEnd; c++) {
                const i = rowIdx + (c - colStart);
                const baseX = c * CELL + offset;

                const dx = pointerX - baseX,
                    dy = pointerY - baseY;
                const dist2 = dx * dx + dy * dy;

                if (dist2 > RADIUS * RADIUS) {
                    influence[i] = 0;
                    alive[i] = 0;
                    continue;
                }

                const dist = Math.sqrt(dist2);
                const u = dist / (RADIUS * markReach(Math.atan2(-dy, -dx)));

                const profile = burstAt ? ringAt(u) : discAt(u);
                const inf = profile * strength;
                influence[i] = inf;

                if (inf <= 0.02) {
                    alive[i] = 0;
                    continue;
                }

                let x = baseX,
                    y = baseY;
                if (dist > 0.001) {
                    const amount = burstAt ? -profile * PULL * RING_PUSH * strength : wellAt(u) * PULL * strength;
                    x += (dx / dist) * amount;
                    y += (dy / dist) * amount;
                }

                alive[i] = escape(x, y) ? 1 : 0;
                vx[i] = escapedX;
                vy[i] = escapedY;
            }
        }

        segmentCount = 0;

        const link = (i: number, j: number, gx: number, gy: number, salt: number) => {
            if (!alive[i] || !alive[j]) return;

            const mid = (influence[i] + influence[j]) * 0.5;
            if (mid <= 0.03) return;

            const cap = mid * 1.7 > 1 ? 1 : mid * 1.7;
            const roll = hash(gx + salt * 17.3, gy - salt * 8.9);
            if (cap < roll) return;

            const clearance = traceClear(vx[i], vy[i], vx[j], vy[j]);
            if (clearance < 0) return;
            if (clearance < FADE && cap * fadeAt(clearance) < roll) return;

            segments[segmentCount++] = vx[i];
            segments[segmentCount++] = vy[i];
            segments[segmentCount++] = vx[j];
            segments[segmentCount++] = vy[j];
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
    };

    let drawnX = NaN,
        drawnY = NaN,
        drawnStrength = NaN,
        drawnFront = NaN;

    const tick = (now: number) => {
        if (burstAt) {
            const p = (now - burstAt) / BURST_MS;
            if (p >= 1) {
                burstAt = 0;
                front = 0;
                strength = 0;
                targetStrength = 0;
            } else {
                front = p * (1 + RING_WIDTH);
                const t = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;
                strength = t * t * (3 - 2 * t);
            }
        } else {
            pointerX += (targetX - pointerX) * EASE;
            pointerY += (targetY - pointerY) * EASE;
            strength += (targetStrength - strength) * EASE;
        }

        ctx.clearRect(0, 0, width, height);

        if (strength > 0.004) {
            const rebuilt = syncField(now, window.scrollX, window.scrollY);

            if (
                rebuilt ||
                Math.abs(pointerX - drawnX) > 0.25 ||
                Math.abs(pointerY - drawnY) > 0.25 ||
                Math.abs(strength - drawnStrength) > 0.002 ||
                Math.abs(front - drawnFront) > 0.002
            ) {
                buildPath();
                drawnX = pointerX;
                drawnY = pointerY;
                drawnStrength = strength;
                drawnFront = front;
            }

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < segmentCount; i += 4) {
                ctx.moveTo(segments[i], segments[i + 1]);
                ctx.lineTo(segments[i + 2], segments[i + 3]);
            }
            ctx.stroke();
            frame = requestAnimationFrame(tick);
            return;
        }

        if (targetStrength > 0 || burstAt) {
            frame = requestAnimationFrame(tick);
            return;
        }
        frame = 0;
    };

    const start = () => {
        if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
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
        start();
    };

    const onTap = (e: PointerEvent) => {
        tapX = e.clientX;
        tapY = e.clientY;
        pointerX = targetX = e.clientX;
        pointerY = targetY = e.clientY;
        strength = 0;
        targetStrength = 0;
        front = 0;
        burstAt = performance.now();
        fieldStale = true;
        start();
    };

    const onTapMove = (e: PointerEvent) => {
        if (!burstAt) return;
        if (Math.abs(e.clientX - tapX) + Math.abs(e.clientY - tapY) < TAP_SLOP) return;
        burstAt = 0;
        front = 0;
        targetStrength = 0;
    };

    const retreat = () => {
        targetStrength = 0;
    };

    const markDirty = () => {
        needScan = true;
        drawnStrength = NaN;
    };

    const markMoved = () => {
        needMeasure = true;
        drawnStrength = NaN;
    };

    window.addEventListener(
        'pointermove',
        (e) => {
            if (e.pointerType === 'touch') onTapMove(e);
            else onPointer(e);
        },
        {passive: true}
    );

    window.addEventListener(
        'pointerdown',
        (e) => {
            if (e.pointerType === 'touch') onTap(e);
            else onPointer(e);
        },
        {passive: true}
    );

    document.addEventListener('pointerleave', retreat);
    window.addEventListener('blur', retreat);

    window.addEventListener(
        'resize',
        () => {
            resize();
            markDirty();
        },
        {passive: true}
    );

    for (const type of ['transitionstart', 'transitionend', 'transitioncancel']) {
        document.addEventListener(
            type,
            (e) => {
                const name = (e as TransitionEvent).propertyName;
                if (name === 'opacity') markDirty();
                else if (name === 'transform') markMoved();
            },
            {capture: true, passive: true}
        );
    }

    new ResizeObserver(markMoved).observe(document.body);
    new MutationObserver(markDirty).observe(document.body, {childList: true, subtree: true});

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
        } else {
            markDirty();
            start();
        }
    });

    document.fonts?.ready.then(markDirty);
    window.setTimeout(markDirty, RESURVEY_DELAY);

    resize();
}
