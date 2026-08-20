import {boundsOf, centroid, type Point, type Polygon, type Rect, type Segment} from './geometry';
import {LOGO_HULL} from './logo-shape';

const BOX_PAD = 5;
const TEXT_PAD_X = 4;
const TEXT_PAD_Y = 2;
export const LINE_PAD = 6;
const OFF_SCREEN = 80;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CANVAS', 'BR']);

interface Spec {
    el: Element;
    surface: boolean;
    borders: [number, number, number, number] | null;
    hull: Point[] | null;
    segments: Segment[] | null;
    panel: boolean;
    text: Text[];
}

export interface Obstacles {
    rects: Rect[];
    polygons: Polygon[];
    lines: Segment[];
}

const range = document.createRange();

class CutProbe {
    x = 0;
    y = 0;
    private readonly el = document.createElement('div');

    constructor() {
        this.el.style.cssText =
            'position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;' +
            'width:var(--cut-x);height:var(--cut-y);';
        document.body.appendChild(this.el);
    }

    measure() {
        const r = this.el.getBoundingClientRect();
        this.x = r.width;
        this.y = r.height;
    }
}

const parseSegments = (raw: string | undefined): Segment[] | null => {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Segment[];
    } catch {
        return null;
    }
};

const specOf = (el: Element): Spec | null => {
    if ((el as SVGElement).ownerSVGElement) return null;
    if (SKIP_TAGS.has(el.tagName.toUpperCase())) return null;

    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return null;

    const data = (el as HTMLElement).dataset;
    const segments = data?.collide === 'lines' ? parseSegments(data.segments) : null;
    const hull = data?.collide === 'logo' ? LOGO_HULL : null;
    const panel = el.classList.contains('panel-cut');

    const text: Text[] = [];
    for (let n = el.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === Node.TEXT_NODE && n.nodeValue?.trim()) text.push(n as Text);
    }

    const bg = cs.backgroundColor;
    const painted = !!bg && bg !== 'transparent' && !bg.endsWith(', 0)');
    const surface = !hull && !segments && (painted || el.tagName === 'IMG');

    const widths: [number, number, number, number] = [
        parseFloat(cs.borderTopWidth) || 0,
        parseFloat(cs.borderRightWidth) || 0,
        parseFloat(cs.borderBottomWidth) || 0,
        parseFloat(cs.borderLeftWidth) || 0
    ];
    const borders = widths.some((v) => v > 0) ? widths : null;

    if (!surface && !borders && !hull && !segments && !panel && !text.length) return null;
    return {el, surface, borders, hull, segments, panel, text};
};

export class ObstacleIndex {
    private specs: Spec[] = [];
    private readonly probe = new CutProbe();

    /** Costly; layout-shift events only. */
    survey() {
        this.probe.measure();
        this.specs = [];
        for (const el of document.querySelectorAll('body *')) {
            const spec = specOf(el);
            if (spec) this.specs.push(spec);
        }
    }

    /** Runs on every scroll. */
    collect(viewportHeight: number, viewportWidth: number): Obstacles {
        const rects: Rect[] = [];
        const polygons: Polygon[] = [];
        const lines: Segment[] = [];

        const visible = (r: DOMRect) =>
            r.width > 0 && r.height > 0 &&
            r.bottom > -OFF_SCREEN && r.top < viewportHeight + OFF_SCREEN &&
            r.right > -OFF_SCREEN && r.left < viewportWidth + OFF_SCREEN;

        for (const spec of this.specs) {
            const r = spec.el.getBoundingClientRect();
            if (!visible(r)) continue;

            if (spec.hull) polygons.push(inflatedHull(spec.hull, r));
            if (spec.segments) lines.push(...mapSegments(spec.segments, r));
            if (spec.panel) lines.push(...panelOutline(r, this.probe.x, this.probe.y));
            if (spec.surface) rects.push([r.left - BOX_PAD, r.top - BOX_PAD, r.right + BOX_PAD, r.bottom + BOX_PAD]);
            if (spec.borders) rects.push(...borderBands(r, spec.borders));

            for (const node of spec.text) {
                range.selectNodeContents(node);
                for (const line of range.getClientRects()) {
                    if (!visible(line)) continue;
                    rects.push([
                        line.left - TEXT_PAD_X, line.top - TEXT_PAD_Y,
                        line.right + TEXT_PAD_X, line.bottom + TEXT_PAD_Y
                    ]);
                }
            }
        }

        return {rects, polygons, lines};
    }
}

const inflatedHull = (hull: Point[], r: DOMRect): Polygon => {
    const points: Point[] = hull.map(([nx, ny]) => [r.left + nx * r.width, r.top + ny * r.height]);
    const [gx, gy] = centroid(points);

    for (const p of points) {
        const dx = p[0] - gx, dy = p[1] - gy;
        const d = Math.hypot(dx, dy) || 1;
        p[0] = gx + dx * (1 + BOX_PAD / d);
        p[1] = gy + dy * (1 + BOX_PAD / d);
    }
    return {bbox: boundsOf(points), points};
};

const mapSegments = (segments: Segment[], r: DOMRect): Segment[] => {
    const sx = r.width / 100, sy = r.height / 100;
    return segments.map(([x0, y0, x1, y1]) => [
        r.left + x0 * sx, r.top + y0 * sy,
        r.left + x1 * sx, r.top + y1 * sy
    ]);
};

const panelOutline = (r: DOMRect, cutX: number, cutY: number): Segment[] => {
    if (cutX <= 0 || cutY <= 0) return [];
    const {left: l, top: t, right: rt, bottom: b} = r;
    return [
        [l + cutX, t, rt, t],
        [rt, t, rt, b - cutY],
        [rt - cutX, b, l, b],
        [l, b, l, t + cutY],
        [l + cutX, t, l, t + cutY],
        [rt - cutX, b, rt, b - cutY]
    ];
};

const borderBands = (r: DOMRect, [top, right, bottom, left]: [number, number, number, number]): Rect[] => {
    const bands: Rect[] = [];
    if (top > 0) bands.push([r.left - BOX_PAD, r.top - BOX_PAD, r.right + BOX_PAD, r.top + top + BOX_PAD]);
    if (bottom > 0) bands.push([r.left - BOX_PAD, r.bottom - bottom - BOX_PAD, r.right + BOX_PAD, r.bottom + BOX_PAD]);
    if (left > 0) bands.push([r.left - BOX_PAD, r.top - BOX_PAD, r.left + left + BOX_PAD, r.bottom + BOX_PAD]);
    if (right > 0) bands.push([r.right - right - BOX_PAD, r.top - BOX_PAD, r.right + BOX_PAD, r.bottom + BOX_PAD]);
    return bands;
};
