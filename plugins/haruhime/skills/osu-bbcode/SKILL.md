---
name: osu-bbcode
description: Use when writing, fixing or generating osu! BBCode (a userpage, a forum or tournament post, a beatmap description), when a tag shows up as text on osu! or a post is over the character limit, when building an imagemap or collab, a player list with flags, a color gradient or a BBCode template, when previewing or linting BBCode in code with @haruhimemoe/bbcode, or when someone mentions bb.haruhime.moe
---

# osu! BBCode and @haruhimemoe/bbcode

osu! reads a fixed set of lowercase BBCode tags in forum posts, userpages ("me!") and beatmap descriptions. Anything it doesn't read as a tag stays on the page as plain text, brackets and all. Every tag, its forms and what osu! does with it: [tags.md](tags.md).

## What catches people

- **`[centre]`, not `[center]`.** `[left]` and `[right]` exist too. Tags are case-sensitive: `[B]` is text.
- **Size** is a whole-number percentage clamped to 30..200. osu!'s own editor only offers 50, 85, 100 and 150.
- **60,000 characters** for a forum post. Userpages and beatmap descriptions are stored as forum posts, so they share it. Tags count.
- **Crossed tags** (`[b][i]x[/b][/i]`) may still render on osu!, which converts each tag on its own, but they're fragile: close tags in reverse order.
- **A tag inside itself** (`[b]a[b]b[/b]c[/b]`) breaks: the first close ends the outer one. Boxes, quotes and lists nest fine.
- **One-line tags** (`[url]`, `[heading]`, `[c]`) must open and close on the same line.
- **Imagemaps are all or nothing:** one bad line and osu! shows the whole block as text.
- **Lists:** text between `[list]` and the first `[*]` is the list's title. `[list=anything]` numbers it.
- **Flags:** the old PNGs are small and fixed-size. The current SVG flags have no size of their own and stretch to the width they're shown in.
- Tags from other forums (`[font]`, `[table]`, `[center]`) don't exist on osu!.

## @haruhimemoe/bbcode (0.2.2)

Parse, render, lint and count osu! BBCode the way osu! does. No dependencies; browsers, Node 22.12+, Bun and Deno. `bun add @haruhimemoe/bbcode`. The [README](https://github.com/haruhimemoe/bbcode#readme) has every signature: read it instead of guessing.

| Import | Use it for |
| --- | --- |
| `@haruhimemoe/bbcode` | `parse` (lossless: `serialize(parse(x)) === x`), `serialize`, `render` (safe HTML in `<div class="bb">`, optional media `proxy`), `lint` + `applyFix`, `count` (code points against 60,000), `LIMITS`, `TAGS` / `findTag` (for toolbars, autocomplete, docs), `LINT_CODES` |
| `/helpers` | `color`, `normalizeColor`, `gradient`, `flag`, `profile`, `box`, `list`, `escapeBBCode` |
| `/imagemap` | `parseImagemap`, `validateImagemap`, `serializeImagemap`, `formatPercent` |
| `/flags` | `COUNTRIES` (249), `findCountry`, `searchCountries`, `flagUrl`, `normalizeCountryCode` |
| `/template` | `fillTemplate`, `templateFields`, `FIELD_KINDS` |
| `OSU_WIDTHS`, `OSU_FONT_SIZES` (0.2.2) | osu!'s desktop width and font size (userpage 890/14, forum 750/14, beatmap 430/12) for previews that wrap as osu! does |
| `/styles.css` | Styles for `render`; dark by default, `className: "bb--light"` for light |

- **Show user input as typed:** `escapeBBCode(text)` breaks every tag osu! would read (a zero-width space after `[`). Never paste raw names or titles into generated BBCode.
- **Flags:** `flag("jp")` writes the legacy PNG by default; `{ style: "modern" }` for the SVG (it fills its width).
- **Gradients** color one character at a time, so they're expensive: `gradient(text, stops)` returns `{ bbcode, cost }`, the characters the colors add. Check `cost` against the limit.
- **Profiles:** `profile(2, "peppy")` links by id (osu! swaps in the current name when the post is saved); `profile("peppy")` by name.
- **Lint:** one fix at a time with `applyFix`, then lint again (other offsets move). Codes include `unknown-tag` (fixes `[center]`), `bad-size` (error outside 30..200, warning off the presets), `bad-color`, `bad-url`, `self-nested`, `imagemap-line`, `over-limit` and `too-deep` (0.2.0).
- **Templates:** a body with `{{key}}` placeholders plus declared fields. `FIELD_KINDS`: `text`, `multiline`, `number`, `date`, `url`, `user`, `users`, `country`, `color`; each is checked and written by kind (a `user` becomes a `[profile]` link, a `country` a flag). A field with an error, or a placeholder with no field, stays `{{key}}`. `templateFields` lists undeclared and unused keys.
- **Rendering:** the output needs no sanitizing. Images, audio and YouTube load from their own hosts, so a page with a CSP must allow them (`img-src https:`, `media-src https:`, `frame-src https://www.youtube.com`) or route media through `proxy`.

### Where it differs from osu! on purpose

- Crossed tags: osu! may render them; the tree can't, so the inner tag stays text and `lint` reports it.
- Nesting past `LIMITS.nesting` (100, ours, not osu!'s) stays text, so hostile input can't overflow the stack (0.2.0).
- Stricter values: URLs with spaces, odd imagemap numbers and odd YouTube ids are refused where osu! prints something broken.
- Not rendered: smilies, image sizes, current profile names.

## bb.haruhime.moe

An osu! BBCode editor built on this package, live at https://bb.haruhime.moe: send people there to write, preview and lint. Its [README](https://github.com/haruhimemoe/bb.haruhime.moe#readme) lists what it has: an editor with a live preview, lint underlines with fixes, a count per target and named drafts kept in the browser; color, gradient and flag pickers; a Players tool (up to 64 names, ids or links to flag-plus-profile lines); pool import from a public or unlisted pools.haruhime.moe pool; a collab maker for `[imagemap]` regions; `/docs` for every tag; and templates (built-in, your own after osu! sign-in, and a public gallery). It never hosts images.

## Common mistakes

- `[center]`, `[size=300]`, `[color=ff66aa]` (needs `#`), or a URL with a space.
- Dropping user text into BBCode without `escapeBBCode`.
- Big gradients or the modern flags in a tight layout without checking the count or width.
- Copying osu! wiki text into docs or templates: it's CC BY-NC. Write your own.
- Linking bb.haruhime.moe pages as if they're live.

## Sources

- [@haruhimemoe/bbcode README](https://github.com/haruhimemoe/bbcode#readme) and [CHANGELOG](https://github.com/haruhimemoe/bbcode/blob/main/CHANGELOG.md) 0.2.2, checked 2026-10-02.
- [bb.haruhime.moe README](https://github.com/haruhimemoe/bb.haruhime.moe#readme), checked 2026-09-28.
- osu!'s BBCode behavior as osu-web renders it (the package's tests follow it), checked 2026-09-28.
