import {boundsOf, type Point, type Segment} from './geometry';
import {emptyObstacles, type Obstacles} from './distance-field';
import {LOGO_HULL} from './logo-shape';

const PAD_SURFACE = 10;
const PAD_BORDER = 9;
const PAD_TEXT_X = 11;
const PAD_TEXT_Y = 7;
const PAD_LINE = 9;
const PAD_HULL = 10;

const MIN_OPACITY = 0.06;

const MEASURE_MARGIN = 1200;
export const REMEASURE_STEP = 600;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CANVAS', 'BR', 'NOSCRIPT']);

interface Spec {
    el: Element;
    pinned: boolean;
    surface: boolean;
    borders: [number, number, number, number] | null;
    hull: boolean;
    segments: Segment[] | null;
    panel: boolean;
    text: Text[];
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

export class ObstacleIndex {
    readonly flow: Obstacles = emptyObstacles();
    readonly pinned: Obstacles = emptyObstacles();

    scrollX = 0;
    scrollY = 0;

    private specs: Spec[] = [];
    private readonly probe = new CutProbe();

    scan() {
        this.probe.measure();
        this.specs = [];

        const pinnedBy = new Map<Element, boolean>();
        const fadedBy = new Map<Element, boolean>();

        for (const el of document.querySelectorAll('body *')) {
            const parent = el.parentElement;
            const inheritsPin = parent ? pinnedBy.get(parent) === true : false;
            const inheritsFade = parent ? fadedBy.get(parent) === true : false;

            if ((el as SVGElement).ownerSVGElement) {
                pinnedBy.set(el, inheritsPin);
                fadedBy.set(el, inheritsFade);
                continue;
            }

            const cs = getComputedStyle(el);
            const pinned = inheritsPin || cs.position === 'fixed' || cs.position === 'sticky';
            const faded = inheritsFade || parseFloat(cs.opacity) < MIN_OPACITY;
            pinnedBy.set(el, pinned);
            fadedBy.set(el, faded);
            if (faded) continue;

            const spec = specOf(el, cs, pinned);
            if (spec) this.specs.push(spec);
        }
    }

    measure() {
        const sx = window.scrollX,
            sy = window.scrollY;
        this.scrollX = sx;
        this.scrollY = sy;

        reset(this.flow);
        reset(this.pinned);

        const top = -MEASURE_MARGIN;
        const bottom = window.innerHeight + MEASURE_MARGIN;

        for (const spec of this.specs) {
            const r = spec.el.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            if (!spec.pinned && (r.bottom < top || r.top > bottom)) continue;

            const out = spec.pinned ? this.pinned : this.flow;
            const dx = spec.pinned ? 0 : sx;
            const dy = spec.pinned ? 0 : sy;

            if (spec.hull) out.hulls.push(mapHull(r, dx, dy));
            if (spec.segments) mapSegments(spec.segments, r, dx, dy, out);
            if (spec.panel) panelOutline(r, dx, dy, this.probe.x, this.probe.y, out);
            if (spec.surface) {
                out.boxes.push([r.left + dx, r.top + dy, r.right + dx, r.bottom + dy, PAD_SURFACE]);
            }
            if (spec.borders) borderBands(r, dx, dy, spec.borders, out);

            for (const node of spec.text) {
                range.selectNodeContents(node);
                for (const line of range.getClientRects()) {
                    if (line.width <= 0 || line.bottom < top || line.top > bottom) continue;
                    const bleed = PAD_TEXT_X - PAD_TEXT_Y;
                    out.boxes.push([
                        line.left + dx - bleed,
                        line.top + dy,
                        line.right + dx + bleed,
                        line.bottom + dy,
                        PAD_TEXT_Y
                    ]);
                }
            }
        }
    }
}

const reset = (o: Obstacles) => {
    o.boxes.length = 0;
    o.capsules.length = 0;
    o.hulls.length = 0;
};

const specOf = (el: Element, cs: CSSStyleDeclaration, pinned: boolean): Spec | null => {
    if (SKIP_TAGS.has(el.tagName.toUpperCase())) return null;
    if (cs.display === 'none' || cs.visibility === 'hidden') return null;

    const data = (el as HTMLElement).dataset;
    if (data?.collide === 'none') return null;

    const segments = data?.collide === 'lines' ? parseSegments(data.segments) : null;
    const hull = data?.collide === 'logo';
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
    return {el, pinned, surface, borders, hull, segments, panel, text};
};

const mapHull = (r: DOMRect, dx: number, dy: number) => {
    const points: Point[] = LOGO_HULL.map(([nx, ny]) => [r.left + dx + nx * r.width, r.top + dy + ny * r.height]);
    return {points, bbox: boundsOf(points), pad: PAD_HULL};
};

const mapSegments = (segments: Segment[], r: DOMRect, dx: number, dy: number, out: Obstacles) => {
    const sx = r.width / 100,
        sy = r.height / 100;
    for (const [x0, y0, x1, y1] of segments) {
        out.capsules.push([
            r.left + dx + x0 * sx,
            r.top + dy + y0 * sy,
            r.left + dx + x1 * sx,
            r.top + dy + y1 * sy,
            PAD_LINE
        ]);
    }
};

const panelOutline = (r: DOMRect, dx: number, dy: number, cutX: number, cutY: number, out: Obstacles) => {
    if (cutX <= 0 || cutY <= 0) return;
    const l = r.left + dx,
        t = r.top + dy,
        rt = r.right + dx,
        b = r.bottom + dy;
    out.capsules.push(
        [l + cutX, t, rt, t, PAD_LINE],
        [rt, t, rt, b - cutY, PAD_LINE],
        [rt - cutX, b, l, b, PAD_LINE],
        [l, b, l, t + cutY, PAD_LINE],
        [l + cutX, t, l, t + cutY, PAD_LINE],
        [rt - cutX, b, rt, b - cutY, PAD_LINE]
    );
};

const borderBands = (
    r: DOMRect,
    dx: number,
    dy: number,
    [top, right, bottom, left]: [number, number, number, number],
    out: Obstacles
) => {
    const l = r.left + dx,
        t = r.top + dy,
        rt = r.right + dx,
        b = r.bottom + dy;
    if (top > 0) out.boxes.push([l, t, rt, t + top, PAD_BORDER]);
    if (bottom > 0) out.boxes.push([l, b - bottom, rt, b, PAD_BORDER]);
    if (left > 0) out.boxes.push([l, t, l + left, b, PAD_BORDER]);
    if (right > 0) out.boxes.push([rt - right, t, rt, b, PAD_BORDER]);
};
