# Changelog

All notable changes to the haruhime Claude Code plugin are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- haruhime-app-standards: mobile and PWA rules in a new `mobile-pwa.md`. Build at 375px, no sideways scroll, `relative` on clipping boxes that hold `.sr-only` text, 44px touch targets through ui's `coarse:` variant, a Playwright phone check, and the `/pwa` wiring every app ships (manifest, service worker, viewport and iOS metadata, icons) with what the service worker may and may not cache. haruhime-ui and haruhime-next-kit point to it and cover ui 0.24.0 and next-kit 0.16.0's `/pwa`. New `mobile-pwa` eval.

### Changed

- haruhimemoe-packages: pool 0.4.0 (`createPackInputSchema`), ui 0.25.0, next-kit 0.17.1, bbcode 0.2.3, mirror 0.2.0 and tourney 0.2.1.
- haruhimemoe-packages lists today's versions (osu 0.7.0, ui 0.24.0, next-kit 0.16.0 and the rest) and adds tourney, time, invites, crowdfund and vcs to the routing table. Peers and runtimes moved to a new `fit.md` to keep the skill under 900 words. The README and llms.txt package lists match.
- CI: CodeQL and a gitleaks history scan run on every push and pull request.
- hinai-mirror and haruhimemoe-packages point at `@haruhimemoe/mirror` 0.1.0 instead of the deprecated `@haruhimemoe/hinai`: `/hinai` for the hinai client, `/testing` for the msw mocks, and the root `createMirrorClient` for failover across mirrors (hinai first). The hinai-abort-retry eval asks about the new import path.
- haruhime-ui: the confirm rule follows @haruhimemoe/ui 0.14.0: no confirm with an Undo, `InlineConfirm` in the row, `ConfirmDialog` for destructive actions that affect others or sit in a table cell or menu, `typeToConfirm` for accounts and ownership. `Dialog`, `ConfirmDialog` and the `danger` button are listed. haruhime-next-kit: `DeleteAccountForm` opens a dialog from next-kit 0.8.0.
- The ui-confirm eval asks about ui 0.14.0 and accepts `ConfirmDialog` with `typeToConfirm`; it still fails a hand-built modal.
- haruhime-ui covers @haruhimemoe/ui 0.15.0: sortable lists (`SortableList`, `useSortable`), when to keep Up and Down, and hand-rolled drag and drop as a common mistake.
- haruhime-ui covers `@haruhimemoe/ui` 0.16.0: MapCard, MapSetCard, MapGroup, MapCover, MapPreviewButton, MapCopyScope and CopyButton's status placement.
- haruhime-ui covers `@haruhimemoe/ui` 0.17.0: `Toc`, `Kbd`, the MDX article pieces (`Figure`, `Steps`, `Embed`, `MdxLinkCard`, `Schedule`, `Glossary`, `Term`), the sanitize helpers and `ContentPage`'s byline/reading-time/toc/footer. `haruhimemoe-packages` names ui's dialogs, sortable lists, map cards and MDX content.
- haruhime-ui covers `@haruhimemoe/ui` 0.18.0: chevron Up/Down move buttons, Button `size="sm"`, `orientation`.
- haruhime-app-standards: the five legal pages every app ships (`terms`, `privacy`, `your-privacy-rights`, `copyright`, `disclaimers`), the `@haruhimemoe/next-kit/legal` blocks and `LegalSite` config, `next-kit check` 0.10.0 requiring all five, and the site-wide command palette (`AppPalette`). haruhime-next-kit covers 0.11.0 and its `legal` entry point, including `legalMarkdownTransform` for the `.md` mirrors.
- Discord link is now https://haruhime.moe/discord and the contact email is haruhime@haruhime.moe.

## [0.6.0] - 2026-10-04

### Changed

- `haruhime-app-standards` covers the shipped app standards phase 2 (2026-10-04): `/docs`, `/guides`, `/legal` and `/brand` as one opt-in content registry, the cookie cutter file list, per-app rollout (packs `30c9530`, pools `79607c7`, bb `8c7e9a6`), and `next-kit check`'s `brand`/`legal`/`docs`/`guides` standards and `content/docs/api.mdx`. New reference file `content-pages.md`.
- `haruhime-next-kit` covers next-kit 0.6.1's `docs` and `docs/files` entry points: `defineContent`, `mdxToMarkdown`, the llms/sitemap/rewrite builders, `readContentMarkdown`, `contentFileDrift`. New reference file `docs.md`.
- `haruhime-ui` covers ui 0.11.0's `ContentLayout`, `ContentNav`, `ContentSearch`, `ContentIndex`, `ContentPage`, `CopyMarkdownButton`, `BrandPage` and `BrandSwatch`, plus 0.11.1's `BrandPage` empty-`alt` fix, detailed in `components.md`.
- `haruhime-brand` covers brand 0.7.0's `brandPageData`, `BRAND_CONTACT` and the browser-safe `/products` entry.
- `packs` and `pools` point at their shipped content pages: packs' `/guide` is `/guides`, plus a `/legal` row; pools gains `/docs` (API only, no guides yet), `/legal` and `/brand`.

### Fixed

- `haruhime-app-standards`: the "Crawl files" trim had dropped that bb's `robots.ts` also disallows `/me` (its separate "my templates" page) alongside `/account`; restored.
- `haruhime-app-standards`: `content-pages.md` lists haruhime.moe as merged (`79e9128`), not in progress.
- `haruhime-ui`: now says 0.11.1, not 0.11.0 (a `BrandPage` alt-text fix shipped after this task's first pass, and all four apps are on it: haruhime.moe `79e9128`, packs `ae59cb6`, pools `e132078`, bb `9dd347b`). Restored the dropped `unavailableReason` example ("EZ while HR is on").

## [0.5.0] - 2026-10-04

### Added

- Skill `haruhime-repo-standards`: how every haruhimemoe repo, packages and apps alike, keeps its CHANGELOG.md (Keep a Changelog 1.1.0 sections, an always-present `[Unreleased]`, dated semver releases, compare links) and which version bump a change needs on 0.x.
- Skill `haruhime-app-standards`: the rulebook every haruhime.moe app (packs, pools, bb or a new one) follows for its API key format and prefix registry (`hpk_` packs, `hpl_` pools, `hbb_` bb), the `/api/v1` guard and its rate limits, the routes an app's API serves, the crawl files (robots.txt, sitemap, llms.txt, llms-full.txt, security.txt) and the `next-kit check` standards check, plus a new-app checklist. Covers `@haruhimemoe/next-kit` 0.5.0's `api-keys` entry point and `next-kit check` bin.

### Changed

- `haruhime-next-kit` covers next-kit 0.5.0's `/api-keys` subpath (`createApiKeyStore`, `createApiKeyGuard`) and the `next-kit check` bin, pointing at `haruhime-app-standards` for the shared rules.
- `packs` and `pools` point their key format and rate-limit details at `haruhime-app-standards`; `pools`' "No public API" became "The API", covering its new `GET /api/v1/me` route (`hpl_` keys).
- `haruhime-app-standards` points at `haruhime-repo-standards` for changelogs.

### Fixed

- The changelog links 0.4.0 and compares Unreleased from it.

## [0.4.0] - 2026-10-02

### Changed

- `haruhime-ui` covers ui 0.6.0: `SiteFooter`'s `tools` prop (the "haruhime tools" column), `HARUHIME_TOOLS` and `haruhimeToolsColumn`.
- `haruhime-next-kit` covers next-kit 0.4.0: the `/seo` subpath (0.3.0: `siteMetadata`, `homeMetadata`, `pageMetadata`, `notFoundMetadata`, `pageTitle`, `clampDescription`, `robots` and `AI_BOTS`, `sitemapEntries`, the `ld` JSON-LD builders and `HARUHIME_ORG`, `llmsTxt`, `llmsFull`, `textResponse`) and 0.4.0's short title suffix, with a new common mistake: hand-built metadata.
- `haruhime-brand` covers brand 0.6.0: per-page link previews with `ogCardSvg` and `ogCard`, `OG_CARD`, `asciiText` and `fitLines`.
- `osu-bbcode` covers bbcode 0.2.2: `OSU_WIDTHS` and `OSU_FONT_SIZES` for previews that wrap where osu! does.
- `haruhimemoe-packages` lists every package at its npm version (bbcode 0.2.2, ui 0.6.0, brand 0.6.0, next-kit 0.4.0).
- Every package skill points at its README rendered on haruhime.moe (`/libraries/<name>`, with live npm and GitHub numbers on `/libraries`).
- bb.haruhime.moe is live (since 2026-09-28): `osu-bbcode`, `haruhime-brand`, the README and `llms.txt` no longer say it's launching soon.

### Added

- Reference files `haruhime-next-kit/seo.md` (the `/seo` helpers, each site's wiring, gotchas) and `haruhime-brand/page-cards.md` (per-page link previews).

## [0.3.0] - 2026-09-28

### Added

- Skill `osu-bbcode`, for osu! BBCode in userpages, forum posts and beatmap descriptions: the tags osu! reads and what it does with them (`[centre]`, not `[center]`; sizes clamped to 30..200 with osu!'s 50, 85, 100 and 150; list titles; boxes and spoilerboxes; the imagemap line format; profile links; YouTube ids and links; the 60,000 character limit), the gotchas (crossed tags, a tag inside itself, SVG flags filling their width), and `@haruhimemoe/bbcode` 0.2.0: `parse`, `serialize`, `render`, `lint`, `count`, `LIMITS`, `TAGS`, `/helpers` (`escapeBBCode`, `flag` defaulting to the legacy PNG, `gradient` and its character cost), `/imagemap`, `/flags`, `/template` (`{{key}}` fields and `FIELD_KINDS`) and `/styles.css`. It says bb.haruhime.moe, the editor built on it, is launching soon. `osu-bbcode/tags.md` has every tag, newline handling and imagemaps; the `bbcode-userpage` eval case covers it.

### Changed

- haruhime.moe is described as osu! tools for players, mappers and hosts, not only tournament tools: the plugin and marketplace descriptions, README, `llms.txt` and AGENTS.md. The plugin's keywords add `bbcode` and `userpage`.
- `haruhime-ui` covers ui 0.5.0: `Tabs`, `CharCounter`, `VisibilitySelect` and `ReportDisclosure`.
- `haruhime-next-kit` covers next-kit 0.2.1: the `/auth-react` account components (`SignInWithOsu`, `SignOutButton`, `AccountMenu`, `DeleteAccountForm`, bound with `createAuthComponents`), `osuAvatarSrc`, `signInErrorMessage`, the `@haruhimemoe/ui` ^0.5.0 peer, and `@haruhimemoe/osu` ^0.4.0 accepted as a peer.
- `osu-api-v2` covers osu 0.4.0: `getUser` and `getUsers`, and the osu! user endpoints they call.
- `hinai-mirror` covers hinai 0.3.1, which needs osu 0.4.x.
- `haruhime-brand` covers brand 0.5.0: the `bb` product (`bb.`, hue 265) and haruhime's new tagline, "osu! tools for players, mappers and hosts".
- `haruhimemoe-packages` covers every package at its npm version (pool 0.2.0, osu 0.4.0, hinai 0.3.1, compliance 0.1.1, bbcode 0.2.0, ui 0.5.0, brand 0.5.0, next-kit 0.2.1), adds `@haruhimemoe/bbcode` and player lookups, and says which versions go together.

## [0.2.0] - 2026-09-28

### Added

- Skill `packs`, for building, sharing and downloading osu! mappool packs with packs.haruhime.moe: its pages (the owner's `/p/<slug>/edit` and `/brand` too), pack keys, the "Add to osu! collection" card (osu!stable's `collection.db`, the osu!lazer zip for the setup wizard, and the file staying in the browser), downloads through the hinai mirror, and the API with its keys, pack `stats`, pinned packs and the search index. `packs/api.md` is a copy of the live API docs. It says pools.haruhime.moe is in beta, and that its packs are pools built there and past pools from tournament hosts, community submissions and sources like otdb.
- Skill `pools`, for building an osu! tournament mappool on pools.haruhime.moe (in beta), editor v2.1 included: osu! sign-in for anyone, `/new` and its templates (Qualifiers, Group stage, Knockout, Finals), which set slot counts only, slot targets (0 to 16 maps and an optional star range), built-in and custom slots with forced mods, paste, drag and drop with keyboard buttons, slot notes that public pages show, covers and preview clips from osu!'s servers, undo (20 steps, no redo), export (IDs with slot labels, `!mp map <id> 0` and `!mp mods` lines, CSV), Recent changes for the owner and editors, the map browser's mod lens with its filters, sort and Add, the summary, co-editors, visibility, the synced pack with Download on packs, and Start from this pool. Past pools from otdb, tournament hosts and community submissions stay as reference: pool search by type (past, built or both), every osu! map (Check first, Unranked and explicit maps), map history, the check and sending a pool. Mod values come from the hinai mirror, and there's no public API. `pools/editor.md` has the editor's detail and `pools/search-links.md` every link param; eval cases cover links, export and undo.
- Skill `haruhime-ui`, for building a haruhime.moe tool's pages with `@haruhimemoe/ui` 0.4.0: setup, the theme and `--hue`, which component fits a job (`haruhime-ui/components.md`, with 0.4.0's confirms, tables, link tabs, header menu, badges, text links, disclosure, radio group, choice chips, osu! display pieces and `cx`), client and server components, and accessibility. Eval cases cover setup and the confirms.
- Skill `haruhime-next-kit`, for building a haruhime.moe-style Next.js app's server side with `@haruhimemoe/next-kit` 0.1.0: the subpaths and their peers, wiring env, MongoDB, rate limits and osu! sign-in, a route handler, the osu! budget, bearer-auth routes and the test helpers. An eval case covers it.
- `llms.txt`, listing every skill and reference file with a link to it.
- A README banner, and the haruhime.moe Discord server wherever the docs list help (README, CONTRIBUTING, SECURITY and `llms.txt`).
- Issue templates (a wrong or broken skill, a skill request, and links to the Discord server and private vulnerability reporting), a pull request checklist and `CODEOWNERS`.

### Changed

- The plugin description, README and `llms.txt` cover the pools.haruhime.moe pool builder, the UI components and the Next.js server kit, and the `no-trigger-*` evals fail if any skill loads.
- `haruhimemoe-packages` covers every package at its npm version (pool 0.2.0, osu 0.3.0, hinai 0.3.0, compliance 0.1.1, ui 0.4.0, brand 0.4.0) and the new `@haruhimemoe/next-kit` 0.1.0: each entry point (`/shapes`, `/collections`, `/format`, `/testing`, `/palette`, `/content-filter`, `/service`), where each runs, which versions go together, and that every version is published with npm provenance from a GitHub release. It no longer names sheets.haruhime.moe, which isn't live. The `packages-map` eval accepts next-kit for sign-in.
- `osu-api-v2` covers osu 0.3.0: the browser-safe `/collections` (osu!stable's `collection.db` and the osu!lazer import) and `/format` entry points, a `userAgent` that must be printable ASCII, `retryAfterMs` null for a malformed `Retry-After`, and `OSU_BEATMAPSET_FALLBACK_LIMIT`.
- `hinai-mirror` covers hinai 0.3.0: it needs osu 0.3.x, the `/testing` msw mocks, a server `userAgent` or `baseUrl` that throws `RangeError`, an already-aborted signal and a safe `forensicsUrl`. Client details moved to `hinai-mirror/client.md`.
- `osu-mappool-data` covers pool 0.2.0: the `clash` and `digits` code rules, `changesStarRating`, `ratingMods`, `speedRate`, `displayPoolName` for untrusted key names, and the `/content-filter` and `/service` entry points. `pack-key-format.md` checked against 0.2.0 (the spec is unchanged).
- `haruhime-brand` covers brand 0.4.0: the parent haruhime brand, README banners, the 11 files the CLI writes, the browser-safe `/palette` entry, `favicon.ico` counted as a conflict, and the CLI stopping at symlinks that lead outside `--root`. Sites take the palette tokens from `@haruhimemoe/ui`'s `theme.css`. The `brand-edge` eval allows `/palette` in an edge runtime.
- `osu-mappool-content-rules` covers compliance 0.1.1: hand-built facts without `moreInformation` need 0.1.1, and label tracks match by substring, so short track names flag unrelated titles.
- `scripts/validate.mjs` also checks that `llms.txt` lists exactly the skills and reference files there are, that both manifests carry the same description, that every eval case with a skill-fired grader also grades the answer, and that the `no-trigger-*` patterns catch every skill.
- CONTRIBUTING and AGENTS.md say skill changes reach existing installs only when a release bumps the plugin's `version`.

### Fixed

- `hinai-mirror`: download one or two sets at a time, as the mirror asks (it said four). What an abort rejects with, which failures aren't a `HinaiError`, and what the shed and budget errors mean.
- `osu-api-v2`: `getBeatmapsets` keys its sets by difficulty id, any error status on a `/beatmaps` call throws (not only 429 and 5xx), and bad ids given to the batch lookups never throw.
- `osu-mappool-content-rules`: the Mlumìn // SoundWarper and MEGAREX gaps in the compliance data, and disallowed verdicts without a `reason`.
- `haruhime-brand`: adding a product no longer tells you to release a version. Releases are cut by the maintainers.
- `haruhime-brand`: `brandFiles` and `previewHtml` load the native PNG renderer too, not only `svgToPng` and the CLI.
- `haruhime-brand`: sheets.haruhime.moe isn't live yet, so the product table no longer links it.

### Security

- CI runs its actions from pinned commit SHAs, and Dependabot groups their updates. SECURITY.md lists GitHub private vulnerability reporting first, then email.

## [0.1.0] - 2026-09-23

### Added

- Skills `osu-api-v2`, `osu-mappool-content-rules`, `osu-official-tournament-support`, `hinai-mirror`, `osu-mappool-data`, `haruhimemoe-packages` and `haruhime-brand`.
- The `haruhimemoe` marketplace; install with `/plugin install haruhime@haruhimemoe`.
- A `claude plugin eval` suite with a case for every skill and near-miss negatives.

[unreleased]: https://github.com/haruhimemoe/claude-plugin/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/haruhimemoe/claude-plugin/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/haruhimemoe/claude-plugin/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/haruhimemoe/claude-plugin/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/haruhimemoe/claude-plugin/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/haruhimemoe/claude-plugin/compare/f73398f844d71f60ebedf5d89ec648c29bdb9f7d...v0.2.0
[0.1.0]: https://github.com/haruhimemoe/claude-plugin/tree/f73398f844d71f60ebedf5d89ec648c29bdb9f7d
