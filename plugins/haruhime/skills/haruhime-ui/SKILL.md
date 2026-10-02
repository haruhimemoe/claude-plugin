---
name: haruhime-ui
description: Use when building a haruhime.moe tool's pages or another Next.js page with @haruhimemoe/ui, setting up its Tailwind theme (theme.css, --hue), choosing which of its components fits a job (confirms, tables, tabs, visibility pickers, character counters, report forms, badges, filters, star ratings), deciding what needs a Client Component, checking its accessibility, or when its components render unstyled
---

# @haruhimemoe/ui

React components for the haruhime.moe tools, for **Next.js 16 (app router) only**: the osu!-web-style palette as a Tailwind 4 theme, plus buttons, links, badges, form fields and confirms, filters, tables, osu! beatmap pieces and the site shell. Every component is shown in its states at https://www.haruhime.moe/ui (the page names the version it runs). The [README](https://github.com/haruhimemoe/ui#readme) lists every prop: read it instead of guessing one.

This covers 0.6.0, the current release. Anything marked with a version (0.2.0 to 0.6.0) isn't in the one before it.

## Setup

Peers: `next` 16, `react` and `react-dom` 19, `tailwindcss` 4.1 or later (below 5). ESM only, Node 22.12 or later.

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

   It adds the palette as Tailwind colors (`bg-b4`, `text-c1` in your own markup too), an `h1` focus ring, and an `@source` line so Tailwind generates the components' classes.
3. **Nunito:** `Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" })` from `next/font/google`, with `className={nunito.variable}` on `<html>`. Without it `font-sans` falls back to the system font.
4. **Hue (optional):** `:root { --hue: 200; }` after the imports; the default is 333 (pink). Use the product's hue from `@haruhimemoe/brand` (see `haruhime-brand`). Some hues fall under 4.5:1 contrast: `--h2-l` fixes white on `h2` (hues about 23 to 205; `42%` at 200, `35%` at 150, `31%` for any hue) and `--h1-l` fixes `h1` on `b4` (`77%` for hues about 222 to 283).

Tokens: `b1` to `b6` backgrounds (lightest to darkest), `c1` to `c4` text (brightest to most muted), `h1` the bright accent, `h2` the deeper one (primary buttons). The theme is dark only.

## Which component

Look for a component before writing markup: [components.md](components.md) maps each job to one. In short:

- **Frame:** `PageShell`, `SiteHeader`, `SiteFooter`, `PageHeader`; `LinkTabs` for link tabs and `HeaderMenu` for the account menu (0.4.0); `Tabs` for panels on one page (0.5.0). `SiteFooter`'s `tools` prop (0.6.0) adds the "haruhime tools" column.
- **Content:** `Card`, `Notice`, `Prose`, `JsonLd`; `Badge`, `TextLink`, `Disclosure` and the `Table` primitives (0.4.0).
- **Actions and forms:** `Button`, `ButtonLink`, `CopyButton`, `Pagination` (button mode 0.4.0), the fields; `AsyncButton`, `InlineConfirm`, `TypeToConfirm` and `RadioGroup` (0.4.0); `VisibilitySelect`, `CharCounter` and `ReportDisclosure` (0.5.0).
- **Filters:** `FilterPanel`, `FilterRow`, `ChipGroup`, `Chip` (`unavailableReason` 0.4.0), `RangeSlider`; `ChoiceChips` (0.4.0) for one choice.
- **osu!:** `StarRating`, `BeatmapStats` and `ModBadge` (0.4.0). **Classes:** `cx` (0.4.0).

Never write a `window.confirm()` or a modal for a destructive action: use `InlineConfirm`, or `TypeToConfirm` when it can't be undone. Sign-in buttons, the account menu and account deletion come from `@haruhimemoe/next-kit/auth-react` 0.2.0; icons and link previews from `@haruhimemoe/brand`.

## Server and client

- Import everything from `@haruhimemoe/ui`, in Server and Client Components.
- The client components are `CopyButton`, `Chip`, `ChipGroup`, `RangeSlider`, `FilterPanel` and, from 0.4.0, `AsyncButton`, `InlineConfirm`, `Disclosure`, `ChoiceChips`, `RadioGroup`, `TypeToConfirm` and `HeaderMenu`, and from 0.5.0 `Tabs`, `VisibilitySelect` and `ReportDisclosure`. Each file carries its `"use client"`. Everything else is server-safe.
- A Server Component can't pass a function to a Client Component. Callback props (`onChange`, `onPressedChange`, `onClear`, `onConfirm`, `action`) must come from your own `"use client"` file that holds the state, like a `PackFilters` component. Plain data (`CopyButton`'s `text`, `Chip`'s `pressed`) works from a Server Component. `Pagination` with `hrefFor` is a Server Component, so that's fine anywhere; its button mode (`onPageChange`) is a callback.
- `SiteHeader` and `NavLinks` are Server Components (0.2.0). A small client list sets `aria-current` only when a link can be the current page.
- Every component takes its element's native props (`ref` too). `className` is merged last with tailwind-merge and wins on conflict.

## Accessibility

The package's tests run axe-core (WCAG 2.0 to 2.2, A and AA) on every component and keyboard tests on the interactive ones. What's left to you:

- Give each field a unique `id`: the label, hint and error hang off it. An `error` sets `aria-invalid` and is announced.
- Inside a `FilterRow`, give `ChipGroup` and `RangeSlider` `hideLabel`, so each row is announced once.
- A `live` info or warning `Notice` is only reliably announced when its text changes while mounted: keep it mounted, `<Notice live>{saved ? "Saved." : ""}</Notice>`. Error notices are always announced.
- A titled `Card` is a region landmark; under another heading, `headingLevel={3}`.
- A chip that can't be picked right now (EZ while HR is on): `unavailableReason`, not `disabled`, so keyboard users still reach it and hear why.
- When an `InlineConfirm` removes its own item, move focus somewhere sensible yourself, such as the list's heading.
- Give a `Table` a `caption` (`hideCaption` if a heading names it).
- You write the text: `aria-label` on icon-only buttons, meaningful `label` props, a label on any link around `GitHubIcon` or `DiscordIcon` (they're hidden from screen readers).
- At a hue other than 333, check contrast and set `--h1-l` or `--h2-l` (Setup, step 4).

## Common mistakes

- No `postcss.config.mjs`, or no theme import: the components render unstyled, with no build error.
- Passing `onChange`, `onConfirm` or `onClear` from a Server Component page.
- Using it outside Next.js 16 or with Tailwind 3.
- Hex colors in app CSS instead of the tokens.
- Hand-rolling a table, tabs, badge, star pill, visibility picker or character counter the package has.

## Sources

- [@haruhimemoe/ui README](https://github.com/haruhimemoe/ui#readme) and [CHANGELOG](https://github.com/haruhimemoe/ui/blob/main/CHANGELOG.md) 0.6.0, checked 2026-10-02.
- Component showcase, https://www.haruhime.moe/ui (running 0.6.0), checked 2026-10-02.
