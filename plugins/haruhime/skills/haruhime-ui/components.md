<!-- Details for SKILL.md's "Which component". Summarized from the @haruhimemoe/ui README (https://github.com/haruhimemoe/ui#readme), which lists every prop and is the source of truth. Recheck this when a new ui version ships. -->

# @haruhimemoe/ui: which component

"(client)" marks a component whose file carries `"use client"`. "0.6.0" marks one that isn't in 0.5.0 (0.2.0 to 0.5.0 likewise). Import everything from `@haruhimemoe/ui`.

## Page frame

| Need | Use |
| --- | --- |
| Skip link, header, `<main>`, footer | `PageShell` |
| Site header with nav links as data (`SiteLinkItem`) | `SiteHeader`; `NavLinks` for your own header |
| Footer: link columns, fine print, wordmark, GitHub and Discord icons | `SiteFooter` (`discordHref` 0.3.0, `discordLabel` 0.4.0) |
| Account menu in the header: avatar button, links, a sign-out button | `HeaderMenu` (client, 0.4.0). A disclosure, not an ARIA menu |
| A row of link tabs (Pools / Maps), each its own URL | `LinkTabs` (0.4.0). You mark the `current` item |
| Tabs that switch panels on the same page (Source / Preview) | `Tabs` (client, 0.5.0): ARIA tabs, arrows, Home and End. The panels are yours; `tabId` and `tabPanelId` give the ids that tie them |
| The page's one `<h1>`, lead, meta and actions | `PageHeader` |

## Content

| Need | Use |
| --- | --- |
| A panel | `Card` (`headingLevel` 2 to 6; 5 and 6 from 0.4.0) |
| Status text | `Notice` (`info`, `warning`, `error`; `live`) |
| A status or tag pill ("Unranked", "beta") | `Badge` (0.4.0): `neutral`, `accent`, `warning`, `muted` |
| A text link | `TextLink` (0.4.0): `accent` for running text, `plain` for names in lists; `linkClasses` for another element |
| Show and hide a panel | `Disclosure` (client, 0.4.0) |
| Docs, MDX or legal text | `Prose` |
| A data table | `Table` (caption, `hideCaption`), `THead`, `TBody`, `Th`, `Td` (`numeric`), with plain `<tr>` (0.4.0) |
| schema.org data | `JsonLd` |
| Merging classes the way the components do | `cx` (0.4.0). It imports tailwind-merge |

## Buttons, forms and confirms

| Need | Use |
| --- | --- |
| Buttons, and links that look like them | `Button`, `ButtonLink`, `buttonClasses` |
| A button that runs an async action and announces the result | `AsyncButton` (client, 0.4.0) |
| Copy to clipboard | `CopyButton` (client) |
| "Are you sure?" in the page, no dialog | `InlineConfirm` (client, 0.4.0) |
| Confirm something that can't be undone by typing its name | `TypeToConfirm` (client, 0.4.0) |
| Fields with label, hint and error | `TextInput`, `Textarea`, `Select`, `Checkbox`; `fieldClasses` for a bare control |
| One choice from a list, with hints | `RadioGroup` (client, 0.4.0) |
| Who can see it: private, unlisted or public, each with its line | `VisibilitySelect` (client, 0.5.0), as radios or a select; `VISIBILITIES`, `VISIBILITY_TEXT` for the default words |
| "1,234 / 60,000 characters", rose once over | `CharCounter` (0.5.0). You pass `count` and `limit`, so any counting rule works |
| "Report this" with a reason field | `ReportDisclosure` (client, 0.5.0): `onSubmit(reason)` returns a `ReportResult` (`{ ok: true }` shows a status line, `{ ok: false, message }` keeps the text for a retry) |
| Previous and next page | `Pagination`: links (`hrefFor`), or buttons (`onPageChange`, 0.4.0) for results fetched in place, where `pageCount` may be `null` with `hasNext` |

## Filters

| Need | Use |
| --- | --- |
| A panel of filter rows, like osu!'s beatmap listing | `FilterPanel` (client) of `FilterRow`s |
| Toggle chips (several on at once) | `ChipGroup` or `Chip` (client). `unavailableReason` (0.4.0) blocks a chip but keeps it focusable, with the reason read out |
| One choice as chips (a status or type) | `ChoiceChips` (client, 0.4.0): native radios, arrow keys move and pick |
| A two-thumb range | `RangeSlider` (client) |

## osu! and icons

| Need | Use |
| --- | --- |
| A star rating pill on osu!'s spectrum ("5.23 stars" for screen readers) | `StarRating` (0.4.0) |
| CS, AR, OD, HP, BPM and length from plain numbers | `BeatmapStats` (0.4.0) |
| A slot pill colored by its mod (`NM1`, `HD2`, `TB`) | `ModBadge` (0.4.0) |
| Icons and the parent wordmark | `GitHubIcon`, `DiscordIcon` (0.3.0), `HaruhimeWordmark`, `HaruhimeWordmarkLink` |

The osu! pieces take plain numbers, not osu! API types, and are Server Components. For the same numbers as plain text elsewhere (`m:ss`, two-decimal stars), use `@haruhimemoe/osu/format` (osu 0.3.0 and later).

## Footer tools column (0.6.0)

`SiteFooter`'s `tools` prop (`{ current: "packs" | "pools" | "bb" }`) adds a "haruhime tools" column: the other live haruhime.moe tools as "name: blurb" links and "All tools" on www.haruhime.moe, with the current tool left out. `HARUHIME_TOOLS` (each `{ id, name, href, blurb }`) and `haruhimeToolsColumn(current)` give the same data for a custom footer. www's own footer doesn't use it: its Tools column already lists every tool.

## Content pages: docs, guides, legal (0.11.0)

A content section (`/docs`, `/guides`, `/legal`) is built from these, typed against `@haruhimemoe/next-kit/docs`'s `ContentEntry`/`ContentSection` shape (`import type` only, no runtime dependency on next-kit):

| Need | Use |
| --- | --- |
| The section's side nav, current page marked | `ContentNav` (client): `groups` (`ContentNavGroup[]`, each an optional `heading` and `ContentNavItem[]`), an index link, `aria-current="page"`, `navTitle ?? title` clamped to two lines (full title in the link's `title` attribute), an optional `badge` |
| The nav plus the page in a grid | `ContentLayout` (server): a 14rem nav column from `lg` up; takes `nav` as an already-rendered slot, so it's section-agnostic |
| Search the section's entries | `searchContent(items, query)` (pure: blank query returns everything, else every typed word must appear in `title`, `navTitle`, `description`, `badge` or `keywords`, title-prefix first) plus `ContentSearch` (client): `TextInput` and a polite live-region count ("12 pages.", `countNoun`, default `["page", "pages"]`) over `ContentIndex` |
| A bare card grid (too few entries to search: `/legal`, a handful of guides) | `ContentIndex` (server) |
| A content page: header, last updated, copy-markdown, JSON-LD | `ContentPage` (server): `PageHeader` (`title`, `description` as `lead`), a meta row with `lastUpdated` (`<time dateTime>`) and, when `markdownHref` is set, `CopyMarkdownButton`, plus `actions`; optional `jsonLd` (one object, passed to `JsonLd`); body in `Prose` |
| Copy a page's Markdown mirror | `CopyMarkdownButton` (client): fetches `href`, copies the response body, reports like `CopyButton`; any failure (fetch, response, clipboard) shows the same message and never throws |

New types: `ContentNavItem`, `ContentNavGroup`, `ContentSearchItem`.

## Brand page (0.11.0, alt fix 0.11.1)

`<BrandPage {...brandPageData("pools")} />` (`@haruhimemoe/brand`'s `brandPageData`, typed structurally) renders a product's `/brand` page: Name (how to write it), Logo (each file previewed on a dark or light tile with a `download` link), Colors (`BrandSwatch`, click to copy the hex), Type (`fonts`, default Nunito), Do's and don'ts, osu! (not affiliated with ppy), Family (only with `familyHref`), Contact (`mailto:`). `BrandPageProps` also takes `slots.afterLogo`, `slots.afterColors` and `slots.end` for extra sections (haruhime.moe's README banners and product family). `BrandSwatch` (client) and `BrandPage` both ship finished class strings, no tailwind-merge. New types: `BrandPageProps`, `BrandPageAsset`, `BrandPageFont`, `BrandSwatchProps`.

0.11.1 fix: the Logo tile previews use an empty `alt` (the file's name is already on its `download` link, right next to the image), so axe no longer flags `image-redundant-alt` there.
