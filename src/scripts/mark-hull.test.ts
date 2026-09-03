import {describe, expect, test} from 'bun:test';
import {MARK_HULL, markReach} from './mark-hull';

const TAU = Math.PI * 2;
const sample = (steps: number) => Array.from({length: steps}, (_, i) => markReach((i / steps) * TAU));

describe('markReach', () => {
    test('is normalised so the widest direction reaches exactly 1', () => {
        expect(Math.max(...sample(2048))).toBeCloseTo(1, 5);
    });

    test('stays above zero and never overshoots 1', () => {
        for (const reach of sample(2048)) {
            expect(reach).toBeGreaterThan(0);
            expect(reach).toBeLessThanOrEqual(1);
        }
    });

    test('wraps around a full turn', () => {
        for (const angle of [0, 0.7, 2.1, 4.9]) {
            expect(markReach(angle)).toBeCloseTo(markReach(angle + TAU), 4);
        }
    });

    test('accepts negative angles', () => {
        expect(markReach(-1)).toBeCloseTo(markReach(TAU - 1), 4);
    });

    test('reaches further along the tall axis than across the waist', () => {
        expect(markReach(-Math.PI / 2)).toBeGreaterThan(markReach(0));
    });
});

describe('MARK_HULL', () => {
    test('is a quad inside the unit square', () => {
        expect(MARK_HULL).toHaveLength(4);
        for (const [x, y] of MARK_HULL) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(1);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThanOrEqual(1);
        }
    });
});
