import {describe, expect, test} from 'bun:test';
import {LOGO_HULL, logoReach} from './logo-shape';

const TAU = Math.PI * 2;
const sample = (steps: number) => Array.from({length: steps}, (_, i) => logoReach((i / steps) * TAU));

describe('logoReach', () => {
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
            expect(logoReach(angle)).toBeCloseTo(logoReach(angle + TAU), 4);
        }
    });

    test('accepts negative angles', () => {
        expect(logoReach(-1)).toBeCloseTo(logoReach(TAU - 1), 4);
    });

    test('reaches further along the tall axis than across the waist', () => {
        expect(logoReach(-Math.PI / 2)).toBeGreaterThan(logoReach(0));
    });
});

describe('LOGO_HULL', () => {
    test('is a quad inside the unit square', () => {
        expect(LOGO_HULL).toHaveLength(4);
        for (const [x, y] of LOGO_HULL) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(1);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThanOrEqual(1);
        }
    });
});
