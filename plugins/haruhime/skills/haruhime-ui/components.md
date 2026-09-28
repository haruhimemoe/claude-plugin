<!-- Details for SKILL.md's "Which component". Summarized from the @haruhimemoe/ui README (https://github.com/haruhimemoe/ui#readme), which lists every prop and is the source of truth. Recheck this when a new ui version ships. -->

# @haruhimemoe/ui: which component

"(client)" marks a component whose file carries `"use client"`. "0.5.0" marks one that isn't in 0.4.0 (0.2.0, 0.3.0 and 0.4.0 likewise). Import everything from `@haruhimemoe/ui`.

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
