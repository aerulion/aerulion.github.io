import {describe, expect, test} from 'bun:test';
import {boundsOf, distToSegment2, hash, type Point, pointInPolygon} from './geometry';
import {LOGO_HULL} from './logo-shape';

const SQUARE: Point[] = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
];

describe('hash', () => {
    test('is deterministic for the same cell', () => {
        expect(hash(3, 7)).toBe(hash(3, 7));
    });

    test('stays inside the unit interval', () => {
        for (let i = 0; i < 500; i++) {
            const value = hash(i * 1.7, -i * 0.3);
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    test('separates neighbouring cells', () => {
        expect(hash(1, 1)).not.toBe(hash(1, 2));
        expect(hash(1, 1)).not.toBe(hash(2, 1));
    });
});

describe('boundsOf', () => {
    test('wraps every point', () => {
        expect(
            boundsOf([
                [2, -4],
                [-6, 3],
                [5, 9]
            ])
        ).toEqual([-6, -4, 5, 9]);
    });

    test('collapses to a point for a single vertex', () => {
        expect(boundsOf([[4, 4]])).toEqual([4, 4, 4, 4]);
    });
});

describe('distToSegment2', () => {
    test('is zero on the segment', () => {
        expect(distToSegment2(5, 0, 0, 0, 10, 0)).toBe(0);
    });

    test('measures the squared perpendicular drop', () => {
        expect(distToSegment2(5, 3, 0, 0, 10, 0)).toBeCloseTo(9);
    });

    test('clamps past either end point', () => {
        expect(distToSegment2(-4, 0, 0, 0, 10, 0)).toBeCloseTo(16);
        expect(distToSegment2(14, 0, 0, 0, 10, 0)).toBeCloseTo(16);
    });

    test('falls back to the start of a zero-length segment', () => {
        expect(distToSegment2(3, 4, 0, 0, 0, 0)).toBeCloseTo(25);
    });
});

describe('pointInPolygon', () => {
    test('accepts an interior point', () => {
        expect(pointInPolygon(5, 5, SQUARE)).toBe(true);
    });

    test('rejects points beyond every edge', () => {
        expect(pointInPolygon(-1, 5, SQUARE)).toBe(false);
        expect(pointInPolygon(11, 5, SQUARE)).toBe(false);
        expect(pointInPolygon(5, -1, SQUARE)).toBe(false);
        expect(pointInPolygon(5, 11, SQUARE)).toBe(false);
    });

    test('follows the logo hull rather than its bounding box', () => {
        expect(pointInPolygon(0.5, 0.5, LOGO_HULL)).toBe(true);
        expect(pointInPolygon(0.05, 0.05, LOGO_HULL)).toBe(false);
        expect(pointInPolygon(0.95, 0.95, LOGO_HULL)).toBe(false);
    });
});
