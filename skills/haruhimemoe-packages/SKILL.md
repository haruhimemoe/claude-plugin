---
name: haruhimemoe-packages
description: Use when building an osu! tournament tool on the @haruhimemoe npm packages (pools.haruhime.moe, sheets.haruhime.moe, packs.haruhime.moe or your own), choosing which package does a job, deciding what may run in the browser, installing them, or publishing or releasing them
---

# The @haruhimemoe packages

Small, separate packages, one repo each under github.com/haruhimemoe, shared by the haruhime.moe tools. Each does one job, and none does network, storage or UI unless that is its job.

| Job | Package | Runs in |
| --- | --- | --- |
| A pool's shape, slots, mods, pasted pools, pack keys (`pk1.`…) | `@haruhimemoe/pool` | anywhere |
| osu! data shapes (`BeatmapMeta`), links and cover image URLs (`coverUrl`), sign-in endpoints and scopes | `@haruhimemoe/osu/shapes` | anywhere |
| Calling the osu! API (beatmaps, sets, star ratings) with your client secret | `@haruhimemoe/osu` | **server only** |
| Difficulty metadata and `.osz` downloads with no osu! credentials | `@haruhimemoe/hinai` | anywhere, browsers included |
| Whether a map's music is allowed in a badged tournament (DMCA, restricted artists) | `@haruhimemoe/compliance` | anywhere |
| Logo, favicon, link preview image, palette | `@haruhimemoe/brand` (dev dependency, CLI) | build time |

## Which one?

- **Sign in with osu!:** `OSU_OAUTH`, `OSU_SIGN_IN_SCOPES` and `toOsuUser` from `@haruhimemoe/osu/shapes`; the token exchange runs in your server route (see `osu-api-v2`).
- **Map metadata in the browser:** `@haruhimemoe/hinai`. The osu! API needs a secret, so browsers never call it; your server does, for maps the mirror doesn't know.
- **Checking a pool's music:** get each set's fields with `@haruhimemoe/osu` on the server, then `factsFromOsuBeatmapset` and `evaluateBeatmapset` from `@haruhimemoe/compliance` (see `osu-mappool-content-rules`).
- **Sharing a pool:** `encodePackKey` / `decodePackKey` from `@haruhimemoe/pool` (see `osu-mappool-data`).
- **Branding a new app:** `bunx haruhime-brand <product>` (see `haruhime-brand`).

## How they fit

- **`@haruhimemoe/osu` owns the beatmap shapes** (`BeatmapMeta`, osu!'s row schemas). `@haruhimemoe/hinai` depends on `@haruhimemoe/osu/shapes`, so metadata from the mirror and from osu! has one type. Nothing else depends on another package.
- `@haruhimemoe/compliance` has no dependencies at all; its input type matches the beatmapsets `@haruhimemoe/osu` returns.
- `zod` is a **peer dependency** of `pool`, `osu` and `hinai`: install it yourself, **zod 4, 4.0.16 or later** (not zod 3; 4.0.0 to 4.0.15 break the published types). `bun add @haruhimemoe/pool zod`.
- All are ESM only, ship their own types and need Node 22.12 or later. All but `brand` (native PNG rendering) also run in Bun, browsers and edge runtimes.

## Releasing

- **Publish `@haruhimemoe/osu` before `@haruhimemoe/hinai`.** npm can't install hinai until the osu version it depends on exists. Then run `bun install` in hinai and commit its `bun.lock` (kept out of git until osu is on npm).
- Each repo's `release.yml` publishes from a GitHub release tag through npm trusted publishing (the `npm` environment, with provenance). Prereleases go to the `next` dist-tag.
- Pack keys are forever: a `@haruhimemoe/pool` release must never change a key an older version made. Its fixtures from packs.haruhime.moe are never regenerated.

## Common mistakes

- Importing `@haruhimemoe/osu` (the root) in a client component. Use `/shapes`.
- Installing zod 3, or leaving zod out.
- Copying a shape into an app instead of importing it from `@haruhimemoe/osu/shapes`.

## Sources

- READMEs of [pool](https://github.com/haruhimemoe/pool#readme), [osu](https://github.com/haruhimemoe/osu#readme), [hinai](https://github.com/haruhimemoe/hinai#readme), [compliance](https://github.com/haruhimemoe/compliance#readme) and [brand](https://github.com/haruhimemoe/brand#readme), all 0.1.0, checked 2026-09-23.
