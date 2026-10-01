import type {Part} from './design';

export interface Chapter {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
}

/** A numbered rule; the page numbers it by position. */
export interface Rule {
    name: string;
    rule: string;
}

export interface Readout {
    label: string;
    value: string;
}

export interface Stage {
    name: string;
    measure: string;
    note: string;
}

export interface Lane {
    name: string;
    stages: Stage[];
}

export interface Snippet {
    caption: string;
    code: string;
}

export interface Field {
    name: string;
    bits: number;
    note: string;
}

export const project = {
    name: 'Taerra',
    kicker: 'Live map for Paper and Fabric',
    standfirst: 'The whole world, in under three minutes.',
    lede: 'A web map plugin for Paper servers, with a companion Fabric mod that brings the same map into the game. It reads the world straight from its region files, renders a top-down map and an isometric view from all four corners, and keeps both current while people play, without the server noticing it is there.',
    status: 'Public on Modrinth in early access, plugin and mod alike. Still running live on Corpium, where it was proven under real players, real builds and real terrain.',
    closing:
        'Taerra is on Modrinth, free for any server, and still running live on Corpium. Open the map and try to break it.',
    mapUrl: 'https://map.corpium.net',
    modrinthUrl: 'https://modrinth.com/project/taerra',
    icon: ['M10 6.6795H42L36 17.0718 44 30.9282 38 41.3205H6L12 30.9282 4 17.0718Z', 'M4 17.0718H36', 'M12 30.9282H44']
};

export const chapters: Chapter[] = [
    {
        id: 'benchmark',
        eyebrow: 'The number',
        title: 'All of it, in 2:46.',
        subtitle:
            'Corpium’s main world has a 6,000-block radius. Taerra renders all of it, top-down and isometric from all four corners, at every zoom level. On the same machine, one of the most widely used map plugins needed more than sixteen hours for the same world, and drew less.'
    },
    {
        id: 'principles',
        eyebrow: 'Principles',
        title: 'Five goals, eight refusals.',
        subtitle:
            'The goals have barely changed since the first line was written. What Taerra refuses to do matters as much: every refusal bought the renderer room to be fast.'
    },
    {
        id: 'pipeline',
        eyebrow: 'Pipeline',
        title: 'Every arrow moves less.',
        subtitle:
            'Two lanes feed one renderer. A full render walks the region files on disk; a live refresh takes chunks the server already holds in memory. Both end in the same sampler, the same cache and the same encoder.'
    },
    {
        id: 'reading',
        eyebrow: 'Reading the world',
        title: 'Read the disk, not the server.',
        subtitle:
            'Most map plugins either ask the server for chunks, which loads them and competes with players for the main thread, or run a second process with its own copy of the world. Taerra reads the Anvil region files directly, from its own threads, while the server keeps running.'
    },
    {
        id: 'runs',
        eyebrow: 'Columns as runs',
        title: 'Surfaces, not blocks.',
        subtitle:
            'A chunk holds 98,304 blocks and the map cares about very few of them. Each of its 256 columns is sampled from the top down into runs: vertical stretches of one full-cube material. Everything else rests on this.'
    },
    {
        id: 'topdown',
        eyebrow: 'Top-down',
        title: 'One pixel per block, read as ground.',
        subtitle:
            'A top-down tile is 64 × 64 blocks at one pixel each, stored at native size and scaled up in the browser without smoothing. A flat colour per block reads like a spreadsheet, so four cheap passes make it read like terrain.'
    },
    {
        id: 'isometric',
        eyebrow: 'Isometric',
        title: 'Decide what not to draw.',
        subtitle:
            'The classic 2:1 pixel-art projection, 8 px per block at zoom 0, three flat polygons per block. The renderer is fast not because it draws polygons quickly, but because most of them are never drawn at all.'
    },
    {
        id: 'light',
        eyebrow: 'Light',
        title: 'Expensive maths, computed once.',
        subtitle:
            'Trailer lighting: a warm sun and a cool sky, mixed in linear light and pushed through OKLab with a 1.2× chroma boost, so shadows go blue-violet instead of muddy grey. Three cube roots, three powers and three sRGB encodes per colour: far too much to spend per pixel.'
    },
    {
        id: 'scheduling',
        eyebrow: 'Scheduling',
        title: 'The order is the optimisation.',
        subtitle:
            'A fast renderer still makes a slow render if it reads the same data three times. Much of the speed is the order in which things happen, which is the part nobody draws diagrams of.'
    },
    {
        id: 'live',
        eyebrow: 'Live updates',
        title: 'Small, bounded, batched.',
        subtitle:
            'When a block changes, a listener at MONITOR priority works out exactly which tiles could look different. Nothing else is touched, and nothing is drawn until the interval comes round.'
    },
    {
        id: 'writing',
        eyebrow: 'Writing less',
        title: 'Same bytes, no write.',
        subtitle:
            'The cheapest write is the one that never happens. Every stage after the renderer exists to find out whether anything actually changed.'
    },
    {
        id: 'picking',
        eyebrow: 'Pick buffers',
        title: 'The block under the cursor.',
        subtitle:
            'Top-down, a cursor maps straight to world coordinates. In isometric a screen point is a line through the world, and guessing sea level is right on flat ground and wrong everywhere else. The renderer knows the answer, because it wrote every pixel.'
    },
    {
        id: 'frontend',
        eyebrow: 'The frontend',
        title: 'A map people leave open.',
        subtitle:
            'The renderer is half the product. The other half is a tab people keep on a second monitor, send links to and use to find their friends: Leaflet, plain ES modules and no build step, so what is in the jar is what the browser runs.'
    },
    {
        id: 'access',
        eyebrow: 'Access',
        title: 'No passwords, no admin panel.',
        subtitle:
            'Some of the map is only for some people, which means knowing who is looking. That takes no accounts, no passwords and no e-mail addresses: a Minecraft account is the identity, and the login starts in game.'
    },
    {
        id: 'ingame',
        eyebrow: 'In game',
        title: 'The map, in the game.',
        subtitle:
            'A companion Fabric mod brings the server’s map into the client: a minimap, a full-screen world map and waypoints standing in the world. It renders nothing itself. It draws the tiles the server already made, through the same API the browser uses.'
    },
    {
        id: 'colours',
        eyebrow: 'Colours',
        title: 'Taken from the game itself.',
        subtitle:
            'The last piece runs before the plugin is even built. A small Python tool generates the block data from the vanilla client assets for the target version, and nothing in it is maintained by hand.'
    },
    {
        id: 'log',
        eyebrow: 'The log',
        title: 'What did not pay off.',
        subtitle: 'Honest notes from the development log, and the four things still on the list.'
    },
    {
        id: 'stack',
        eyebrow: 'Stack',
        title: 'One jar.',
        subtitle:
            'The server side ships as a single plugin with an embedded web server. The tiles are plain files on disk, nothing else has to be running, and the mod is optional.'
    }
];

/* ---- The number ---------------------------------------------------------- */

export const headline: Readout[] = [
    {label: 'Full render', value: '2:46'},
    {label: 'Established plugin', value: '16 h+'},
    {label: 'Faster, wall-clock', value: '>340×'},
    {label: 'Chunks', value: '~560k'}
];

export const benchmark = [
    {measure: 'World', taerra: '6,000-block radius, up to 12,000 × 12,000 blocks', other: 'Same'},
    {measure: 'Views', taerra: 'Top-down + isometric × 4 rotations', other: 'Top-down + one 3D view'},
    {measure: 'Full render', taerra: '2 min 46 s', other: '16 h+'},
    {measure: 'Hardware', taerra: 'Intel Core Ultra 7 265, 64 GB RAM', other: 'Same'}
];

/** `value: null` is a figure not yet measured; the page shows it as pending. */
export const figures: {measure: string; value: string | null; note: string}[] = [
    {measure: 'Top-down tile', value: null, note: '64 × 64 blocks'},
    {measure: 'Isometric tile', value: null, note: '256 × 256 px'},
    {measure: 'Render threads', value: null, note: 'Half the cores by default'},
    {measure: 'Disk usage', value: null, note: 'For the benchmark world'},
    {measure: 'Main-thread cost', value: '~2 ms / tick', note: 'During live refresh; zero during full renders'}
];

/** The four verbs, each pointing at the chapter that does it. */
export const motto = [
    {verb: 'Read less', chapter: 'reading'},
    {verb: 'Store less', chapter: 'runs'},
    {verb: 'Draw less', chapter: 'isometric'},
    {verb: 'Write less', chapter: 'writing'}
];

/* ---- Principles ---------------------------------------------------------- */

export const goals: Rule[] = [
    {
        name: 'A map, not a screenshot',
        rule: 'Readable terrain, clear relief, water that shows its depth. One flat colour per block, lit like a painting rather than shaded like a render.'
    },
    {
        name: 'Both views are first-class',
        rule: 'The top-down map is for finding the way; the isometric view is for showing off what people built. Neither is bolted on, and both have to read as the same map.'
    },
    {
        name: 'The server must not notice',
        rule: 'No chunk loading, no chunk generation, no unbounded work on the main thread. A full render of a large world is something to start on a Tuesday afternoon, not schedule for 4 a.m.'
    },
    {
        name: 'Nothing changed, nothing costs',
        rule: 'A creeper crater redraws that hill, not the region around it. A re-render that comes out byte-identical is never downloaded again.'
    },
    {
        name: 'Correct by construction',
        rule: 'Block colours and shapes come from the game’s own assets, not from a hand-kept spreadsheet that drifts with every Minecraft update.'
    }
];

export const refusals: Part[] = [
    {
        name: 'No 3D, no textures',
        kind: 'PNG tiles',
        note: 'No WebGL either: the map is plain image tiles. Any browser on any phone can show it, and the server does the work once instead of every client doing it every frame.'
    },
    {
        name: 'No real geometry',
        kind: 'Full cubes',
        note: 'Slabs, stairs, walls, fences and panes all draw as cubes. At 4–16 px per block a stair’s step is noise, and the stylised cube is why a chunk fits in ~19 KB.'
    },
    {
        name: 'No style toggles',
        kind: 'One look',
        note: 'Lighting, sun angle and palette are fixed. The style is part of the product, and no configuration means no combinations to test and no cache keys to multiply.'
    },
    {
        name: 'No per-face shadows',
        kind: 'Per column',
        note: 'Shadows are decided per column top-down, and per run and face band in isometric, never per pixel. There is no block light either: night mode and torchlight are on the someday list, not the roadmap.'
    },
    {
        name: 'No on-demand rendering',
        kind: 'File reads',
        note: 'A tile request is a file read. A tile that does not exist yet answers “nothing here”, and the pipeline catches up when it gets there. Anyone who can open the map can ask for any tile, so no request may buy CPU time.'
    },
    {
        name: 'No realtime by default',
        kind: '15 min',
        note: 'Changes are recorded instantly and rendered on an interval. A tile edited four hundred times in that window renders once.'
    },
    {
        name: 'No accounts',
        kind: 'In game',
        note: 'No passwords and no web admin panel. A Minecraft account is the identity, and the server is configured from inside the game.'
    },
    {
        name: 'No outside services',
        kind: 'One jar',
        note: 'No external database, no CDN, no Folia for now. One jar with an embedded web server, and tiles as plain files on disk.'
    }
];

/* ---- Pipeline ------------------------------------------------------------ */

export const lanes: Lane[] = [
    {
        name: 'Full render',
        stages: [
            {name: 'Header scan', measure: '4 KiB / region', note: 'Which chunks exist, without reading one.'},
            {name: 'Z-order plan', measure: 'Morton curve', note: 'Neighbouring regions render close together.'},
            {name: 'Selective read', measure: '4 NBT fields', note: 'Everything else is skipped in the stream.'},
            {name: 'Run sampler', measure: '256 columns', note: 'Surfaces kept, interiors swallowed.'},
            {name: 'Column cache', measure: '~19 KB / chunk', note: 'One structure behind both renderers.'},
            {name: 'Top-down', measure: '64 × 64 blocks', note: 'Measures the heights isometric needs.'},
            {name: 'Isometric', measure: '4 rotations', note: 'Queued from those heights, right behind.'},
            {name: 'Zoom pyramid', measure: '64 → 1', note: 'Top-down composed in memory from tiles still held.'},
            {name: 'Indexed PNG', measure: 'FNV-1a hash', note: 'Unchanged bytes stop here.'},
            {name: 'Disk and socket', measure: 'LRU / Javalin', note: 'Served to Leaflet, pushed as tile_updated.'}
        ]
    },
    {
        name: 'Live refresh',
        stages: [
            {name: 'Block events', measure: 'Tile maths', note: 'Only tiles that could look different.'},
            {name: 'Change buffer', measure: '15 min', note: 'Deduplicated: many edits, one render.'},
            {
                name: 'Live lane',
                measure: 'Token bucket',
                note: 'Rate-limited, so a crater cannot starve a full render.'
            },
            {
                name: 'Chunk snapshot',
                measure: '2 ms / tick',
                note: 'From memory, since the region may not be saved yet.'
            },
            {name: 'Run sampler', measure: 'Joins at 04', note: 'Same sampler, same cache, same encoder.'}
        ]
    }
];

/* ---- Reading the world --------------------------------------------------- */

export const reading: Readout[] = [
    {label: 'Read per region to plan', value: '4 KiB'},
    {label: 'To plan the main world', value: '~2.3 MB'},
    {label: 'Reads per chunk, per view', value: '1'},
    {label: 'NBT fields kept', value: '4'}
];

export const headerScan: Snippet = {
    caption: 'Java / The header scan',
    code: `for (int index = 0; index < 1024; index++) {
  if (header[index * 4] == 0 && header[index * 4 + 1] == 0 && header[index * 4 + 2] == 0) {
    continue; // chunk never generated
  }
  zoom0Tiles.add(TileGeometry.chunkToTile(regionX * 32 + index % 32, regionZ * 32 + index / 32, 0, world));
}`
};

export const collectFields: Snippet = {
    caption: 'Java / Four fields, the rest skipped',
    code: `CollectFields fields = new CollectFields(
    new FieldSelector(ListTag.TYPE, "sections"),
    new FieldSelector(IntTag.TYPE, "xPos"),
    new FieldSelector(IntTag.TYPE, "zPos"),
    new FieldSelector(StringTag.TYPE, "Status"));
NbtIo.parse(input, fields, NbtAccounter.create(64L << 20));`
};

export const sections: Part[] = [
    {
        name: 'Palette',
        kind: 'Once',
        note: 'Resolved to materials and a parallel air flag, once per section.'
    },
    {
        name: 'All air',
        kind: 'Palette only',
        note: 'A section whose palette holds only air is skipped without unpacking a single index.'
    },
    {
        name: 'All full',
        kind: 'Palette, lazily',
        note: 'If every palette entry is a full cube, the section is solid throughout. The next chapter is why that matters.'
    },
    {
        name: 'Indices',
        kind: 'On first touch',
        note: 'Unpacked into a short[4096] once, then indexed directly. Sections the sampler never touches stay packed.'
    },
    {
        name: 'Biomes',
        kind: 'One at a time',
        note: 'Unpacked per lookup, because the sampler only ever asks for one or two per column.'
    }
];

/* ---- Columns as runs ----------------------------------------------------- */

export const runs: Readout[] = [
    {label: 'Blocks per chunk', value: '98,304'},
    {label: 'Columns sampled', value: '256'},
    {label: 'Cached per chunk', value: '~19 KB'},
    {label: 'For 8,192 chunks', value: '~160 MB'}
];

/**
 * The column drawn in the figure, top to bottom. `null` material is air.
 * `span` is the drawn height: the figure is a schematic, not to scale.
 */
export const column: {material: string | null; top: number; bottom: number; span: number}[] = [
    {material: null, top: 90, bottom: 75, span: 16},
    {material: 'oak_leaves', top: 74, bottom: 71, span: 20},
    {material: null, top: 70, bottom: 68, span: 12},
    {material: 'grass_block', top: 67, bottom: 67, span: 10},
    {material: 'dirt', top: 66, bottom: 63, span: 18},
    {material: 'stone', top: 62, bottom: -64, span: 40}
];

export const layout = [
    {field: 'runOffsets', type: 'int[257]', holds: 'Column i owns runs off[i] up to off[i + 1]'},
    {field: 'runTopY', type: 'short[]', holds: 'Top of each run'},
    {field: 'runBottomY', type: 'short[]', holds: 'Bottom of each run'},
    {field: 'runMaterial', type: 'Material[]', holds: 'One material per run'},
    {field: 'capMaterial', type: 'Material[]', holds: 'Per column: the flower, grass or snow painted on top'},
    {field: 'columnBiome', type: 'Biome[]', holds: 'Per column'},
    {field: 'minTopY, maxTopY', type: 'int, int', holds: 'Packed into one long for the height index'}
];

export const shortcuts: Rule[] = [
    {
        name: 'All-air sections, skipped whole',
        rule: 'One mask jumps to the section base. Sky, floating islands and the air above an ocean cost one palette check each.'
    },
    {
        name: 'All-full sections, swallowed whole',
        rule: 'In an interior column whose run reaches the top of a section built only of full cubes, every block is enclosed on six sides and can never be seen. The run grows by sixteen without reading a block, and most deep terrain goes this way.'
    },
    {
        name: 'Hidden runs, merged after',
        rule: 'A last pass folds each interior run whose four neighbours are solid across its full height into the run above. Ore veins and sealed caves vanish into one stone run, and four cursors that only ever move down keep the pass linear.'
    }
];

export const swallow: Snippet = {
    caption: 'Java / Sixteen blocks, zero reads',
    code: `if (interior && (y & 15) == 15 && runMaterial != null && !Fluids.isFluid(runMaterial)
    && runBottomY == y + 1 && source.isSectionAllFull(y, shapes)) {
  y &= ~15;
  runBottomY = y;   // absorb 16 blocks, zero reads
  continue;
}`
};

export const thin: Part[] = [
    {
        name: 'Ground cover',
        kind: 'Cap material',
        note: 'Flowers, grass, carpets and snow layers up to two tall colour the top face beneath them. A meadow reads as a meadow and keeps its relief.'
    },
    {
        name: 'Tall stacks',
        kind: 'Runs',
        note: 'Sugar cane and tall bamboo become runs of their own, so they stand up in the isometric view.'
    },
    {
        name: 'Submerged plants',
        kind: 'Water',
        note: 'Seagrass and kelp are sampled as water, so a kelp forest does not punch holes in the ocean.'
    },
    {
        name: 'The Nether',
        kind: 'Under the roof',
        note: 'In a world with a ceiling the column top is the first solid block under two blocks of open space, so the map shows cavern floors instead of one bedrock rectangle.'
    }
];

export const heightIndex: string[] = [
    'Every sampled chunk leaves its lowest and highest top behind, packed into one long in a per-world map. It costs 16 bytes per chunk, is never evicted, and outlives the cache that produced it.',
    'Three systems use it to skip work. The isometric renderer culls chunks that cannot reach a tile before loading them; shadow and occlusion rays stop once they rise above the highest terrain nearby; and invalidation bounds a block change vertically, so an edit at y = 64 does not dirty tiles for the whole build height.'
];

/* ---- Top-down ------------------------------------------------------------ */

export const passes: Part[] = [
    {
        name: 'Terracing',
        kind: 'Drop ≤ 8',
        note: 'Where a block drops away to +X or +Z, its side colour, lit as the matching isometric face, is blended in by the height of the drop. Cliffs pick up the brown of a grass block’s side, and the map becomes the isometric view seen from straight above.'
    },
    {
        name: 'Occlusion',
        kind: '1.00 → 0.76',
        note: 'The number of taller neighbours among the eight around a block sets an occlusion factor. Valleys darken and ridges stand out.'
    },
    {
        name: 'Sun shadows',
        kind: '≈ 26.6°, 32 steps',
        note: 'Traced through the height field in fixed point: two multiply-shifts and a lookup per step, no floating point and no trigonometry.'
    },
    {
        name: 'Water depth',
        kind: '4-block bands',
        note: 'Shaded from the bed’s height field rather than the flat surface, then tinted in depth bands that push deep water toward blue.'
    }
];

export const terrace: Snippet = {
    caption: 'Terracing / One blend per pixel',
    code: `colour = (top·2 + sideX·dropX + sideZ·dropZ) / (2 + dropX + dropZ)`
};

export const sun: Snippet = {
    caption: 'Java / The sun, in fixed point',
    code: `static final int SUN_STEP_X = 809, SUN_STEP_Z = -627;   // ≈ unit vector × 1024
// step k samples (x + k·809 >> 10, z − k·627 >> 10) at height topY + ⌈k/2⌉`
};

/* ---- Isometric ----------------------------------------------------------- */

export const culling: Rule[] = [
    {
        name: 'Per tile',
        rule: 'Once every screen column is painted from the top row down, the tile is finished and the chunk loop ends.'
    },
    {
        name: 'Per chunk',
        rule: 'A chunk’s screen bounds come from its known highest top, not the world height. If the whole footprint sits under the skyline, the chunk is never fetched from the cache or read from disk.'
    },
    {
        name: 'Per run',
        rule: 'Walking down a column, the first run whose top row is already covered ends it. Everything below is hidden too.'
    }
];

export const frontToBack: string[] = [
    'The painter’s algorithm draws back to front and lets near things overwrite far ones. In a dense world nearly everything it draws is overwritten, so nearly all of its work is wasted.',
    'Taerra draws front to back, and a pixel that is set is never written again. In this projection nearer simply means a larger x + z in rotated space, so chunks are sorted by that sum and columns walk the anti-diagonals from 30 down to 0. No depth buffer, and no sort per pixel or per block.'
];

export const skyline =
    'Write-once pixels only save the writes. The real saving is knowing, before doing any work, that something is hidden. For every screen column the renderer keeps the row from which each pixel down to the bottom of the tile is already painted: the skyline. Whatever lies farther away, with its whole footprint under that line in every column it touches, cannot be seen. After each face the line is pulled up through pixels that were already set, so coverage from separate objects joins up.';

export const paint: Snippet = {
    caption: 'Java / Write once',
    code: `void paint(int index, int color, int depth, int blockY, int submergedExtra) {
  if (pixels[index] != 0) return;  // something nearer already owns this pixel
  ...
}`
};

export const iso: Part[] = [
    {
        name: 'Candidates, solved',
        kind: 'Sum and difference',
        note: 'A tile’s screen x-range fixes a range of rotatedX − rotatedZ, and its y-range, with the world’s height range, fixes a range of their sum. The chunks that can land on it are exactly the points where the two share a parity: a tight diamond, no wasted tests, narrowed further per chunk by the height index.'
    },
    {
        name: 'Exposed faces only',
        kind: 'Cursor walk',
        note: 'A side face is drawn only where the neighbouring column leaves it exposed, so a wall beside a hill is drawn from the hilltop up. Rows that come out the same colour merge into one span.'
    },
    {
        name: 'Water to see into',
        kind: '0.8 · (1 − 0.5ᵈ)',
        note: 'Water wets pixels without claiming them, and whatever solid is drawn behind is blended by depth. Reefs glow turquoise, trenches fade to navy, and a sunken build shows through.'
    },
    {
        name: 'Four rotations',
        kind: 'One renderer',
        note: 'Rotation is a transform applied at the edges; the renderer only ever sees rotated space. Each rotation is its own pyramid on disk, rendered, invalidated and served on its own.'
    }
];

/* ---- Light --------------------------------------------------------------- */

export const lightKey: string[] = [
    'The inputs, though, are tiny and discrete: a colour, one of three faces, up to eight taller neighbours or blocked rays, shadowed or not, and one of three contact levels. All of them pack into a single long, and a hash map per thread remembers the answer.',
    'After the first few tiles the hit rate is effectively 100%, and lighting costs one lookup per face. Zero doubles as the missing sentinel for free, because a lit opaque colour always carries full alpha.'
];

export const key: Field[] = [
    {name: 'Colour', bits: 32, note: 'ARGB'},
    {name: 'Face', bits: 2, note: 'Top, +X, +Z'},
    {name: 'Taller', bits: 4, note: '0–8'},
    {name: 'Shadow', bits: 1, note: 'Yes / no'},
    {name: 'Contact', bits: 2, note: '3 levels'}
];

export const shading: Part[] = [
    {
        name: 'Occlusion per run',
        kind: '8 compares',
        note: 'Neighbouring bed heights are gathered once per column and compared against each run’s top, so the floor of a shaft is darker than the ground above it.'
    },
    {
        name: 'Enclosure',
        kind: '8 rays, 12 blocks',
        note: 'Side faces cast eight short rays from the air in front of them and count the hits. Alleys and courtyards darken on their own.'
    },
    {
        name: 'Contact',
        kind: '1–2 rows',
        note: 'Where a wall meets the ground its lowest rows get a darker sky term, which grounds a building without real occlusion.'
    },
    {
        name: 'Sun shadows',
        kind: 'Through the runs',
        note: 'Marched through the full run data rather than the height field, so overhangs cast their shadows correctly.'
    }
];

export const cutoff =
    'Before a chunk is rendered, the renderer looks up the highest terrain its rays could reach in the height index, and every ray stops as soon as it rises above it. In open terrain, which is most of any world, a shadow ray gives up after a step or two instead of marching all thirty-two.';

/* ---- Scheduling ---------------------------------------------------------- */

export const scheduling: Readout[] = [
    {label: 'Tiles per full-render batch', value: '64'},
    {label: 'Tiles per region', value: '8 × 8'},
    {label: 'Dispatcher tick', value: '20 ms'},
    {label: 'Live batches / s', value: '10'}
];

export const order: Rule[] = [
    {
        name: 'Batches follow region files',
        rule: 'A batch is a seed tile and up to 63 more of the same priority, world, view and rotation in the same region; live batches stop at 16. A region is 512 × 512 blocks, exactly 8 × 8 tiles: one open file, one hot set of chunks, one worker.'
    },
    {
        name: 'The world walks a Z-order curve',
        rule: 'Inside a region, tiles run back and forth like an ox ploughing. The regions themselves are sorted by Morton code, so neighbours render close together in time and the halo one sampled is still cached when the next one needs it.'
    },
    {
        name: 'Isometric follows the ground',
        rule: 'Early versions queued isometric tiles for the full height range and produced three to four times more tiles than had anything in them, in each of four rotations. Now they are queued from the heights their chunks were just measured at, per chunk rather than per tile, and pushed to the front, so they render right behind top-down while those chunks are still cached.'
    },
    {
        name: 'The pyramid is built in memory',
        rule: 'A finished top-down batch composes its own zoom levels from the images it still holds, 64 to 16 to 4 to 1, and queues only the top. Isometric and live tiles queue their parents one by one. Point sampling keeps the pixel art crisp and never invents a colour that was not in the source.'
    },
    {
        name: 'Two pools that share',
        rule: 'A base pool and a zoom pool, half the cores by default and at least two left for the server. An idle worker takes the other pool’s work, and a finished batch dispatches at once instead of waiting for the next tick.'
    }
];

export const queue = [
    {lane: 'Live, zoom 0', work: 'Tiles a change touched', note: 'Token bucket: 10 batches / s, 2 s burst'},
    {lane: 'Full render, zoom 0', work: 'Every tile that exists', note: 'Region batches on the Z-order curve'},
    {lane: 'Live, parent', work: 'Zoom levels above a change', note: 'Recomposed from the tiles below'},
    {lane: 'Full render, parent', work: 'Above each pyramid top', note: 'One zoom task per finished batch'}
];

export const nothingLost =
    'A tile dirtied again while it is rendering is remembered and re-queued the moment the current render lands, so no change is lost to a race. On shutdown the whole queue, in-flight tiles included, is written atomically to JSON, and a restart picks up where it stopped.';

/* ---- Live updates -------------------------------------------------------- */

export const live: Readout[] = [
    {label: 'Default interval', value: '15 min'},
    {label: 'Main-thread budget', value: '2 ms'},
    {label: 'Checks per tick, max', value: '4,096'},
    {label: 'Shadow halo, blocks', value: '32'}
];

export const liveSteps: Rule[] = [
    {
        name: 'Work out the tiles',
        rule: 'Top-down: the column’s tile, a one-block halo for occlusion and terracing, and 32 blocks toward the sun, because a new tower casts its shadow that way. Isometric: the chunk’s footprint in each rotation, bounded by the height index and the changed range, extended by the shadow’s reach.'
    },
    {
        name: 'Buffer and deduplicate',
        rule: 'Tile coordinates collect in a set that flushes into the live lane once per interval. However often a tile changes in that window, it renders once.'
    },
    {
        name: 'Snapshot from memory',
        rule: 'The region file may not be saved yet, so changed chunks are captured on the main thread under a 2 ms budget, then sampled on a worker by the same sampler into the same cache. Chunks no longer loaded simply drop out and are read from disk later.'
    },
    {
        name: 'Wait out pre-generation',
        rule: 'Freshly populated chunks are marked for rendering, unless a Chunky pre-generation run is in progress. Then Taerra leaves them alone rather than chasing thousands of chunks a second, and when Chunky stops it offers staff a full render in chat.'
    }
];

/* ---- Writing less -------------------------------------------------------- */

export const writing: Readout[] = [
    {label: 'Smaller before deflate', value: '4×'},
    {label: 'Hash, doubling as ETag', value: '64-bit'},
    {label: 'Update coalescing', value: '500 ms'},
    {label: 'Tiles before bulk', value: '256'}
];

export const writes: Part[] = [
    {
        name: 'Indexed PNG',
        kind: 'Hand-rolled',
        note: 'A flat-shaded tile rarely has more than a few hundred colours. The encoder builds its palette on the fly, writes transparency only when it is needed and deflates 8-bit scanlines: a quarter of the raw data before compression even starts. Past 256 colours it falls back to ImageIO.'
    },
    {
        name: 'Content hash',
        kind: 'FNV-1a',
        note: 'Every encoded tile is hashed, and the hash is its ETag. When a re-render matches the file on disk, which happens constantly, nothing is written and no client is told. Only the file’s modified time moves.'
    },
    {
        name: 'Mark and sweep',
        kind: 'The filesystem',
        note: 'That modified time is the garbage collector. After a full render, any tile older than the render’s start was not produced by it, belongs to terrain that no longer exists, and is deleted. No manifest, no database. If any region could not be read, the sweep is skipped.'
    },
    {
        name: 'Client updates',
        kind: 'Coalesced',
        note: 'Changed tiles are announced every 500 ms. Past 256 at once a single bulk refresh goes instead, at most every 5 s per world, and the client cache-busts only what changed.'
    }
];

/* ---- Pick buffers -------------------------------------------------------- */

export const parity =
    'One number per pixel is enough. Screen x narrows u − v down to two neighbouring candidates; screen y ties u + v to the height. Recording the depth u + v settles both, because it always shares its parity with u − v, and the two candidates differ in theirs.';

export const planes: Part[] = [
    {
        name: 'Depth plane',
        kind: 'u + v',
        note: 'Recovers the block under every pixel from a single number.'
    },
    {
        name: 'Height plane',
        kind: 'Kept anyway',
        note: 'A wall pixel could belong to either of two levels, and teleporting someone into the wrong one is worse than a few extra bytes.'
    },
    {
        name: 'Storage',
        kind: '16-bit, planar',
        note: 'Offsets from each plane’s minimum, at half resolution for isometric tiles, deflated. A depth plane is a smooth gradient and a height plane is a height map, so both compress well.'
    },
    {
        name: 'Decoding',
        kind: 'Native',
        note: 'The browser inflates them with DecompressionStream, with no JavaScript inflate library. They drive the block tooltip, the coordinate readout and click-to-teleport, and the mod reads the very same buffers.'
    }
];

/* ---- The frontend -------------------------------------------------------- */

export const features: Part[] = [
    {
        name: 'The URL is the state',
        kind: 'Shareable',
        note: 'World, position, zoom, view, rotation, panels, colour style, language and layers all live in the fragment, debounced so the back button is not flooded. Paste a link in Discord and the other person sees exactly what you see.'
    },
    {
        name: 'Context menu',
        kind: 'Keyboard too',
        note: 'Copy the coordinates or a link, centre the map, teleport or drop a waypoint. In isometric the coordinates are exact, height included. Arrow keys move through it and Escape closes it.'
    },
    {
        name: 'Grey style',
        kind: 'One key',
        note: 'A second colour style maps brightness onto the interface’s stone palette so markers stand out. It is an SVG filter: one set of tiles on the server, two looks in the browser, nothing rendered twice.'
    },
    {
        name: 'Live, when it changed',
        kind: 'One socket',
        note: 'One WebSocket per tab carries player positions, sampled once a second and sent only when something changed, plus tile updates, marker changes and render progress. An empty server at night sends nothing, and a client that stops reading loses updates rather than growing the server’s buffers.'
    },
    {
        name: 'Markers and layers',
        kind: 'Marker API',
        note: 'WorldGuard regions, vanilla and ChunkyBorder borders, grouped waypoints and spawn, each a layer a viewer can switch. Other plugins add their own through a small public API, published to Maven Central with every release, drawn on the ground they belong to, and markers from dynmap can be imported as waypoint groups.'
    },
    {
        name: 'Self-hosted',
        kind: 'EN / DE',
        note: 'Fonts, icons and player heads are all served by the plugin itself, and the interface speaks English and German.'
    }
];

export const players =
    'Player markers show the player’s face in the colour of their in-game locator bar, and following someone keeps them centred, even across a world switch. Heads are fetched by the server, only from textures.minecraft.net, then cropped, cached and served locally, so looking at the map never leaks a viewer’s address to Mojang or anyone else.';

export const privacy: Rule[] = [
    {
        name: 'Hidden',
        rule: 'Players in spectator mode, invisible or vanished players, and anyone with taerra.hide do not appear at all.'
    },
    {
        name: 'Anonymous',
        rule: 'Players who turned off server listings in their client appear as a grey dot: no name, no head, and an id salted afresh on every server start, so they cannot be followed across restarts.'
    },
    {
        name: 'Staff',
        rule: 'Staff with taerra.web.see-hidden do see hidden players, clearly marked as hidden.'
    }
];

/* ---- Access -------------------------------------------------------------- */

export const login: Rule[] = [
    {
        name: 'A link in chat',
        rule: '/taerra login answers with a clickable link carrying a one-time code: 32 random bytes, valid for five minutes, usable once. A link that leaks after it has been clicked is worthless.'
    },
    {
        name: 'Carried in the fragment',
        rule: 'The code rides after the #, which browsers never send in a request or a Referer. The page strips it from the address bar before doing anything else, so it stays out of the history too, and then posts it to the server.'
    },
    {
        name: 'A thirty-day session',
        rule: 'The code is exchanged for a 30-day session cookie: HttpOnly, SameSite=Strict, and Secure over HTTPS, including behind a reverse proxy.'
    },
    {
        name: 'Told in game',
        rule: 'The player is told a browser has just logged in as them. Other open tabs hear about it over a BroadcastChannel and never need a reload.'
    },
    {
        name: 'Hashes only',
        rule: 'Only SHA-256 hashes of codes and tokens are stored, so a copy of the sessions file logs nobody in. The login goes to the command’s sender, not its executor, so it cannot be minted on someone else’s behalf. /taerra logout ends a player’s sessions, staff can end anyone’s, and a banned player’s sessions end on their own.'
    },
    {
        name: 'No link for the mod',
        rule: 'A connected client is already authenticated, so the mod needs no login. On join the server sends it a session over a plugin channel. That session lives in memory only, is never written to disk, and ends the moment the player leaves.'
    }
];

export const grants: string[] = [
    'Permission plugins cannot reliably say what an offline player may do, and people browse the map offline all the time. So while a player with a web session is online, Taerra checks the handful of permissions the map cares about once a second and keeps the result beside the session. Offline, their browser goes by that snapshot.',
    'When a snapshot changes, every open connection that player has is re-checked at once. Remove a staff rank in LuckPerms and within about a second their open tab loses the staff world and the private layers, without a reload.',
    'Every world-specific endpoint, from tiles and pick buffers to markers, players and avatars, passes the same check, and a private world answers exactly like one that does not exist: a plain 404.'
];

export const actions = [
    {action: 'Browse public worlds and layers', needs: 'Nothing', detail: 'No login needed'},
    {action: 'See a private world', needs: 'taerra.web.world.<ns>.<world>', detail: 'e.g. minecraft.the_end'},
    {action: 'See a private layer', needs: 'taerra.web.layer.<layer>', detail: 'e.g. worldguard'},
    {action: 'See hidden players', needs: 'taerra.web.see-hidden', detail: 'Marked as hidden'},
    {action: 'Teleport from the map', needs: 'taerra.web.teleport', detail: 'Online, onto the exact block shown'},
    {action: 'Edit waypoints', needs: 'taerra.command.waypoint', detail: 'Works while offline'},
    {action: 'Private waypoint groups', needs: 'taerra.command.config', detail: 'Private before the first waypoint'}
];

export const writesFromWeb: Part[] = [
    {
        name: 'Teleports',
        kind: 'Checked live',
        note: 'The snapshot only decides whether the button shows. The permission is checked again on the main thread, the target must lie inside the border, the chunk loads asynchronously, and the height comes from the pick buffer, so you land on the roof you clicked.'
    },
    {
        name: 'Waypoints',
        kind: 'From a phone',
        note: 'The sixteen dye colours in creative-inventory order, a hue and shade picker and a hex field. Move one by picking it up and clicking its new spot, or put it in a group that becomes its own layer. Editing goes by the permission snapshot, so it works from a phone while offline.'
    },
    {
        name: 'Every write',
        kind: 'Same origin',
        note: 'Guarded by Fetch Metadata. A browser too old to send it is refused, and only a client with no Origin at all gets through without it. Editing or deleting a waypoint needs sight of the group it is in, so a private group cannot be touched blind. Names are normalised and limited to 32 letters, digits and common punctuation, and nothing can be placed outside the border, so no request can make the server load or generate a chunk it should not.'
    }
];

export const noPanel =
    'What the browser cannot do is administer the plugin, and that is deliberate. Enabling worlds, making worlds and layers private, limiting the rendered area and starting renders all happen in game, through /taerra config, /taerra limit and /taerra render, with tab completion. The same render command also exports a world as one PNG per view and rotation, stitched from the tiles on disk and streamed a row of tiles at a time, so even a whole world never has to fit in memory. A web admin panel would be another login surface to secure, for settings changed once.';

/* ---- In game ------------------------------------------------------------- */

export const explored =
    'Client-side map mods only show what the player has explored, chunk by chunk, as they walk past it. On a server with years of history that is a small fraction of the world, and it is out of date the moment someone else builds. The server already knows the whole world and keeps it current, so the client should not have to rediscover it.';

export const inGame: Part[] = [
    {
        name: 'Minimap',
        kind: 'HUD',
        note: 'Sized, zoomed and placed on either side, north-up or turning with the player. It moves down out of the way of status effects and steps aside for the debug screen.'
    },
    {
        name: 'World map',
        kind: 'Full screen',
        note: 'Both views and all four rotations, layers, the player list with follow, spawn, and a right-click menu to copy coordinates or a link, teleport, or drop a waypoint. Pans glide and zooms ease, and every action has a rebindable key.'
    },
    {
        name: 'Waypoints in the world',
        kind: 'Labels',
        note: 'Each waypoint stands where it is, with its name, its distance and the vanilla banner icon closest to its colour. Past ten blocks it holds a constant size on screen, out to the render distance.'
    }
];

export const client: Part[] = [
    {
        name: 'Handshake',
        kind: 'taerra:web',
        note: 'On join the plugin sends the map’s address and a session over a plugin channel. No link in chat, no setup. The message carries a protocol number, and a mod and plugin that disagree say which side needs the update instead of misreading each other.'
    },
    {
        name: 'Tiles',
        kind: 'ETag, LRU',
        note: 'The same indexed PNGs, revalidated with If-None-Match, so an unchanged tile costs a 304. Uploaded as textures sampled nearest-neighbour, so the pixel art stays sharp at every GUI scale. Until a tile arrives, the closest loaded ancestor up to four levels up stands in for it.'
    },
    {
        name: 'Updates',
        kind: 'Same socket',
        note: 'The WebSocket the browser listens to keeps the in-game map current. Player positions arrive once a second and glide between updates; a jump of more than 32 blocks snaps instead.'
    },
    {
        name: 'Heights',
        kind: 'Pick buffers',
        note: 'The cursor readout, waypoint placement and teleport targets come from the same buffers the browser decodes. An area marker drawn in isometric samples them along its edges, median-smoothed, so a region’s floor drapes over the hills beneath it.'
    },
    {
        name: 'Markers',
        kind: 'Rasterised',
        note: 'Regions, borders and paths are drawn into 256 px overlay tiles off the render thread, four at a time and nearest the centre first, then cached like map tiles. In isometric a region stands up as walls from its ground outline.'
    },
    {
        name: 'Same rules',
        kind: 'Permissions',
        note: 'Every request is an ordinary API call under the player’s own permissions. A private world stays private in game too, and the mod can do nothing the browser could not.'
    }
];

/* ---- Colours ------------------------------------------------------------- */

export const colourCounts: Readout[] = [
    {label: 'Blocks in the data', value: '1,187'},
    {label: 'Side unlike the top', value: '532'},
    {label: 'Voxel grid per model', value: '16³'},
    {label: 'Shape threshold', value: '0.25'}
];

export const compositing =
    'For every block the tool resolves the blockstate to a canonical variant, flattens the model’s parent chain, resolves its texture references and composites the outward faces in element order, which is what puts the green fringe on top of a grass block’s dirt side.';

export const colours: Part[] = [
    {
        name: 'Picked, not averaged',
        kind: 'OKLab mean shift',
        note: 'Pixels are clustered in OKLab and the dominant cluster wins, so outlines, highlights and stray pixels cannot drag a colour toward mud.'
    },
    {
        name: 'Top and side',
        kind: '532 of 1,187',
        note: 'Kept apart. Derive the side by darkening the top and a grass block renders as green dirt.'
    },
    {
        name: 'Shapes, measured',
        kind: 'Flood fill',
        note: 'Each model is voxelised with the union of its rotated placements, and a sheet thinner than one unit counts only if it encloses a volume. Mature wheat stays thin, a hopper is full, and powder snow comes out solid, with no per-block exceptions. The line itself, 0.25, is exactly a wall post, so walls count and fence posts, at 0.0625, do not.'
    },
    {
        name: 'Panels as walls',
        kind: 'Forced full',
        note: 'Doors, trapdoors, panes and fences count as full, so a glass facade does not render as a hole into the building behind it.'
    },
    {
        name: 'Tints',
        kind: 'Baked or flagged',
        note: 'Constant tints are baked in. Only biome-dependent faces keep a flag, resolved per biome at runtime, the swamp’s grass noise included.'
    },
    {
        name: 'Biome colormaps',
        kind: '6 coefficients',
        note: 'The grass, foliage and dry-foliage gradients live in the client jar, which the server does not ship. Each is smooth, so the tool fits a quadratic surface per channel instead of bundling the image. It reproduces the original to within three levels of 255, and the plugin rebuilds the tables at startup and hands them to the game, so custom biomes are tinted correctly too.'
    },
    {
        name: 'Fail loudly',
        kind: 'Magenta',
        note: 'A block missing from the data renders as a magenta cube, and at startup the data is cross-checked against the running server.'
    }
];

/* ---- The log ------------------------------------------------------------- */

export const dropped: Rule[] = [
    {
        name: 'Caching shadows across a batch',
        rule: 'A column on the edge of two tiles saves exactly one ray, and the hash map cost as much as the rays it saved. Removed.'
    },
    {
        name: 'Throwing memory at re-reads',
        rule: 'A full render once sampled each chunk about 2.5 times: 188k samples for 74.5k chunks. A cache four times larger helped by 6%, a Hilbert curve instead of Z-order by 2%. The fix was scheduling: isometric following the top-down frontier.'
    },
    {
        name: 'Rendering on request',
        rule: 'The first version built missing isometric tiles on the HTTP thread under a per-world lock, and the first visitor to a new area paid for all of it. It moved to the queue, and later on-demand rendering was dropped altogether.'
    },
    {
        name: 'Two samplers for two views',
        rule: 'Separate data paths read every chunk twice and resolved colours differently. One run representation made renders faster and made both views the same map.'
    }
];

export const pending: Part[] = [
    {
        name: 'Walls in shadow',
        kind: 'Top-down',
        note: 'Shadows are decided per column from its top, so a wall in shadow still shows a lit side band.'
    },
    {
        name: 'Water depth',
        kind: 'To the bed',
        note: 'Measured to the bed, not through the water: a ledge halfway down a lake reads as open water to the bottom.'
    },
    {
        name: 'Pick buffer size',
        kind: '≈ the tiles',
        note: 'It costs about as much disk as the tiles themselves. A coarser buffer would keep most of the precision.'
    },
    {
        name: 'Night',
        kind: 'Block light',
        note: 'Torches, lava and glowstone are already in the data, waiting for a night mode.'
    }
];

/* ---- Stack --------------------------------------------------------------- */

export const stack = [
    {
        layer: 'Plugin',
        built: 'Java 25 and Paper 26.2, with paperweight userdev for the NBT and region-file internals; fastutil primitive collections, Caffeine for the tile and chunk caches, Jackson'
    },
    {
        layer: 'Web',
        built: 'Javalin 7 on embedded Jetty and WebSockets; content-hash ETags even for bundled files, since every file in a jar shares one timestamp'
    },
    {
        layer: 'Frontend',
        built: 'Leaflet with CRS.Simple, plain ES modules and no build step; BroadcastChannel, DecompressionStream and the Popover API'
    },
    {
        layer: 'Mod',
        built: 'Fabric with Loom and Fabric API; the JDK’s own HTTP and WebSocket client, so the mod adds no networking library; Mod Menu optional, for the settings screen'
    },
    {
        layer: 'Tooling',
        built: 'Python and NumPy for the block data and colormaps; Python and headless Chrome for the branding images, rendered from real tiles; JUnit for the geometry, sampling, projection, overlay and pick-buffer maths'
    },
    {
        layer: 'Integrations',
        built: 'WorldGuard regions, vanilla and ChunkyBorder borders, Chunky pre-generation, marker import from other web maps, and a public marker API on Maven Central'
    }
];
