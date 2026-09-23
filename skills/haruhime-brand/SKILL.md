---
name: haruhime-brand
description: Use when a haruhime.moe tool (packs, pools, sheets, or a new one) needs its logo, wordmark, favicon, Apple icon, link preview (Open Graph) image or color palette, when adding a product to the family, or when the haruhime-brand CLI stops or refuses to write files
---

# haruhime.moe branding

Every haruhime.moe tool is branded from one table in `@haruhimemoe/brand`. Don't hand-draw logos, pick colors, or write `opengraph-image.tsx`: generate the files and commit them.

| Product | Mark | Hue | Site |
| --- | --- | --- | --- |
| packs | `pk.` | 333 (pink) | packs.haruhime.moe |
| pools | `pl.` | 200 (blue) | pools.haruhime.moe |
| sheets | `sh.` | 150 (green) | sheets.haruhime.moe |

- **Wordmark:** the lowercase name in Nunito ExtraBold plus a dot in the highlight color.
- **Icon:** the two-letter mark plus the dot, at the same letter size for every product, so the icons match as a family.
- **Palette from the hue:** backgrounds `b1`–`b6` (light to dark), text `c1`–`c4`, highlights `h1` and `h2`. Apps set the CSS variable `--hue` and derive the rest. On light backgrounds use `h2`; `h1` is too pale there.
- All text is outlined to paths, so the SVGs need no fonts and the PNGs are identical on every machine.

## Brand an app

```sh
bun add -d @haruhimemoe/brand
bunx haruhime-brand pools        # from the app's root
```

It writes, for an app with `src/app` (or `app/`; it stops if there's neither):

- `public/brand/pools-wordmark.svg` (dark backgrounds), `pools-wordmark-dark.svg` (light backgrounds), `pools-icon.svg` (schema.org `logo`), `pools-palette.json`.
- `src/app/icon.svg` (favicon), `src/app/apple-icon.png` (180×180, square: iOS rounds it), `src/app/opengraph-image.png` and its `.alt.txt`.

Next.js serves the `app/` files by name, so there's no route code and nothing renders per request. Commit the output. Rerun after upgrading the package; it prints `wrote` or `replaced` per file. `--dry-run` lists the paths first. Other options: `--root`, `--public`, `--app`.

**When it stops and lists files** such as `opengraph-image.tsx`, `apple-icon.tsx`, `icon.png` or `twitter-image.jpg`: those already make an icon or preview another way, and Next.js would serve both. Delete them (the generated files replace them) and run it again. `--force` writes anyway; don't use it to keep both.

`bunx haruhime-brand preview` writes `preview/index.html` with every product side by side; `list` prints the table.

## In code

```ts
import { iconSvg, palette, PRODUCTS, wordmarkSvg } from "@haruhimemoe/brand";
palette(PRODUCTS.pools.hue).h1; // "#66ccff"
wordmarkSvg(PRODUCTS.pools, { background: "light" });
```

The bundled fonts are subset to printable ASCII. Any other character (accents, CJK, tabs, non-breaking spaces) throws instead of drawing a blank box, so product names and marks stay ASCII.

## Adding a product

Add an entry to `PRODUCTS` in the brand repo's `src/products.ts`: a lowercase name, a two-letter mark, a hue that's clear of the others, a one-line tagline and the URL. Check it in `bun run preview`, accept the new snapshots (`bun run test -u`, then review them), and release a minor version. Then run the CLI in the new app.

## Common mistakes

- Writing `opengraph-image.tsx` or an `ImageResponse` route for a haruhime tool. The static files are cheaper and match the family.
- Choosing a new hue for an existing product in app CSS. Hues live in `PRODUCTS`.
- Using `h1` for accents on a light background.
- Leaving an old `favicon.ico` in the app directory. The CLI doesn't check for it, and browsers may keep showing it instead of `icon.svg`: delete it yourself.

## Sources

- [@haruhimemoe/brand README](https://github.com/haruhimemoe/brand#readme) 0.1.0, checked 2026-09-23.
