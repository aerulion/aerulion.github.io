import {describe, expect, test} from 'bun:test';
import {
    barePath,
    EPISODE_DEFAULTS,
    episodeBeat,
    episodeLength,
    INK_TRAVEL,
    inkPoints,
    ladderPath,
    planEpisode,
    SILHOUETTE,
    toPath,
    unfold,
    UNFOLD_DEFAULTS
} from './morphing-logo';

const OUTLINE_POINTS = 15;
const {lead} = EPISODE_DEFAULTS;

const seeded = (seed: number) => {
    let state = seed >>> 0;
    return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
    };
};

describe('SILHOUETTE', () => {
    test('is a closed path', () => {
        expect(SILHOUETTE.startsWith('m')).toBe(true);
        expect(SILHOUETTE.endsWith('Z')).toBe(true);
    });
});

describe('ink geometry', () => {
    test('inkPoints describes a four-corner sweep', () => {
        expect(inkPoints().split(' ')).toHaveLength(4);
    });

    test('barePath keeps the outer frame and moves the cut-out', () => {
        expect(barePath(0).startsWith('M-200 -200H200V200H-200Z')).toBe(true);
        expect(barePath(INK_TRAVEL)).not.toBe(barePath(0));
    });

    test('INK_TRAVEL clears the whole view box', () => {
        expect(INK_TRAVEL).toBeGreaterThan(26.458333);
    });
});

describe('toPath', () => {
    test('emits a closed polyline at three decimals', () => {
        expect(
            toPath([
                [0, 0],
                [1, 2]
            ])
        ).toBe('M0.000 0.000L1.000 2.000Z');
    });
});

describe('planEpisode', () => {
    test('is reproducible for a given source of randomness', () => {
        expect(planEpisode(seeded(42))).toEqual(planEpisode(seeded(42)));
    });

    test('stays inside the configured envelope', () => {
        for (let seed = 0; seed < 200; seed++) {
            const episode = planEpisode(seeded(seed));

            expect(episode.turns).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.turns[0]);
            expect(episode.turns).toBeLessThanOrEqual(EPISODE_DEFAULTS.turns[1]);
            expect(episode.rest).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.rest[0]);
            expect(episode.rest).toBeLessThanOrEqual(EPISODE_DEFAULTS.rest[1]);
            expect(episode.phases).toHaveLength(episode.turns);
            expect(episode.reach).toHaveLength(episode.turns);
        }
    });

    test('plans one span per turn', () => {
        const episode = planEpisode(seeded(7));
        const perTurn = episode.span / episode.turns;

        expect(perTurn).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.turn[0]);
        expect(perTurn).toBeLessThanOrEqual(EPISODE_DEFAULTS.turn[1]);
    });
});

describe('episodeBeat', () => {
    const episode = planEpisode(seeded(1234));
    const total = episodeLength(episode, lead);

    test('episodeLength covers the rest, both leads and the run', () => {
        expect(total).toBeCloseTo(episode.rest + 2 * lead + episode.span);
    });

    test('rests unrotated with no ink', () => {
        const beat = episodeBeat(episode, 0, lead);

        expect(beat.angle).toBe(0);
        expect(beat.ink).toBe(0);
        expect(beat.phase).toBe(episode.phases[0]);
    });

    test('is fully inked once the lead-in finishes', () => {
        expect(episodeBeat(episode, episode.rest + lead, lead).ink).toBeCloseTo(1);
    });

    test('settles back to no ink at the end', () => {
        expect(episodeBeat(episode, total, lead).ink).toBeCloseTo(0);
        expect(episodeBeat(episode, total + 5, lead).ink).toBe(0);
    });

    test('keeps ink within its bounds for the whole episode', () => {
        for (let i = 0; i <= 1000; i++) {
            const {ink} = episodeBeat(episode, (i / 1000) * total, lead);

            expect(ink).toBeGreaterThanOrEqual(0);
            expect(ink).toBeLessThanOrEqual(1);
        }
    });

    test('turns monotonically through half a turn per planned turn', () => {
        const start = episode.rest + lead;
        let previous = -1;

        for (let i = 0; i <= 500; i++) {
            const {angle} = episodeBeat(episode, start + (i / 500) * episode.span * 0.999, lead);

            expect(angle).toBeGreaterThanOrEqual(previous);
            previous = angle;
        }
        expect(previous).toBeCloseTo(episode.turns * Math.PI, 1);
    });

    test('always reports a phase and reach drawn from the plan', () => {
        for (let i = 0; i <= 500; i++) {
            const {phase, reach} = episodeBeat(episode, (i / 500) * total, lead);

            expect(episode.phases).toContain(phase);
            expect(episode.reach).toContain(reach);
        }
    });
});

describe('unfold', () => {
    test('rebuilds the outline vertex for vertex', () => {
        expect(unfold(0).base).toHaveLength(OUTLINE_POINTS);
    });

    test('lies flat at rest', () => {
        const frame = unfold(0);

        expect(frame.spread).toBe(0);
        expect(frame.span[0]).toBeCloseTo(0);
        expect(frame.span[1]).toBeCloseTo(0);
        for (const shell of frame.shells) {
            expect(shell.offset[0]).toBeCloseTo(0);
            expect(shell.offset[1]).toBeCloseTo(0);
        }
    });

    test('spreads with the sine of the angle', () => {
        for (const angle of [0.3, 1.1, Math.PI / 2, 2.6, 4.2]) {
            expect(unfold(angle).spread).toBeCloseTo(Math.abs(Math.sin(angle)));
        }
    });

    test('emits a mirrored pair of shells per level', () => {
        const frame = unfold(1, {...UNFOLD_DEFAULTS, shells: 3});

        expect(frame.shells).toHaveLength(6);
        for (let i = 0; i < frame.shells.length; i += 2) {
            const [ax, ay] = frame.shells[i].offset;
            const [bx, by] = frame.shells[i + 1].offset;

            expect(ax).toBeCloseTo(-bx);
            expect(ay).toBeCloseTo(-by);
        }
    });

    test('pushes the shells further as depth grows', () => {
        const near = unfold(1, {...UNFOLD_DEFAULTS, depth: 0.2});
        const far = unfold(1, {...UNFOLD_DEFAULTS, depth: 0.8});

        expect(Math.hypot(...far.span)).toBeGreaterThan(Math.hypot(...near.span));
    });

    test('repeats after a full turn', () => {
        const once = unfold(0.4);
        const again = unfold(0.4 + Math.PI * 2);

        for (let i = 0; i < once.base.length; i++) {
            expect(again.base[i][0]).toBeCloseTo(once.base[i][0], 6);
            expect(again.base[i][1]).toBeCloseTo(once.base[i][1], 6);
        }
    });

    test('produces finite coordinates throughout a turn', () => {
        for (let i = 0; i <= 200; i++) {
            for (const [x, y] of unfold((i / 200) * Math.PI * 2).base) {
                expect(Number.isFinite(x)).toBe(true);
                expect(Number.isFinite(y)).toBe(true);
            }
        }
    });
});

describe('ladderPath', () => {
    test('draws one rung per outline vertex', () => {
        const rungs = ladderPath(unfold(1)).match(/M/g);

        expect(rungs).toHaveLength(OUTLINE_POINTS);
    });
});
