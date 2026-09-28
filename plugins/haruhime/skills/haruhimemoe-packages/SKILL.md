---
name: haruhimemoe-packages
description: Use when building an osu! tournament tool on the @haruhimemoe npm packages (packs.haruhime.moe, pools.haruhime.moe or your own), choosing which package or entry point does a job, deciding what may run in the browser, on a server, in an edge runtime or only at build time, checking which versions work together, or installing them
---

# The @haruhimemoe packages

Small, separate packages, one repo each under github.com/haruhimemoe, shared by the haruhime.moe tools. Each does one job, and none does network, storage or UI unless that is its job. Current versions: pool 0.2.0, osu 0.3.0, hinai 0.3.0, compliance 0.1.1, ui 0.4.0, brand 0.4.0, next-kit 0.1.0.

| Job | Package or entry point | Runs in |
| --- | --- | --- |
| A pool's shape, slots, mods, pasted pools, pack keys (`pk1.`…), which mods change a star rating | `@haruhimemoe/pool` | anywhere: browsers, servers, Bun, edge runtimes |
| The slur blocklist for published names; the packs and pools sync schemas | `@haruhimemoe/pool/content-filter`, `/service` (0.2.0) | anywhere |
| osu! data shapes (`BeatmapMeta`), links and cover image URLs (`coverUrl`), sign-in endpoints and scopes | `@haruhimemoe/osu/shapes` | browsers and servers |
| Display text for beatmap numbers (`m:ss`, stars, BPM, CS/AR/OD/HP, file sizes) | `@haruhimemoe/osu/format` (0.3.0) | anywhere (imports nothing) |
| Reading and writing osu!stable's `collection.db`, and the files osu!lazer's setup wizard imports | `@haruhimemoe/osu/collections` | browsers and servers (doesn't load zod) |
| Calling the osu! API (beatmaps, sets, star ratings) with your client secret | `@haruhimemoe/osu` | **server only** |
| Difficulty metadata and `.osz` downloads with no osu! credentials | `@haruhimemoe/hinai` | browsers, workers and servers |
| Mocking the hinai mirror in tests (msw 2) | `@haruhimemoe/hinai/testing` (0.3.0) | tests |
| Whether a map's music is allowed in a badged tournament (DMCA, restricted artists) | `@haruhimemoe/compliance` | servers, Bun, Deno, browsers (through a bundler) |
| The tools' look: the palette as a Tailwind 4 theme, buttons, forms, confirms, tables, filters, the site shell | `@haruhimemoe/ui` | **Next.js 16 apps only** (mostly Server Components) |
| Logo, favicon, link preview image, README banners | `@haruhimemoe/brand` (dev dependency, CLI) | **build time only** |
| Palette hex values in a page | `@haruhimemoe/brand/palette` (0.4.0) | anywhere (imports nothing) |
| A Next.js app's server side: JSON routes, rate limits and osu! budgets in MongoDB, env, the MongoDB client, osu! sign-in with better-auth | `@haruhimemoe/next-kit/<subpath>` (no root entry) | **servers**; only `/auth-react` in the browser |

## Which one?

- **Sign in with osu!:** `createOsuAuth` from `@haruhimemoe/next-kit/auth` (better-auth, osu! as the only provider), with `useAccount` from `/auth-react` in the browser (see `haruhime-next-kit`). Without better-auth: `OSU_OAUTH`, `OSU_SIGN_IN_SCOPES` and `toOsuUser` from `@haruhimemoe/osu/shapes`, with the token exchange in your server route (see `osu-api-v2`).
- **A route handler, a rate limit or a cron route:** `@haruhimemoe/next-kit/server`.
- **Map metadata in the browser:** `@haruhimemoe/hinai`. The osu! API needs a secret, so browsers never call it; your server does, for maps the mirror doesn't know.
- **Checking a pool's music:** get each set's fields with `@haruhimemoe/osu` on the server, then `factsFromOsuBeatmapset` and `evaluateBeatmapset` from `@haruhimemoe/compliance` (see `osu-mappool-content-rules`).
- **Adding maps to a player's osu! collections:** `@haruhimemoe/osu/collections`, in the page: the player's file never has to reach your server (see `osu-api-v2`).
- **Sharing a pool:** `encodePackKey` / `decodePackKey` from `@haruhimemoe/pool` (see `osu-mappool-data`).
- **A tool's pages:** `@haruhimemoe/ui`. Add `@import "@haruhimemoe/ui/theme.css";` after `@import "tailwindcss";` in the global stylesheet, and set `--hue` to the product's hue (see `haruhime-ui`).
- **Branding a new app:** `bunx haruhime-brand <product>` (see `haruhime-brand`).

## How they fit

- **`@haruhimemoe/osu` owns the beatmap shapes.** `@haruhimemoe/hinai` depends on it for `/shapes` only, so metadata from the mirror and from osu! has one type. hinai 0.3.x needs osu 0.3.x: if an app imports both, keep them on matching versions so there's one copy. next-kit's `/auth` takes osu 0.2 or 0.3 as an optional peer. No other package depends on another `@haruhimemoe` package.
- `@haruhimemoe/compliance` has no dependencies at all; its input type matches the beatmapsets `@haruhimemoe/osu` returns.
- `zod` is a **peer dependency** of `pool`, `osu` and `hinai` (**zod 4, 4.0.16 or later**; not zod 3, and 4.0.0 to 4.0.15 break the published types) and of `next-kit` (4.6.5 or later). Install it yourself: `bun add @haruhimemoe/pool zod`.
- `@haruhimemoe/ui`'s peers are `next` 16 (app router), `react` and `react-dom` 19, and `tailwindcss` 4.1 or later (below 5). It uses `next/link` and `next/navigation`, so it doesn't work in other frameworks.
- next-kit's other peers are optional, per subpath: `mongodb`, `mongoose`, `better-auth`, `react`, `next`, and for `/testing` `vitest`, `msw` and `mongodb-memory-server`.
- `@haruhimemoe/brand`'s `palette()` uses the same HSL recipe as `@haruhimemoe/ui`'s `theme.css`; apps style their pages with the theme.
- All are ESM only, ship their own types and need Node 22.12 or later. Never import the `@haruhimemoe/osu` root (it holds your secret), the `brand` root (native PNG rendering) or next-kit's server subpaths into browser code.
- Pack keys are forever: no `@haruhimemoe/pool` release may change a key an older version made.
- Every version is published from a GitHub release through npm trusted publishing, with provenance. `npm audit signatures` checks an install against it.

## Common mistakes

- Importing `@haruhimemoe/osu` (the root) in a client component. Use `/shapes`, `/format` or `/collections`.
- Importing `@haruhimemoe/next-kit` with no subpath: there's no root entry.
- Installing zod 3, or leaving zod out.
- Copying a shape, a formatter or a mod table into an app instead of importing it.
- Writing palette CSS by hand in a tool. Import `@haruhimemoe/ui/theme.css` and set `--hue`.

## Sources

- READMEs and CHANGELOGs of [pool](https://github.com/haruhimemoe/pool#readme) 0.2.0, [osu](https://github.com/haruhimemoe/osu#readme) 0.3.0, [hinai](https://github.com/haruhimemoe/hinai#readme) 0.3.0, [compliance](https://github.com/haruhimemoe/compliance#readme) 0.1.1, [ui](https://github.com/haruhimemoe/ui#readme) 0.4.0, [brand](https://github.com/haruhimemoe/brand#readme) 0.4.0 and [next-kit](https://github.com/haruhimemoe/next-kit#readme) 0.1.0, checked 2026-09-28.
- Each package's release workflow (`.github/workflows/release.yml`: a published GitHub release, `npm publish --provenance`), checked 2026-09-28.
