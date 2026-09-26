<!-- Details for SKILL.md's "Links" section, summarized from pools.haruhime.moe's search code (src/utils/search-params.ts and src/constants/search.ts in https://github.com/haruhimemoe/pools.haruhime.moe). Recheck this when they change. -->

# pools search links

Base: `https://pools.haruhime.moe/search`. The query string is the whole search: the page reads it on load and writes it back as filters change, so any search can be shared. Params can come in any order.

## Reading rules

- A value that can't be read counts as unset, never an error. The one exception is `map` on the pools tab: a value that isn't a beatmap ID or link shows an error.
- Params that don't belong to the search are ignored (`status` on a played-in-pools search, say).
- `q` is trimmed and cut to 100 characters. On the pools and played-in-pools searches every word must appear in the text it's matched against; all-maps passes it to the mirror.
- `page` is a whole number from 1; anything past 200 reads as 200. 50 results a page.
- On the pools and played-in-pools searches, a row missing a value a range filters on is left out, and the page says how many.

## Which search

| Link | Searches |
| --- | --- |
| `/search` (or `tab=pools`) | Pools |
| `/search?tab=maps` (or `tab=maps&scope=all`) | Every osu! map, through the hinai mirror |
| `/search?tab=maps&scope=played` | Maps played in the site's pools |

`scope` takes `all` or `played` and wins when it's there. Without it, a `tab=maps` link with a non-empty `ar`, `od`, `cs`, `played`, `used`, `last` or `sort` reads as played in pools, and anything else as all maps. That keeps links from before the all-maps search working. The site writes `scope=played` on every played-in-pools search and never writes `scope=all`.

`/search?tab=maps&q=freedom%20dive&sr=6-7` searches all osu! maps. For the maps played in pools, add `scope=played`.

## Ranges

Write `low-high`, `low-` (no top) or `-high` (no bottom). A bare number (`sr=6`, or `6+`) means that and up. Decimals take `.` or `,`. A value is clamped to its slider and rounded to its precision. A range that covers the whole slider is no filter, and a crossed one (`7-6`) is dropped.

| Param | Slider | Precision | Searches |
| --- | --- | --- | --- |
| `sr` | 0 to 10 stars, no mod | 0.01 | all three |
| `len` | 0 to 600 seconds | 1 | both map searches |
| `bpm` | 60 to 300 | 1 | both map searches |
| `ar`, `od` | 0 to 11 | 0.1 | played in pools |
| `cs` | 0 to 10 | 0.1 | played in pools |
| `used` | 1 to 20 pools | 1 | played in pools |
| `last` | 2007 to this year (last year used) | 1 | played in pools |
| `year` | 2007 to this year | 1 | pools |
| `maps` | 1 to 40 maps | 1 | pools |

`len` also takes `m:ss`: `len=1:30-3:00`. When one end has a colon, an end without one is seconds (`len=90-3:00`). A top end at the slider's maximum means no top, so `len=300-600` is five minutes and up.

## Pools

| Param | Values |
| --- | --- |
| `q` | Tournament, round or pool name |
| `year`, `maps` | Ranges |
| `sr` | A range; matches pools whose star range overlaps it (pools with every map's stars known) |
| `badged` | `yes`, `no` or `unknown` (unset for any). The page shows the filter only once some pools' badged is known |
| `map` | A beatmap ID or difficulty link the pool contains, up to 200 characters |
| `sort` | `year` (default, newest first), `name` (A to Z), `maps` (most maps) |

## All osu! maps (`tab=maps`)

| Param | Values |
| --- | --- |
| `q` | Title, artist or mapper, passed to the mirror |
| `status` | `ranked` (default, includes approved), `loved`, `qualified`, `pending`, `graveyard`, `any` |
| `sr`, `len`, `bpm` | Ranges |
| `explicit` | `show` to include explicit maps; they're hidden otherwise |

No sort: results come in the mirror's order, one card per beatmapset, osu!standard difficulties only. With `sr`, a set lists only its difficulties inside the range (all of them when none are, since the mirror's star ratings differ slightly from osu!'s). The total comes from the mirror and can be missing.

## Played in pools (`tab=maps&scope=played`)

| Param | Values |
| --- | --- |
| `q` | Title, artist, set host or difficulty name |
| `sr`, `len`, `bpm`, `ar`, `od`, `cs`, `used`, `last` | Ranges |
| `played` | Comma-separated codes: `NM`, `HD`, `HR`, `DT`, `FM`, `TB`, `EZ`, `HT`, `FL` (any case). A map matches when it was played as every code listed. EZ, HT and FL are mods a custom slot forced |
| `sort` | `used` (default, most used), `last` (last used), `stars` (high to low, no mod), `length` (longest first), `title` (A to Z) |

## Examples

| Search | Link |
| --- | --- |
| Pools matching "owc" from 2020 on, by name | `/search?year=2020-&sort=name&q=owc` |
| Pools that played beatmap 129891 | `/search?map=129891` |
| Loved sets from 6 to 7 stars | `/search?tab=maps&status=loved&sr=6-7` |
| Ranked sets at 180 BPM and up, page 2 | `/search?tab=maps&bpm=180-&page=2` |
| Maps played as HR and DT in 5 or more pools, last used first | `/search?tab=maps&scope=played&played=HR,DT&used=5-&sort=last` |
| Beatmap 129891's tournament history | `/maps/129891` |
