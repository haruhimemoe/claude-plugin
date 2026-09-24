# Changelog

All notable changes to the haruhime Claude Code plugin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Skill `packs`, for building, sharing and downloading osu! mappool packs with packs.haruhime.moe and its API.
- `packs` covers map usage (`GET /beatmaps/{id}/usage` and `GET /beatmaps/usage`, no key), archive packs and their read-only `archive` field, and the search index's stats, `x`, `xk` and `xu`.
- `packs` covers pack `stats`, the `/packs` filters, sort and pinned packs, Copy ID and "Used in N pools" on pack pages, and the archived pools guide.
- Skill `haruhime-ui`, for building a haruhime.moe tool's pages with `@haruhimemoe/ui`: setup, the theme and `--hue`, which component fits a job, client and server components, and accessibility.
- `llms.txt`, listing every skill with a link to its `SKILL.md`.

### Changed

- `haruhimemoe-packages` covers `@haruhimemoe/ui` (the theme import, Next.js 16 only) next to pool, osu, hinai, compliance and brand, and says where each package runs.
- `haruhime-brand` covers brand 0.3.0: the parent haruhime brand, README banners and the 11 files the CLI writes. Sites take the palette tokens from `@haruhimemoe/ui`'s `theme.css`.

### Fixed

- `hinai-mirror`: download one or two sets at a time, as the mirror asks (it said four). What an abort rejects with, which failures aren't a `HinaiError`, and what the shed and budget errors mean.
- `osu-api-v2`: `getBeatmapsets` keys its sets by difficulty id, any error status on a `/beatmaps` call throws (not only 429 and 5xx), and bad ids given to the batch lookups never throw.
- `osu-mappool-content-rules`: the Mlumìn // SoundWarper and MEGAREX gaps in the compliance data, and disallowed verdicts without a `reason`.
- `haruhime-brand`: adding a product no longer tells you to release a version. Releases are cut by the maintainers.

## [0.1.0] - 2026-09-23

### Added

- Skills `osu-api-v2`, `osu-mappool-content-rules`, `osu-official-tournament-support`, `hinai-mirror`, `osu-mappool-data`, `haruhimemoe-packages` and `haruhime-brand`.
- The `haruhimemoe` marketplace; install with `/plugin install haruhime@haruhimemoe`.
- A `claude plugin eval` suite with a case for every skill and near-miss negatives.

[unreleased]: https://github.com/haruhimemoe/claude-plugin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/haruhimemoe/claude-plugin/releases/tag/v0.1.0
