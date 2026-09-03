import type {Point, Segment} from './geometry';

export type ViewBox = [x: number, y: number, width: number, height: number];

const TOKENS = /([A-Za-z])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/g;

export const parseViewBox = (raw: string): ViewBox => {
    const parts = raw
        .trim()
        .split(/[\s,]+/)
        .map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
        throw new Error(`figure-collide: bad viewBox "${raw}"`);
    }
    return parts as ViewBox;
};

export const pathSegments = (d: string): Segment[] => {
    const tokens = d.match(TOKENS);
    if (!tokens) return [];

    const out: Segment[] = [];
    let command = '';
    let i = 0;
    let cursor: Point = [0, 0];
    let start: Point = [0, 0];

    const number = () => Number(tokens[i++]);
    const line = (to: Point) => {
        if (to[0] !== cursor[0] || to[1] !== cursor[1]) out.push([cursor[0], cursor[1], to[0], to[1]]);
        cursor = to;
    };

    while (i < tokens.length) {
        if (/[A-Za-z]/.test(tokens[i])) command = tokens[i++];

        switch (command) {
            case 'M':
                cursor = [number(), number()];
                start = cursor;
                command = 'L';
                break;
            case 'm':
                cursor = [cursor[0] + number(), cursor[1] + number()];
                start = cursor;
                command = 'l';
                break;
            case 'L':
                line([number(), number()]);
                break;
            case 'l':
                line([cursor[0] + number(), cursor[1] + number()]);
                break;
            case 'H':
                line([number(), cursor[1]]);
                break;
            case 'h':
                line([cursor[0] + number(), cursor[1]]);
                break;
            case 'V':
                line([cursor[0], number()]);
                break;
            case 'v':
                line([cursor[0], cursor[1] + number()]);
                break;
            case 'Z':
            case 'z':
                line(start);
                break;
            default:
                throw new Error(`figure-collide: unsupported command "${command}"`);
        }
    }
    return out;
};

const round = (n: number): number => Math.round(n * 100) / 100;

export const clipToConvex = (segment: Segment, polygon: Point[]): Segment | null => {
    const [x0, y0, x1, y1] = segment;
    const dx = x1 - x0;
    const dy = y1 - y0;

    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % polygon.length];
        area += a[0] * b[1] - b[0] * a[1];
    }
    const wind = area >= 0 ? 1 : -1;

    let lo = 0;
    let hi = 1;

    for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i];
        const b = polygon[(i + 1) % polygon.length];
        const nx = (b[1] - a[1]) * wind;
        const ny = -(b[0] - a[0]) * wind;
        const reach = nx * (x0 - a[0]) + ny * (y0 - a[1]);
        const along = nx * dx + ny * dy;

        if (Math.abs(along) < 1e-12) {
            if (reach > 0) return null;
            continue;
        }

        const t = -reach / along;
        if (along > 0) hi = Math.min(hi, t);
        else lo = Math.max(lo, t);
        if (lo > hi) return null;
    }

    return [x0 + dx * lo, y0 + dy * lo, x0 + dx * hi, y0 + dy * hi];
};

export const scaleSegments = (segments: Segment[], viewBox: string, scale = 1): Segment[] => {
    const [x, y, width, height] = parseViewBox(viewBox);
    const cx = x + width / 2;
    const cy = y + height / 2;

    return segments.map(([x0, y0, x1, y1]) => [
        round(((cx + (x0 - cx) * scale - x) / width) * 100),
        round(((cy + (y0 - cy) * scale - y) / height) * 100),
        round(((cx + (x1 - cx) * scale - x) / width) * 100),
        round(((cy + (y1 - cy) * scale - y) / height) * 100)
    ]);
};

export const percentSegments = (paths: string[], viewBox: string, scale = 1): Segment[] =>
    scaleSegments(paths.flatMap(pathSegments), viewBox, scale);

export const collide = (viewBox: string, paths: string[], scale = 1): string =>
    JSON.stringify(percentSegments(paths, viewBox, scale));

const RING_STEPS = 12;
const RING_HALF = Math.PI / RING_STEPS;

export const ringPath = (cx: number, cy: number, radius: number): string => {
    const reach = radius / Math.cos(RING_HALF);
    const corner = (i: number): string => {
        const a = RING_HALF + (i * 2 * Math.PI) / RING_STEPS;
        return `${Number((cx + reach * Math.cos(a)).toFixed(4))} ${Number((cy + reach * Math.sin(a)).toFixed(4))}`;
    };
    return `M${Array.from({length: RING_STEPS}, (_, i) => corner(i)).join(' ')}Z`;
};

export interface Frame {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const LABEL_PITCH = 12;

export const frameSegments = (host: Frame, box: Frame, pitch = LABEL_PITCH): Segment[] => {
    if (host.width <= 0 || host.height <= 0 || box.width <= 0 || box.height <= 0) return [];

    const x0 = round(((box.left - host.left) / host.width) * 100);
    const x1 = round(((box.left + box.width - host.left) / host.width) * 100);
    const rows = Math.max(1, Math.ceil(box.height / pitch));

    return Array.from({length: rows + 1}, (_, i) => {
        const y = round(((box.top + (i / rows) * box.height - host.top) / host.height) * 100);
        return [x0, y, x1, y] as Segment;
    });
};

export function mountFigureText() {
    const hosts = Array.from(document.querySelectorAll<SVGSVGElement>('svg[data-collide="lines"]')).filter((host) =>
        host.querySelector('text')
    );
    if (!hosts.length) return;

    const drawn = hosts.map((host) => ({
        host,
        base: JSON.parse(host.dataset.segments ?? '[]') as Segment[],
        labels: Array.from(host.querySelectorAll<SVGTextElement>('text'))
    }));

    const apply = () => {
        for (const {host, base, labels} of drawn) {
            const frame = host.getBoundingClientRect();
            const segments = [...base];
            for (const label of labels) segments.push(...frameSegments(frame, label.getBoundingClientRect()));
            host.dataset.segments = JSON.stringify(segments);
        }
    };

    apply();
    document.fonts?.ready.then(apply);
}
