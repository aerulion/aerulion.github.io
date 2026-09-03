# aerulion.net

[![Deploy to GitHub Pages](https://github.com/aerulion/aerulion.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/aerulion/aerulion.github.io/actions/workflows/deploy.yml)

My personal portfolio website showcasing my work as a Java developer and Minecraft plugin creator. Built with modern web
technologies for optimal performance and maintainability.

🌐 **Live Site:** [aerulion.net](https://aerulion.net)

## 🎛 Nyx, the design language

A true-monochrome technical plate, named for the Greek primordial night: `#000` is not a dark theme but the ground
everything is drawn out of, and `#fff` is the only thing that exists on it. The full guidelines live at
[`/design`](https://aerulion.net/design). The rules below are the whole system. If a change breaks one of them, it
belongs somewhere else.

Every part is filed under the same name: **Nyx Mark** (the logo), **Nyx Rule** (the hairline), **Nyx Cut** (the 30°
bevel), **Nyx Lattice** (the 60° field), **Nyx Plate** (the crop), **Nyx Gauge** (the scroll readout), **Nyx Curtain**
(the routing transition), **Nyx Glyph** (the icon) and **Nyx Scale** (the spacing ramp and the module of clear space).

- **Two colours.** Exactly `#000` and `#fff`. No greys, no tints, no alpha on text. Hierarchy comes from size, position
  and density, never from dimming.
- **30° and 60°, always.** Both angles are taken from the mark, an equilateral triangle with a 30/60 bolt cut. The tail
  drops exactly one third of the triangle's height below its base, which is what forces the lower edges to 30°. All
  fifteen edges are solved from one side length (X = 24) against lines offset by whole multiples of a single band width,
  so every stroke and every cut in the mark is exactly that width. Panel corners are bevelled at 30° (`.panel-cut`) and
  the cursor lattice is a 60° triangular grid. Nothing spins in the plane: an in-plane rotation is off-grid for all but
  six frames of its cycle, so motion runs _along_ the geometry instead. The one figure that turns, the hero mark, does
  it by rotating a four-axis lift of the outline and projecting back down, so every silhouette it passes through is
  still built from the same four lattice directions.
- **Hairlines are the layout.** A 1px rule does the work a box or a background would do elsewhere.
- **Instrumentation labels.** Small uppercase mono readouts (`Node / 001`, `Status / Active`, `02 / 03`) frame each
  block, the way a print registration mark or a telemetry panel would.
- **Falloff is density, not opacity.** The lattice dithers segments in and out so the field never renders a grey pixel.
- **Type**: Tektur for the wordmark, Chakra Petch for headings, Space Grotesk for copy, IBM Plex Mono for every label.
- **Rank runs backwards to measure.** One column, and a block takes the measure its rank calls for: 15ch for a section
  title, 52ch for a lede, 54ch for a note, 68ch for a rule, 72ch for prose. A longer line is a quieter line.
- **One ramp, fixed or travelling.** Spacing is `--spacing-*` (4/6/8/12/16/24/32/48/64/96/128) when it holds still and
  `--flow-*` when it does not. A flow step doubles, which is exactly two ramp stops, so both ends are on the ramp; it
  holds the lower stop below 640px and reaches the upper one at 1280px. No block sets a bespoke `clamp()` for a gap.
- **Filed under one name.** Each part answers to its Nyx name in the source: `Plate.astro` / `--plate-*`,
  `Curtain.astro` / `curtain.ts`, `Mark.astro` / `mark-geometry.ts` / `mark-hull.ts`, `gauge.ts`, `roll.ts`.
- **It has to work switched off.** Two inks is 21:1, one column is a reading order that cannot come apart, and under
  `prefers-reduced-motion` the lattice never mounts, the curtain never covers and readouts do not roll. The 2px focus
  ring is the only sanctioned break of the hairline law.

## 🚀 Tech Stack

- **[Astro](https://astro.build)** - Modern static site generator
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **TypeScript** - Type-safe development
- **GitHub Actions** - Automated deployment
- **GitHub Pages** - Hosting

## 🗂 Layout

```
src/
├── components/   one .astro file per block, styles scoped alongside
│   ├── Plate.astro           the four crop-mark rules pinned to the viewport
│   ├── LineConstruct.astro   the hexagon/triangle scaffolding behind the mark
│   ├── Glyph.astro           one icon, drawn on the lattice at hairline weight
│   ├── Mark.astro            the static mark, drawn then inked (404)
│   └── MorphingMark.astro    the same mark, wired for the unfold loop (hero)
├── data/         projects, timeline, stack, skills and the Nyx guidelines: the content edited most often
├── layouts/      the document shell: head, metadata, structured data
├── pages/        index, the Nyx guidelines (/design) and 404
├── scripts/      client-side behaviour, imported by the components that need it
│   ├── geometry.ts           allocation-light 2D primitives
│   ├── distance-field.ts     the sampled clearance field the lattice reads
│   ├── lattice-obstacles.ts  turns the live DOM into things to wrap around
│   ├── lattice-field.ts      the cursor lattice itself
│   ├── mark-hull.ts          the mark hull, and its reach as a function of angle
│   ├── mark-geometry.ts      the mark's geometry: lift, unfold, episode planning
│   ├── morphing-mark.ts      drives that geometry from a rAF loop
│   ├── figure-collide.ts     turns figure artwork into lattice obstacles
│   ├── gauge.ts              the scroll readout riding the right crop rule
│   ├── roll.ts               the digit-by-digit landing of a numeric readout
│   ├── copy-endpoint.ts      the click-to-copy handles
│   ├── curtain.ts            the routing curtain
│   └── reveal.ts             scroll reveals and self-drawing lines
├── styles/       global.css: tokens and the shared primitives
└── utils/        dates, build metadata, id generation
```

Pure modules are unit-tested beside the source as `*.test.ts`. Anything that needs a DOM lives in a component and is
covered by `astro check` plus the linter instead.

## 🛠 Development

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/aerulion/aerulion.github.io.git
   cd aerulion.github.io
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start development server**

   ```bash
   bun run dev
   ```

4. **Open in browser**
   ```
   http://localhost:4321
   ```

### Available Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `bun run dev`          | Start development server with hot reload       |
| `bun run build`        | Type-check, then build for production          |
| `bun run preview`      | Preview production build locally               |
| `bun test`             | Run the unit tests                             |
| `bun run lint`         | ESLint over `.ts` and `.astro`                 |
| `bun run format`       | Rewrite every file with Prettier               |
| `bun run format:check` | Fail if anything is unformatted                |
| `bun run check`        | Everything CI runs: format, lint, types, tests |
| `bun run astro`        | Run Astro CLI commands                         |

### Brand artwork

Everything that shows the mark is generated from `src/scripts/mark-geometry.ts`, so nothing is drawn by hand and nothing
can drift. Both scripts shoot real pages in headless Chrome and need Chrome plus `ffmpeg` on the machine.

| Command                       | Writes                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `bash brand/render/icons.sh`  | Every favicon, the maskable and apple icons, and the OG card, straight to `public/` |
| `bash brand/render/render.sh` | The Discord banner and avatar (PNG + GIF) and the lockscreen, to `brand/`           |

`icons.sh` sizes each icon by one number: `box`, the mark's square box as a fraction of the canvas. The favicons and the
Android icons use `0.86`, the Apple icon `0.78` because iOS rounds the corners, and the maskable icon `0.56` so the
box's diagonal still fits inside the 80% safe circle. `favicon.ico` is packed from the 16/32/48 renders by
`ico.mjs`; `favicon.svg` is written by `favicon-svg.mjs` at the same `0.86` so it frames identically to the raster set.

## ✅ Quality

Four gates, all of them run by CI before a deploy and all of them runnable at once with `bun run check`:

- **Prettier** owns formatting. The config in `.prettierrc` encodes the house style (4-space indent, single quotes, no
  bracket spacing, no trailing commas, 120 columns), so formatting is never a review topic. YAML, JSON and Markdown drop
  to 2-space indent via overrides.
- **ESLint** (`typescript-eslint` + `eslint-plugin-astro`, including its `jsx-a11y` rules) owns correctness and
  accessibility. It never reformats.
- **`astro check`** owns types, against `astro/tsconfigs/strict`.
- **`bun test`** owns the pure logic: date arithmetic, the 2D primitives, the mark hull's reach curve, and the mark's
  unfold and episode planning. No dependency beyond Bun itself.

## 📦 Deployment

Two workflows, one gate:

- **🔍 CI** (`ci.yml`) runs the four quality gates as a single job with a step per gate, so a failure names itself. It
  fires on every pull request, Dependabot's included, and is callable by other workflows.
- **🚀 Deploy** (`deploy.yml`) runs on pushes to `master`. It calls CI first and only builds once every gate is green,
  then publishes `dist/` to GitHub Pages. Nothing reaches the live site that has not passed formatting, linting, type
  checking and tests.

`PUBLIC_COMMIT_HASH` is supplied by the workflow and surfaces in the footer as the build stamp.

Deploy also runs on a schedule, on 1 January and 12 May. The copyright year and the age in the Context section are both
resolved at build time, so the site has to rebuild itself on the two days either of them changes.

## Built with ❤️ using Astro and Bun
