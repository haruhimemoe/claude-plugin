<!-- Details for SKILL.md's "SEO". Summarized from the @haruhimemoe/next-kit README (https://github.com/haruhimemoe/next-kit#readme), the source of truth; recheck this when it changes. -->

# @haruhimemoe/next-kit/seo

Every haruhime site (www, packs, pools, bb) builds its metadata from `/seo` with one `Site` record, never by hand. `siteMetadata` in the layout, `homeMetadata` on `/`, `pageMetadata({ path, title, description })` on every other page (it always sets canonical and og:url together and writes the full openGraph with the site's images, so a page never loses its preview; a partial page-level `openGraph` would replace the layout's), `notFoundMetadata` on the 404. `pageTitle` makes "keyword · host" and `clampDescription` cuts at 160 characters on a word. `robots` takes the AI crawler stance (`"allow"`, `"block-training"` or `"block-all"`; `AI_BOTS` lists them). `sitemapEntries` writes absolute URLs with lastmod only for a real date. `ld.*` builds JSON-LD (Organization with `HARUHIME_ORG`, WebSite, WebApplication, BreadcrumbList, ItemList, FAQPage, HowTo, TechArticle, CreativeWork, Dataset) with stable `@id`s; `serializeLd` escapes it for a script tag. `llmsTxt`, `llmsFull` and `textResponse` serve `/llms.txt`. 0.4.0 adds a short title suffix: `Site.shortTitleSuffix` ("pools") and `pageMetadata`'s `titleSuffix` (`"auto"` switches to it only past 60 characters, `TITLE_MAX`).

## Where each site uses it

- Layout: `siteMetadata(SITE)`. Home: `homeMetadata(SITE)`. Every other page: `pageMetadata(SITE, { path, title, description })`, usually through a small app helper that reads the page's copy from one constants table. 404: `notFoundMetadata(SITE, "Page")`, which also sets `robots: { index: false }`.
- `app/robots.ts`: `robots(SITE, { aiBots: "allow" })`. `app/sitemap.ts`: `sitemapEntries(SITE, [staticPages, dynamicRecords])`, each entry `{ path, lastModified? }`; pass no `lastModified` when the date isn't known rather than a build time.
- JSON-LD: build with `ld.graph(...)` and render with ui's `JsonLd` (it escapes `<`, `>`, `&`, U+2028/9). Every haruhime site's Organization is `HARUHIME_ORG` (`@id` `https://www.haruhime.moe/#organization`), never a copy.
- `/llms.txt`: a route handler with `dynamic = "force-static"` returning `textResponse(llmsTxt({ title, summary, notes, sections }), { maxAge, sMaxAge })`.

## Gotchas

- Next 16 drops the body of a page-level `notFound()` (an empty `__next_error__` shell); the metadata still says noindex. Known, not fixable from the kit.
- A description over 160 characters is cut at a word by `clampDescription`; write them to fit instead.
- `titleSuffix: "auto"` only switches to the short suffix when the site sets `shortTitleSuffix`; without it, long titles stay long.
