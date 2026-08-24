export interface Station {
    top: number;
    label: string;
}

const SIGHT_LINE = 0.35;

export const progressAt = (scrollY: number, viewport: number, page: number): number => {
    const travel = page - viewport;
    if (travel <= 0) return 0;

    const reached = scrollY / travel;
    return reached < 0 ? 0 : reached > 1 ? 1 : reached;
};

export const stationAt = (stations: Station[], scrollY: number, viewport: number): Station | null => {
    const line = scrollY + viewport * SIGHT_LINE;
    let found: Station | null = null;

    for (const station of stations) {
        if (station.top <= line) found = station;
    }
    return found ?? stations[0] ?? null;
};

export function mountScrollGauge() {
    const gauge = document.querySelector<HTMLElement>('[data-gauge]');
    const readout = document.querySelector<HTMLElement>('[data-gauge-readout]');
    if (!gauge) return;

    const marks = Array.from(document.querySelectorAll<HTMLElement>('[data-station]'));
    let stations: Station[] = [];
    let shown = '';
    let painted = '';
    let queued = 0;

    const measure = () => {
        stations = marks
            .map((el) => ({top: el.getBoundingClientRect().top + window.scrollY, label: el.dataset.station ?? ''}))
            .sort((a, b) => a.top - b.top);
    };

    const paint = () => {
        queued = 0;
        const viewport = window.innerHeight;
        const progress = progressAt(window.scrollY, viewport, document.documentElement.scrollHeight);

        const tick = progress.toFixed(5);
        if (tick !== painted) {
            painted = tick;
            gauge.style.setProperty('--tick', tick);
        }

        if (!readout) return;
        const station = stationAt(stations, window.scrollY, viewport);
        if (station && station.label !== shown) {
            shown = station.label;
            readout.textContent = station.label;
        }
    };

    const schedule = () => {
        if (queued) return;
        queued = requestAnimationFrame(paint);
    };

    const remeasure = () => {
        measure();
        paint();
    };

    measure();
    paint();
    gauge.dataset.live = 'true';

    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', remeasure);
    window.addEventListener('load', remeasure);
}
