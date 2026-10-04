# @haruhimemoe/next-kit's `docs` and `docs/files`

Backs [SKILL.md](SKILL.md)'s "Docs, guides and legal" section. Shipped in next-kit 0.6.0 (0.6.1 widens the `@haruhimemoe/ui` peer to ^0.11). Shared URL table, the cookie cutter app and per-app rollout: `haruhime-app-standards` and its [content-pages.md](../haruhime-app-standards/content-pages.md).

## `/docs` (no runtime imports)

- `defineContent({ docs, guides, legal, extra? })` validates and returns a `Content`: slugs lowercase with hyphens, unique per section, ISO `lastUpdated` dates. Throws at build on a bad entry. Each entry is `{ slug, title, navTitle?, description, lastUpdated, howTo? }`; `extra` holds app-made pages in a section that aren't registry entries, like bb's `/docs/tags/<tag>`.
- `CONTENT_SECTIONS` (`["docs", "guides", "legal"]`) and `SECTION_LABELS` ("Docs", "Guides", "Legal").
- `contentPath(section, slug)` and `markdownPath(section, slug)` build a page's URL and its `.md` mirror's URL. `findEntry(content, section, slug)` looks an entry up (registry or `extra`) or returns `undefined`. `contentParams(content, section)` is `generateStaticParams`'s `{ slug }[]` for a section, pairing with `dynamicParams = false` so an unregistered slug's page and `.md` mirror both 404.
- `mdxToMarkdown(src, { title, siteUrl, transforms? })`: strips `import`/`export` lines, turns `<Callout>` into `> **Note:**` blocks, absolutizes root-relative links and images against `siteUrl`, drops unknown JSX tags but keeps their text, adds a title heading when the source has none, and leaves fenced code blocks untouched (including one nested inside a callout). `transforms` lets an app convert its own custom components (bb's `<Example>`) before the generic rules run.
- `contentLlmsTxt(content, site, extra?)`: an `llmsTxt` document with sections in order Docs, Guides, API, Legal (an empty one is left out), each entry linking its `.md` mirror. `contentLlmsFull(content, site, extraParts?)`: an `llmsFull` document, every entry's own markdown, with each entry's leading H1 stripped (since `llmsFull` writes the part title itself). `extraParts` is for non-content material: haruhime.moe's brand and library sections, bb's FAQ.
- `contentSitemap(content)`: `SitemapRecord[]` for every section's index and every entry (registry and `extra`), `lastModified` from `lastUpdated` only when it's a real date. Apps merge this with their own DB-driven sitemap groups (a pack's `updatedAt`, a pool's).
- `contentRewrites()`: the one Next.js rewrite rule mapping a content page's `<section>/<slug>.md` URL to its markdown route handler (`<section>/[slug]/md/route.ts`), for `next.config.ts`.

## `/docs/files` (loads `node:fs`)

- `readContentMarkdown(content, section, slug, { root?, siteUrl, transforms? })`: reads `<root>/content/<section>/<slug>.mdx` (`root` defaults to `process.cwd()`) and runs it through `mdxToMarkdown`. Returns `null` for an unregistered slug; throws the file system's `ENOENT` when a registered slug's file is missing. The source for a page's `.md` mirror, `CopyMarkdownButton`'s fetch target and `contentLlmsFull`.
- `contentFileDrift(content, { root? })`: `{ missingFiles, unregistered }`. `missingFiles` lists a registered entry with no `.mdx` file on disk (`"guides/make-a-pack.mdx"`); `unregistered` lists a `.mdx` file on disk with no matching registry entry. Run it as a unit test (packs' `tests/unit/content/registry.test.ts` pattern), not only through `next-kit check`, which checks files but never parses the registry itself.

## Gotchas

- `defineContent` throws at build, not at request time: a bad slug or a duplicate fails the build, so catch it in CI, not production.
- `mdxToMarkdown` leaves code fence content alone, including inside a callout: don't double-convert a fence's own Markdown-looking text.
- `@next/mdx` needs static `import()`s per MDX file (no dynamic glob), hence `src/content/load.ts` in the cookie cutter file list.
- `readContentMarkdown`'s `root` must point at the directory holding `content/`, not `content/` itself.
