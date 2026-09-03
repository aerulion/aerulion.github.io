import {expect, test} from 'bun:test';
import {collide, frameSegments, parseViewBox, pathSegments, percentSegments, ringPath} from './figure-collide';
import {SILHOUETTE, VIEW} from './mark-geometry';

test('parses a viewBox with spaces or commas', () => {
    expect(parseViewBox('0 0 200 118')).toEqual([0, 0, 200, 118]);
    expect(parseViewBox('-2,-2,52,52')).toEqual([-2, -2, 52, 52]);
});

test('rejects a malformed viewBox', () => {
    expect(() => parseViewBox('0 0 200')).toThrow();
});

test('walks absolute line commands', () => {
    expect(pathSegments('M10 20L30 40')).toEqual([[10, 20, 30, 40]]);
    expect(pathSegments('M0 0H10V10')).toEqual([
        [0, 0, 10, 0],
        [10, 0, 10, 10]
    ]);
});

test('walks relative line commands', () => {
    expect(pathSegments('m10 20l10 10')).toEqual([[10, 20, 20, 30]]);
    expect(pathSegments('M0 0h10v10h-10')).toEqual([
        [0, 0, 10, 0],
        [10, 0, 10, 10],
        [10, 10, 0, 10]
    ]);
});

test('closes a subpath back to its start', () => {
    expect(pathSegments('M0 0H10V10Z')).toEqual([
        [0, 0, 10, 0],
        [10, 0, 10, 10],
        [10, 10, 0, 0]
    ]);
});

test('repeats an implicit command for trailing coordinate pairs', () => {
    expect(pathSegments('M0 0 10 0 10 10')).toEqual([
        [0, 0, 10, 0],
        [10, 0, 10, 10]
    ]);
});

test('drops zero-length steps', () => {
    expect(pathSegments('M5 5L5 5H5')).toEqual([]);
});

test('starts a new subpath without joining the previous one', () => {
    expect(pathSegments('M0 0H10M20 20H30')).toEqual([
        [0, 0, 10, 0],
        [20, 20, 30, 20]
    ]);
});

test('rejects a curve it cannot honestly flatten', () => {
    expect(() => pathSegments('M0 0C1 1 2 2 3 3')).toThrow();
});

test('maps user units onto percentages of the viewBox', () => {
    expect(percentSegments(['M0 0H200'], '0 0 200 118')).toEqual([[0, 0, 100, 0]]);
    expect(percentSegments(['M0 0V118'], '0 0 200 118')).toEqual([[0, 0, 0, 100]]);
});

test('accounts for a viewBox origin that is not zero', () => {
    expect(percentSegments(['M-2 -2H50'], '-2 -2 52 52')).toEqual([[0, 0, 100, 0]]);
});

test('scales about the centre of the viewBox', () => {
    expect(percentSegments(['M0 0H100'], '0 0 100 100', 0.5)).toEqual([[25, 25, 75, 25]]);
});

test('a scale of one leaves the mapping untouched', () => {
    expect(percentSegments([SILHOUETTE], `0 0 ${VIEW} ${VIEW}`, 1)).toEqual(
        percentSegments([SILHOUETTE], `0 0 ${VIEW} ${VIEW}`)
    );
});

test('the mark stays inside its own viewBox', () => {
    for (const [x0, y0, x1, y1] of percentSegments([SILHOUETTE], `0 0 ${VIEW} ${VIEW}`)) {
        for (const n of [x0, y0, x1, y1]) {
            expect(n).toBeGreaterThanOrEqual(0);
            expect(n).toBeLessThanOrEqual(100);
        }
    }
});

test('serialises to the JSON the lattice reads back', () => {
    expect(collide('0 0 200 118', ['M0 0H200'])).toBe('[[0,0,100,0]]');
});

test('rules a label across, as percentages of the figure around it', () => {
    const host = {left: 100, top: 200, width: 400, height: 200};
    expect(frameSegments(host, {left: 200, top: 250, width: 100, height: 50}, 25)).toEqual([
        [25, 25, 50, 25],
        [25, 37.5, 50, 37.5],
        [25, 50, 50, 50]
    ]);
});

test('a short label still gets both of its edges', () => {
    const host = {left: 0, top: 0, width: 200, height: 100};
    expect(frameSegments(host, {left: 0, top: 0, width: 200, height: 4}, 12)).toEqual([
        [0, 0, 100, 0],
        [0, 4, 100, 4]
    ]);
});

test('fills a tall label densely enough that no rule is more than a pitch from the next', () => {
    const host = {left: 0, top: 0, width: 400, height: 400};
    const rules = frameSegments(host, {left: 0, top: 0, width: 320, height: 55}, 12);
    expect(rules.length).toBeGreaterThan(4);
    for (let i = 1; i < rules.length; i++) {
        expect(((rules[i][1] - rules[i - 1][1]) / 100) * host.height).toBeLessThanOrEqual(12);
    }
    expect(((rules[rules.length - 1][1] - rules[0][1]) / 100) * host.height).toBeCloseTo(55, 3);
});

test('skips a label or a figure that has not been laid out', () => {
    const host = {left: 0, top: 0, width: 200, height: 100};
    expect(frameSegments(host, {left: 0, top: 0, width: 0, height: 20})).toEqual([]);
    expect(frameSegments({left: 0, top: 0, width: 0, height: 0}, host)).toEqual([]);
});

test('a ring closes on twelve edges, each touching the circle it stands for', () => {
    const segments = pathSegments(ringPath(0, 0, 10));
    expect(segments).toHaveLength(12);
    for (const [x0, y0, x1, y1] of segments) {
        expect(Math.hypot((x0 + x1) / 2, (y0 + y1) / 2)).toBeCloseTo(10, 3);
    }
});

test('every ring edge sits on a lattice direction', () => {
    for (const [x0, y0, x1, y1] of pathSegments(ringPath(5, 5, 8))) {
        const deg = ((((Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI) % 180) + 180) % 180;
        const off = Math.min(...[0, 30, 60, 90, 120, 150, 180].map((axis) => Math.abs(deg - axis)));
        expect(off).toBeLessThan(0.001);
    }
});
