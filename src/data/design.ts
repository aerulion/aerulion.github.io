import {EDGES} from '../scripts/mark-geometry';

export interface Chapter {
    id: string;
    eyebrow: string;
}

export const chapters: Chapter[] = [
    {id: 'name', eyebrow: 'The name'},
    {id: 'rules', eyebrow: 'The rules'},
    {id: 'ink', eyebrow: 'Ground and ink'},
    {id: 'geometry', eyebrow: 'The parts'},
    {id: 'mark', eyebrow: 'The mark'},
    {id: 'spacing', eyebrow: 'Spacing'},
    {id: 'plate', eyebrow: 'The plate'},
    {id: 'icons', eyebrow: 'Icons'},
    {id: 'type', eyebrow: 'Type'},
    {id: 'motion', eyebrow: 'Motion'},
    {id: 'access', eyebrow: 'Access'},
    {id: 'misuse', eyebrow: 'Misuse'},
    {id: 'applications', eyebrow: 'Applications'}
];

export interface System {
    name: string;
    epithet: string;
    tagline: string;
    night: string[];
}

export const system: System = {
    name: 'Nyx',
    epithet: 'Night, the primordial ground',
    tagline: 'Two inks. Two angles. One mark.',
    night: [
        'Nyx is the Greek night, not dusk, not shadow, and not a mood. She is primordial: the ground that was there before anything was drawn on it, and the thing everything else is drawn out of. That is the exact relationship this system has with its two inks. In Hesiod she arrives near the beginning and most of what follows is her descendant, which is the other half of the fit: everything here is derived from one figure.',
        '#000 is not a dark theme and not a background colour. It is the ground: the untouched surface, the state of every pixel nobody has claimed. #fff is not a colour either. It is the only thing that exists on that ground, and a figure is either drawn or it is not.',
        'That is also why there are no greys. A grey is a half-drawn figure, a thing caught between existing and not, and this system has no vocabulary for that. Where a field needs to recede it thins until it is gone, so the ink stays absolute and the night stays absolute, and the whole hierarchy is built out of how much of the ground is still showing.'
    ]
};

export interface Asset {
    name: string;
    subject: string;
    note: string;
}

export const nomenclature: Asset[] = [
    {
        name: 'Nyx Mark',
        subject: 'The logo',
        note: 'The triangle, the tail and the bolt cut. Drawn, inked, or mid-unfold: three states of one figure, never three figures.'
    },
    {
        name: 'Nyx Rule',
        subject: 'The hairline',
        note: 'One weight at 1px, doing the work a box, a card or a background would do elsewhere.'
    },
    {
        name: 'Nyx Cut',
        subject: 'The 30° bevel',
        note: 'Taken off a panel top-left and bottom-right, with the drop always the run times tan 30°.'
    },
    {
        name: 'Nyx Lattice',
        subject: 'The 60° field',
        note: 'The triangular grid that reads the live page, bends around what it finds, and thins rather than fades.'
    },
    {
        name: 'Nyx Plate',
        subject: 'The crop',
        note: 'Four rules pinned inside the viewport with an opaque margin behind them, so the page reads as a printed plate.'
    },
    {
        name: 'Nyx Gauge',
        subject: 'The readout',
        note: 'The tick riding the right rule with the current station beside it, reporting position as an instrument would.'
    },
    {
        name: 'Nyx Curtain',
        subject: 'The transition',
        note: 'The ground closing over a route and lifting again on a 30° edge, so a page is never seen arriving. It doubles as the intro on the first visit of a session.'
    },
    {
        name: 'Nyx Glyph',
        subject: 'The icon',
        note: 'A figure drawn on the lattice at hairline weight, in the same five directions the mark uses and never in any other.'
    },
    {
        name: 'Nyx Scale',
        subject: 'The ramp',
        note: 'Two interleaved octaves of spacing, and the module of clear space that every lockup is measured with.'
    }
];

export interface Law {
    index: string;
    name: string;
    rule: string;
}

export const laws: Law[] = [
    {
        index: 'I',
        name: 'Two inks',
        rule: 'Exactly #000 and #fff. No greys, no tints, no alpha on text. Hierarchy comes from size, position and density, never from dimming.'
    },
    {
        index: 'II',
        name: 'Thirty / sixty',
        rule: 'Both angles are taken from the mark. Panels bevel at 30°, the lattice is a 60° triangular grid, and there is no third angle anywhere in the system.'
    },
    {
        index: 'III',
        name: 'No spin',
        rule: 'An in-plane rotation is off-grid for all but six frames of its cycle, so nothing here sweeps through one. Where a figure has to change orientation it snaps between on-axis positions, or it turns in four dimensions and is projected back.'
    },
    {
        index: 'IV',
        name: 'Hairline law',
        rule: 'A 1px rule does the work a box, a card or a background would do elsewhere. Fills belong to the mark, to a primary button, and to the inverted state of a control under hover, focus or selection. Nothing else gets a surface.'
    },
    {
        index: 'V',
        name: 'Instrumentation',
        rule: 'Small uppercase mono readouts frame each block, the way a print registration mark or a telemetry panel would. A readout always names something true.'
    },
    {
        index: 'VI',
        name: 'Density, not dimming',
        rule: 'Where a field recedes it thins. The lattice dithers vertices and segments in and out so it never renders a grey pixel. That is law I restated for anything generative.'
    }
];

export interface Part {
    name: string;
    kind: string;
    note: string;
}

export const parts: Part[] = [
    {
        name: 'The cut',
        kind: '30°',
        note: 'The bevel taken off a panel, top-left and bottom-right. The vertical drop is always the horizontal run times tan 30°, so the angle can never drift.'
    },
    {
        name: 'The lattice',
        kind: '60°',
        note: 'A triangular grid on a 40px cell that reads the live page and bends around whatever it finds. It runs everywhere and is only drawn where someone is looking.'
    },
    {
        name: 'The four axes',
        kind: '30 / 60 / 120 / 150',
        note: 'Every edge of the mark classifies onto one of these. They are the only directions any line in the system is allowed to take.'
    },
    {
        name: 'The hairline',
        kind: '1px',
        note: 'Rules, borders, crop marks, the gauge tick. One weight, never thickened for emphasis. A heavier line is a different idea, not a louder one.'
    }
];

export interface Step {
    index: string;
    name: string;
    rule: string;
}

export const construction: Step[] = [
    {
        index: '01',
        name: 'The triangle',
        rule: 'Start with an equilateral triangle, apex up, side S. Its base angles are already 60°, so the first two edges of the mark are on-axis before anything else is decided.'
    },
    {
        index: '02',
        name: 'The tail',
        rule: 'Drop one vertex on the centre axis, exactly one third of the triangle’s height below its base. That single choice forces the two lower edges to 30°. The tail angle is not picked, it falls out.'
    },
    {
        index: '03',
        name: 'The frame',
        rule: 'The result is 0.75 triangle and 0.25 tail, so the height is S × 2 ÷ √3 and the box is exactly √3 : 2, width to height. The base line always sits at three quarters of the height.'
    },
    {
        index: '04',
        name: 'The bolt',
        rule: 'A lightning cut is taken through the body, every edge of it running along one of the four boundary edges offset inward by a whole number of bands. The finished outline has no angle, and no width, the triangle did not already imply.'
    }
];

export const bandRules: Part[] = [
    {
        name: 'The band',
        kind: 'w',
        note: 'One width, measured square off an edge. Every filled stroke in the mark is exactly this wide, and so is every cut between them, which is the whole reason the figure reads as one continuous ribbon rather than a drawing of one.'
    },
    {
        name: 'The families',
        kind: '4 × 3',
        note: 'Each of the four boundary edges is offset inward by one, two and three bands. Twelve lines, and the outline is allowed to turn on those and on nothing else. Offset zero is the boundary itself.'
    },
    {
        name: 'The constraint',
        kind: 'X = (3 + 2√3) w',
        note: 'Two corners of the cut sit on the axis of symmetry, at 2w and 4w below the apex, where the lines one and two bands inside the triangle meet. Asking the third line to pass through the lower one leaves a single ratio between the side and the band. It is solved, not chosen.'
    },
    {
        name: 'What follows',
        kind: 'Exact',
        note: 'At a side of 24 every vertex is a whole number plus a whole multiple of √3. The side has to be a multiple of six for that: the apex needs the two, the band needs the three.'
    }
];

export interface Census {
    axis: string;
    count: number;
    role: string;
}

const onAxis = (axis: number): number => EDGES.filter(([edgeAxis]) => edgeAxis === axis).length;

export const census: Census[] = [
    {axis: '30°', count: onAxis(30), role: 'The tail’s lower-left edge, and the bolt’s two shallowest runs'},
    {axis: '60°', count: onAxis(60), role: 'The triangle’s right edge, and three edges of the bolt'},
    {axis: '120°', count: onAxis(120), role: 'The triangle’s left edge, the bolt’s longest inner run, and one return'},
    {
        axis: '150°',
        count: onAxis(150),
        role: 'The tail’s lower-right edge, cut in two by the bolt, and three counter-runs'
    }
];

export interface Metric {
    label: string;
    value: string;
    note: string;
}

export const metrics: Metric[] = [
    {
        label: 'Outline edges',
        value: String(EDGES.length),
        note: 'Every one exactly on an axis, by construction rather than by fitting'
    },
    {label: 'Triangle side', value: 'X = 24', note: 'The one number chosen; every other measure falls out of it'},
    {
        label: 'Band',
        value: 'X (2√3 − 3) / 3',
        note: 'One width for every stroke and every cut; 3.712813 at a side of 24'
    },
    {label: 'Bounding box', value: '√3 : 2', note: 'Width is the triangle side, height is that times 1.1547'},
    {label: 'Perimeter', value: '2(1 + √3) X', note: 'The length the draw traces; 131.1384 at a side of 24'},
    {label: 'Base line', value: '0.75 H', note: 'Where the equilateral triangle closes and the tail begins'},
    {label: 'Tail drop', value: '0.25 H', note: 'One third of the triangle height, which is what makes it 30°'},
    {label: 'Module', value: '0.25 H', note: 'The tail drop, reused as the unit of clear space'},
    {
        label: 'Axis corners',
        value: '2w / 4w',
        note: 'Two corners of the cut sit on the centre line, which is what pins the band'
    }
];

export interface SpacingStep {
    token: string;
    rem: string;
    px: string;
    step: string;
}

export const spacing: SpacingStep[] = [
    {token: '--spacing-3xs', rem: '0.25rem', px: '4', step: '—'},
    {token: '--spacing-2xs', rem: '0.375rem', px: '6', step: '× 1.5'},
    {token: '--spacing-xs', rem: '0.5rem', px: '8', step: '× 1.333'},
    {token: '--spacing-sm', rem: '0.75rem', px: '12', step: '× 1.5'},
    {token: '--spacing-md', rem: '1rem', px: '16', step: '× 1.333'},
    {token: '--spacing-lg', rem: '1.5rem', px: '24', step: '× 1.5'},
    {token: '--spacing-xl', rem: '2rem', px: '32', step: '× 1.333'},
    {token: '--spacing-2xl', rem: '3rem', px: '48', step: '× 1.5'},
    {token: '--spacing-3xl', rem: '4rem', px: '64', step: '× 1.333'},
    {token: '--spacing-4xl', rem: '6rem', px: '96', step: '× 1.5'},
    {token: '--spacing-5xl', rem: '8rem', px: '128', step: '× 1.333'}
];

export interface FlowStep {
    token: string;
    span: string;
    note: string;
}

export const flow: FlowStep[] = [
    {token: '--flow-lg', span: '12 → 24', note: 'A gap inside a row'},
    {token: '--flow-xl', span: '16 → 32', note: 'The plate gutter, and most padding'},
    {token: '--flow-2xl', span: '24 → 48', note: 'Between the cells of a grid'},
    {token: '--flow-3xl', span: '32 → 64', note: 'Between the columns of a section header'},
    {token: '--flow-4xl', span: '48 → 96', note: 'Above the first block on a page'}
];

export interface ClearRule {
    subject: string;
    module: string;
    note: string;
}

export const clearSpace: ClearRule[] = [
    {
        subject: 'The mark alone',
        module: 'M on all four sides',
        note: 'M is one quarter of the mark’s height, the same distance the tail drops below the base, so the rule can be read straight off the figure without a ruler.'
    },
    {
        subject: 'Mark and wordmark',
        module: 'M between, M around',
        note: 'The gap from the mark to the first letter is one module, and the lockup then keeps a full module clear on every side of its combined box.'
    },
    {
        subject: 'The wordmark alone',
        module: 'Half its cap height',
        note: 'Without the mark there is no tail to measure, so the module becomes half the cap height of the setting, the nearest equivalent the letterforms offer.'
    },
    {
        subject: 'Inside a circular crop',
        module: '84% of the radius',
        note: 'An avatar is cropped by the client, not by us. The mark is held inside 84% of the crop radius so the unfold never touches the edge.'
    }
];

export interface TokenRow {
    token: string;
    value: string;
    governs: string;
}

export const tokens: TokenRow[] = [
    {token: '--tan-30', value: '0.5773502692', governs: 'The one constant every bevel is derived from'},
    {token: '--cut-x', value: 'clamp(26px, 2.6vw, 52px)', governs: 'Horizontal run of the cut'},
    {token: '--cut-y', value: '--cut-x × --tan-30', governs: 'Vertical drop of the cut, never set by hand'},
    {token: '--hairline', value: '1px', governs: 'Every rule, border and registration mark'},
    {token: 'CELL / ROW', value: '40px / 40 · sin 60°', governs: 'Lattice pitch'},
    {token: 'RADIUS / PULL', value: '420px / 26px', governs: 'Pointer reach, and how far a vertex may travel'},
    {token: 'BAND', value: '34px', governs: 'Clearance the lattice keeps from anything it finds'}
];

export const plateTokens: TokenRow[] = [
    {token: '--plate-width', value: '1600px', governs: 'The widest the column is allowed to run'},
    {token: '--plate-gutter', value: '--flow-xl', governs: 'Ground held between the crop rules and the column'},
    {
        token: '--plate-inset',
        value: 'clamp(0.5rem, 1vw, 1.15rem)',
        governs: 'How far the plate sits inside the viewport'
    },
    {
        token: '--gauge-inset',
        value: 'clamp(3rem, 7vh, 5rem)',
        governs: 'Where the gauge starts and stops on the right rule'
    }
];

export interface Breakpoint {
    width: string;
    governs: string;
}

export const breakpoints: Breakpoint[] = [
    {width: '1799px', governs: 'The gauge readout folds away; the tick keeps riding the rule'},
    {width: '1100px', governs: 'The hero and the timeline give up their widest arrangement'},
    {width: '900px', governs: 'Two-column blocks become one; the section header stacks'},
    {width: '768px', governs: 'Tracking tightens, the cut shortens, titles take their small clamp'},
    {width: '640px', governs: 'The gauge leaves; four-across becomes two'},
    {width: '560px', governs: 'Prose stops justifying; the last grids collapse'}
];

export const layers: TokenRow[] = [
    {token: '--layer-field', value: '0', governs: 'The lattice, under everything it deflects around'},
    {token: '--layer-page', value: '1', governs: 'The column and the footer'},
    {token: '--layer-raised', value: '2', governs: 'A rail lifted clear of the panel it sits on'},
    {token: '--layer-plate', value: '40', governs: 'The crop rules, the bleed and the gauge'},
    {token: '--layer-entry', value: '60', governs: 'The skip link, which has to clear the plate'},
    {token: '--layer-curtain', value: '90', governs: 'The routing curtain, over all of it'}
];

export const durations: TokenRow[] = [
    {token: '--dur-xs', value: '250ms', governs: 'A control inverting under hover, focus or selection'},
    {token: '--dur-sm', value: '375ms', governs: 'A stroke fading out from under the ink it was tracing'},
    {token: '--dur-md', value: '500ms', governs: 'The curtain covering and lifting; a node arriving'},
    {token: '--dur-lg', value: '750ms', governs: 'A block revealing; a rule drawing itself across'},
    {token: '--dur-xl', value: '1000ms', governs: 'A figure tracing its own outline; the intro hold'}
];

export const typeTokens: TokenRow[] = [
    {token: '--label-size', value: '0.6875rem', governs: 'Every instrumentation label, at every size'},
    {token: '--font-size-xs', value: '0.75rem', governs: 'Code set in a table cell'},
    {token: '--font-size-sm', value: '0.875rem', governs: 'Notes, captions, table bodies'},
    {token: '--font-size-base', value: '1rem', governs: 'Running copy'},
    {token: '--font-size-lg', value: '1.125rem', governs: 'A lede, at the top of its clamp'},
    {token: '--font-size-xl', value: '1.25rem', governs: 'A sub-head in the display face'},
    {token: '--font-size-2xl', value: '1.5rem', governs: 'The standfirst'},
    {token: '--font-size-3xl', value: '2.25rem', governs: 'A statistic; the 2xl taken up one ramp turn (× 1.5)'},
    {token: '--label-tracking', value: '0.2em', governs: 'Tracking on every label; 0.16em below 768px'}
];

export interface Size {
    context: string;
    minimum: string;
    state: string;
}

export const sizes: Size[] = [
    {context: 'Favicon, chat avatar', minimum: '16 px', state: 'Inked only'},
    {context: 'Profile avatar, app icon', minimum: '64 px', state: 'Inked; the unfold from 128 px up'},
    {context: 'Drawn outline', minimum: '96 px', state: 'Below this the hairline breaks up'},
    {context: 'Print', minimum: '12 mm', state: 'Inked, solid black or solid white'}
];

export interface Face {
    name: string;
    slug: string;
    role: string;
    variable: string;
    sample: string;
    note: string;
}

export const faces: Face[] = [
    {
        name: 'Tektur',
        slug: 'wordmark',
        role: 'Wordmark',
        variable: '--font-family-accent',
        sample: 'aerulion',
        note: '700, set tight and always lowercase. Never used for headings or copy.'
    },
    {
        name: 'Chakra Petch',
        slug: 'headings',
        role: 'Headings',
        variable: '--font-family-display',
        sample: 'Performance-focused plugins',
        note: '600, uppercase, tracked slightly open. Also carries statistics and sub-heads.'
    },
    {
        name: 'Space Grotesk',
        slug: 'copy',
        role: 'Copy',
        variable: '--font-family',
        sample: 'Professional Java development for custom Minecraft systems and long-term server architecture.',
        note: '400 at 1rem, line height 1.6, measure held between 52 and 72 characters by rank.'
    },
    {
        name: 'IBM Plex Mono',
        slug: 'instrumentation',
        role: 'Instrumentation',
        variable: '--font-family-mono',
        sample: 'Node / 001 / Status / Active',
        note: '400 at 0.6875rem, uppercase, tracked 0.2em. Tabular figures, so a rolling readout never reflows.'
    }
];

export interface Beat {
    name: string;
    token: string;
    note: string;
}

export const motion: Beat[] = [
    {
        name: 'The draw',
        token: '--ease-draw',
        note: 'A figure arrives as a stroke tracing its own outline. Nothing fades in from nowhere.'
    },
    {
        name: 'The ink sweep',
        token: '--ease-draw',
        note: 'A solid edge rises through the outline and fills it. The stroke is clipped to wherever the ink is not, so there is no rim and no gap.'
    },
    {
        name: 'The unfold',
        token: '4D rotation, projected',
        note: 'The mark is lifted into four dimensions along its four axes, turned there, and projected back, so it can rotate without ever spinning in the plane.'
    },
    {
        name: 'The curtain',
        token: '500ms hold / 500ms lift',
        note: 'A route waits behind the ground, then the ground lifts on a 30° edge. The first visit of a session gets the same figure as an intro; sessionStorage sees to it that no later visit does.'
    },
    {
        name: 'The roll',
        token: '950ms settle / 140ms stagger',
        note: 'A numeric readout lands digit by digit, each one scrambling through the ten glyphs until its own settle time. Only digits move; the slash between them never does.'
    },
    {
        name: 'The tick',
        token: '7s / steps(1)',
        note: 'The node marking the present on the timeline turns 60° and back, stepped rather than swept, so the square it draws is only ever square to the plate or on the lattice.'
    },
    {
        name: 'The invert',
        token: '--transition-base',
        note: 'A control under hover, focus or selection swaps its two inks. It is a state change and not a movement, so it takes the only linear timing in the system.'
    },
    {
        name: 'The reveal',
        token: '--ease-settle',
        note: 'One --reveal-shift of travel as a block enters. Under reduced motion it resolves instantly and the lattice never mounts at all.'
    }
];

export interface MeasureStop {
    subject: string;
    ch: number;
    note: string;
}

export const measureLadder: MeasureStop[] = [
    {subject: 'Section title', ch: 15, note: 'Display, uppercase'},
    {subject: 'Lede', ch: 52, note: 'Under a title'},
    {subject: 'Note', ch: 54, note: 'Captions, part notes'},
    {subject: 'Rule', ch: 68, note: 'A law, a step'},
    {subject: 'Prose', ch: 72, note: 'Running copy'}
];

export const plate: Part[] = [
    {
        name: 'The column',
        kind: '1600px',
        note: 'One column, centred, and no second one. Nothing on the page is positioned against anything else, so the reading order and the visual order can never come apart.'
    },
    {
        name: 'The gutter',
        kind: 'Fluid',
        note: 'The only ground between the crop rules and the column. It scales with the viewport so the plate keeps its proportion rather than its pixel margin.'
    },
    {
        name: 'The crop',
        kind: 'Frame',
        note: 'Four rules pinned inside the viewport with an opaque margin behind them, so the page reads as a plate and nothing scrolls past the edge.'
    },
    {
        name: 'The bleed',
        kind: 'Opaque',
        note: 'A black margin painted behind the crop rules, so content is cut at the edge instead of fading out. It is the one element told to sit out of the lattice index rather than deflect it.'
    },
    {
        name: 'The rail',
        kind: 'Header',
        note: 'Eyebrow, hairline, count: the three-part rule that opens every section. The count is the station the gauge reports, so the page and the instrument always agree.'
    },
    {
        name: 'The gauge',
        kind: 'Readout',
        note: 'A tick riding the right rule with the current station beside it. It reports scroll position as an instrument would, not as a progress bar.'
    },
    {
        name: 'The section line',
        kind: '220px',
        note: 'A short rule closing each lede. It draws itself left to right on reveal, and it is the only decoration in the system that carries no information.'
    },
    {
        name: 'The stack',
        kind: '8rem / 4rem',
        note: 'Sections are separated by the top of the ramp and their inner blocks by two steps down, so the gap between two sections can never be mistaken for a gap inside one.'
    }
];

export const glyph: Part[] = [
    {
        name: 'The box',
        kind: '48 units',
        note: 'Every glyph is drawn inside the same band, 4 to 44 across and 6.6795 to 41.3205 down, which is the bounding box of a lattice hexagon of radius 20. Two glyphs set side by side therefore share a top line and a bottom line without being told to.'
    },
    {
        name: 'The grid',
        kind: '4 / 4 · sin 60°',
        note: 'The lattice again, at a tenth of the band. The band is ten cells across and ten rows down, and every corner of every glyph is one of its vertices, so a glyph is a thing the field could have drawn itself.'
    },
    {
        name: 'The directions',
        kind: '0 / 30 / 60 / 120 / 150',
        note: 'The four axes plus the horizontal the plate already uses. There is no vertical: the mark has none either, and a glyph is drawn from the same vocabulary or it is not drawn.'
    },
    {
        name: 'The weight',
        kind: '1px, non-scaling',
        note: 'A glyph at 200px carries the same line as one at 24px. Stroke width is pinned to the device, not to the box, so the hairline law survives scaling.'
    },
    {
        name: 'No fill',
        kind: 'Outline only',
        note: 'A glyph is an outline. The mark is the one figure in this system allowed to be solid, and an icon that fills itself starts competing with it.'
    },
    {
        name: 'No curve',
        kind: 'Five directions',
        note: 'No arc, no radius, no round terminal. If a subject cannot be built from five straight directions it is the wrong subject. That is a constraint on what gets drawn, not a licence to bend one.'
    }
];

export interface GlyphNote {
    name: string;
    use: string;
}

export const glyphSet: GlyphNote[] = [
    {name: 'east', use: 'A link that leaves this page for another'},
    {name: 'west', use: 'The return to where the reader came from'},
    {name: 'descend', use: 'Down the page, on the same 30° the reveal travels'},
    {name: 'external', use: 'A link that opens somewhere this system does not control'},
    {name: 'copy', use: 'A value the reader can take, on the click-to-copy handles'},
    {name: 'check', use: 'The confirmation after taking one'},
    {name: 'node', use: 'A point on the lattice; a marker with nowhere else to go'}
];

export const access: Part[] = [
    {
        name: 'Contrast',
        kind: '21 : 1',
        note: 'Law I is the accessibility story restated. #fff on #000 is the highest contrast a screen can render, and because nothing is ever dimmed to carry hierarchy, every glyph on the page has it.'
    },
    {
        name: 'Focus',
        kind: '2px / 3px offset',
        note: 'The one place a rule is allowed to double. At 1px a focus ring would be indistinguishable from a border, so it is drawn at 2px and held 3px clear of whatever it is on.'
    },
    {
        name: 'Reduced motion',
        kind: 'Everything off',
        note: 'The lattice never mounts, the curtain never covers, readouts do not roll, and reveals resolve where they stand. Nothing in the system is only legible once it has moved.'
    },
    {
        name: 'No script',
        kind: 'Dead man’s switch',
        note: 'A class is set before paint so reveal targets start hidden, and a 4s timeout takes it off again if a module fails to load. A page that never runs its JavaScript is still the finished page.'
    },
    {
        name: 'Figures',
        kind: 'Labelled or hidden',
        note: 'Every construction drawing is an image with a sentence describing what it shows. Anything that carries no information (the lattice, the crop, the curtain) is hidden from the tree and never focusable.'
    },
    {
        name: 'Entry',
        kind: 'Skip link',
        note: 'The first focusable element on every page, set in the same mono label as everything else rather than smuggled in as a different language.'
    }
];

export const misuse: Law[] = [
    {
        index: '01',
        name: 'Not a grey',
        rule: 'A dimmed white is a half-drawn figure, and the system has no vocabulary for one. Where something must recede, thin it, space it further out, or take it away.'
    },
    {
        index: '02',
        name: 'Not a third angle',
        rule: '45° is not a rounding of 30°. The only right angle in the system is where two rules of the plate meet; every other edge is 30, 60, 120 or 150.'
    },
    {
        index: '03',
        name: 'Not a spin',
        rule: 'Nothing sweeps through an in-plane rotation. If a figure has to change orientation it snaps between two on-axis ones, or it rotates its four-axis lift and projects back down, which is the whole reason the unfold exists.'
    },
    {
        index: '04',
        name: 'Not a thicker rule',
        rule: '1px, at every size and every distance. A heavier line is a different idea, not a louder one. The focus ring is the single exception, and only because it has to be told apart from a border.'
    },
    {
        index: '05',
        name: 'Not a fill',
        rule: 'Surfaces belong to the mark, to a primary button, and to a control inverted under hover or focus. A card, a chip, a callout or a tinted panel is a different design language.'
    },
    {
        index: '06',
        name: 'Not a recolour',
        rule: 'Not for a season, not for a partner, not to mark a state. There is no palette to extend, and a coloured mark is not this mark.'
    },
    {
        index: '07',
        name: 'Not a stretch',
        rule: 'The box is √3 : 2 and it does not negotiate. Scale it, crop it, invert it. Never set its width and its height independently.'
    },
    {
        index: '08',
        name: 'Not a ring or a radius',
        rule: 'A circular crop belongs to the client, not to the mark. The mark is never given a ring, a backing panel, a shadow, a glow or a corner radius of its own.'
    },
    {
        index: '09',
        name: 'Not a wireframe at rest',
        rule: 'The shells the unfold passes through are frames of an animation, not a variant of the mark. A static mark is inked, or it is drawn as one closed outline.'
    },
    {
        index: '10',
        name: 'Not a stock icon',
        rule: 'A glyph pulled from an icon set arrives filled, curved and off-axis, and breaks three laws before it is even placed. Two of them sat on this site for a year. Draw it on the lattice or do without it.'
    },
    {
        index: '11',
        name: 'Not a capital A',
        rule: 'The wordmark is aerulion: lowercase, Tektur 700, set tight. Never title-cased, never letterspaced apart, never outlined, and never set in one of the other three faces.'
    },
    {
        index: '12',
        name: 'Not a photograph behind it',
        rule: 'The ground is #000, not “dark”. If the surface underneath is an image, a texture or a gradient, the mark does not go on it.'
    }
];

export interface Filing {
    part: string;
    component: string;
    module: string;
    token: string;
}

export const filing: Filing[] = [
    {
        part: 'Nyx Mark',
        component: 'Mark, MorphingMark',
        module: 'mark-geometry, mark-hull, morphing-mark',
        token: 'data-morphing-mark'
    },
    {part: 'Nyx Rule', component: '—', module: '—', token: '--hairline'},
    {part: 'Nyx Cut', component: '.panel-cut', module: '—', token: '--cut-x, --cut-y, --tan-30'},
    {
        part: 'Nyx Lattice',
        component: 'LatticeField',
        module: 'lattice-field, lattice-obstacles, distance-field',
        token: 'data-collide'
    },
    {part: 'Nyx Plate', component: 'Plate', module: '—', token: '--plate-width, --plate-gutter, --plate-inset'},
    {part: 'Nyx Gauge', component: '.gauge', module: 'gauge', token: 'data-station'},
    {part: 'Nyx Curtain', component: 'Curtain', module: 'curtain', token: 'data-curtain'},
    {part: 'Nyx Glyph', component: 'Glyph', module: 'glyphs', token: 'GLYPH_BOX, GLYPH_CELL'},
    {part: 'Nyx Scale', component: '—', module: '—', token: '--spacing-*, --flow-*'}
];

export interface Application {
    name: string;
    format: string;
    image: string;
    still?: string;
    width: number;
    height: number;
    alt: string;
    orientation: 'wide' | 'square' | 'tall';
    notes: string[];
}

export const applications: Application[] = [
    {
        name: 'Profile banner',
        format: '600 × 240',
        image: '/assets/brand/discord-banner-1200x480.gif',
        still: '/assets/brand/discord-banner-1200x480.png',
        width: 1200,
        height: 480,
        alt: 'A wide black banner: the lattice field on the left, the aerulion wordmark set large on the right',
        orientation: 'wide',
        notes: [
            'One word, set large. A client renders a banner small enough that anything else stops being readable.',
            'The lattice warps around the wordmark and opens where the avatar lands.',
            'Nothing is framed, so no crop can sever a corner, and type stays inside the middle 77% of the height.'
        ]
    },
    {
        name: 'Avatar',
        format: '128 / 256 / 512',
        image: '/assets/brand/discord-avatar-256x256.gif',
        still: '/assets/brand/discord-avatar-256.png',
        width: 256,
        height: 256,
        alt: 'The mark unfolding through its four lattice axes, square, on black',
        orientation: 'square',
        notes: [
            'Inked at rest. The wireframe is a passage through the unfold, never a resting state.',
            'No ring and no rounded edge. A circular crop belongs to the client, not to the mark.',
            'Held inside 84% of the crop radius so the unfold never clips.'
        ]
    },
    {
        name: 'Lockscreen',
        format: '1290 × 2796',
        image: '/assets/brand/lockscreen-preview.png',
        width: 430,
        height: 932,
        alt: 'A phone wallpaper: the mark inked on black, its four outer edges carried on downward and off the sides of the screen',
        orientation: 'tall',
        notes: [
            'The mark inked, and nothing else drawn. No wordmark and no address, a wallpaper rather than an advert.',
            'Its four outer edges are carried on past the figure and off the plate. The mark sets the angles; the ground only shows where they go, which is the whole system in one move.',
            'They run downward alone, so the clock, the widget row and the two controls all sit on untouched ground. Every ray leaves by an edge, so the crop the phone applies can never sever a frame.'
        ]
    },
    {
        name: 'Desktop',
        format: '1920 → 6016',
        image: '/assets/brand/desktop-preview.png',
        still: '/assets/brand/desktop-preview.png',
        width: 1600,
        height: 900,
        alt: 'A desktop wallpaper: the mark inked at the centre, its four outer edges carried on across the full width and off every side',
        orientation: 'wide',
        notes: [
            'The same move as the lockscreen, opened both ways. With no clock to keep clear the rays run in both directions, and the two shallow ones cross almost the whole width.',
            'Everything is a share of the plate rather than a pixel count, so a 1080p screen and a Pro Display XDR get the same drawing rather than the same file scaled.',
            'Six sizes, and the two MacBook Pro displays are drawn at their own 3456 × 2234 and 3024 × 1964 rather than cropped out of a 16 : 9 sheet.'
        ]
    }
];
