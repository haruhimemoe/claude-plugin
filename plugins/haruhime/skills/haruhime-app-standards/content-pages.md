# Content pages, llms and brand: the cookie cutter

Backs [SKILL.md](SKILL.md)'s "Content pages, llms and brand" section. Shipped 2026-10-04: brand 0.7.0, next-kit 0.6.0/0.6.1, ui 0.11.0.

## URLs, same in every app

| Section | Index | Page | Required when |
| --- | --- | --- | --- |
| `/docs` | `/docs` | `/docs/<slug>` (`/docs/api` with an API) | `src/app/api/v1` exists, or any `content/docs/*.mdx` |
| `/guides` | `/guides` | `/guides/<slug>` | any `content/guides/*.mdx` |
| `/legal` | `/legal` | `/legal/<slug>` (`/legal/terms`, `/legal/privacy`, ...) | always |
| `/brand` | — | `/brand` | always |

Every content page also serves a Markdown mirror at its own URL plus `.md`. An unknown slug's `.md` URL returns Next's 404 (`dynamicParams = false`), not a hand-written one. No redirects for an old path: it just changes (packs' `/guide/*` → `/guides/*`, bb's `/docs/guides/*` → `/guides/*`, haruhime.moe's `/terms`, `/privacy`, `/disclaimer` → `/legal/*`). Sections are extensible: a later `blog` section is a new section, not a new system.

## The cookie cutter file list

```
content/{docs,guides,legal}/*.mdx
src/constants/content.ts                       defineContent registry
src/content/load.ts                            static import() map (@next/mdx needs static imports)
src/app/{docs,guides,legal}/layout.tsx         ContentLayout
src/app/{docs,guides,legal}/page.tsx           ContentIndex
src/app/{docs,guides,legal}/[slug]/page.tsx    ContentPage, dynamicParams = false
src/app/{docs,guides,legal}/[slug]/md/route.ts markdown mirror (readContentMarkdown)
src/app/brand/page.tsx                         <BrandPage {...brandPageData("pools")} />
src/app/{llms.txt,llms-full.txt,sitemap.ts}    one-liners over the registry (contentLlmsTxt, contentLlmsFull, contentSitemap)
```

packs' AGENTS.md section 7 is the reference copy of this pattern: a new content page is three edits (the `.mdx` file, its registry entry, its `load.ts` line), kept in sync by a registry test; a new app copies the `src/app/(public)/{docs,guides,legal}/` route files unchanged apart from the section name.

## Per app (shipped)

- **packs** (`30c9530`): the template for the list above. `constants/guide.ts`, `docs.ts` and `legal.ts` merged into one `CONTENT` registry; `lib/docs.ts` and `utils/doc-markdown.ts` deleted; `/guide` is `/guides`.
- **pools** (`79607c7`): added `/docs` (`content/docs/api.mdx` replacing its old TSX API page) and `/brand`. No `/guides` yet: pools has no guide content, so `next-kit check` doesn't require one. Legal moved onto the shared pages.
- **bb** (`8c7e9a6`): `/docs/guides/*` is `/guides/*`. Tag pages stay at `/docs/tags/<tag>` as `extra.docs` (an app-made entry, not a registry one, in `defineContent`'s `extra` field). `DocsNav`, `DocsSearch` and `lib/guide-source.ts` are replaced by ui's `ContentNav`/`ContentSearch`; `LiveExample`, `TagReference`, `DocsFaq` and bb's `<Example>` MDX transform stay bb's own. `/docs/api` is MDX and shows in the nav. Added `/brand`.
- **haruhime.moe** (in progress on `phase2`, not yet merged to main): adding `@next/mdx`; `/terms`, `/privacy`, `/disclaimer` become `content/legal/*.mdx` at `/legal/*`; `/brand` moves to `BrandPage` with `slots` (README banners, product family); no `/docs` (no API) and no `/guides`.

## Brand page

`<BrandPage {...brandPageData("packs")} />` (ui 0.11.0 + brand 0.7.0's `brandPageData`, `@haruhimemoe/brand/products`) renders, in order: name and how to write it, logo/icon/wordmark/banners with downloads, colors (`BrandSwatch`, click to copy hex), type, do's and don'ts, osu! (not affiliated with ppy), family (a link to haruhime.moe/brand, hidden on haruhime.moe itself), contact. Contact is `haruhime@haruhime.moe` (`BRAND_CONTACT`) on every app's brand page; other contact addresses (security.txt, legal pages) are unchanged per app. haruhime.moe passes extra sections through `BrandPage`'s `slots` prop (`afterLogo`, `afterColors`, `end`).
