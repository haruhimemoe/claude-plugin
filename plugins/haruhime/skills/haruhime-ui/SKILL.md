---
name: haruhime-ui
description: Use when building a haruhime.moe tool's pages or another Next.js page with @haruhimemoe/ui, setting up its Tailwind theme (theme.css, --hue), choosing which of its components fits a job (confirms, tables, tabs, visibility pickers, character counters, report forms, badges, filters, star ratings), deciding what needs a Client Component, checking its accessibility, or when its components render unstyled
---

# @haruhimemoe/ui

React components for the haruhime.moe tools, for **Next.js 16 (app router) only**: the osu!-web-style palette as a Tailwind 4 theme, plus buttons, dialogs, filters, tables, sortable lists, osu! map pieces, MDX content and the site shell. Every component is shown at https://www.haruhime.moe/ui (names the version running). The [README](https://github.com/haruhimemoe/ui#readme) lists every prop: read it instead of guessing one.

This covers 0.18.0. Anything marked with a version isn't in the one before it.

## Setup

Peers: `next` 16, `react`/`react-dom` 19, `tailwindcss` 4.1+ (<5). ESM only, Node 22.12+.

```sh
bun add @haruhimemoe/ui
bun add -d tailwindcss @tailwindcss/postcss   # if the app doesn't have Tailwind 4 yet
```

1. **PostCSS:** `postcss.config.mjs` with `export default { plugins: { "@tailwindcss/postcss": {} } };`.
2. **Theme, after Tailwind**, in `src/app/globals.css`:

   ```css
   @import "tailwindcss";
   @import "@haruhimemoe/ui/theme.css";
   ```

   Adds the palette as Tailwind colors (`bg-b4`, `text-c1`), an `h1` focus ring, and an `@source` line for the components' classes.
3. **Nunito:** `Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" })` from `next/font/google`, `className={nunito.variable}` on `<html>`, or `font-sans` falls back to the system font.
4. **Hue (optional):** `:root { --hue: 200; }` after the imports; default 333 (pink), from `@haruhimemoe/brand` (see `haruhime-brand`). Some hues drop under 4.5:1 contrast; `--h2-l`/`--h1-l` fix it (see Accessibility).

Tokens: `b1`-`b6` backgrounds, `c1`-`c4` text, `h1` bright accent, `h2` deeper (primary buttons). Dark only.

## Which component

Look for a component before writing markup: [components.md](components.md) maps each job to one. In short:

- **Frame:** `PageShell`, `SiteHeader`, `SiteFooter`, `PageHeader`, `LinkTabs`, `HeaderMenu`, `Tabs`.
- **Content:** `Card`, `Notice`, `Prose`, `JsonLd`, `Badge`, `TextLink`, `Disclosure`, `Table`; `Dialog`/`ConfirmDialog` (0.14.0, see "Which confirm" below).
- **Actions and forms:** `Button` (`variant="danger"` 0.14.0), `ButtonLink`, `CopyButton`, `Pagination`, fields, `AsyncButton`, `InlineConfirm`, `TypeToConfirm`, `RadioGroup`, `VisibilitySelect`, `CharCounter`, `ReportDisclosure`.
- **Filters:** `FilterPanel`, `FilterRow`, `ChipGroup`, `Chip`, `RangeSlider`, `ChoiceChips`.
- **Reordering (0.15.0):** `SortableList` for one list; `useSortable`, `SortableHandle`, `SortableMoveButtons`, `SortableLayer` for several/nested lists; `moveItem` applies a move. Keep Up/Down (`moveButtons`, on by default): WCAG 2.2 2.5.7 needs a one-press way to do a drag.
- **osu!:** `StarRating`, `BeatmapStats`, `ModBadge`. A map: `MapCard` (0.16.0), never a hand-built row; a set: `MapSetCard`; a bucket: `MapGroup`. **Classes:** `cx`.
- **Content pages and brand:** `ContentLayout`, `ContentNav`, `ContentSearch`, `ContentIndex`, `ContentPage` (authors, published, reading time, `Toc`, footer: 0.17.0), `CopyMarkdownButton`; `BrandPage`/`BrandSwatch` from `@haruhimemoe/brand`'s `brandPageData`.
- **MDX (0.17.0):** `Toc`, `Kbd`; `/mdx` article pieces (`Figure`, `Steps`, `Embed`, `MdxLinkCard`, `Schedule`, `Glossary`, `Term`); `/remark`'s sanitize helpers and `mdxExports`.

Pick a confirm with the rule in [components.md](components.md) (0.14.0): `InlineConfirm` in the row, `ConfirmDialog` (optionally `typeToConfirm`) for what affects others or sits in a cell or menu. Never `window.confirm()` or a hand-built modal. Sign-in, the account menu and account deletion come from `@haruhimemoe/next-kit/auth-react`; icons from `@haruhimemoe/brand`.

## Server and client

- Import everything from `@haruhimemoe/ui`, in Server and Client Components.
- Most interactive components carry their own `"use client"` (full list in components.md), including `Dialog`/`ConfirmDialog` (0.14.0), `useSortable`/`SortableList` (0.15.0) and `MapPreviewButton`/`MapCopyScope` (0.16.0). `SortableHandle`, `SortableMoveButtons` and `SortableLayer` take a `Sortable`, so render them only from a client file that already holds one. `MapCard`, `MapSetCard`, `MapGroup`, `MapCover`, `Toc` and `ContentPage` are Server Components; everything else not listed is server-safe.
- A Server Component can't pass a function to a Client Component. Callback props (`onChange`, `onConfirm`, `action`) must come from your own `"use client"` file holding the state. Plain data (`CopyButton`'s `text`) works from a Server Component; `Pagination`'s `hrefFor` mode is a Server Component too, but its `onPageChange` button mode is a callback.
- `SiteHeader` and `NavLinks` are Server Components. A small client list sets `aria-current` only when a link can be the current page.
- Every component takes its element's native props (`ref` too). `className` is merged last with tailwind-merge and wins on conflict.

## Accessibility

The package's tests run axe-core (WCAG 2.0-2.2, A/AA) on every component, plus keyboard tests on interactive ones. What's left to you:

- Give each field a unique `id`: the label, hint and error hang off it. An `error` sets `aria-invalid` and is announced.
- Inside a `FilterRow`, give `ChipGroup` and `RangeSlider` `hideLabel`, so each row is announced once.
- A `live` info/warning `Notice` is only reliably announced while mounted and its text changes: keep it mounted, `<Notice live>{saved ? "Saved." : ""}</Notice>`.
- A titled `Card` is a region landmark; under another heading, `headingLevel={3}`.
- A chip that can't be picked right now: `unavailableReason`, not `disabled`, so keyboard users still reach it and hear why.
- When a confirm removes its own item, pass `ConfirmDialog` a `returnFocus`, or move focus yourself after an `InlineConfirm` (the list's heading, a status line).
- Give a `Table` a `caption` (`hideCaption` if a heading names it).
- Write the text yourself: `aria-label` on icon-only buttons, a label on `GitHubIcon`/`DiscordIcon` links.
- At a hue other than 333, check contrast and set `--h1-l`/`--h2-l` (Setup, step 4).

## Common mistakes

- No `postcss.config.mjs`, or no theme import: components render unstyled, with no build error.
- Passing `onChange`, `onConfirm` or `onClear` from a Server Component page.
- Using it outside Next.js 16 or with Tailwind 3. Hex colors instead of tokens.
- Hand-rolling a table, tabs, badge, star pill, visibility picker or character counter the package has.
- Hand-rolling drag and drop (`draggable`, `dataTransfer`, a drag library): use the sortable lists instead, for touch, keyboard, announcements and focus.
- Applying a "between" move as a swap: `to.index` is the index after the move; `moveItem(list, from.index, to.index)` is the whole update.

## Sources

- [@haruhimemoe/ui README](https://github.com/haruhimemoe/ui#readme) and [CHANGELOG](https://github.com/haruhimemoe/ui/blob/main/CHANGELOG.md) 0.17.0, checked 2026-10-05.
- Component showcase, https://www.haruhime.moe/ui (running 0.17.0), checked 2026-10-05.
