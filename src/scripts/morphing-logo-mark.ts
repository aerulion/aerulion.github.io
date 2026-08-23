import {
    barePath,
    type Episode,
    EPISODE_DEFAULTS,
    episodeBeat,
    episodeLength,
    INK_TRAVEL,
    ladderPath,
    planEpisode,
    toPath,
    unfold,
    UNFOLD_DEFAULTS,
    type UnfoldOptions
} from './morphing-logo';

const SHELL_ALPHA = 0.3;
const SHELL_FADE = 0.5;
const LADDER_ALPHA = 0.13;
const MAX_STEP = 0.1;

interface Rig {
    svg: SVGSVGElement;
    outline: SVGPathElement;
    clip: SVGPathElement;
    bare: SVGPathElement;
    ladder: SVGPathElement;
    shells: SVGPathElement[];
    ink: SVGPolygonElement;
    silhouette: string;
    options: UnfoldOptions;
    ladderAlpha: number;
    episode: Episode;
    clock: number;
}

const readOptions = (svg: SVGSVGElement): UnfoldOptions => {
    const data = svg.dataset;
    const num = (key: string, fallback: number) => {
        const raw = data[key];
        const value = raw === undefined ? NaN : Number(raw);
        return Number.isFinite(value) ? value : fallback;
    };
    return {
        depth: num('depth', UNFOLD_DEFAULTS.depth),
        shells: Math.round(num('shells', UNFOLD_DEFAULTS.shells)),
        precess: num('precess', UNFOLD_DEFAULTS.precess),
        anomaly: num('anomaly', UNFOLD_DEFAULTS.anomaly),
        phase: 0
    };
};

const rigOf = (svg: SVGSVGElement): Rig | null => {
    const outline = svg.querySelector<SVGPathElement>('.mark-outline');
    const clip = svg.querySelector<SVGPathElement>('.mark-clip');
    const bare = svg.querySelector<SVGPathElement>('.mark-bare');
    const ladder = svg.querySelector<SVGPathElement>('.mark-ladder');
    const ink = svg.querySelector<SVGPolygonElement>('.mark-ink');
    const shells = Array.from(svg.querySelectorAll<SVGPathElement>('.mark-shell'));
    if (!outline || !clip || !bare || !ladder || !ink || !shells.length) return null;

    const alpha = Number(svg.dataset.ladder);
    return {
        svg,
        outline,
        clip,
        bare,
        ladder,
        ink,
        shells,
        silhouette: outline.getAttribute('d') ?? '',
        options: readOptions(svg),
        ladderAlpha: Number.isFinite(alpha) ? alpha : LADDER_ALPHA,
        episode: planEpisode(Math.random),
        clock: 0
    };
};

const paint = (rig: Rig) => {
    const beat = episodeBeat(rig.episode, rig.clock, EPISODE_DEFAULTS.lead);
    const frame = unfold(beat.angle, {
        ...rig.options,
        phase: beat.phase,
        depth: rig.options.depth * beat.reach
    });

    const d = toPath(frame.base);
    rig.outline.setAttribute('d', d);
    rig.clip.setAttribute('d', d);

    const dy = beat.ink * INK_TRAVEL;
    rig.bare.setAttribute('d', barePath(dy));
    rig.ink.style.transform = `translateY(${dy.toFixed(4)}px)`;

    if (rig.ladderAlpha > 0) {
        rig.ladder.setAttribute('d', ladderPath(frame));
        rig.ladder.style.opacity = String(frame.spread * rig.ladderAlpha);
    }

    frame.shells.forEach((shell, i) => {
        const node = rig.shells[i];
        if (!node) return;
        node.setAttribute('d', d);
        node.setAttribute('transform', `translate(${shell.offset[0].toFixed(3)} ${shell.offset[1].toFixed(3)})`);
        node.style.opacity = String(frame.spread * SHELL_ALPHA * (1 - shell.level * SHELL_FADE));
    });
};

export function mountMorphingLogoMarks() {
    const marks = Array.from(document.querySelectorAll<SVGSVGElement>('[data-morphing-logo]'));
    if (!marks.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rigs = marks.map(rigOf).filter((r): r is Rig => r !== null);
    if (!rigs.length) return;

    let live: Rig[] = [];
    let raf = 0;
    let last = 0;

    const rest = (rig: Rig) => {
        rig.svg.classList.remove('is-live');
        rig.outline.setAttribute('d', rig.silhouette);
        rig.clip.setAttribute('d', rig.silhouette);
        rig.ladder.style.opacity = '0';
        rig.shells.forEach((s) => (s.style.opacity = '0'));
        rig.ink.style.transform = '';
        rig.bare.setAttribute('d', barePath(0));
        rig.episode = planEpisode(Math.random);
        rig.clock = 0;
    };

    const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, MAX_STEP);
        last = now;

        for (const rig of live) {
            rig.clock += dt;
            if (rig.clock >= episodeLength(rig.episode, EPISODE_DEFAULTS.lead)) {
                rig.episode = planEpisode(Math.random);
                rig.clock = 0;
            }
            paint(rig);
        }
        raf = requestAnimationFrame(tick);
    };

    const sync = () => {
        const wanted =
            reduced.matches || document.hidden
                ? []
                : rigs.filter((rig) => rig.svg.dataset.visible === 'true' && rig.svg.dataset.intro === 'done');

        for (const rig of live) if (!wanted.includes(rig)) rest(rig);
        for (const rig of wanted) if (!live.includes(rig)) rig.svg.classList.add('is-live');

        live = wanted;

        if (live.length && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(tick);
        }
        if (!live.length && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                (entry.target as SVGSVGElement).dataset.visible = String(entry.isIntersecting);
            }
            sync();
        },
        {rootMargin: '120px'}
    );

    for (const rig of rigs) {
        observer.observe(rig.svg);

        const host = rig.svg.closest('[data-draw]');
        const delay = Number(rig.svg.dataset.introDelay) || 0;
        const arm = () =>
            window.setTimeout(() => {
                rig.svg.dataset.intro = 'done';
                sync();
            }, delay);

        if (!host || host.classList.contains('is-drawn')) {
            arm();
        } else {
            const watch = new MutationObserver(() => {
                if (!host.classList.contains('is-drawn')) return;
                watch.disconnect();
                arm();
            });
            watch.observe(host, {attributes: true, attributeFilter: ['class']});
        }
    }

    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    sync();
}
