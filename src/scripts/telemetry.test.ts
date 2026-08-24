import {describe, expect, test} from 'bun:test';
import {planRoll, ROLL_DEFAULTS, rollAt} from './telemetry';

const COUNT = '01 / 05';

describe('planRoll', () => {
    test('settles the digits left to right', () => {
        const roll = planRoll(COUNT);

        expect(roll.settles).toEqual([
            ROLL_DEFAULTS.settle,
            ROLL_DEFAULTS.settle + ROLL_DEFAULTS.stagger,
            -1,
            -1,
            -1,
            ROLL_DEFAULTS.settle + 2 * ROLL_DEFAULTS.stagger,
            ROLL_DEFAULTS.settle + 3 * ROLL_DEFAULTS.stagger
        ]);
    });

    test('runs until the last digit lands', () => {
        expect(planRoll(COUNT).length).toBe(ROLL_DEFAULTS.settle + 3 * ROLL_DEFAULTS.stagger);
    });

    test('has nothing to do without digits', () => {
        expect(planRoll('Status / Active').length).toBe(0);
    });
});

describe('rollAt', () => {
    const roll = planRoll(COUNT);

    test('never changes the length of the label', () => {
        for (let time = 0; time <= roll.length + 50; time += 7) {
            expect(rollAt(roll, time)).toHaveLength(COUNT.length);
        }
    });

    test('leaves everything that is not a digit alone', () => {
        for (let time = 0; time <= roll.length; time += 7) {
            const shown = rollAt(roll, time);

            for (let i = 0; i < COUNT.length; i++) {
                if (roll.settles[i] < 0) expect(shown[i]).toBe(COUNT[i]);
            }
        }
    });

    test('shows only digits where digits belong', () => {
        for (let time = 0; time <= roll.length; time += 7) {
            const shown = rollAt(roll, time);

            for (let i = 0; i < COUNT.length; i++) {
                if (roll.settles[i] >= 0) expect(shown[i]).toMatch(/[0-9]/);
            }
        }
    });

    test('lands on the real reading and stays there', () => {
        expect(rollAt(roll, roll.length)).toBe(COUNT);
        expect(rollAt(roll, roll.length + 1000)).toBe(COUNT);
    });

    test('each digit is settled once its own time has passed', () => {
        for (let time = 0; time <= roll.length; time += 3) {
            const shown = rollAt(roll, time);

            for (let i = 0; i < COUNT.length; i++) {
                if (roll.settles[i] >= 0 && time >= roll.settles[i]) expect(shown[i]).toBe(COUNT[i]);
            }
        }
    });

    test('actually moves while it is rolling', () => {
        const seen = new Set<string>();
        for (let time = 0; time < roll.settles[0]; time += 5) seen.add(rollAt(roll, time));

        expect(seen.size).toBeGreaterThan(1);
    });

    test('is a pure function of the time', () => {
        for (let time = 0; time <= roll.length; time += 11) {
            expect(rollAt(roll, time)).toBe(rollAt(roll, time));
        }
    });
});
