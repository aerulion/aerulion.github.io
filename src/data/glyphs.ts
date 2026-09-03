export const GLYPH_BOX = 48;
export const GLYPH_CELL = 4;

export const glyphs = {
    east: ['M4 24H44', 'M44 24 32 17.0718', 'M44 24 32 30.9282'],
    west: ['M4 24H44', 'M4 24 16 17.0718', 'M4 24 16 30.9282'],
    descend: ['M4 10.1436 40 30.9282', 'M40 30.9282 28 30.9282', 'M40 30.9282 34 20.5359'],
    external: ['M6 34.3923 42 13.6077', 'M42 13.6077 30 13.6077', 'M42 13.6077 36 24', 'M6 41.3205H22'],
    copy: ['M16 10.1436H36L28 24H8Z', 'M24 17.0718H44L36 30.9282H16Z'],
    check: ['M14 20.5359 22 34.3923 38 6.6795'],
    node: ['M4 24H44', 'M14 6.6795 34 41.3205', 'M34 6.6795 14 41.3205']
} as const;

export type GlyphName = keyof typeof glyphs;
