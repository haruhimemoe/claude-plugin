<!-- Details for SKILL.md's "Page cards". Summarized from the @haruhimemoe/brand README (https://github.com/haruhimemoe/brand#readme), the source of truth; recheck this when it changes. -->

# @haruhimemoe/brand: page cards (0.6.0)

A link preview per page (a pack, a pool, a template, a guide), not only per site: `ogCardSvg(product, { title, subtitle?, eyebrow? })` and `ogCard` (PNG), 1200×630 in the `ogSvg` look, the title wrapped and shrunk to fit (88, 76 or 64px, at most 3 lines, then "..."), `OG_CARD` for the size. `ogCard` can run per request in a Node.js route (the README has the Next.js config). `asciiText` folds user text to what the bundled fonts draw and `fitLines` wraps text to a width.

## When to use one

The static `opengraph-image.png` from `haruhime-brand <product>` is the site's preview. A page card is for a page whose share matters on its own: a public pack, a pool, a template, a guide. Give it the page's title, a one-line subtitle (the pack's map count and stars, a pool's tournament) and an optional eyebrow (the product or section name).

## In Next.js

- Static: draw the PNGs at build (a script over the pages you know) into `public/og/<slug>.png` and point `pageMetadata`'s `ogImages` at them.
- Per request: a Node.js route (`export const runtime = "nodejs"`) that calls `ogCard(product, { title, subtitle })` and returns the PNG with a long cache header. The README shows the config; keep it off the edge runtime, since the renderer is native.
- Text goes through `asciiText` first: the bundled Nunito is subset to printable ASCII, so accents are dropped and typographic punctuation straightened; anything else is left out rather than drawn as a box.
