import {defineConfig, fontProviders} from 'astro/config';

const fonts = [
    {name: 'Space Grotesk', cssVariable: '--font-family', weights: [400, 500, 700]},
    {name: 'Chakra Petch', cssVariable: '--font-family-display', weights: [500, 600, 700]},
    {name: 'Tektur', cssVariable: '--font-family-accent', weights: [600, 700]},
    {name: 'IBM Plex Mono', cssVariable: '--font-family-mono', weights: [400, 500]}
];

const FALLBACKS = {
    '--font-family-mono': ['ui-monospace', 'monospace']
};

export default defineConfig({
    site: 'https://aerulion.net',
    base: '/',
    prefetch: {prefetchAll: true, defaultStrategy: 'hover'},
    fonts: fonts.map((font) => ({
        ...font,
        provider: fontProviders.fontsource(),
        fallbacks: FALLBACKS[font.cssVariable] ?? ['system-ui', 'sans-serif']
    }))
});
