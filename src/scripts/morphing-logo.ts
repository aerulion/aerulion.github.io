import type {Point} from './geometry';

export const SILHOUETTE = "m24.686 19.8438-3.1349 1.81-3.3773-5.8496-4.9444 2.8546-1.8102-1.0449 1.81-3.1348 3.1347-1.8098-3.1347-5.4297-6.512 11.2793 6.512 3.7597 3.3773-1.95 1.81 3.135-5.1873 2.9947-11.4568-6.6145L13.2292 0Z";

const LOGO_OUTLINE: Point[] = [
    [24.686, 19.8438], [21.5511, 21.6538], [18.1738, 15.8042], [13.2294, 18.6588],
    [11.4192, 17.6139], [13.2292, 14.4791], [16.3639, 12.6693], [13.2292, 7.2396],
    [6.7172, 18.5189], [13.2292, 22.2786], [16.6065, 20.3286], [18.4165, 23.4636],
    [13.2292, 26.4583], [1.7724, 19.8438], [13.2292, 0]
];

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const ROOT2 = Math.SQRT2;
const ROOT3 = Math.sqrt(3);

const AXIS_ANGLES = [30, 60, 120, 150];

const AXES: Point[] = AXIS_ANGLES.map((a) => [Math.cos(a * DEG), Math.sin(a * DEG)]);

const dot4 = (u: number[], v: number[]): number =>
    u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];

const F1 = AXES.map((g) => g[0] / ROOT2);
const F2 = AXES.map((g) => g[1] / ROOT2);
const F3 = [1, -ROOT3, ROOT3, -1].map((v) => v / (2 * ROOT2));
const F4 = [ROOT3, -1, -1, ROOT3].map((v) => v / (2 * ROOT2));

const classify = (ax: number, ay: number, bx: number, by: number): [number, number] => {
    let axis = 0;
    let span = 0;
    let best = Infinity;
    const dx = bx - ax;
    const dy = by - ay;

    AXES.forEach((g, i) => {
        const t = dx * g[0] + dy * g[1];
        const err = Math.hypot(dx - t * g[0], dy - t * g[1]);
        if (err < best) {
            best = err;
            axis = i;
            span = t;
        }
    });
    return [axis, span];
};

const lift = (): number[][] => {
    const steps: [number, number][] = LOGO_OUTLINE.map((p, i) => {
        const q = LOGO_OUTLINE[(i + 1) % LOGO_OUTLINE.length];
        return classify(p[0], p[1], q[0], q[1]);
    });

    const drift = [0, 0, 0, 0];
    let arc = 0;
    for (const [axis, span] of steps) {
        drift[axis] += span;
        arc += Math.abs(span);
    }

    const out: number[][] = [];
    let cursor = [0, 0, 0, 0];
    for (const [axis, span] of steps) {
        out.push(cursor);
        const share = Math.abs(span) / arc;
        const next = cursor.slice();
        next[axis] += span;
        for (let j = 0; j < 4; j++) next[j] -= drift[j] * share;
        cursor = next;
    }
    return out;
};

const rmsOf = (pts: Point[]): number =>
    Math.sqrt(pts.reduce((s, p) => s + p[0] * p[0] + p[1] * p[1], 0) / pts.length);

const build = () => {
    const raw = lift();
    const mid = [0, 1, 2, 3].map((j) => raw.reduce((s, v) => s + v[j], 0) / raw.length);
    const centred = raw.map((v) => v.map((x, j) => x - mid[j]));

    const visible: Point[] = centred.map((v) => [dot4(v, F1) * ROOT2, dot4(v, F2) * ROOT2]);
    const perp: Point[] = centred.map((v) => [dot4(v, F3) * ROOT2, dot4(v, F4) * ROOT2]);

    const k = rmsOf(visible) / rmsOf(perp);
    return {
        visible,
        perp: perp.map((p): Point => [p[0] * k, p[1] * k]),
        radius: rmsOf(visible)
    };
};

const LIFT = build();

const LOGO_RADIUS = LIFT.radius;

const LOGO_CENTRE: Point = [
    LOGO_OUTLINE.reduce((s, p) => s + p[0], 0) / LOGO_OUTLINE.length,
    LOGO_OUTLINE.reduce((s, p) => s + p[1], 0) / LOGO_OUTLINE.length
];

export interface UnfoldOptions {
    depth: number;
    shells: number;
    precess: number;
    anomaly: number;
    phase: number;
}

export const UNFOLD_DEFAULTS: UnfoldOptions = {
    depth: 0.4,
    shells: 2,
    precess: -1,
    anomaly: 0.14,
    phase: 0
};

export interface Shell {
    offset: Point;
    level: number;
}

export interface UnfoldFrame {
    base: Point[];
    shells: Shell[];
    span: Point;
    spread: number;
}

const smootherstep = (u: number): number => u * u * u * (u * (u * 6 - 15) + 10);

export const unfold = (angle: number, options: UnfoldOptions = UNFOLD_DEFAULTS): UnfoldFrame => {
    const {depth, shells, precess, anomaly, phase} = options;

    const ca = Math.cos(angle);
    const sa = Math.sin(angle);
    const cg = Math.cos(angle);
    const sg = Math.sin(angle);

    const psi = angle * precess + phase;
    const step = (depth * LOGO_RADIUS) / shells;
    const dir: Point = [Math.cos(psi), Math.sin(psi)];

    const shift = (s: number): Point => {
        const x = -s * dir[0] * sa;
        const y = -s * dir[1] * sa;
        return [x * cg - y * sg, x * sg + y * cg];
    };

    const base = LIFT.visible.map((z, i): Point => {
        const u = LIFT.perp[i];
        const x = z[0] * ca - (-z[1] + anomaly * u[0]) * sa;
        const y = z[1] * ca - (z[0] + anomaly * u[1]) * sa;
        return [
            LOGO_CENTRE[0] + x * cg - y * sg,
            LOGO_CENTRE[1] + x * sg + y * cg
        ];
    });

    const out: Shell[] = [];
    for (let j = 1; j <= shells; j++) {
        out.push({offset: shift(j * step), level: j / shells});
        out.push({offset: shift(-j * step), level: j / shells});
    }

    return {base, shells: out, span: shift(shells * step), spread: Math.abs(sa)};
};

const TAN30 = 0.5773502692;
const FAR = 60;

export const INK_REST = 7.388;

export const INK_TRAVEL = 31;

const INK_POLY: Point[] = [
    [-FAR, INK_REST + FAR * TAN30],
    [FAR, INK_REST - FAR * TAN30],
    [FAR, FAR * 1.5],
    [-FAR, FAR * 1.5]
];

const BARE_FRAME = 'M-200 -200H200V200H-200Z';

export const inkPoints = (): string =>
    INK_POLY.map((p) => `${p[0]},${Number(p[1].toFixed(4))}`).join(' ');

export const barePath = (dy: number): string =>
    `${BARE_FRAME}M${INK_POLY.map(([x, y]) => `${x} ${(y + dy).toFixed(3)}`).join('L')}Z`;

export interface EpisodeShape {
    rest: [number, number];
    turns: [number, number];
    turn: [number, number];
    lead: number;
}

export const EPISODE_DEFAULTS: EpisodeShape = {
    rest: [7, 15],
    turns: [2, 4],
    turn: [3, 4.4],
    lead: 0.9
};

export interface Episode {
    rest: number;
    span: number;
    turns: number;
    phases: number[];
    reach: number[];
}

export const planEpisode = (rand: () => number, shape: EpisodeShape = EPISODE_DEFAULTS): Episode => {
    const between = ([lo, hi]: [number, number]) => lo + rand() * (hi - lo);
    const turns = Math.round(between(shape.turns));
    const phases: number[] = [];
    const reach: number[] = [];

    for (let i = 0; i < turns; i++) {
        phases.push(rand() * TAU);
        reach.push(0.8 + rand() * 0.45);
    }

    return {rest: between(shape.rest), span: turns * between(shape.turn), turns, phases, reach};
};

export const episodeLength = (episode: Episode, lead: number): number =>
    episode.rest + 2 * lead + episode.span;

export interface Beat {
    angle: number;
    phase: number;
    reach: number;
    ink: number;
}

export const episodeBeat = (episode: Episode, time: number, lead: number): Beat => {
    const last = episode.turns - 1;
    const at = (turn: number, ink: number): Beat => ({
        angle: 0,
        phase: episode.phases[turn],
        reach: episode.reach[turn],
        ink
    });

    if (time <= episode.rest) return at(0, 0);

    const opening = time - episode.rest;
    if (opening < lead) return at(0, smootherstep(opening / lead));

    const running = opening - lead;
    if (running < episode.span) {
        const p = running / episode.span;
        const angle = episode.turns * Math.PI * smootherstep(p);
        const turn = Math.min(last, Math.floor(angle / Math.PI));
        return {angle, phase: episode.phases[turn], reach: episode.reach[turn], ink: 1};
    }

    const closing = running - episode.span;
    if (closing < lead) return at(last, 1 - smootherstep(closing / lead));

    return at(last, 0);
};

export const toPath = (pts: Point[]): string =>
    `M${pts.map((p) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`).join('L')}Z`;

export const ladderPath = (frame: UnfoldFrame): string => {
    const [sx, sy] = frame.span;
    let d = '';
    for (const [x, y] of frame.base) {
        d += `M${(x - sx).toFixed(3)} ${(y - sy).toFixed(3)}L${(x + sx).toFixed(3)} ${(y + sy).toFixed(3)}`;
    }
    return d;
};
