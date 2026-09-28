<!-- Details for SKILL.md's "The map browser" and "Links" sections, summarized from pools.haruhime.moe's code in https://github.com/haruhimemoe/pools.haruhime.moe: the map browser's params (src/utils/browse-params.ts, src/utils/browse-state.ts, src/utils/browse-add.ts, src/constants/browse.ts) and search's (src/utils/search-params.ts, src/constants/search.ts). Recheck this when they change. -->

# pools links

Two kinds of pools.haruhime.moe link carry their state in the query string: the map browser in a pool's editor, and search. Each page reads it on load and writes it back as filters change, so a link shares the view. Params can come in any order, and a value that can't be read counts as its default: an error only for search's `map` (below).

## The map browser

`https://pools.haruhime.moe/pools/<id>/edit?browse=<value>`. The value is the browser's own query string, URL-encoded as one param (`=` as `%3D`, `&` as `%26`, `,` as `%2C`; in JavaScript, `encodeURIComponent`), so it never mixes with the editor's other params. The editor rewrites it without a reload as filters change and drops it at the defaults.

- Only the pool's owner and editors can open the editor. Anyone else signed in, admins included, gets a 404. A visitor who isn't signed in is sent to sign in and comes back to the editor without `browse`.
- Built pool ids are `b-` and 8 characters (`b-` then a letter, then 7 letters or digits). Find them on `/account`, in search (`type=built`) or on the pool's page.

| Param | Values |
| --- | --- |
| `lens` | `NM` (default), `HD`, `HR`, `DT`, `EZ`, `HT`, `FL`, `HDHR`, `HDDT`, `HRDT`, `HDHRDT`, `EZDT`, `EZHT`, as far as the hinai mirror lists them. Any order and case, and NC reads as DT (`hrhd` is HDHR). Any other combo reads as NM |
| `status` | `ranked` (default, includes approved), `loved`, `graveyard`: mod data. `qualified`, `pending`: no mod data, so the lens reads as NM and `sort` is ignored |
| `sort` | `favourites_desc` (default, most favourited), `pp`, `stars_desc`, `bpm_desc`, `length_desc`, each high to low. Ranked, Loved and Graveyard only |
| `sr`, `bpm`, `len`, `ar`, `od` | Ranges under the lens, written and bounded as on search (see Ranges below) |
| `q` | Title, artist or mapper; trimmed and cut to 100 characters |
| `inPool=hide` | Hide maps already in this pool |
| `hidePlayed=1` | Hide maps played in past pools (`true` works too) |
| `explicit=show` | Show explicit maps, for Qualified and Pending only. Ranked, Loved and Graveyard searches can include explicit maps either way |
| `page` | 1 to 200 |

Example: HR, 5 to 6 stars and AR 9.5 and up with HR, the pool's own maps hidden. The browser's query is `lens=HR&sr=5-6&ar=9.5-&inPool=hide`, so the link is `/pools/<id>/edit?browse=lens%3DHR%26sr%3D5-6%26ar%3D9.5-%26inPool%3Dhide`.

### What it shows

- **Values under the lens.** Star rating comes from the mirror's search. AR, OD and CS come from the mirror's values for that combo; without them, pools computes them by osu!'s rules and says "no mod data". BPM and length are always computed: ×1.5 BPM with DT, ×0.75 with HT, and length the other way. The no-mod stars show beside the lens's when they differ. The mirror's values can differ slightly from osu!'s.
- **Filtering.** The mirror filters star rating. BPM, length, AR and OD, the pool's own maps and maps played in past pools are taken off each page after it arrives, so a page can come back short; the browser says how many each one left out. Sets officially supported tournaments can't use are left out and counted, sets that need a closer look say **Check first**, and graveyard, pending and WIP sets are **Unranked**.
- **Each difficulty:** how many past pools played it (linking its map page) and **Add**. A map already in the pool says **In this pool**.
- **Where Add goes:** the bucket whose **Find maps** opened the browser, while the lens still matches it. Otherwise, for an NM, HD, HR or DT lens, that bucket; for any other lens, a custom bucket forced to exactly its mods; with no such bucket, a slot picker. **Choose slot** picks any slot, or none. A map lands at the end of its bucket.
- **Find maps** on a slot opens the browser under that slot's lens (NM when the mirror doesn't offer it) on page 1, switching Qualified or Pending back to Ranked, and puts the slot's target star range, if it has one, in `sr`.
- **Failure:** "Map search isn't working right now." with Retry. The pool keeps working.

## Search

Base: `https://pools.haruhime.moe/search`. The query string is the whole search.

- Params that don't belong to the search are ignored (`status` on a played-in-pools search, say). The one value that shows an error is `map` on the pools tab, when it isn't a beatmap ID or link.
- `q` is trimmed and cut to 100 characters. On the pools and played-in-pools searches every word must appear in the text it's matched against; all-maps passes it to the mirror.
- `page` counts from 1, and a page past 200 reads as 200. An unreadable page reads as 1. 50 results a page.
- On the pools and played-in-pools searches, a row missing a value a range filters on is left out, and the page says how many.

### Which search

| Link | Searches |
| --- | --- |
| `/search` (or `tab=pools`) | Pools: past tournament pools, or with `type`, public pools built here too |
| `/search?tab=maps` (or `tab=maps&scope=all`) | Every osu! map, through the hinai mirror |
| `/search?tab=maps&scope=played` | Maps played in the site's past pools |

`scope` takes `all` or `played` and wins when it's there. Without it, a `tab=maps` link with a non-empty `ar`, `od`, `cs`, `played`, `used`, `last` or `sort` reads as played in pools, and anything else as all maps. That keeps links from before the all-maps search working. The site writes `scope=played` on every played-in-pools search and never writes `scope=all`.

`/search?tab=maps&q=freedom%20dive&sr=6-7` searches all osu! maps. For the maps played in pools, add `scope=played`.

### Ranges

Write `low-high`, `low-` (no top) or `-high` (no bottom). A bare number (`sr=6`, or `6+`) means that and up. Decimals take `.` or `,`. A value is clamped to its slider and rounded to its precision. A range that covers the whole slider is no filter, and a crossed one (`7-6`) is dropped. The map browser writes its `sr`, `bpm`, `len`, `ar` and `od` the same way, under its lens.

| Param | Slider | Precision | Searches |
| --- | --- | --- | --- |
| `sr` | 0 to 10 stars | 0.01 | all three (no mod), and the browser (under the lens) |
| `len` | 0 to 600 seconds | 1 | both map searches, and the browser |
| `bpm` | 60 to 300 | 1 | both map searches, and the browser |
| `ar`, `od` | 0 to 11 | 0.1 | played in pools, and the browser |
| `cs` | 0 to 10 | 0.1 | played in pools |
| `used` | 1 to 20 pools | 1 | played in pools |
| `last` | 2007 to this year (last year used) | 1 | played in pools |
| `year` | 2007 to this year | 1 | pools |
| `maps` | 1 to 40 maps | 1 | pools |

`len` also takes `m:ss`: `len=1:30-3:00`. When one end has a colon, an end without one is seconds (`len=90-3:00`). A top end at the slider's maximum means no top, so `len=300-600` is five minutes and up.

### Pools

| Param | Values |
| --- | --- |
| `type` | `past` (default, and what a link without `type` means), `built` (public pools built here, not hidden), `both` (built pools first, then past pools, each in the chosen order). Built results say who built them |
| `q` | Tournament, round or pool name |
| `year`, `maps` | Ranges |
| `sr` | A range; matches past pools whose star range overlaps it. Only pools with every map's stars, length and BPM known can match; the rest count as missing data. Built pools have no star range, so none match while `sr` is set |
| `badged` | `yes`, `no` or `unknown` (unset for any). The page shows the filter only once some pools' badged is known. Past pools only: no built pool matches while it's set |
| `map` | A beatmap ID or difficulty link the pool contains, up to 200 characters |
| `sort` | `year` (default, newest first), `name` (A to Z), `maps` (most maps) |

### All osu! maps (`tab=maps`)

| Param | Values |
| --- | --- |
| `q` | Title, artist or mapper, passed to the mirror |
| `status` | `ranked` (default, includes approved), `loved`, `qualified`, `pending`, `graveyard`. One at a time; there is no "any" (an old `status=any` link opens as Ranked) |
| `sr`, `len`, `bpm` | Ranges, without mods |
| `explicit` | `show` to include explicit maps; they're hidden otherwise |

No sort: results come in the mirror's order, one card per beatmapset, osu!standard difficulties only. With `sr`, a set lists only its difficulties inside the range (all of them when none are, since the mirror's star ratings differ slightly from osu!'s). The total comes from the mirror and can be missing. Each difficulty says how many past pools played it.

### Played in pools (`tab=maps&scope=played`)

Maps from the site's past pools. Built pools never count here, on `/maps/<id>` or in any "played in N pools".

| Param | Values |
| --- | --- |
| `q` | Title, artist, set host or difficulty name |
| `sr`, `len`, `bpm`, `ar`, `od`, `cs`, `used`, `last` | Ranges; map values are without mods |
| `played` | Comma-separated codes: `NM`, `HD`, `HR`, `DT`, `FM`, `TB`, `EZ`, `HT`, `FL` (any case). A map matches when it was played as every code listed. EZ, HT and FL are mods a custom slot forced |
| `sort` | `used` (default, most used), `last` (last used), `stars` (high to low, no mod), `length` (longest first), `title` (A to Z) |

## Examples

| What | Link |
| --- | --- |
| The map browser under DT at 6 stars and up with DT, hiding maps past pools played | `/pools/<id>/edit?browse=lens%3DDT%26sr%3D6-%26hidePlayed%3D1` |
| Public built pools and past pools matching "owc" | `/search?type=both&q=owc` |
| Past pools matching "owc" from 2020 on, by name | `/search?year=2020-&sort=name&q=owc` |
| Pools that played beatmap 129891 | `/search?map=129891` |
| Loved sets from 6 to 7 stars | `/search?tab=maps&status=loved&sr=6-7` |
| Ranked sets at 180 BPM and up, page 2 | `/search?tab=maps&bpm=180-&page=2` |
| Maps played as HR and DT in 5 or more pools, last used first | `/search?tab=maps&scope=played&played=HR,DT&used=5-&sort=last` |
| Beatmap 129891's tournament history | `/maps/129891` |
