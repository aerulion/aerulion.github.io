import {describe, expect, test} from 'bun:test';
import {age, BIRTH_DATE, calculateAge, getCurrentYear} from './dates';

const on = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe('calculateAge', () => {
    test('ticks over on the birthday itself', () => {
        expect(calculateAge(on(2000, 6, 15), on(2026, 6, 15))).toBe(26);
    });

    test('has not ticked over the day before', () => {
        expect(calculateAge(on(2000, 6, 15), on(2026, 6, 14))).toBe(25);
    });

    test('counts the extra year the day after', () => {
        expect(calculateAge(on(2000, 6, 15), on(2026, 6, 16))).toBe(26);
    });

    test('does not tick early across a year boundary', () => {
        expect(calculateAge(on(2000, 12, 31), on(2026, 1, 1))).toBe(25);
    });

    test('holds a 29 February birthday back until March in a non-leap year', () => {
        expect(calculateAge(on(2000, 2, 29), on(2025, 2, 28))).toBe(24);
        expect(calculateAge(on(2000, 2, 29), on(2025, 3, 1))).toBe(25);
    });

    test('is zero on the day of birth', () => {
        expect(calculateAge(on(2026, 3, 1), on(2026, 3, 1))).toBe(0);
    });
});

describe('build-time exports', () => {
    test('age is derived from the birth date', () => {
        expect(age).toBe(calculateAge(BIRTH_DATE));
    });

    test('age is a plausible number of years', () => {
        expect(age).toBeGreaterThan(20);
        expect(age).toBeLessThan(80);
    });

    test('getCurrentYear reports the calendar year', () => {
        expect(getCurrentYear()).toBe(new Date().getFullYear());
    });
});
