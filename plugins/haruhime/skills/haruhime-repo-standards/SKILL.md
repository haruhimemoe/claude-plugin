---
name: haruhime-repo-standards
description: Use when writing or reviewing a CHANGELOG.md entry, preparing a version bump, or setting up the repo files of a haruhimemoe repository (a @haruhimemoe package, packs, pools, bb, haruhime.moe or this plugin)
---

# haruhime repo standards

Every haruhimemoe repository, packages and apps alike, keeps its changelog the same way, so people and tools (haruhime.moe reads them) can rely on one shape.

## Changelogs

Every repo has a `CHANGELOG.md` in [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) form with [Semantic Versioning](https://semver.org/spec/v2.0.0.html). That includes the apps: packs, pools, bb and haruhime.moe deploy every push to `main`, but they still cut numbered, dated releases.

The file, top to bottom:

1. `# Changelog`, one line saying what the file covers, and the line "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)." (an app may add one sentence of its own after it).
2. `## [Unreleased]`, always present and always the first `##` heading, even when empty.
3. Releases, newest first, each headed `## [x.y.z] - YYYY-MM-DD`.
4. Link references at the bottom: `[unreleased]: https://github.com/haruhimemoe/<repo>/compare/v<newest>...HEAD`, then one per release: `compare/v<previous>...v<this>`, and the first release `releases/tag/v<first>`.

Inside a release or Unreleased, only these `###` sections, in this order, and only the ones with entries: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.

### Writing an entry

- Every change that someone using the package or site could notice gets a line under `## [Unreleased]` in the same change. Internal refactors, test-only and CI-only changes don't.
- Write for the person using it: what they can now do or what behaves differently, with the API name or page in backticks. Not "refactored X".
- A dependency bump that changes behavior is an entry ("Depends on `@haruhimemoe/ui` 0.9.0: ..."); a silent bump isn't.
- Never edit a released entry. A correction goes in a new entry.

### Versions

- Patch (`0.4.1`): fixes and security only.
- While on `0.x`, anything that adds API or changes how something looks or behaves is a minor (`0.5.0`), not a patch. Packages enforce this with a changelog test (ui's `tests/packaging.test.ts` is the reference); apps carry the same test.
- The newest release heading always equals `version` in `package.json` (or `plugin.json` here).
- A release moves the Unreleased entries under a new `## [x.y.z] - YYYY-MM-DD` heading, leaves `## [Unreleased]` empty, bumps the version and adds the compare link. The tag `vx.y.z` and its GitHub release (notes: that section) are made by the maintainers; packages publish to npm from that release.

## Common mistakes

- `## Unreleased` without brackets, or no `[unreleased]` link.
- A release with no date, or a date heading with no version.
- Section names outside the six (`### New`, `### Docs`, `### Internal`).
- Two `### Changed` blocks inside one release.
- Releasing an app's whole history under `[Unreleased]` forever: cut a release when a batch ships.

## Related

- `haruhime-app-standards` for the API, key and crawl-file rules every app follows.
- `haruhimemoe-packages` for which package does what.

## Sources

- [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html), checked 2026-10-04.
- [@haruhimemoe/ui CHANGELOG](https://github.com/haruhimemoe/ui/blob/main/CHANGELOG.md) and its changelog test in [tests/packaging.test.ts](https://github.com/haruhimemoe/ui/blob/main/tests/packaging.test.ts), checked 2026-10-04.
