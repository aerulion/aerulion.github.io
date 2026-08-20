# aerulion.net

[![Deploy to GitHub Pages](https://github.com/aerulion/aerulion.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/aerulion/aerulion.github.io/actions/workflows/deploy.yml)

My personal portfolio website showcasing my work as a Java developer and Minecraft plugin creator. Built with modern web
technologies for optimal performance and maintainability.

🌐 **Live Site:** [aerulion.net](https://aerulion.net)

## 🎛 Design language

A true-monochrome technical poster. The rules below are the whole system — if a change breaks one of them, it belongs
somewhere else.

- **Two colours.** Exactly `#000` and `#fff`. No greys, no tints, no alpha on text. Hierarchy comes from size, position
  and density, never from dimming.
- **30° and 60°, always.** Both angles are taken from the logo — an equilateral triangle with a 30/60 bolt cut. Panel
  corners are bevelled at 30° (`.panel-cut`), the cursor lattice is a 60° triangular grid, and nothing rotates: a
  rotating figure is off-grid for all but six frames of its cycle, so motion runs *along* the geometry instead.
- **Hairlines are the layout.** A 1px rule does the work a box or a background would do elsewhere.
- **Instrumentation labels.** Small uppercase mono readouts (`Node / 001`, `Status / Active`, `02 / 03`) frame each
  block, the way a print registration mark or a telemetry panel would.
- **Falloff is density, not opacity.** The lattice dithers segments in and out so the field never renders a grey pixel.
- **Type**: Tektur for the wordmark, Chakra Petch for headings, Space Grotesk for copy, IBM Plex Mono for every label.

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
│   └── ScreenFrame.astro     the four crop-mark rules pinned to the viewport
├── data/         projects, timeline, stack and skills — the content edited most often
├── layouts/      the document shell: head, metadata, structured data
├── pages/        index and 404
├── scripts/      client-side behaviour, imported by the components that need it
│   ├── geometry.ts           allocation-light 2D primitives
│   ├── lattice-obstacles.ts  turns the live DOM into things to wrap around
│   ├── lattice-field.ts      the cursor lattice itself
│   ├── page-transition.ts    the routing curtain
│   └── reveal.ts             scroll reveals and self-drawing lines
├── styles/       global.css — tokens and the shared poster primitives
└── utils/        dates, build metadata, id generation
```

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

| Command           | Description                              |
|-------------------|------------------------------------------|
| `bun run dev`     | Start development server with hot reload |
| `bun run build`   | Type-check, then build for production    |
| `bun run preview` | Preview production build locally         |
| `bun run astro`   | Run Astro CLI commands                   |

## 📦 Deployment

The site automatically deploys to GitHub Pages when you push to the main branch. `PUBLIC_COMMIT_HASH` is supplied by the
workflow and surfaces in the footer as the build stamp.

## Built with ❤️ using Astro and Bun
