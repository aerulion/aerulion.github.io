import {describe, expect, test} from 'bun:test';
import {
    arcLength,
    barePath,
    EASES,
    type Episode,
    EPISODE_DEFAULTS,
    episodeBeat,
    episodeLength,
    INK_TRAVEL,
    VIEW,
    inkPoints,
    ladderPath,
    planEpisode,
    SILHOUETTE,
    toPath,
    unfold,
    UNFOLD_DEFAULTS
} from './mark-geometry';

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
        expect(SILHOUETTE.startsWith('M')).toBe(true);
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
        expect(INK_TRAVEL).toBeGreaterThan(VIEW);
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

const HALF = Math.PI;

const arcStarts = (episode: Episode, lead: number): number[] => {
    const marks: number[] = [];
    let at = episode.rest + lead;

    for (const arc of episode.arcs) {
        marks.push(at);
        at += arc.out.strike + arc.out.hold + arc.back.strike + arc.back.hold;
    }
    return marks;
};

const plans = (count: number): Episode[] => Array.from({length: count}, (_, seed) => planEpisode(seeded(seed)));

describe('easings', () => {
    test('every curve runs from nought to one', () => {
        for (const ease of Object.values(EASES)) {
            expect(ease(0)).toBeCloseTo(0);
            expect(ease(1)).toBeCloseTo(1);
        }
    });

    test('recoil overshoots and comes back', () => {
        const peak = Math.max(...Array.from({length: 101}, (_, i) => EASES.recoil(i / 100)));

        expect(peak).toBeGreaterThan(1);
        expect(peak).toBeLessThan(1.2);
    });

    test('a strike leaves fast and lands slow', () => {
        for (const ease of [EASES.snap, EASES.recoil]) {
            const leaves = ease(0.08) - ease(0);
            const lands = ease(1) - ease(0.92);

            expect(Math.abs(lands)).toBeLessThan(Math.abs(leaves));
        }
    });

    test('glide stays the even-handed one', () => {
        expect(EASES.glide(0.25)).toBeCloseTo(1 - EASES.glide(0.75));
    });
});

describe('planEpisode', () => {
    test('is reproducible for a given source of randomness', () => {
        expect(planEpisode(seeded(42))).toEqual(planEpisode(seeded(42)));
    });

    test('stays inside the configured envelope', () => {
        for (const episode of plans(200)) {
            expect(episode.arcs.length).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.arcs[0]);
            expect(episode.arcs.length).toBeLessThanOrEqual(EPISODE_DEFAULTS.arcs[1]);
            expect(episode.rest).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.rest[0]);
            expect(episode.rest).toBeLessThanOrEqual(EPISODE_DEFAULTS.rest[1]);

            episode.arcs.forEach((arc, i) => {
                const last = i === episode.arcs.length - 1;
                const flat = last ? EPISODE_DEFAULTS.settle : EPISODE_DEFAULTS.flat;

                expect(EASES).toHaveProperty(arc.out.ease);
                expect(EASES).toHaveProperty(arc.back.ease);
                expect(Math.abs(arc.dir)).toBe(1);
                expect(arc.fan).toBeGreaterThanOrEqual(0);
                expect(arc.fan).toBeLessThan(Math.PI * 2);

                for (const strike of [arc.out.strike, arc.back.strike]) {
                    expect(strike).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.strike[0]);
                    expect(strike).toBeLessThanOrEqual(EPISODE_DEFAULTS.strike[1]);
                }
                expect(arc.out.hold).toBeGreaterThanOrEqual(EPISODE_DEFAULTS.fanned[0]);
                expect(arc.out.hold).toBeLessThanOrEqual(EPISODE_DEFAULTS.fanned[1]);
                expect(arc.back.hold).toBeGreaterThanOrEqual(flat[0]);
                expect(arc.back.hold).toBeLessThanOrEqual(flat[1]);
            });
        }
    });

    test('dwells on the fanned pose far longer than it takes to get there', () => {
        for (const episode of plans(200)) {
            for (const arc of episode.arcs) expect(arc.out.hold).toBeGreaterThan(arc.out.strike * 1.5);
        }
    });

    test('every arc spends more of itself held than moving', () => {
        for (const episode of plans(200)) {
            for (const arc of episode.arcs) {
                expect(arc.out.hold + arc.back.hold).toBeGreaterThan(arc.out.strike + arc.back.strike);
            }
        }
    });

    test('peaks near the widest fan', () => {
        for (const episode of plans(200)) {
            for (const arc of episode.arcs) expect(Math.abs(Math.sin(arc.peak))).toBeGreaterThan(0.85);
        }
    });

    test('span is the sum of every strike and every hold', () => {
        const episode = planEpisode(seeded(7));
        const sum = episode.arcs.reduce((s, a) => s + a.out.strike + a.out.hold + a.back.strike + a.back.hold, 0);

        expect(episode.span).toBeCloseTo(sum);
    });

    test('spaces successive fan directions at least a quarter turn apart', () => {
        for (const episode of plans(200)) {
            episode.arcs.forEach((arc, i) => {
                if (i === 0) return;
                const apart = Math.abs(arc.fan - episode.arcs[i - 1].fan) % (Math.PI * 2);
                const gap = Math.min(apart, Math.PI * 2 - apart);

                expect(gap).toBeGreaterThanOrEqual(Math.PI / 2 - 1e-9);
            });
        }
    });

    test('rolls a fresh fan direction and easing across plans', () => {
        const fans = new Set<number>();
        const eases = new Set<string>();
        for (const episode of plans(60)) {
            for (const arc of episode.arcs) {
                fans.add(arc.fan);
                eases.add(arc.out.ease);
            }
        }

        expect(fans.size).toBeGreaterThan(60);
        expect(eases.size).toBe(Object.keys(EASES).length);
    });
});

describe('episodeBeat', () => {
    const episode = planEpisode(seeded(1234));
    const total = episodeLength(episode, lead);

    test('episodeLength covers the rest, both leads and every arc', () => {
        expect(total).toBeCloseTo(episode.rest + 2 * lead + episode.span);
    });

    test('rests unrotated with no ink', () => {
        const beat = episodeBeat(episode, 0, lead);

        expect(beat.angle).toBe(0);
        expect(beat.ink).toBe(0);
        expect(beat.phase).toBe(episode.arcs[0].phase);
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

    test('every arc starts and ends flat, so the fan direction can change unseen', () => {
        for (const plan of plans(60)) {
            const marks = arcStarts(plan, lead);

            plan.arcs.forEach((arc, i) => {
                const opens = episodeBeat(plan, marks[i], lead).angle;
                const closes = episodeBeat(plan, marks[i] + arcLength(arc) - arc.back.hold * 0.01, lead).angle;

                expect(opens / HALF).toBeCloseTo(Math.round(opens / HALF), 6);
                expect(closes / HALF).toBeCloseTo(Math.round(closes / HALF), 6);
            });
        }
    });

    test('opens each arc on its planned fan, then drifts it onward', () => {
        for (const plan of plans(30)) {
            const marks = arcStarts(plan, lead);

            plan.arcs.forEach((arc, i) => {
                expect(episodeBeat(plan, marks[i] + 1e-4, lead).fan).toBeCloseTo(arc.fan, 3);

                let previous = -Infinity;
                for (let s = 1; s < 20; s++) {
                    const {fan} = episodeBeat(plan, marks[i] + (s / 20) * arcLength(arc), lead);

                    expect(fan).toBeGreaterThan(previous);
                    previous = fan;
                }
            });
        }
    });

    test('keeps the fanned hold moving so it never reads as frozen', () => {
        for (const plan of plans(30)) {
            const marks = arcStarts(plan, lead);

            plan.arcs.forEach((arc, i) => {
                const landed = marks[i] + arc.out.strike;
                const at = (time: number) => {
                    const beat = episodeBeat(plan, time, lead);
                    return unfold(beat.angle, {...UNFOLD_DEFAULTS, fan: beat.fan}).base;
                };

                const a = at(landed);
                const b = at(landed + arc.out.hold * 0.99);
                const moved = Math.max(...a.map((p, k) => Math.hypot(p[0] - b[k][0], p[1] - b[k][1])));

                expect(moved).toBeGreaterThan(0.05);
                expect(moved).toBeLessThan(2);
            });
        }
    });

    test('parks at the fanned pose for the length of the hold', () => {
        for (const plan of plans(60)) {
            const marks = arcStarts(plan, lead);

            plan.arcs.forEach((arc, i) => {
                const landed = marks[i] + arc.out.strike;
                const held = episodeBeat(plan, landed, lead).angle;

                expect(episodeBeat(plan, landed + arc.out.hold * 0.99, lead).angle).toBeCloseTo(held, 6);
                expect(Math.abs(Math.sin(held))).toBeGreaterThan(0.85);
            });
        }
    });

    test('returns to centre before the ink retreats', () => {
        for (const plan of plans(60)) {
            const {angle, fan} = episodeBeat(plan, episodeLength(plan, lead) - lead, lead);
            const rest = unfold(0).base;

            expect(angle / HALF).toBeCloseTo(Math.round(angle / HALF), 6);
            unfold(angle, {...UNFOLD_DEFAULTS, fan}).base.forEach((p, i) => {
                expect(p[0]).toBeCloseTo(rest[i][0], 6);
                expect(p[1]).toBeCloseTo(rest[i][1], 6);
            });
        }
    });

    test('spends most of the run holding a pose rather than moving', () => {
        for (const plan of plans(200)) {
            const moving = plan.arcs.reduce((s, a) => s + a.out.strike + a.back.strike, 0);

            expect(moving / plan.span).toBeLessThan(0.5);
        }
    });

    test('always reports a reach drawn from the plan', () => {
        const reaches = episode.arcs.map((a) => a.reach);

        for (let i = 0; i <= 500; i++) {
            expect(reaches).toContain(episodeBeat(episode, (i / 500) * total, lead).reach);
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

describe('fan direction', () => {
    test('changes the splay without changing how far the mark opens', () => {
        const spread = (fan: number) => {
            const pts = unfold(Math.PI / 2, {...UNFOLD_DEFAULTS, fan}).base;
            const rest = unfold(0).base;
            return Math.sqrt(pts.reduce((s, p, i) => s + (p[0] - rest[i][0]) ** 2 + (p[1] - rest[i][1]) ** 2, 0));
        };
        const reference = spread(0);

        for (let i = 0; i < 24; i++) expect(spread((i / 24) * Math.PI * 2)).toBeCloseTo(reference, 6);
    });

    test('is invisible wherever the mark lies flat, so it can be re-rolled there', () => {
        const rest = unfold(0).base;

        for (const turn of [-2, -1, 0, 1, 2]) {
            for (let i = 0; i < 12; i++) {
                unfold(turn * Math.PI, {...UNFOLD_DEFAULTS, fan: (i / 12) * Math.PI * 2}).base.forEach((p, k) => {
                    expect(p[0]).toBeCloseTo(rest[k][0], 9);
                    expect(p[1]).toBeCloseTo(rest[k][1], 9);
                });
            }
        }
    });

    test('holds every edge on the four lattice axes at any fan', () => {
        const offAxis = (pts: [number, number][]) => {
            let worst = 0;
            for (let i = 0; i < pts.length; i++) {
                const a = pts[i];
                const b = pts[(i + 1) % pts.length];
                const dx = b[0] - a[0];
                const dy = b[1] - a[1];
                if (Math.hypot(dx, dy) < 1e-6) continue;
                const deg = ((((Math.atan2(dy, dx) * 180) / Math.PI) % 180) + 180) % 180;
                worst = Math.max(worst, Math.min(...[30, 60, 120, 150, 210].map((axis) => Math.abs(deg - axis))));
            }
            return worst;
        };

        let worst = 0;
        for (let f = 0; f < 12; f++) {
            for (let i = -24; i <= 24; i++) {
                const fan = (f / 12) * Math.PI * 2;
                worst = Math.max(worst, offAxis(unfold((i / 12) * Math.PI, {...UNFOLD_DEFAULTS, fan}).base));
            }
        }

        expect(worst).toBeLessThan(6);
    });
});

describe('ladderPath', () => {
    test('draws one rung per outline vertex', () => {
        const rungs = ladderPath(unfold(1)).match(/M/g);

        expect(rungs).toHaveLength(OUTLINE_POINTS);
    });
});
