import {defineConfig, fontProviders} from 'astro/config';

export default defineConfig({
    site: 'https://aerulion.net', base: '/', fonts: [{
        name: 'Inter', cssVariable: '--font-family', provider: fontProviders.fontsource(),
    }, {
        name: 'Inter Tight', cssVariable: '--font-family-display', provider: fontProviders.fontsource(),
    }, {
        name: 'Audiowide', cssVariable: '--font-family-accent', provider: fontProviders.fontsource(),
    }, {
        name: 'IBM Plex Mono', cssVariable: '--font-family-mono', provider: fontProviders.fontsource(),
    }]
});