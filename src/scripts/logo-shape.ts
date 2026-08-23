import type {Point} from './geometry';

export const LOGO_HULL: Point[] = [
    [0.5, 0],
    [0.933, 0.75],
    [0.5, 1],
    [0.067, 0.75]
];

const CENTRE_X = 0.5;
const CENTRE_Y = 0.5;
const STEPS = 512;
const TAU = Math.PI * 2;

const castRay = (angle: number): number => {
    const dx = Math.cos(angle),
        dy = Math.sin(angle);
    let best = 0;

    for (let i = 0; i < LOGO_HULL.length; i++) {
        const a = LOGO_HULL[i],
            b = LOGO_HULL[(i + 1) % LOGO_HULL.length];
        const ex = b[0] - a[0],
            ey = b[1] - a[1];
        const den = dx * ey - dy * ex;
        if (Math.abs(den) < 1e-12) continue;

        const ax = a[0] - CENTRE_X,
            ay = a[1] - CENTRE_Y;
        const t = (ax * ey - ay * ex) / den;
        const s = (ax * dy - ay * dx) / den;
        if (t > best && s >= 0 && s <= 1) best = t;
    }
    return best;
};

const table = (() => {
    const t = new Float32Array(STEPS);
    let max = 0;
    for (let i = 0; i < STEPS; i++) {
        t[i] = castRay((i / STEPS) * TAU);
        if (t[i] > max) max = t[i];
    }
    for (let i = 0; i < STEPS; i++) t[i] /= max;
    return t;
})();

export const logoReach = (angle: number): number => {
    const pos = (angle / TAU) * STEPS;
    const lo = Math.floor(pos);
    const a = table[((lo % STEPS) + STEPS) % STEPS];
    const b = table[(((lo + 1) % STEPS) + STEPS) % STEPS];
    return a + (b - a) * (pos - lo);
};
