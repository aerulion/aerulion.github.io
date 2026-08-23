import {expect, test} from 'bun:test';
import {uid} from './uid';

test('numbers ids sequentially within a prefix', () => {
    expect(uid('alpha')).toBe('alpha-1');
    expect(uid('alpha')).toBe('alpha-2');
    expect(uid('alpha')).toBe('alpha-3');
});

test('counts each prefix independently', () => {
    expect(uid('beta')).toBe('beta-1');
    expect(uid('gamma')).toBe('gamma-1');
    expect(uid('beta')).toBe('beta-2');
});

test('never repeats an id for the same prefix', () => {
    const ids = new Set(Array.from({length: 50}, () => uid('delta')));
    expect(ids.size).toBe(50);
});
