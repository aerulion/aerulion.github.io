# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Bun is the runtime and package manager; there is no npm/yarn path.

| Command                                 | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| `bun run dev`                           | Dev server on http://localhost:4321                       |
| `bun run build`                         | `astro check` then `astro build` into `dist/`             |
| `bun run check`                         | All four CI gates: format:check, lint, astro check, tests |
| `bun test`                              | Unit tests (Bun's runner, no extra framework)             |
| `bun test src/scripts/geometry.test.ts` | One test file                                             |
| `bun test -t "reach"`                   | Tests matching a name                                     |
| `bun run format`                        | Prettier rewrite (4-space, single quotes, 120 cols)       |

CI (`.github/workflows/ci.yml`) runs those four gates on every PR; `deploy.yml` calls CI and only then publishes `dist/` to GitHub Pages on pushes to `master`. Deploy also runs on cron for 1 January and 12 May, because the footer year and the age in the About section are both resolved at build time and would otherwise go stale.

## Design constraints

The site is a true-monochrome technical plate and the rules are load-bearing, not decorative: see the "Design language" section of `README.md` before changing anything visual. In short: only `#000` and `#fff` (no greys, tints, or alpha on text — hierarchy comes from size, position, and density); every angle is 30° or 60°, taken from the mark; 1px hairlines do the work of boxes and backgrounds; nothing rotates in-plane. Design tokens live in `:root` in `src/styles/global.css` — `--cut-x`/`--cut-y` (the 30° bevel), `--spacing-*` (the fixed ramp), `--flow-*` (the same ramp travelling, one step = two stops, 640px→1280px), `--plate-*`, type scale, easings. Never write a bespoke `clamp()` for a gap or padding; take a `--flow-*` step. Names follow the Nyx nomenclature in `README.md` — mark, rule, cut, lattice, plate, gauge, curtain, glyph, scale — and the code answers to them. Shared primitives (`.panel-cut`, `.mono-label`, `.section-*`, `.btn`, `.draw-path`) live there too; per-block styles stay scoped inside their `.astro` file.

## Architecture

**Astro static site, zero UI framework.** Each block is one `.astro` component in `src/components/` with its markup, scoped `<style>`, and (when it needs behaviour) a `<script>` that imports a `mount*()` function from `src/scripts/`. `src/pages/index.astro` composes the sections; `src/pages/404.astro` reuses the same shell. `src/layouts/Layout.astro` owns head, SEO/OG metadata, JSON-LD, font preloads, and mounts the page-wide behaviours (`mountReveals`, `mountMorphingMarks`, `mountGauge`, `mountRoll`, `mountFigureText`).

**Editable content lives in `src/data/`** (`projects.ts`, `timeline.ts`, `stack.ts`, `skills.ts`, `design.ts` for the Nyx guidelines, `glyphs.ts` for the icon paths) as typed exports — copy changes belong there, not in components.

**Split of testable logic vs. DOM code.** `src/scripts/` modules are pure where they can be and are unit-tested beside the source as `*.test.ts`; anything that touches the DOM lives in the mount function or the component and is covered by `astro check` + ESLint instead. Keep new geometry/planning logic on the pure side so it stays testable.

### The cursor lattice

A 60° triangular grid on a canvas that bends around real page content. The chain is:

1. `lattice-obstacles.ts` — `ObstacleIndex.scan()` walks `body *` once, reading computed styles to decide what each element contributes (painted background, border bands, text-node line rects, `.panel-cut` bevel outline), and splits results into `flow` (document space) vs `pinned` (viewport space, for fixed/sticky). `measure()` re-reads rects cheaply on scroll.
2. `distance-field.ts` — `DistanceField` samples those boxes/capsules/hulls into an 8px grid; `BAND` is the clearance radius the lattice honours.
3. `lattice-field.ts` — `mountLatticeField(canvas)` draws the grid, pulls vertices toward the pointer, and dithers segments in and out near obstacles. Falloff is density, never opacity.

Opting an element in/out is done with data attributes, not by editing the scanner: `data-collide="mark"` uses `MARK_HULL` from `mark-hull.ts` as the outline, `data-collide="lines"` + `data-segments` (JSON, 0–100 percentage coordinates) supplies explicit line capsules, `data-collide="none"` drops an element from the index entirely (used by the opaque frame margin, which paints over the lattice rather than deflecting it). The component is skipped entirely under `prefers-reduced-motion`.

### The morphing mark

`mark-geometry.ts` holds the geometry and is the most subtle code in the repo. The mark outline is classified into the four lattice directions (30/60/120/150°), lifted into 4D, rotated there, and projected back — that is why every silhouette the mark passes through is still built from the same four axes, and why nothing rotates in-plane. `unfold()` produces a frame, `planEpisode()`/`episodeBeat()` schedule the loop, and `toPath`/`ladderPath` serialise to SVG. `morphing-mark.ts` only drives that from a rAF loop over elements marked `data-morphing-mark`; `MorphingMark.astro` renders the shell and passes tuning through data attributes. `Mark.astro` is the static variant (404).

### Cross-cutting DOM contracts

- `data-reveal` / `data-draw` — picked up by `reveal.ts` via IntersectionObserver, which adds `is-revealed` / `is-drawn`. The inline script in `Layout.astro` adds `.js` before paint so targets start hidden, with a 4s dead-man's timeout that unhides everything if a module fails to load.
- `data-curtain` — the routing curtain (`curtain.ts`), which also gates the first-visit intro via `sessionStorage`.
- `data-copy` / `data-copy-note` — click-to-copy handles (`copy-endpoint.ts`).
- SVG ids must come from `uid()` in `src/utils/uid.ts`; a component can appear more than once per page.
- `PUBLIC_COMMIT_HASH` is injected by the deploy workflow and read in `src/utils/git.ts`; it falls back to `dev` locally.

## Conventions

- Commit messages: gitmoji shortcode + conventional type + capitalised sentence, e.g. `:recycle: chore: Simplify button variants in Hero`.
- Prettier owns formatting entirely — never hand-format, just run it. ESLint (typescript-eslint + eslint-plugin-astro, including its jsx-a11y rules) owns correctness and a11y and never reformats.
- Types are checked with `astro check` against `astro/tsconfigs/strict`.
