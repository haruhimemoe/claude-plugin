---
name: haruhimemoe-packages
description: Use when building an osu! tournament tool on the @haruhimemoe npm packages (pools.haruhime.moe, sheets.haruhime.moe, packs.haruhime.moe or your own), choosing which package does a job, deciding what may run in the browser, on a server, in an edge runtime or only at build time, or installing them
---

# The @haruhimemoe packages

Small, separate packages, one repo each under github.com/haruhimemoe, shared by the haruhime.moe tools. Each does one job, and none does network, storage or UI unless that is its job.

| Job | Package | Runs in |
| --- | --- | --- |
| A pool's shape, slots, mods, pasted pools, pack keys (`pk1.`…) | `@haruhimemoe/pool` | anywhere: browsers, servers, Bun, edge runtimes |
| osu! data shapes (`BeatmapMeta`), links and cover image URLs (`coverUrl`), sign-in endpoints and scopes | `@haruhimemoe/osu/shapes` | browsers and servers |
| Calling the osu! API (beatmaps, sets, star ratings) with your client secret | `@haruhimemoe/osu` | **server only** |
| Difficulty metadata and `.osz` downloads with no osu! credentials | `@haruhimemoe/hinai` | browsers, workers and servers |
| Whether a map's music is allowed in a badged tournament (DMCA, restricted artists) | `@haruhimemoe/compliance` | servers, Bun, Deno, browsers (through a bundler) |
| The tools' look: the palette as a Tailwind 4 theme, buttons, forms, filters, the site header and footer | `@haruhimemoe/ui` | **Next.js 16 apps only** (mostly Server Components) |
| Logo, favicon, link preview image, README banners, palette values | `@haruhimemoe/brand` (dev dependency, CLI) | **build time only** |

## Which one?

- **Sign in with osu!:** `OSU_OAUTH`, `OSU_SIGN_IN_SCOPES` and `toOsuUser` from `@haruhimemoe/osu/shapes`; the token exchange runs in your server route (see `osu-api-v2`).
- **Map metadata in the browser:** `@haruhimemoe/hinai`. The osu! API needs a secret, so browsers never call it; your server does, for maps the mirror doesn't know.
- **Checking a pool's music:** get each set's fields with `@haruhimemoe/osu` on the server, then `factsFromOsuBeatmapset` and `evaluateBeatmapset` from `@haruhimemoe/compliance` (see `osu-mappool-content-rules`).
- **Sharing a pool:** `encodePackKey` / `decodePackKey` from `@haruhimemoe/pool` (see `osu-mappool-data`).
- **A tool's pages:** `@haruhimemoe/ui`. Add `@import "@haruhimemoe/ui/theme.css";` after `@import "tailwindcss";` in the global stylesheet, and set `--hue` to the product's hue (see `haruhime-ui`).
- **Branding a new app:** `bunx haruhime-brand <product>` (see `haruhime-brand`).

## How they fit

- **`@haruhimemoe/osu` owns the beatmap shapes** (`BeatmapMeta`, osu!'s row schemas). `@haruhimemoe/hinai` depends on `@haruhimemoe/osu` and uses only its `/shapes`, so metadata from the mirror and from osu! has one type. If an app imports both, keep them on matching versions (0.1.x) so there's one copy. No other package depends on another `@haruhimemoe` package.
- `@haruhimemoe/compliance` has no dependencies at all; its input type matches the beatmapsets `@haruhimemoe/osu` returns.
- `zod` is a **peer dependency** of `pool`, `osu` and `hinai`: install it yourself, **zod 4, 4.0.16 or later** (not zod 3; 4.0.0 to 4.0.15 break the published types). `bun add @haruhimemoe/pool zod`.
- `@haruhimemoe/ui`'s peers are `next` 16 (app router), `react` and `react-dom` 19, and `tailwindcss` 4.1 or later (below 5). It uses `next/link` and `next/navigation`, so it doesn't work in other frameworks.
- `@haruhimemoe/brand` ships no CSS. Its `palette()` uses the same HSL recipe as `@haruhimemoe/ui`'s `theme.css`, as hex values for build-time drawings; apps style their pages with the theme.
- All are ESM only, ship their own types and need Node 22.12 or later. The `@haruhimemoe/osu` root is server-only (it holds your secret), and `brand` is build-time only (native PNG rendering): never import either into browser code or an edge runtime.
- Pack keys are forever: no `@haruhimemoe/pool` release may change a key an older version made.

## Common mistakes

- Importing `@haruhimemoe/osu` (the root) in a client component. Use `/shapes`.
- Installing zod 3, or leaving zod out.
- Copying a shape into an app instead of importing it from `@haruhimemoe/osu/shapes`.
- Writing palette CSS by hand in a tool. Import `@haruhimemoe/ui/theme.css` and set `--hue`.

## Sources

- READMEs of [pool](https://github.com/haruhimemoe/pool#readme), [osu](https://github.com/haruhimemoe/osu#readme), [hinai](https://github.com/haruhimemoe/hinai#readme) and [compliance](https://github.com/haruhimemoe/compliance#readme), all 0.1.0, checked 2026-09-24.
- [brand README](https://github.com/haruhimemoe/brand#readme) 0.3.0, checked 2026-09-24.
- [ui README](https://github.com/haruhimemoe/ui#readme) for 0.2.0 (npm had 0.1.0), checked 2026-09-24.
