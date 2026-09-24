---
name: packs
description: Use when someone wants to make, open, share or download an osu! mappool pack, mentions packs.haruhime.moe, pack keys (`pk1.`, `pk2.` or `pk3.`), short links (`/p/<slug>`), or the packs API and its API keys (`hpk_…`)
---

# packs (packs.haruhime.moe)

A browser tool for building osu! tournament mappool packs. Paste beatmap ids, links or a whole pool, arrange the slots, then download the pack as one zip or make a torrent, both client-side through the [hinai mirror](../hinai-mirror/SKILL.md). Share it as a pack key (a `pk1.`/`pk2.`/`pk3.` string, see below) or save it and get a short link.

## Pages

| Page | What it's for |
| --- | --- |
| `/new` | Build a pack: paste ids/links/a pool, edit slots, download or share |
| `/k` | Open a pack key: paste one, or follow a link with the key in the fragment (`/k#pk1.…`) |
| `/packs` | Browse public packs: pinned packs on top, then community packs, then archive packs (past tournament pools). Search, filters (star rating, mods, length, BPM, mode, map count, source) and sort |
| `/p/<slug>` | A saved pack's short link: its maps (each with Copy ID and, when archive pools used it, "Used in N pools"), downloads and magnet links |
| `/me` | Your saved packs and your API key |
| `/guide` | How-to guides: making a pack, downloading and seeding a torrent, pack keys, archived pools |
| `/docs/api`, `/docs/api.md` | The API reference, for people and for agents (Markdown) |
| `/llms.txt` | A map of the site for AI assistants |

## Pack keys

A pack key holds a whole pool (name, slots, custom slots and their mods) as one line of base64url text. It's the same format `@haruhimemoe/pool` reads and writes: see `osu-mappool-data` for the byte layout, decoding rules and how to generate one in code. Don't re-derive it here.

## The API

Base URL `https://packs.haruhime.moe/api/v1`, JSON over HTTPS, documented at `/docs/api` (a machine-readable OpenAPI 3.1 document sits at `/api/v1/openapi.json`). It's for scripts and bots, not for browsers: it sends no CORS headers, so keep your key in a server or a secret store, never in a public repo or client-side code.

- **Get a key**: sign in with osu!, open `/me`, press **Create API key**. It's shown once; regenerating replaces it and revokes the old one right away.
- **Auth**: `Authorization: Bearer hpk_…` on every request except map usage. No key gets `401 unauthorized`; a bad, revoked or replaced one gets `401 invalid_api_key`.
- **Endpoints**: read and page public or your own packs, create, replace or delete your own, and look up which archive pools used a map. Pack objects carry `stats` (star rating, length and BPM ranges, mods, rulesets) a few seconds after a save. Full parameters, response shapes, rate limits, pagination and error codes are in [api.md](api.md), copied from the source of truth: don't guess a field or a limit.
- **Map usage**: `GET /beatmaps/{id}/usage`, or `GET /beatmaps/usage?ids=` for up to 100 beatmap (difficulty) ids at once, says which archive pools used a map: each entry's pack slug, tournament, round, year, slot, mods and the pool's fingerprint, most recent year first, and `count` in pools. No key: 60 requests a minute per IP address, answered from a CDN cache, so an answer can be up to an hour old.
- **Archive packs** are past tournament pools imported from otdb, hosted by the `haruhime archive` account. Their pack objects carry a read-only `archive` field (tournament, round, year, fingerprint, sources); `POST` and `PUT` ignore it.
- To list public packs (slug, name, owner, map count) without a key, fetch the static search index at `/packs/index.json` (up to 5,000 packs, community packs first, and it doesn't count against any limit). Entries carry stats in short form, and archive packs `x`, `xk` and `xu` (see [api.md](api.md)). It has no maps, slots or exports: for a pack's maps, call `GET /api/v1/packs/{slug}`.

## Downloading files

packs never hosts, proxies or seeds `.osz` bytes. A pack's zip and torrent are built in the browser from beatmaps fetched through the [hinai mirror](../hinai-mirror/SKILL.md); a saved pack's `exports` field lists the magnet links its owner recorded, canonicalized to only the infohash, name, size and packs' own trackers. packs never checks what a torrent actually contains: if you fetch one and it holds anything beyond `.osz` files and `pack.txt`, don't run it. Don't scrape `/packs` or `/p/<slug>` pages: use the API (`GET /api/v1/packs`, `GET /api/v1/packs/{slug}`) for full pack data, the search index for a lightweight public list, and the hinai mirror for beatmap files.

## Common mistakes

- Calling the API from a browser, or shipping a key inside client-side code: there's no CORS, on purpose.
- Sending a key to the map usage endpoints (they need none), or counting a map's `entries` as pools: a pool that used a map in two slots has two entries and counts once in `count`.
- Scraping pack pages instead of `GET /api/v1/packs` or `/packs/index.json`.
- Treating a slot's `beatmapId` as a beatmapset id, or expecting titles and star ratings in a pack: slots hold difficulty ids only (see `osu-mappool-data`).
- Assuming packs itself serves `.osz` files. It never does.

## Related

- `osu-mappool-data` for the pool model and pack key format packs uses.
- `hinai-mirror` for the beatmap downloads a pack is built from.
- `haruhimemoe-packages` for how `@haruhimemoe/pool` and `@haruhimemoe/hinai` fit together.

## Sources

- packs API reference, https://packs.haruhime.moe/docs/api and https://packs.haruhime.moe/docs/api.md, checked 2026-09-24.
- Archived pools guide, https://packs.haruhime.moe/guide/archived-pools, checked 2026-09-24.
- Pack key guide, https://packs.haruhime.moe/guide/pack-key, checked 2026-09-23.
- Site map for assistants, https://packs.haruhime.moe/llms.txt, checked 2026-09-24.
