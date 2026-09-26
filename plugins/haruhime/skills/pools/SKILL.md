---
name: pools
description: Use when someone looks for past osu! tournament mappools or the tournaments a map was played in, searches osu! maps for a pool on pools.haruhime.moe, checks or sends (submits) a pool there, or mentions pools.haruhime.moe or its links (`/search`, `/pools/<id>`, `/maps/<id>`)
---

# pools (pools.haruhime.moe)

A site of past osu! tournament mappools, in beta: things can move, and some pools are still missing. Pools come from several places: some past pools from otdb's public export (by Sheppsu, with his permission), pools sent by tournament hosts, and community submissions, and maybe more sources later. Each pool page names its sources. Never say the pools all come from otdb.

Visitors only read: only admins sign in, with osu!. pools never hosts beatmap files, and every star rating on it is without mods.

## Pages

| Page | What it's for |
| --- | --- |
| `/search` | Search pools, every osu! map, or the maps played in pools |
| `/pools/<id>` | A pool: maps with slot, stars, length, BPM and Copy ID, notes, sources, Open in packs |
| `/maps/<beatmap id>` | A map's history: every current pool that played it, newest first |
| `/check` | Check a pool against the content rules |
| `/data` | Where the data comes from, and corrections |
| `/submit` | How to send a pool |
| `/llms.txt` | For AI assistants: the pages, every current pool, the most used maps |

Find pool ids through search or `/llms.txt`; don't build them.

## Searching

- **Pools:** by tournament, round or name, year, stars, map count, badged (once known) or a map the pool contains.
- **All osu! maps** (the maps tab's default): every osu! map through the [hinai mirror](../hinai-mirror/SKILL.md), osu!standard only, by title, artist or mapper, status (Ranked by default), stars, length and BPM. Sets officially supported tournaments can't use are left out and counted. Sets that need a closer look say **Check first**, with the reason. Graveyard, pending and WIP sets are tagged **Unranked**: they can change or disappear. Explicit maps are hidden unless asked for. Each difficulty says how many pools played it.
- **Played in pools:** only maps from the site's pools, with AR, OD, CS, played as (NM, HD, HR, DT, FM, TB, EZ, HT, FL), times used and last year used too.

Check first and the hidden count are guidance: the osu! Tournament Committee decides.

## Links

- Pools: `https://pools.haruhime.moe/search?q=…` (no `tab`).
- All osu! maps: `/search?tab=maps`, plus `status` (`loved`, `qualified`, `pending` or `graveyard`; none for Ranked), `sr`, `len`, `bpm`, `explicit=show`, `q`.
- Played in pools: `/search?tab=maps&scope=played`, plus `ar`, `od`, `cs`, `played=HR,DT`, `used`, `last`, `sort`.
- Ranges are `low-high`, `low-` or `-high`: `sr=6-7`, `bpm=180-`. `len` takes seconds or `m:ss`. Every search takes `page` (1 to 200).
- **Old links:** `scope` (`all` or `played`) wins when given. Without it, a `tab=maps` link carrying `ar`, `od`, `cs`, `played`, `used`, `last` or `sort` reads as played in pools, anything else as all maps, so links from before the all-maps search still work. Write `scope=played` on every played-in-pools link.
- Map history: `https://pools.haruhime.moe/maps/<beatmap id>`, a difficulty id, not a set id. A map no pool has is a 404.

Every param, value and bound: [search-links.md](search-links.md).

## Check a pool

`/check` takes beatmap IDs or links, slot lines (`NM1 129891`) or a pack key, up to 64 maps. Each map's beatmapset is checked against the content rules for officially supported tournaments: not allowed, needs a closer look, couldn't check, or all clear. It's a guide, not a ruling. The rules: `osu-mappool-content-rules`.

## Open in packs

Every pool is published on packs.haruhime.moe as a plain pack owned by `haruhime pools`. **Open in packs** on a pool page opens it there (its `/p/<slug>` page while packs lists it, else `/k#` with its pack key), where maps download from the mirror straight to the browser. See `packs`.

## Sending a pool

`/submit`: no form. Tournament hosts and community members post in the haruhime.moe Discord server (https://discord.gg/bKy9kjMV4y) or email contact@haruhime.moe with the tournament, round, year, a forum or sheet link, the maps (a packs link is easiest) and who to credit. An admin checks each pool by hand; one whose maps match a pool already there joins its sources. Corrections go to the same places (`/data#corrections`).

## No public API

pools has no public API. The routes behind its pages serve the site only: don't script them or invent endpoints. Share results as search or map links; in code, read pools as packs through the packs API.

## Common mistakes

- Saying every pool comes from otdb.
- A beatmapset id in `/maps/<id>`.
- A played-in-pools link without `scope=played`: `?tab=maps&q=…` alone searches all osu! maps.
- Star ratings read as with mods, or `/check` read as a ruling.

## Sources

- pools.haruhime.moe README, https://github.com/haruhimemoe/pools.haruhime.moe#readme, checked 2026-09-26.
- Search, https://pools.haruhime.moe/search, and Check a pool, https://pools.haruhime.moe/check, checked 2026-09-26.
- Data, https://pools.haruhime.moe/data, and Submit a pool, https://pools.haruhime.moe/submit, checked 2026-09-26.
- Site map for assistants, https://pools.haruhime.moe/llms.txt, checked 2026-09-26.
