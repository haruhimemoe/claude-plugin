# Changelog

All notable changes to the haruhime Claude Code plugin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Skill `packs`, for building, sharing and downloading osu! mappool packs with packs.haruhime.moe and its API.
- `packs` covers map usage (`GET /beatmaps/{id}/usage` and `GET /beatmaps/usage`, no key), archive packs and their read-only `archive` field, and the search index's stats, `x`, `xk` and `xu`.

## [0.1.0] - 2026-09-23

### Added

- Skills `osu-api-v2`, `osu-mappool-content-rules`, `osu-official-tournament-support`, `hinai-mirror`, `osu-mappool-data`, `haruhimemoe-packages` and `haruhime-brand`.
- The `haruhimemoe` marketplace; install with `/plugin install haruhime@haruhimemoe`.
- A `claude plugin eval` suite with a case for every skill and near-miss negatives.

[unreleased]: https://github.com/haruhimemoe/claude-plugin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/haruhimemoe/claude-plugin/releases/tag/v0.1.0
