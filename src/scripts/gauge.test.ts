import {describe, expect, test} from 'bun:test';
import {progressAt, type Station, stationAt} from './gauge';

const STATIONS: Station[] = [
    {top: 0, label: '00 / 05'},
    {top: 900, label: '01 / 05'},
    {top: 1800, label: '02 / 05'},
    {top: 2700, label: '03 / 05'}
];

const VIEWPORT = 800;

describe('progressAt', () => {
    test('reads nought at the top and one at the bottom', () => {
        expect(progressAt(0, VIEWPORT, 3000)).toBe(0);
        expect(progressAt(2200, VIEWPORT, 3000)).toBe(1);
    });

    test('tracks the scroll in between', () => {
        expect(progressAt(1100, VIEWPORT, 3000)).toBeCloseTo(0.5);
    });

    test('stays inside its bounds however far the scroll overshoots', () => {
        for (const scrollY of [-500, -1, 0, 1500, 2200, 9000]) {
            const p = progressAt(scrollY, VIEWPORT, 3000);

            expect(p).toBeGreaterThanOrEqual(0);
            expect(p).toBeLessThanOrEqual(1);
        }
    });

    test('reads nought when the page does not scroll at all', () => {
        expect(progressAt(0, VIEWPORT, VIEWPORT)).toBe(0);
        expect(progressAt(0, VIEWPORT, 200)).toBe(0);
    });

    test('never goes backwards as the scroll advances', () => {
        let previous = -1;
        for (let scrollY = 0; scrollY <= 2400; scrollY += 25) {
            const p = progressAt(scrollY, VIEWPORT, 3000);

            expect(p).toBeGreaterThanOrEqual(previous);
            previous = p;
        }
    });
});

describe('stationAt', () => {
    test('holds the first station until the next one crosses the sight line', () => {
        expect(stationAt(STATIONS, 0, VIEWPORT)?.label).toBe('00 / 05');
        expect(stationAt(STATIONS, 500, VIEWPORT)?.label).toBe('00 / 05');
    });

    test('advances once a station has passed the sight line', () => {
        expect(stationAt(STATIONS, 700, VIEWPORT)?.label).toBe('01 / 05');
        expect(stationAt(STATIONS, 1600, VIEWPORT)?.label).toBe('02 / 05');
    });

    test('stays on the last station at the foot of the page', () => {
        expect(stationAt(STATIONS, 99000, VIEWPORT)?.label).toBe('03 / 05');
    });

    test('only ever moves forward as the scroll advances', () => {
        let previous = -1;
        for (let scrollY = 0; scrollY <= 4000; scrollY += 20) {
            const index = STATIONS.indexOf(stationAt(STATIONS, scrollY, VIEWPORT)!);

            expect(index).toBeGreaterThanOrEqual(previous);
            previous = index;
        }
    });

    test('reports every station somewhere along the page', () => {
        const seen = new Set<string>();
        for (let scrollY = 0; scrollY <= 4000; scrollY += 20) seen.add(stationAt(STATIONS, scrollY, VIEWPORT)!.label);

        expect(seen.size).toBe(STATIONS.length);
    });

    test('copes with nothing to track', () => {
        expect(stationAt([], 0, VIEWPORT)).toBeNull();
    });
});
