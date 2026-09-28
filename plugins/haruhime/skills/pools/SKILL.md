---
name: pools
description: Use when someone wants to build, edit or share an osu! tournament mappool on pools.haruhime.moe, search osu! maps for a pool under a mod (star rating, AR or OD with HR, DT or a combo), add co-editors or download a built pool on packs, looks for past tournament pools or where a map was played before, checks or sends a pool, or mentions pools.haruhime.moe or its links (`/new`, `/pools/<id>`, `/pools/<id>/edit`, `/search`, `/maps/<id>`)
---

# pools (pools.haruhime.moe)

Build an osu! tournament mappool: sign in with osu!, search maps under a mod, fill slots, check the content rules, see where maps were played before, share with co-editors and download on packs. In beta, osu!standard only; it never hosts beatmap files.

Past tournament pools are reference: some come from otdb's public export (by Sheppsu, with his permission), others from tournament hosts and community submissions; each pool page names its sources. Never say they all come from otdb.

## Pages

`/new` (make a pool), `/pools/<id>/edit` (the editor, for the owner and editors), `/pools/<id>` (a pool, built here with a `b-` id, or past), `/account` (your pools; delete your account), `/search`, `/maps/<beatmap id>` (every past pool that played a map), `/check` (the content rules check), `/submit` and `/data` (sending past pools; where they come from), `/llms.txt` (for AI assistants).

## Making a pool

Anyone with an osu! account signs in and makes a pool at `/new`. It starts private and empty; one person owns at most 50. In the editor:

- **Buckets:** NM, HD, HR, DT, FM, TB and up to 8 custom buckets (no mods, forced mods or freemod). At most 64 maps, no map twice.
- **Keyboard moves:** buttons move a map up, down or to another bucket, or remove it; no drag needed.
- **Paste** slot lines (`NM1 129891`), IDs or links to add maps or replace them.
- **Saving:** each change saves at once; if someone else changed the pool first, it reloads and says yours wasn't saved.
- **Summary:** each bucket's star range under its mods, beatmapsets in more than one slot, maps past pools played, and the content rules check.

## The map browser

It searches osu! maps under a **mod lens** (NM, HD, HR, DT, EZ, HT, FL, or a combo like HDHR the hinai mirror has data for). A bucket's **Find maps** opens it under that bucket's mods.

- **Filters:** text, one status (Ranked by default), star rating, BPM, length, AR and OD under the lens, hiding the pool's maps or maps played in past pools. **Sort:** most favourited, pp, stars, BPM or length.
- **Add** puts a difficulty at the end of the bucket matching the lens, or asks which.
- Qualified and Pending have no mod data: they're searched without mods.
- Ranked, Loved and Graveyard mod searches can include explicit maps; "Show explicit maps" only covers Qualified and Pending.
- Sets officially supported tournaments can't use are left out and counted.

## Mod values

Values with mods come from the hinai mirror and can differ slightly from osu!'s. Without mirror data, a slot says "no mod data". Pool slots, built and past, show values under the slot's mods (NM, FM, TB and freemod slots without). `/search` ratings are without mods.

## Sharing

- **Editors:** the owner adds up to 10 by osu! username, even before they sign in. Editors change maps and details, and can leave; the owner removes them, or hands the pool to one who has signed in (confirmed by typing its name).
- **Visibility** (owner only): private (default), unlisted (link only) or public (in search).
- **Packs:** an unlisted or public pool with maps gets a pack on packs.haruhime.moe, owned by `haruhime pools`, crediting the builders, kept in step. The pool page shows **Download on packs**; the editor, **Update pack now**. Going private, or deleting the pool or account, removes it.
- **Start from this pool** (`/new?from=<id>`), on any pool you can see, copies its maps into a new private pool.

## Search and past pools

Search covers past tournament pools (the default), public built pools or both; every osu! map through the [hinai mirror](../hinai-mirror/SKILL.md), with **Check first** and **Unranked** tags; and the maps played in past pools. Built pools never count as played. The check and Check first are guidance: the osu! Tournament Committee decides.

## Links

- Map browser: `/pools/<id>/edit?browse=<query>`, its query URL-encoded as one value: `?browse=lens%3DHR%26sr%3D5-6` opens it under HR at 5 to 6 stars.
- Pools: `/search?q=…`, plus `type=built` or `type=both`.
- All osu! maps: `/search?tab=maps`, plus `status`, `sr`, `len`, `bpm`, `explicit=show`, `q`.
- Played in pools: `/search?tab=maps&scope=played`, plus `ar`, `od`, `cs`, `played=HR,DT`, `used`, `last`, `sort`. Always write `scope=played`: `?tab=maps&q=…` alone searches all osu! maps.
- Ranges: `sr=6-7`, `bpm=180-`.
- `/maps/<beatmap id>` takes a difficulty id, not a set id.

Every param, the old-links rule and the browser's details: [search-links.md](search-links.md).

## Sending a past pool

`/submit`: hosts and community members send past pools, with the maps and who to credit, in the haruhime.moe Discord server (https://discord.gg/bKy9kjMV4y) or to contact@haruhime.moe. An admin checks each by hand. Past pools open on packs with **Open in packs**.

## No public API

pools has no public API. Its `/api` routes serve its own pages, and writes need a signed-in session: don't script them or invent endpoints. Share links instead; in code, read past pools and shared built pools as packs through the packs API (see `packs`).

## Common mistakes

- Calling pools a past-pool list, or saying only admins sign in.
- Saying every pool comes from otdb.
- Taking mirror mod ratings as osu!'s exact values, or `/search` ratings as with mods.
- Promising a mod search leaves out explicit maps.
- A set id in `/maps/<id>`, or a played-in-pools link without `scope=played`.

## Sources

- pools.haruhime.moe README, https://github.com/haruhimemoe/pools.haruhime.moe#readme, checked 2026-09-27.
- Pages: https://pools.haruhime.moe/new, `/search`, `/check`, `/data`, `/submit` and `/llms.txt`, checked 2026-09-27.
