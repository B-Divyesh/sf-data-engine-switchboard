# Visual thesis: concrete switch room, reclaimed by moss

Data Engine Switchboard should feel like a maintenance panel bolted into a concrete data plant: blunt, legible, and built to reveal what is actually connected. Moss is the living signal in that hard environment. It marks the safe route through a migration without turning the tool into a generic green developer dashboard.

## Palette

This is an intentionally single-mode, explicitly painted light interface. The physical metaphor depends on chalky concrete in daylight; a token dark theme would weaken it.

| Token | Value | Use |
| --- | --- | --- |
| `concrete-0` | `#F2EFE5` | page ground |
| `concrete-1` | `#DDD8C8` | slabs and secondary surfaces |
| `concrete-2` | `#B9B3A2` | heavy borders and inactive rails |
| `charcoal` | `#182019` | primary text and controls |
| `charcoal-muted` | `#4B554B` | supporting copy (7.1:1 on ground) |
| `moss` | `#315C35` | links, pass states, active routes |
| `lichen` | `#D7F45B` | high-attention signal against charcoal |
| `rust` | `#9A3F2E` | failure and no-go states |
| `amber` | `#785700` | warning and heuristic states |

Color never carries status alone: every signal is paired with a word, icon, or pattern.

## Type

- **Operations face:** `Arial Narrow`, `Aptos Narrow`, `Roboto Condensed`, then system sans. Uppercase labels, dense report headings, and display type recall stencilled equipment plates without downloading a font.
- **Evidence face:** `ui-monospace`, `SFMono-Regular`, Consolas, monospace. Commands, measurements, plans, and report fields use tabular figures.
- Body copy is 16–18px with 1.55 leading and a maximum 68-character measure. The scale is 12 / 14 / 16 / 20 / 32 / 64px.

## Spacing and structure

An 8px base grid, with 4px only for tightly related evidence labels. Page gutters are 24px on phone and 40–64px on larger screens. Thick 2px rules act as conduit routes; 4px borders mark the primary command and decision output. Cards are avoided for general layout—slabs appear only for independent measured facts or a discrete migration case.

Corners are nearly square (0–4px). Shadows are hard offset slabs, never soft elevation. The phone layout drops decorative plan annotations, stacks evidence vertically, and keeps commands horizontally scrollable rather than shrinking them below readability.

## Interaction grammar

- Controls depress by `translate(2px, 2px)` into their hard shadow.
- Copy actions change their stamped label to “Copied” and announce through a live region.
- The report demo behaves like a switchboard: selecting a fixture reroutes one horizontal signal and updates a measured-versus-heuristic evidence tray.
- Focus is a 3px lichen outline with a 3px charcoal offset, obvious on every surface.
- Purchase and license restoration stay in the pricing section; there are no modal nags.

## Motion policy

Motion only explains routing. On first view, the hero signal line draws once over 500ms; report evidence fades and moves 8px from its source over 180ms. Buttons respond over 120ms. There is no looping animation. Under `prefers-reduced-motion: reduce`, line drawing and movement are removed; all states appear immediately and only color/label changes remain.

## Original asset plan and provenance

One raster hero, `site/public/switchboard-hero.webp`, will depict a top-down brutalist concrete switching plate with three moss-green conduits diverging toward PASS, REVIEW, and STOP-like physical zones. It carries no words, logos, people, UI screenshots, or gradients; HTML supplies all meaningful labels and alternative text. It clarifies the product metaphor while leaving the actual CLI evidence to live markup.

- Generator: factory `gen-image.sh` deployment (`factory-image`), requested by the work order.
- Planned prompt: “Top-down editorial still life of a brutalist concrete industrial switchboard plate, three inset data conduits branching with distinct physical outcomes, restrained living moss tracing one route, oxidized steel fasteners, chalk and aggregate texture, severe daylight, flat near-orthographic composition, desaturated concrete and deep forest green with a small electric lichen accent, generous negative space, tactile photographic collage, no screens, no people, no text, no letters, no numbers, no logos, no watermark, no gradient.”
- License: project-original generated asset, released under the repository MIT license.
- Post-processing: crop/resize and WebP conversion locally; final file must remain at or below 300 KB.

All UI icons are hand-made CSS geometry or text glyphs; no third-party icon set or stock imagery is used.
