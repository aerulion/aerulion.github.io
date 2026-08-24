const GLYPHS = '0123456789';

const LANDING_GRACE = 400;

export interface RollShape {
    settle: number;
    stagger: number;
    step: number;
}

export const ROLL_DEFAULTS: RollShape = {
    settle: 240,
    stagger: 55,
    step: 45
};

export interface Roll {
    text: string;
    settles: number[];
    length: number;
}

const isDigit = (glyph: string): boolean => glyph >= '0' && glyph <= '9';

export const planRoll = (text: string, shape: RollShape = ROLL_DEFAULTS): Roll => {
    const settles: number[] = [];
    let digits = 0;

    for (let i = 0; i < text.length; i++) {
        if (!isDigit(text[i])) {
            settles.push(-1);
            continue;
        }
        settles.push(shape.settle + digits * shape.stagger);
        digits++;
    }

    return {text, settles, length: digits ? shape.settle + (digits - 1) * shape.stagger : 0};
};

const scramble = (index: number, frame: number): string =>
    GLYPHS[(Math.imul(index * 73 + frame * 151 + 1, 2246822519) >>> 0) % GLYPHS.length];

export const rollAt = (roll: Roll, time: number, shape: RollShape = ROLL_DEFAULTS): string => {
    if (time >= roll.length) return roll.text;

    const frame = Math.floor(time / shape.step);
    let out = '';

    for (let i = 0; i < roll.text.length; i++) {
        const settle = roll.settles[i];
        out += settle < 0 || time >= settle ? roll.text[i] : scramble(i, frame);
    }
    return out;
};

const armed = (node: HTMLElement, run: () => void) => {
    const host = node.closest('[data-reveal]');

    if (!host || host.classList.contains('is-revealed')) {
        run();
        return;
    }

    const watch = new MutationObserver(() => {
        if (!host.classList.contains('is-revealed')) return;
        watch.disconnect();
        run();
    });
    watch.observe(host, {attributes: true, attributeFilter: ['class']});
};

export function mountTelemetry() {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-telemetry]'));
    if (!nodes.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (const node of nodes) {
        const roll = planRoll(node.textContent ?? '');
        if (!roll.length) continue;

        armed(node, () => {
            const start = performance.now();
            let shown = roll.text;

            const show = (text: string) => {
                if (text === shown) return;
                shown = text;
                node.textContent = text;
            };

            const land = () => show(roll.text);
            const tick = (now: number) => {
                const time = now - start;
                if (time >= roll.length) {
                    land();
                    return;
                }
                show(rollAt(roll, time));
                requestAnimationFrame(tick);
            };

            window.setTimeout(land, roll.length + LANDING_GRACE);
            requestAnimationFrame(tick);
        });
    }
}
