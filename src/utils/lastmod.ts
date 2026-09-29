import {execFileSync} from 'node:child_process';

/**
 * Build-time only. Resolves each sitemap entry's `lastmod` from git history
 * rather than the clock, so a deploy that changed nothing — the 1 January and
 * 12 May cron runs, a dependency bump — does not claim every page is fresh.
 *
 * Never import this from a component; it reaches for `node:child_process`.
 */

/** A change to the shared shell re-renders every page, so it counts for all of them. */
const SHELL = ['src/layouts', 'src/components', 'src/styles', 'src/scripts'];

/** Pathname as the sitemap emits it, mapped to the sources that decide its content. */
export const PAGE_SOURCES: Record<string, string[]> = {
    '/': [...SHELL, 'src/pages/index.astro', 'src/data'],
    '/design/': [...SHELL, 'src/pages/design.astro', 'src/data/design.ts'],
    '/taerra/': [...SHELL, 'src/pages/taerra.astro', 'src/data/taerra.ts']
};

/** The sources behind `url`, or `undefined` for a page nothing has claimed. */
export const sourcesFor = (url: string): string[] | undefined => {
    const {pathname} = new URL(url);
    return PAGE_SOURCES[pathname];
};

/** A shallow clone only knows the tip commit, which would date every page alike. */
const isShallow = (): boolean =>
    execFileSync('git', ['rev-parse', '--is-shallow-repository'], {encoding: 'utf8'}).trim() === 'true';

/** ISO 8601 date of the last commit touching any of `paths`, or `undefined`. */
export const lastCommitDate = (paths: string[]): string | undefined => {
    const stdout = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...paths], {encoding: 'utf8'}).trim();
    return stdout || undefined;
};

/**
 * Returns a `lastmod` resolver, or `undefined` when git cannot answer — no
 * repository, or a shallow clone. Omitting the field beats publishing a date
 * we know to be wrong.
 */
export const lastmodResolver = (): ((url: string) => string | undefined) | undefined => {
    try {
        if (isShallow()) {
            console.warn('[sitemap] shallow clone: omitting lastmod. Set fetch-depth: 0 on checkout.');
            return undefined;
        }
    } catch {
        console.warn('[sitemap] no git repository: omitting lastmod.');
        return undefined;
    }

    return (url) => {
        const sources = sourcesFor(url);
        if (!sources) return undefined;
        try {
            return lastCommitDate(sources);
        } catch {
            return undefined;
        }
    };
};
