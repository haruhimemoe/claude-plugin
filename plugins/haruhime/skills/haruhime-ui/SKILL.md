---
name: haruhime-ui
description: Use when building a haruhime.moe tool's pages or another Next.js page with @haruhimemoe/ui, setting up its Tailwind theme (theme.css, --hue), choosing which of its components fits a job, deciding what needs a Client Component, checking its accessibility, or when its components render unstyled
---

# @haruhimemoe/ui

React components for the haruhime.moe tools, for **Next.js 16 (app router) only**: the osu!-web-style palette as a Tailwind 4 theme, plus buttons, cards, form fields, filters and the site shell. Every component is shown in its states at https://www.haruhime.moe/ui (the page names the version it runs). The [README](https://github.com/haruhimemoe/ui#readme) lists every prop: read it instead of guessing one.

Anything marked "0.2.0 and later" below is not in 0.1.0. Check the installed version.

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

| Need | Use |
| --- | --- |
| Page frame: skip link, header, `<main>`, footer | `PageShell`, `SiteHeader` (nav links as data), `SiteFooter`; `NavLinks` for your own header |
| The page's one `<h1>`, lead, meta and actions | `PageHeader` |
| A panel | `Card` (`headingLevel`, 0.2.0 and later) |
| Buttons, and links that look like them | `Button`, `ButtonLink`, `buttonClasses` for other elements |
| Status text | `Notice` (`info`, `warning`, `error`) |
| Docs, MDX or legal text | `Prose` |
| Form fields with label, hint and error | `TextInput`, `Textarea`, `Select`, `Checkbox`; `fieldClasses` for a bare control |
| Copy to clipboard | `CopyButton` |
| Previous and next page | `Pagination` |
| schema.org data | `JsonLd` |
| Filters like osu!'s beatmap listing | `FilterPanel` of `FilterRow`s, with `ChipGroup` (or `Chip`) and `RangeSlider` |
| Icons | `GitHubIcon`, `HaruhimeWordmark`, `HaruhimeWordmarkLink` |

A tool's favicon, wordmark files and link preview image come from `@haruhimemoe/brand`, not from this package.

## Server and client

- Import everything from `@haruhimemoe/ui`, in Server and Client Components alike.
- The client components are `CopyButton`, `Chip`, `ChipGroup`, `RangeSlider` and `FilterPanel`. Each file carries its own `"use client"`. Everything else is server-safe.
- A Server Component can't pass a function to a Client Component. Callback props (`onChange`, `onPressedChange`, `onClear`) must come from your own `"use client"` file that holds the state, like a `PackFilters` component. Plain data (`CopyButton`'s `text`, `Chip`'s `pressed`) works from a Server Component. `Pagination` takes a function (`hrefFor`) but is a Server Component, so that's fine anywhere.
- `SiteHeader` and `NavLinks` are Server Components with a small client list that sets `aria-current`, and they keep tailwind-merge out of the browser (0.2.0 and later). In 0.1.0 `NavLinks` is a client component, so the nav always hydrates.
- Every component takes its element's native props. `ref` is a normal prop (React 19). `className` is merged last with tailwind-merge and wins on conflict: `<Select className="w-auto">` drops the built-in `w-full`.

## Accessibility

The package's tests run axe-core (WCAG 2.0 to 2.2, A and AA) on every component and keyboard tests on the interactive ones. What's left to you:

- Give each field a unique `id`: the label, hint and error hang off it. An `error` sets `aria-invalid` and is announced.
- Inside a `FilterRow`, give `ChipGroup` and `RangeSlider` `hideLabel`, so each row is announced once.
- A `live` info or warning `Notice` is only reliably announced when its text changes while mounted: keep it mounted, `<Notice live>{saved ? "Saved." : ""}</Notice>`. Error notices are always announced.
- A `Card` with a `title` is a region landmark. Under another heading, use `headingLevel={3}` (0.2.0 and later).
- You write the text: `aria-label` on icon-only buttons, meaningful `label` props, a label on any link around `GitHubIcon` (it's hidden from screen readers).
- At a hue other than 333, check contrast and set `--h1-l` or `--h2-l` (Setup, step 4).

## Common mistakes

- No `postcss.config.mjs`, or no theme import: the components render unstyled, with no build error.- Passing `onChange` or `onClear` from a Server Component page.
- Using it outside Next.js 16 or with Tailwind 3. It needs `next/link` and `next/navigation`.
- Hex colors or a new palette in app CSS. Use the tokens and `--hue`.

## Sources

- [@haruhimemoe/ui README](https://github.com/haruhimemoe/ui#readme) for 0.2.0 (npm had 0.1.0), checked 2026-09-24.
- Component showcase, https://www.haruhime.moe/ui (running 0.1.0), checked 2026-09-24.
