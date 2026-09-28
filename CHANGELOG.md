# Changelog

All notable changes to the haruhime Claude Code plugin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Skill `packs`, for building, sharing and downloading osu! mappool packs with packs.haruhime.moe and its API.
- `packs` covers pack `stats`, the `/packs` filters, sort and pinned packs, and Copy ID on pack pages.
- `packs` covers the "Add to osu! collection" card on `/new`, `/k` and `/p/<slug>`: the osu!stable `collection.db` flow, the osu!lazer zip for the setup wizard import, and that the file stays in the browser.
- Skill `haruhime-ui`, for building a haruhime.moe tool's pages with `@haruhimemoe/ui`: setup, the theme and `--hue`, which component fits a job, client and server components, and accessibility.
- `llms.txt`, listing every skill with a link to its `SKILL.md`.
- Skill `pools`, for building an osu! tournament mappool on pools.haruhime.moe (in beta): osu! sign-in for anyone, `/new` and the editor (buckets, custom buckets with forced mods, paste, keyboard moves), the map browser's mod lens with its filters, sort and Add, the summary, co-editors, visibility, the synced pack with Download on packs, and Start from this pool. Past pools from otdb, tournament hosts and community submissions stay as reference: pool search by type (past, built or both), every osu! map (Check first, Unranked and explicit maps), map history, the check, Open in packs and sending a pool. Mod values come from the hinai mirror, and there's no public API. `pools/search-links.md` covers the map browser's `?browse=` link and every search param, and an eval case covers it.
- A README banner, and the haruhime.moe Discord server wherever the docs list help (README, CONTRIBUTING, SECURITY and `llms.txt`).
- Skill `haruhime-next-kit`, for building a haruhime.moe-style Next.js app's server side with `@haruhimemoe/next-kit` 0.1.0: the subpaths and their peers, wiring env, MongoDB, rate limits and osu! sign-in, a route handler, the osu! budget, bearer-auth routes and the test helpers. An eval case covers it, and the README, `llms.txt` and plugin description list it.

### Changed

- `haruhimemoe-packages` covers `@haruhimemoe/ui` (the theme import, Next.js 16 only) next to pool, osu, hinai, compliance and brand, and says where each package runs.
- `osu-api-v2` and `haruhimemoe-packages` cover `@haruhimemoe/osu` 0.2.0 and its browser-safe `/collections` entry point (osu!stable's `collection.db` and the osu!lazer import), and keep hinai 0.2.x with osu 0.2.x.
- `packs` says pools.haruhime.moe is in beta, and that its packs are pools built there and shared, and past pools from tournament hosts, community submissions and sources like otdb.
- The plugin description, README and `llms.txt` cover the pools.haruhime.moe pool builder, and the `no-trigger-*` evals fail if `pools` loads.
- `haruhime-ui` covers ui 0.3.0: `DiscordIcon` and `SiteFooter`'s `discordHref`.
- `hinai-mirror` and `haruhimemoe-packages` checked against hinai 0.2.0.
- `haruhime-brand` covers brand 0.3.0: the parent haruhime brand, README banners and the 11 files the CLI writes. Sites take the palette tokens from `@haruhimemoe/ui`'s `theme.css`.
- `haruhime-ui` covers ui 0.4.0: `InlineConfirm`, `TypeToConfirm`, `AsyncButton`, `Disclosure`, `RadioGroup`, `ChoiceChips`, `Badge`, `TextLink` and `linkClasses`, `LinkTabs`, `HeaderMenu`, the `Table` primitives, `StarRating`, `BeatmapStats`, `ModBadge`, `cx`, `Chip`'s `unavailableReason` and `Pagination`'s button mode. The component list moved to `haruhime-ui/components.md`, and an eval case covers the confirms.
- `osu-api-v2` covers osu 0.3.0: the `/format` entry point, a `userAgent` that must be printable ASCII, `retryAfterMs` null for a malformed `Retry-After`, and `OSU_BEATMAPSET_FALLBACK_LIMIT`.
- `hinai-mirror` covers hinai 0.3.0: it needs osu 0.3.x, the `/testing` msw mocks, a server `userAgent` or `baseUrl` that throws `RangeError`, an already-aborted signal and a safe `forensicsUrl`. Client details moved to `hinai-mirror/client.md`.
- `osu-mappool-data` covers pool 0.2.0: the `clash` and `digits` code rules, `changesStarRating`, `ratingMods`, `speedRate`, `displayPoolName` for untrusted key names, and the `/content-filter` and `/service` entry points. `pack-key-format.md` checked against 0.2.0 (the spec is unchanged).
- `haruhime-brand` covers brand 0.4.0: the browser-safe `/palette` entry, `favicon.ico` counted as a conflict, and the CLI stopping at symlinks that lead outside `--root`. The `brand-edge` eval allows `/palette` in an edge runtime.
- `osu-mappool-content-rules` covers compliance 0.1.1: hand-built facts without `moreInformation` need 0.1.1, and label tracks match by substring, so short track names flag unrelated titles.
- `haruhimemoe-packages` covers every package at its current version (pool 0.2.0, osu 0.3.0, hinai 0.3.0, compliance 0.1.1, ui 0.4.0, brand 0.4.0) and the new `@haruhimemoe/next-kit` 0.1.0, with the `/format`, `/testing`, `/palette`, `/content-filter` and `/service` entry points, which versions go together, and that every version is published with npm provenance from a GitHub release. It no longer names sheets.haruhime.moe, which isn't live. The `packages-map` eval accepts next-kit for sign-in.

### Fixed

- `hinai-mirror`: download one or two sets at a time, as the mirror asks (it said four). What an abort rejects with, which failures aren't a `HinaiError`, and what the shed and budget errors mean.
- `osu-api-v2`: `getBeatmapsets` keys its sets by difficulty id, any error status on a `/beatmaps` call throws (not only 429 and 5xx), and bad ids given to the batch lookups never throw.
- `osu-mappool-content-rules`: the Mlumìn // SoundWarper and MEGAREX gaps in the compliance data, and disallowed verdicts without a `reason`.
- `haruhime-brand`: adding a product no longer tells you to release a version. Releases are cut by the maintainers.
- `haruhime-brand`: `brandFiles` and `previewHtml` load the native PNG renderer too, not only `svgToPng` and the CLI.
- `haruhime-brand`: sheets.haruhime.moe isn't live yet, so the product table no longer links it.

## [0.1.0] - 2026-09-23

### Added

- Skills `osu-api-v2`, `osu-mappool-content-rules`, `osu-official-tournament-support`, `hinai-mirror`, `osu-mappool-data`, `haruhimemoe-packages` and `haruhime-brand`.
- The `haruhimemoe` marketplace; install with `/plugin install haruhime@haruhimemoe`.
- A `claude plugin eval` suite with a case for every skill and near-miss negatives.

[unreleased]: https://github.com/haruhimemoe/claude-plugin/compare/f73398f844d71f60ebedf5d89ec648c29bdb9f7d...HEAD
[0.1.0]: https://github.com/haruhimemoe/claude-plugin/tree/f73398f844d71f60ebedf5d89ec648c29bdb9f7d
