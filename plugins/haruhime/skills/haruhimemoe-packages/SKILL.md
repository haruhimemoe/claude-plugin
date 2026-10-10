---
name: haruhimemoe-packages
description: Use when building an osu! tool on the @haruhimemoe npm packages (packs.haruhime.moe, pools.haruhime.moe, bb.haruhime.moe or your own), choosing which package or entry point does a job, deciding what may run in the browser, on a server, in an edge runtime or only at build time, checking which versions work together, or installing them
---

# The @haruhimemoe packages

Small, separate packages, one repo each under github.com/haruhimemoe, shared by the haruhime.moe tools (osu! tools for players, mappers and hosts). Each does one job. Current versions: pool 0.4.0, osu 0.7.0, mirror 0.2.0, compliance 0.1.1, bbcode 0.2.3, tourney 0.2.1, time 0.1.0, invites 0.1.0, crowdfund 0.1.0, vcs 0.1.0, ui 0.25.0, brand 0.10.0, next-kit 0.17.1. `@haruhimemoe/hinai` is deprecated: use `@haruhimemoe/mirror/hinai`. READMEs: https://www.haruhime.moe/libraries/<name>.

| Job | Package or entry point | Runs in |
| --- | --- | --- |
| A pool's shape, slots, mods, pasted pools, pack keys (`pk1.`…), which mods change a star rating | `@haruhimemoe/pool` | anywhere, edge runtimes too |
| The slur blocklist for published names; the packs and pools sync schemas | `@haruhimemoe/pool/content-filter`, `/service` | anywhere |
| osu! data shapes (`BeatmapMeta`), links and cover image URLs (`coverUrl`), sign-in endpoints and scopes | `@haruhimemoe/osu/shapes` | browsers and servers |
| Display text for beatmap numbers (`m:ss`, stars, BPM, CS/AR/OD/HP, file sizes) | `@haruhimemoe/osu/format` | anywhere (imports nothing) |
| Reading and writing osu!stable's `collection.db`, and the files osu!lazer's setup wizard imports | `@haruhimemoe/osu/collections` | browsers and servers (doesn't load zod) |
| Calling the osu! API (beatmaps, sets, star ratings, users, matches) with your client secret; mp links at `/match`, lazer's bracket.json at `/tournament` | `@haruhimemoe/osu` | **server only** |
| Difficulty metadata and `.osz` downloads with no osu! credentials | `@haruhimemoe/mirror` (`/hinai`: hinai only; root: failover) | browsers, workers and servers |
| Mocking the hinai mirror in tests (msw 2) | `@haruhimemoe/mirror/testing` | tests |
| Whether a map's music is allowed in a badged tournament (DMCA, restricted artists) | `@haruhimemoe/compliance` | anywhere (through a bundler in browsers) |
| osu! BBCode: parse, render, lint, count; flags, gradients, imagemaps, templates | `@haruhimemoe/bbcode` (+ `/helpers`, `/imagemap`, `/flags`, `/template`, `/styles.css`) | anywhere (no dependencies) |
| Tournaments, brackets, groups, pick/ban logs, teams, registration; reading an mp link into a result (`/mp`) | `@haruhimemoe/tourney` | anywhere |
| Timezones, weekly availability, match slot finding, regions, `.ics` files | `@haruhimemoe/time` | anywhere |
| Invites as a state machine (pending, countered, accepted...), cooldowns, blocks | `@haruhimemoe/invites` | anywhere |
| Crowdfunding goals, tiers, donations, money math, Ko-fi/Stripe/PayPal webhook parsing | `@haruhimemoe/crowdfund` | anywhere (never moves money) |
| Revisions, diffs and 3-way merges of JSON and text | `@haruhimemoe/vcs` | anywhere (no dependencies) |
| The tools' look: a Tailwind 4 theme, buttons, confirms, dialogs, tables, filters, sortable lists, map cards, MDX content, the site shell | `@haruhimemoe/ui` | **Next.js 16 apps only** (mostly Server Components) |
| Logo, favicon, link preview image, README banners | `@haruhimemoe/brand` (dev dependency, CLI) | **build time only** |
| Palette hex values in a page | `@haruhimemoe/brand/palette` | anywhere (imports nothing) |
| A Next.js app's server side: JSON routes, rate limits and osu! budgets in MongoDB, env, the MongoDB client, osu! sign-in, account components | `@haruhimemoe/next-kit/<subpath>` (no root entry) | **servers**; only `/auth-react` in the browser |

## Which one?

- **Sign in with osu!:** `createOsuAuth` from `@haruhimemoe/next-kit/auth` (better-auth), with `useAccount` and the account components (`SignInWithOsu`, `AccountMenu`, `DeleteAccountForm`) from `/auth-react` (see `haruhime-next-kit`). Without better-auth: `OSU_OAUTH`, `OSU_SIGN_IN_SCOPES` and `toOsuUser` from `@haruhimemoe/osu/shapes`, with the token exchange in your server route (see `osu-api-v2`).
- **A route handler, a rate limit or a cron route:** `@haruhimemoe/next-kit/server`.
- **Map metadata in the browser:** `@haruhimemoe/mirror/hinai`. The osu! API needs a secret, so only your server calls it.
- **Checking a pool's music:** get each set's fields with `@haruhimemoe/osu` on the server, then `factsFromOsuBeatmapset` and `evaluateBeatmapset` from `@haruhimemoe/compliance` (see `osu-mappool-content-rules`).
- **Adding maps to a player's osu! collections:** `@haruhimemoe/osu/collections`, in the page, so the file stays with the player (see `osu-api-v2`).
- **Sharing a pool:** `encodePackKey` / `decodePackKey` from `@haruhimemoe/pool` (see `osu-mappool-data`). Saving packs under your own rules: `createPackInputSchema` from `/service`.
- **A tool's pages:** `@haruhimemoe/ui`: import its `theme.css` after Tailwind and set `--hue` (see `haruhime-ui`).
- **osu! BBCode** previews, lint or generators: `@haruhimemoe/bbcode`; escape typed text with `escapeBBCode` (see `osu-bbcode`).
- **Looking up players** on the server: `getUser` / `getUsers` (see `osu-api-v2`).
- **Branding a new app:** `bunx haruhime-brand <product>` (see `haruhime-brand`).

## How they fit

Peers, runtimes, zod versions, ESM and pack-key rules are in [fit.md](fit.md). The short version: zod 4 is a peer you install yourself, everything is ESM only on Node 22.12+, and server-only roots never go into browser code.

## Common mistakes

- Importing `@haruhimemoe/osu` (the root) in a client component. Use `/shapes`, `/format` or `/collections`.
- Importing `@haruhimemoe/next-kit` with no subpath: there's no root entry.
- Installing zod 3, or leaving zod out.
- Copying a shape, a formatter or a mod table into an app instead of importing it.
- Writing palette CSS by hand in a tool. Import `@haruhimemoe/ui/theme.css` and set `--hue`.

## Sources

- READMEs, CHANGELOGs and package.json of every package at https://github.com/haruhimemoe and the versions published on npm, checked 2026-10-10.
- Each package's release workflow (`.github/workflows/release.yml`: a published GitHub release, `npm publish --provenance`), checked 2026-09-28.
