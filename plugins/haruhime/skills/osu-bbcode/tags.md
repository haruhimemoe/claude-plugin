<!-- Details for SKILL.md: every tag osu! reads, in our own words, checked against @haruhimemoe/bbcode 0.2.0 (its README is the source of truth: https://github.com/haruhimemoe/bbcode#readme). Not copied from the osu! wiki. -->

# osu! BBCode tags

Names are lowercase and case-sensitive. A tag osu! doesn't accept (wrong case, bad argument, no close) stays as text.

| Tag | Forms | What osu! does |
| --- | --- | --- |
| `b` `i` `u` | `[b]x[/b]` | Bold, italic, underline |
| `s` / `strike` | `[s]x[/s]`, `[strike]x[/strike]` | Strikethrough. Each closes only with its own name |
| `spoiler` | `[spoiler]x[/spoiler]` | Blacked out until hovered |
| `color` | `[color=#rrggbb]`, `[color=red]` | Text color. Hex needs `#`; names are letters only |
| `size` | `[size=N]` | Font size in percent, a whole number clamped to 30..200. osu!'s editor offers 50, 85, 100, 150 |
| `centre` `left` `right` | `[centre]x[/centre]` | Alignment. `[center]` is not a tag |
| `heading` | `[heading]x[/heading]`, one line | A section heading |
| `c` | `[c]x[/c]`, one line | Inline code |
| `code` | `[code]x[/code]` | A code block; the inside isn't read as BBCode |
| `notice` | `[notice]x[/notice]` | A highlighted block |
| `box` | `[box=Title]x[/box]` | A collapsed box. The title can hold inline tags. Left unclosed, it runs to the end of what holds it |
| `spoilerbox` | `[spoilerbox]x[/spoilerbox]` | A collapsed box titled "SPOILER" |
| `quote` | `[quote]x[/quote]`, `[quote="name"]x[/quote]` | A quote, "name wrote:" with a name. The name needs the quotes |
| `list` | `[list]`, `[list=1]` (any argument numbers it), items `[*]` | Bullets or numbers. Text before the first `[*]` is the list's title |
| `url` | `[url]https://…[/url]`, `[url=https://…]text[/url]`, one line | A link: http, https or ftp |
| `email` | `[email]a@b.c[/email]`, `[email=a@b.c]text[/email]` | A mailto link |
| `img` | `[img]https://…[/img]` | An image: http or https, no `[` in the URL |
| `audio` | `[audio]https://…[/audio]` | An audio player |
| `youtube` | a video id, or a youtube.com, youtu.be or shorts link | An embedded video |
| `profile` | `[profile]name[/profile]`, `[profile=id]name[/profile]` | A link to an osu! user. With an id, osu! swaps in the current username when the post is saved |
| `imagemap` | see below | An image with link regions |

Bare `http://`, `https://`, `ftp://` and `www.` links and email addresses become links on their own.

## Newlines

Newlines become line breaks, but block tags swallow the ones next to them so a block on its own line leaves no gap. Boxes, notices and code take the newlines inside their edges and one after; quotes and lists take two after; alignment takes one after its opening and one after its closing tag; headings and imagemaps one after. Extra blank lines around blocks are usually why a post looks too spaced or too tight.

## Imagemaps

```
[imagemap]
https://example.com/collab.png
0 0 50 100 https://osu.ppy.sh/users/2 peppy
50 0 50 100 # Nothing here yet
[/imagemap]
```

- A newline right after `[imagemap]`, the image URL (http or https) on the first line, one region per line, `[/imagemap]` on its own line.
- A region is `x y width height link title`. The four numbers are percentages of the image (0 to 100, plain decimals). The link is `#` for none, an `http(s)://` URL or `mailto:`. The title is the rest of the line.
- One bad line and osu! shows the whole block as text. `parseImagemap` reports each bad line; `serializeImagemap` refuses to write one.

## Limits

- 60,000 characters for forum posts, the userpage and beatmap descriptions (all stored as forum posts). Tags count.
- `@haruhimemoe/bbcode` keeps tags nested deeper than 100 as text (its own cap, not osu!'s).
