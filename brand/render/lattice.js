export const hash = (a, b) => {
    const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return n - Math.floor(n);
};

export const smoothstep = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

const discAt = (u) => {
    if (u > 1) return 0;
    const t = 1 - u;
    return t * t * (3 - 2 * t);
};

const wellAt = (u) => 6.75 * u * (1 - u) * (1 - u);

const gapOf = (o, x, y) => {
    if (o.r !== undefined) return Math.hypot(x - o.cx, y - o.cy) - o.r;
    const dx = Math.max(o.x - x, 0, x - (o.x + o.w));
    const dy = Math.max(o.y - y, 0, y - (o.y + o.h));
    return Math.hypot(dx, dy);
};

const openness = (obstacles, x, y) => {
    let least = 1;
    for (const o of obstacles) {
        const v = smoothstep(0, o.band, gapOf(o, x, y));
        if (v < least) least = v;
    }
    return least;
};

export function drawLattice(ctx, opts) {
    const {
        width,
        height,
        cell = 34,
        radius = 170,
        pull = 15,
        dot = 1.3,
        density = 0.5,
        lift = 0.5,
        weave = 1,
        obstacles = [],
        attractor = null,
        falloff = () => 1
    } = opts;

    const row = cell * Math.sin(Math.PI / 3);
    const half = cell / 2;
    const c0 = -2;
    const c1 = Math.ceil(width / cell) + 2;
    const r0 = -2;
    const r1 = Math.ceil(height / row) + 2;
    const cols = c1 - c0 + 1;

    const vx = new Float32Array(cols * (r1 - r0 + 1));
    const vy = new Float32Array(vx.length);
    const inf = new Float32Array(vx.length);
    const live = new Uint8Array(vx.length);

    for (let r = r0; r <= r1; r++) {
        const base = (r - r0) * cols;
        const oy = r * row;
        const ox = r & 1 ? half : 0;
        for (let c = c0; c <= c1; c++) {
            const i = base + (c - c0);
            let x = c * cell + ox;
            let y = oy;

            let influence = 0;
            if (attractor) {
                const dx = attractor[0] - x;
                const dy = attractor[1] - y;
                const dist = Math.hypot(dx, dy);
                const u = dist / radius;
                influence = discAt(u);
                if (influence > 0 && dist > 0.001) {
                    const amount = wellAt(u) * pull;
                    x += (dx / dist) * amount;
                    y += (dy / dist) * amount;
                }
            }

            const local = falloff(x, y) * openness(obstacles, x, y) * (density + influence * lift);
            vx[i] = x;
            vy[i] = y;
            inf[i] = Math.min(1, local);
            live[i] = inf[i] > 0.02 ? 1 : 0;
        }
    }

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;

    const crosses = (i, j) => {
        for (const o of obstacles) {
            const keep = o.clear ?? 0;
            if (keep <= 0) continue;
            for (let s = 0; s <= 1.0001; s += 0.125) {
                const x = vx[i] + (vx[j] - vx[i]) * s;
                const y = vy[i] + (vy[j] - vy[i]) * s;
                if (gapOf(o, x, y) < keep) return true;
            }
        }
        return false;
    };

    ctx.beginPath();
    const link = (i, j, c, r, salt) => {
        if (!live[i] || !live[j]) return;
        const mid = (inf[i] + inf[j]) * 0.5 * weave;
        if (mid < hash(c + salt * 17.3, r - salt * 8.9)) return;
        if (crosses(i, j)) return;
        ctx.moveTo(vx[i], vy[i]);
        ctx.lineTo(vx[j], vy[j]);
    };

    for (let r = r0; r < r1; r++) {
        const base = (r - r0) * cols;
        const next = (r + 1 - r0) * cols;
        const even = (r & 1) === 0;
        for (let c = c0; c < c1; c++) {
            const i = base + (c - c0);
            if (!live[i]) continue;
            link(i, base + (c + 1 - c0), c, r, 1);
            const bl = even ? c - 1 : c;
            const br = even ? c : c + 1;
            if (bl >= c0) link(i, next + (bl - c0), c, r, 2);
            if (br <= c1) link(i, next + (br - c0), c, r, 3);
        }
    }
    ctx.stroke();

    for (let r = r0; r <= r1; r++) {
        const base = (r - r0) * cols;
        for (let c = c0; c <= c1; c++) {
            const i = base + (c - c0);
            if (!live[i]) continue;
            if (hash(c * 1.7 + 4.2, r * 2.3 - 1.1) > inf[i] * 1.6) continue;
            ctx.fillRect(vx[i] - dot / 2, vy[i] - dot / 2, dot, dot);
        }
    }
}

export const fade = (a, b) => (x) => 1 - smoothstep(a, b, x);
