---
name: haruhime-brand
description: Use when haruhime.moe or one of its tools (packs, pools, sheets, or a new one) needs its logo, wordmark, favicon, Apple icon, link preview (Open Graph) image, README banner or color palette, when adding a product to the family, or when the haruhime-brand CLI stops or refuses to write files
---

# haruhime.moe branding

haruhime.moe and every one of its tools are branded from one table in `@haruhimemoe/brand`. Don't hand-draw logos, pick colors, or write `opengraph-image.tsx`: generate the files and commit them.

| Product | Mark | Hue | Site |
| --- | --- | --- | --- |
| haruhime (the parent site) | `h.` | 333 (pink) | haruhime.moe |
| packs | `pk.` | 333 (pink) | packs.haruhime.moe |
| pools | `pl.` | 200 (blue) | pools.haruhime.moe |
| sheets | `sh.` | 150 (green) | sheets.haruhime.moe |

- **Wordmark:** the lowercase name in Nunito ExtraBold plus a dot in the highlight color. haruhime's is stacked instead: "haruhime" over a half-size ".moe".
- **Icon:** the mark plus the dot, at the same letter size for every product, so the icons match as a family.
- **Palette from the hue:** backgrounds `b1`–`b6` (light to dark), text `c1`–`c4`, highlights `h1` and `h2`. On light backgrounds use `h2`; `h1` is too pale there. This package gives them as hex values (`palette`, `<name>-palette.json`) and ships no CSS.
- **Sites get the tokens from `@haruhimemoe/ui`:** its `theme.css` builds the same palette as Tailwind colors from one `--hue`. Import it and set `--hue` to the product's hue on `:root` (see `haruhime-ui`).
- All text is outlined to paths, so the SVGs need no fonts and the PNGs are identical on every machine.

## Brand an app

```sh
bun add -d @haruhimemoe/brand
bunx haruhime-brand pools        # from the app's root
```

It writes 11 files, for an app with `src/app` (or `app/`; it stops if there's neither):

- `public/brand/`: `pools-wordmark.svg` (dark backgrounds), `pools-wordmark-on-light.svg`, `pools-icon.svg` (schema.org `logo`), the README banners `pools-banner.svg`, `pools-banner-on-light.svg` and `pools-banner.png` (1280×320), and `pools-palette.json`.
- `src/app/icon.svg` (favicon), `src/app/apple-icon.png` (180×180, square: iOS rounds it), `src/app/opengraph-image.png` (1200×630) and its `.alt.txt`.

Next.js serves the `app/` files by name, so there's no route code and nothing renders per request. Commit the output. Rerun after upgrading the package; it prints `wrote` or `replaced` per file. `--dry-run` lists the paths first, marking the ones that exist. Other options: `--root`, `--public`, `--app` (both must be inside `--root`, and the app directory must already exist).

**When it stops and lists files** such as `opengraph-image.tsx`, `apple-icon.tsx`, `icon.png` or `twitter-image.jpg`: those already make an icon or preview another way, and Next.js would serve both. Delete them (the generated files replace them) and run it again. `--force` writes anyway; don't use it to keep both. On the first run for a product, a hand-made `icon.svg`, `apple-icon.png` or `opengraph-image.png` already in the app directory also stops it: check it's safe to replace, then rerun with `--force`.

`bunx haruhime-brand preview` writes `preview/index.html` with every product side by side (keep `preview/` out of git); `list` prints the table.

## README banners

Once a site has deployed its brand files, its banners have stable URLs under `/brand/`. At the top of a repo's README, link the banner to the site and let GitHub pick the one for the reader's theme:

```html
<a href="https://www.haruhime.moe">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://www.haruhime.moe/brand/haruhime-banner-on-light.svg">
    <img alt="haruhime.moe: osu! tools for tournament hosts" src="https://www.haruhime.moe/brand/haruhime-banner.svg" width="100%">
  </picture>
</a>
```

Swap `haruhime` for the product and its site. Use the host the site answers on without a redirect (`www.haruhime.moe`, not `haruhime.moe`): GitHub's image proxy may not follow one. The PNG is for places that don't show SVG.

## In code

```ts
import { bannerSvg, palette, PRODUCTS, wordmarkSvg } from "@haruhimemoe/brand";
palette(PRODUCTS.pools.hue).h1; // "#66ccff"
wordmarkSvg(PRODUCTS.pools, { background: "light" });
bannerSvg(PRODUCTS.haruhime, { background: "light" });
```

Importing the package doesn't load the native PNG renderer; only `svgToPng`, `brandFiles`, `previewHtml` and the CLI do, so palettes and SVGs work even where it isn't installed. Still, keep it to build time and Node 22.12+, never a browser or edge runtime. A hue outside 0–359 throws `RangeError` in `palette` and every drawing function, and so does a name that isn't lowercase `a-z0-9-` starting with a letter in `brandFiles`. The bundled fonts are subset to printable ASCII. Any other character (accents, CJK, tabs, non-breaking spaces) throws instead of drawing a blank box, so names, marks and taglines stay ASCII.

## Adding a product

Add an entry to `PRODUCTS` in the brand repo's `src/products.ts`: a lowercase `name`, a one- or two-letter `mark` no other product uses, a hue no other tool uses, a one-line `tagline` and the `url` (`https://<name>.haruhime.moe`). Check it with `bun run preview`, and accept the new snapshots (`bun run test -u`) only after looking at the diffs. The repo's CONTRIBUTING lists every other place that names the products. Releases are cut by the maintainers; once the new version is out, run the CLI in the new app.

## Common mistakes

- Writing `opengraph-image.tsx` or an `ImageResponse` route for a haruhime tool. The static files are cheaper and match the family.
- Giving an existing product a new hue in app CSS. Hues live in `PRODUCTS`; set `--hue` to that value.
- Using `h1` for accents on a light background.
- Leaving an old `favicon.ico` in the app directory. The CLI doesn't check for it, and browsers may keep showing it instead of `icon.svg`: delete it yourself.

## Sources

- [@haruhimemoe/brand README](https://github.com/haruhimemoe/brand#readme) 0.3.0, checked 2026-09-24.
- [@haruhimemoe/brand CONTRIBUTING](https://github.com/haruhimemoe/brand/blob/main/CONTRIBUTING.md), "Adding a product", checked 2026-09-24.
- [@haruhimemoe/ui README](https://github.com/haruhimemoe/ui#setup), "Setup" (the theme and `--hue`), checked 2026-09-24.
