---
name: packs
description: Use when someone wants to make, open, share or download an osu! mappool pack, mentions packs.haruhime.moe, pack keys (`pk1.`, `pk2.` or `pk3.`), short links (`/p/<slug>`), adding a pack's maps to an osu! collection (`collection.db`) from packs, or the packs API and its API keys (`hpk_…`)
---

# packs (packs.haruhime.moe)

A browser tool for building osu! tournament mappool packs. Paste beatmap ids, links or a whole pool, arrange the slots, then download the pack as one zip or make a torrent, both client-side through the [hinai mirror](../hinai-mirror/SKILL.md). Share it as a pack key (`pk1.`/`pk2.`/`pk3.`) or save it for a short link.

## Pages

| Page | What it's for |
| --- | --- |
| `/new` | Build a pack: paste ids/links/a pool, edit slots, download or share |
| `/k` | Open a pack key: paste one, or follow a link with the key in the fragment (`/k#pk1.…`) |
| `/packs` | Browse public packs: pinned packs on top, then the rest, newest first. Search, filters (star rating, mods, length, BPM, mode, map count) and sort |
| `/p/<slug>` | A saved pack's short link: its maps (each with Copy ID), downloads and magnet links; the owner edits it at `/p/<slug>/edit` |
| `/me` | Your saved packs and your API key |
| `/guides` | How-to guides: making a pack, osu! collections, downloading and seeding a torrent, pack keys |
| `/docs/api`, `/docs/api.md` | The API reference, for people and for agents (Markdown) |
| `/legal` | Terms, privacy and the rest, an MDX page each, with a `.md` mirror |
| `/brand` | The packs name, logos and colors, for staff, wikis and press |
| `/llms.txt` | A map of the site for AI assistants |

## Pack keys

A pack key holds a whole pool (name, slots, custom slots and their mods) as one line of base64url text, the format `@haruhimemoe/pool` reads and writes: see `osu-mappool-data` for the byte layout and code.

## The API

Base URL `https://packs.haruhime.moe/api/v1`, JSON over HTTPS, documented at `/docs/api` (OpenAPI 3.1 at `/api/v1/openapi.json`). It's for scripts and bots, not browsers: it sends no CORS headers, so keep your key in a server or a secret store, never in a public repo or client-side code.

Follows `haruhime-app-standards`: the key format, the `/me` key panel, the `/api/v1` guard and its rate limits all come from there. packs' prefix is `hpk_`.

- **Endpoints**: read and page public or your own packs (the API doesn't mark or move up pinned packs), and create, replace or delete your own. Pack objects carry `stats` (star rating, length and BPM ranges, mods, rulesets) a few seconds after a save. An admin's key skips the 200-saved-pack cap (`409 conflict` for everyone else), same as the site. Full parameters, response shapes, pagination and error codes: [api.md](api.md), copied from the source of truth; don't guess a field or limit.
- `ownerName` is the owner's osu! username, `Unknown player` when there's none (not an error), or `haruhime pools` for ordinary packs from pools.haruhime.moe (in beta): shared built pools, and past pools from hosts, community submissions and sources like otdb. `description` is left out when empty.
- To list public packs without a key, fetch the static search index at `/packs/index.json` (up to 5,000, newest created first, no rate limit). Entries use short keys (`s` slug, `n` name, `o` owner, `c` map count, stats; see [api.md](api.md)) and carry no maps: call `GET /api/v1/packs/{slug}` for those.

## Downloading files

packs never hosts, proxies or seeds `.osz` bytes. A pack's zip and torrent are built in the browser from beatmaps fetched through the [hinai mirror](../hinai-mirror/SKILL.md); a saved pack's `exports` lists the magnet links its owner recorded. packs never checks what a torrent holds: if one holds anything beyond `.osz` files and `pack.txt`, don't run it. Don't scrape pack pages: use the API or the search index for pack data, and the hinai mirror for beatmap files.

## osu! collections

The "Add to osu! collection" card on `/new`, `/k` and `/p/<slug>` adds a pack's maps to an osu! collection, by each difficulty's MD5 checksum from the map info the page loaded. It lists the maps it can't add, and why. Maps not downloaded yet show up in osu! once downloaded.

- **osu!stable:** close osu!, pick `collection.db` (next to `osu!.db`), choose a collection or name a new one, and download the whole file with the maps added. Keep a copy of the old file, put the new one in the osu! folder named exactly `collection.db`, then start osu! (it ignores and overwrites a file swapped while it runs).
- **osu!lazer:** type the collection's exact name and download a zip of `collection.db` and an empty `osu!.import.cfg`. Extract it and import the folder with lazer's setup wizard, Collections only. Desktop only.

The file stays in the browser. Steps: `/guides/osu-collections`.

## Common mistakes

- Calling the API from a browser, or shipping a key inside client-side code: there's no CORS, on purpose.
- Scraping pack pages instead of `GET /api/v1/packs` or `/packs/index.json`.
- Treating a slot's `beatmapId` as a beatmapset id, or expecting titles and star ratings in a pack: slots hold difficulty ids only (see `osu-mappool-data`).

## Related

- `osu-mappool-data` for the pool model and pack key format packs uses.
- `hinai-mirror` for the beatmap downloads a pack is built from.
- `haruhimemoe-packages` for how `@haruhimemoe/pool` and `@haruhimemoe/hinai` fit together.
- `haruhime-app-standards` for the key format, the `/api/v1` guard and its limits.

## Sources

- packs API reference, https://packs.haruhime.moe/docs/api and https://packs.haruhime.moe/docs/api.md (copied to `api.md`), checked 2026-09-28.
- Pack key guide, https://packs.haruhime.moe/guides/pack-key, checked 2026-10-04.
- osu! collections guide, https://packs.haruhime.moe/guides/osu-collections, checked 2026-10-04.
- Site map for assistants, https://packs.haruhime.moe/llms.txt, and the [packs.haruhime.moe README](https://github.com/haruhimemoe/packs.haruhime.moe#readme), checked 2026-09-28.
