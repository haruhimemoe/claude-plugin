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
| Copy to clipboard | `CopyButton` (client); `statusPosition` and `reserveStatus` (0.16.0) |
| "Are you sure?" in the page, no dialog | `InlineConfirm` (client, 0.4.0) |
| Confirm something that can't be undone by typing its name | `TypeToConfirm` (client, 0.4.0) when the confirm is the whole page; in a dialog, `ConfirmDialog`'s `typeToConfirm` |
| "Are you sure?" in a dialog: affects other people, needs more than a sentence, or the trigger sits in a table cell, menu or palette command | `ConfirmDialog` (client, 0.14.0); `tone="destructive"` for the red button; throw in `onConfirm` to keep it open with `failedMessage` |
| The same, typing a name first (an account, a shared pool, handing ownership over) | `ConfirmDialog` with `typeToConfirm` (client, 0.14.0) |
| Your own modal (a preview) | `Dialog` (client, 0.14.0): controlled `open`, `onDismiss(reason)`, focus return and scroll lock built in |
| A red button for a confirm that deletes | `Button variant="danger"` (0.14.0); `confirmVariant="danger"` on `InlineConfirm` |
| Fields with label, hint and error | `TextInput`, `Textarea`, `Select`, `Checkbox`; `fieldClasses` for a bare control |
| One choice from a list, with hints | `RadioGroup` (client, 0.4.0) |
| Who can see it: private, unlisted or public, each with its line | `VisibilitySelect` (client, 0.5.0), as radios or a select; `VISIBILITIES`, `VISIBILITY_TEXT` for the default words |
| "1,234 / 60,000 characters", rose once over | `CharCounter` (0.5.0). You pass `count` and `limit`, so any counting rule works |
| "Report this" with a reason field | `ReportDisclosure` (client, 0.5.0): `onSubmit(reason)` returns a `ReportResult` (`{ ok: true }` shows a status line, `{ ok: false, message }` keeps the text for a retry) |
| Previous and next page | `Pagination`: links (`hrefFor`), or buttons (`onPageChange`, 0.4.0) for results fetched in place, where `pageCount` may be `null` with `hasNext` |

## Which confirm (0.14.0)

1. **No confirm** when it can be undone in place (Undo, Ctrl+Z), only touches an unsaved form, or redoing it costs a click.
2. **`InlineConfirm`** when it can't be undone, touches only your own things, and fits one short sentence, with room in the row.
3. **`ConfirmDialog`** when it can't be undone and affects other people, needs more than one sentence, or sits in a table cell, header menu or palette command.
4. **`ConfirmDialog` with `typeToConfirm`** to delete an account, delete a thing other people edit, or give ownership away.
5. **`TypeToConfirm`** only when the confirm is the whole page or a step with nothing else on screen.

Never `window.confirm()`, never a hand-built modal.

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
| A map as a row or card, with cover, stars, stats, slot pill, Copy ID | `MapCard` (0.16.0): `map={meta}` takes osu!'s `BeatmapMeta` as-is; `layout` row or card, `background` none, cover or blur |
| A beatmapset and its difficulties | `MapSetCard` (0.16.0): a header over a list of `MapDifficultyRow`s |
| A mod bucket: heading, count, maps, empty slots | `MapGroup` (0.16.0): `badge`, `count`/`target`, `emptySlots`, its own `MapCopyScope` |
| A set's cover image | `MapCover` (0.16.0); `mapCoverUrl(beatmapsetId, size?)` for a bare URL |
| Play a set's preview clip | `MapPreviewButton` (client, 0.16.0); `stopMapPreview()` on route changes; CSP needs `media-src https://b.ppy.sh` |
| Only the latest Copy ID in a group says "Copied." | `MapCopyScope` (client, 0.16.0): wraps `MapGroup`/`MapSetCard` or your own list |

The osu! pieces take plain numbers (or, for the map display, `@haruhimemoe/osu`'s `BeatmapMeta`-shaped data), not osu! API types, and are Server Components except the preview button and copy scope. For the same numbers as plain text elsewhere (`m:ss`, two-decimal stars), use `@haruhimemoe/osu/format` (osu 0.3.0 and later).

## Reordering (0.15.0)

| Need | Use |
| --- | --- |
| One list the user reorders (slots, pinned items, regions) | `SortableList` (client): `items`, `getId`, `getLabel`, `label`, `onMove`; the row's render function places `handle` and `moveButtons`. `itemProps` puts a name or a selected style on each `li` |
| Several lists, items moving between them, or lists nested in rows | `useSortable` (client) with `container()`, `item()`, one `SortableLayer`, `SortableHandle` per row and `SortableMoveButtons`; `SORTABLE_ITEM` and `SORTABLE_CONTAINER` draw the line and outlines. `mode: "onto"` for "drop on this row or this list" |
| Refuse a target and say why | `canDrop` returns a reason string; `onMove` may return false, a reason or a promise (server reorders) |
| Cross-list move from a button or select | `sortable.moveTo(id, { container, index })`: same announcement and focus as a drag |
| Apply a move to an array | `moveItem(list, from.index, to.index)` |

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
| A content page: header, byline, published/reading time, toc, footer, copy-markdown, JSON-LD | `ContentPage` (server): `PageHeader` (`title`, `description` as `lead`); `authors`, `published`, `readingMinutes` and `toc` (0.17.0); a meta row with `lastUpdated` (`<time dateTime>`) and, when `markdownHref` is set, `CopyMarkdownButton`, plus `actions`; `footer` after the body (0.17.0); `proseSize="sm"` for dense docs/legal (0.17.0); optional `jsonLd` |
| An article's table of contents | `Toc` (server, 0.17.0): `items` (a flat `TocItem[]` from `articleData`/MDX's `mdxExports`), `maxDepth` (2-4, default 3); a sticky column from `xl` up plus a phone disclosure, both "On this page"; renders nothing under two surviving items |
| Copy a page's Markdown mirror | `CopyMarkdownButton` (client): fetches `href`, copies the response body, reports like `CopyButton`; any failure (fetch, response, clipboard) shows the same message and never throws |

New types: `ContentNavItem`, `ContentNavGroup`, `ContentSearchItem`, `ContentAuthor`, `MdxArticleModule` (0.17.0).

## MDX and content pieces (0.17.0)

`@haruhimemoe/ui/mdx` exports `mdxComponents`, `CodeBlock`, `Callout` and, since 0.17.0, the article pieces below; `@haruhimemoe/ui/remark` exports plain functions for `remarkPlugins`. The root `@haruhimemoe/ui` export adds `Toc` and `Kbd`/`kbdClasses`.

| Need | Use |
| --- | --- |
| A keyboard key in running text (`Ctrl`, `K`) | `Kbd` (0.17.0): a bordered `<kbd>`; `kbdClasses` for your own element. Renders for Markdown's `kbd` too |
| A lone image becomes a captioned figure | Automatic (`remarkHaruhime`'s `figures` option) in `mdxComponents`; `Figure` (0.17.0) in `.mdx` source adds sizes, a credit line and eager loading |
| A numbered how-to list | `Steps` (0.17.0) |
| A click-to-load YouTube/Twitch embed | `Embed` (0.17.0): `url`, `title`, `poster`; a bare provider URL on its own line becomes one automatically (`remarkHaruhime`'s `embeds` option); unrecognized URLs render a plain link |
| A card linking off to one resource, titled and described | `MdxLinkCard` (0.17.0): `href`, `title`, `description`, `source`. Never links a non-`http(s)` scheme (`javascript:`, `data:`): renders `title` as plain text instead; a protocol-relative `//host` href counts as external (new tab, "↗") |
| A pool/bracket schedule: ordered rows with a time, label and note | `Schedule` (0.17.0) |
| A glossary with anchored terms | `Glossary`/`Term` (0.17.0): `Glossary` is a `<dl>` (`{ term, definition, aliases? }`), each `dt` anchored at `#term-<slug>`; `Term` is a dotted-underline link to that anchor |
| `MapCard`/`MapGroup` (0.16.0) inside MDX | Add them to your `useMDXComponents` alongside `mdxComponents`: they aren't in `mdxComponents` itself |
| Sanitizing untrusted Markdown with `rehype-sanitize` | `haruhimeSanitizeSchema(base, options?)` (0.17.0) extends a schema with the tags/attributes the plugins write; `trusted: true` drops the `user-content-` id prefix (your own repos only) |
| Fixing an in-page `#id` link after sanitizing prefixes ids | `rehypeLocalHrefs` (0.17.0), run after the sanitizer |
| Serving a page's raw Markdown mirror alongside MDX | `mdxMarkdownTransforms` (0.17.0) as `transforms` to next-kit's `mdxToMarkdown`: degrades `Figure`/`Embed`/`MdxLinkCard` to plain Markdown; `Schedule`, `Glossary`, `MapCard` and `MapGroup` have no Markdown shape and are left as JSX |
| MDX exporting its own `toc`/`readingMinutes`/`words` | `remarkHaruhime`'s `mdxExports` option (0.17.0, off by default); `collect` for react-markdown, which can't pass a function through Turbopack's plugin options |

Turbopack only takes MDX plugins as module names, not imported functions: `remarkPlugins: ["remark-gfm", "@haruhimemoe/ui/remark"]`, or `["remark-gfm", ["@haruhimemoe/ui/remark", { mdxExports: true }]]` for the one option safe to pass as a tuple. Keep `remark-gfm` in every app (pinned): without it a pipe table renders as a plain paragraph.

## Brand page (0.11.0, alt fix 0.11.1)

`<BrandPage {...brandPageData("pools")} />` (`@haruhimemoe/brand`'s `brandPageData`, typed structurally) renders a product's `/brand` page: Name (how to write it), Logo (each file previewed on a dark or light tile with a `download` link), Colors (`BrandSwatch`, click to copy the hex), Type (`fonts`, default Nunito), Do's and don'ts, osu! (not affiliated with ppy), Family (only with `familyHref`), Contact (`mailto:`). `BrandPageProps` also takes `slots.afterLogo`, `slots.afterColors` and `slots.end` for extra sections (haruhime.moe's README banners and product family). `BrandSwatch` (client) and `BrandPage` both ship finished class strings, no tailwind-merge. New types: `BrandPageProps`, `BrandPageAsset`, `BrandPageFont`, `BrandSwatchProps`.

0.11.1 fix: the Logo tile previews use an empty `alt` (the file's name is already on its `download` link, right next to the image), so axe no longer flags `image-redundant-alt` there.
