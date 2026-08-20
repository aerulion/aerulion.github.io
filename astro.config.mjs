import {defineConfig, fontProviders} from 'astro/config';

// All four faces are angular: the mark and the panel bevels are built
// from 30/60 cuts, and the type follows.
export default defineConfig({
    site: 'https://aerulion.net', base: '/', fonts: [{
        name: 'Space Grotesk',
        cssVariable: '--font-family',
        provider: fontProviders.fontsource(),
        weights: [400, 500, 700],
        fallbacks: ['system-ui', 'sans-serif'],
    }, {
        name: 'Chakra Petch',
        cssVariable: '--font-family-display',
        provider: fontProviders.fontsource(),
        weights: [500, 600, 700],
        fallbacks: ['system-ui', 'sans-serif'],
    }, {
        name: 'Tektur',
        cssVariable: '--font-family-accent',
        provider: fontProviders.fontsource(),
        weights: [600, 700],
        fallbacks: ['system-ui', 'sans-serif'],
    }, {
        name: 'IBM Plex Mono',
        cssVariable: '--font-family-mono',
        provider: fontProviders.fontsource(),
        weights: [400, 500],
        fallbacks: ['ui-monospace', 'monospace'],
    }]
});
