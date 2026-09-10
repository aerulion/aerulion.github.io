import {describe, expect, test} from 'bun:test';
import {lastCommitDate, PAGE_SOURCES, sourcesFor} from './lastmod';

describe('sourcesFor', () => {
    test('maps a sitemap url to the sources behind it', () => {
        expect(sourcesFor('https://aerulion.net/')).toEqual(PAGE_SOURCES['/']);
        expect(sourcesFor('https://aerulion.net/design/')).toEqual(PAGE_SOURCES['/design/']);
    });

    test('ignores origin, query and hash', () => {
        expect(sourcesFor('http://localhost:4321/design/?a=1#b')).toEqual(PAGE_SOURCES['/design/']);
    });

    test('returns undefined for a page nothing claims', () => {
        expect(sourcesFor('https://aerulion.net/nowhere/')).toBeUndefined();
    });

    test('every page carries its own source and the shared shell', () => {
        for (const [pathname, sources] of Object.entries(PAGE_SOURCES)) {
            const page = pathname === '/' ? 'src/pages/index.astro' : `src/pages${pathname.slice(0, -1)}.astro`;
            expect(sources).toContain(page);
            expect(sources).toContain('src/layouts');
        }
    });
});

describe('lastCommitDate', () => {
    test('returns an ISO 8601 date for a tracked path', () => {
        const date = lastCommitDate(['src/layouts']);
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
        expect(Number.isNaN(Date.parse(date ?? ''))).toBe(false);
    });

    test('returns undefined for a path with no history', () => {
        expect(lastCommitDate(['src/does-not-exist'])).toBeUndefined();
    });
});
