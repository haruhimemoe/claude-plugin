---
name: pools
description: Use when someone wants to build, edit or share an osu! tournament mappool on pools.haruhime.moe, plan slot targets or start from a template, add slot notes, undo, export a pool as IDs, !mp lines or CSV, search osu! maps for a pool under a mod (star rating, AR or OD with HR, DT or a combo), add co-editors or download a built pool on packs, look for past tournament pools or where a map was played before, check or send a pool, or mentions pools.haruhime.moe or its links (`/new`, `/pools/<id>`, `/pools/<id>/edit`, `/search`, `/maps/<id>`)
---

# pools (pools.haruhime.moe)

Build an osu! tournament mappool: sign in with osu!, search maps under a mod, fill slots, check the content rules, share with co-editors and download on packs. In beta, osu!standard only; it never hosts beatmap files.

Past tournament pools are reference: some from otdb's public export (by Sheppsu, with his permission), others from tournament hosts and community submissions. Each pool page names its sources.

## Pages

`/new`, `/pools/<id>/edit` (the editor), `/pools/<id>` (a pool, built here with a `b-` id, or past), `/account` (your pools; deleting your account), `/search`, `/maps/<beatmap id>` (every past pool that played a map), `/check`, `/submit`, `/data`, `/docs` (just `/docs/api`), `/legal`, `/brand`, `/llms.txt`.

## Making a pool

Anyone with an osu! account signs in and makes a pool at `/new`, blank or from a template (Qualifiers, Group stage, Knockout, Finals) that only sets each slot's map count. It starts private and empty; one person owns at most 50. In the editor (details: [editor.md](editor.md)):

- **Slots:** NM, HD, HR, DT, FM, TB and up to 8 custom slots (no mods, forced mods, freemod). At most 64 maps, no map twice.
- **Targets:** per slot, a map count (0 to 16) and an optional star range under its mods, shown as placeholder rows and out-of-range badges.
- **Moving:** drag a map by its handle, or the Up, Down and Move buttons (keyboard). **Paste** slot lines (`NM1 129891`), IDs or links.
- **Notes:** one line per map, up to 280 characters. Public pool pages show them.
- **Saving and undo:** each change saves at once (someone else's change first reloads the pool). Undo (Ctrl+Z / Cmd+Z) takes back up to 20 of your own changes this session; no redo.
- **Previews:** covers and preview clips from osu!'s servers.
- **Export,** on the pool page too: IDs with slot labels, `!mp map <id> 0` and `!mp mods` per slot (`None`, the forced mods, or `Freemod`), and a CSV.
- **Recent changes:** the last 20 and who made them, for the owner and editors only.
- **Summary:** star ranges under each slot's mods, targets not met, sets in two slots, maps played before, and the content rules check.

## The map browser

It searches osu! maps under a **mod lens** (NM, HD, HR, DT, EZ, HT, FL, or a combo like HDHR the hinai mirror has data for). A slot's **Find maps** opens it under that slot's mods and its target's star range.

- **Filters:** text, status (Ranked by default), star rating, BPM, length, AR and OD under the lens; hide the pool's maps or maps played before.
- **Add** puts a difficulty at the end of the matching slot, or asks which.
- Qualified and Pending have no mod data, so they're searched without mods. Mod searches can include explicit maps.

## Mod values

Values with mods come from the hinai mirror and can differ slightly from osu!'s; without its data, a slot says "no mod data". Pool slots show values under the slot's mods (NM, FM, TB and freemod slots without). `/search` ratings are without mods.

## Sharing

- **Editors:** the owner adds up to 10 by osu! username, even before they sign in. Editors edit and can leave; the owner removes them, or hands the pool to one signed in (typing its name).
- **Visibility** (owner only): private, unlisted (link only) or public (in search).
- **Packs:** an unlisted or public pool with maps gets a pack on packs.haruhime.moe, owned by `haruhime pools`, crediting the builders, kept in step. Going private, or deleting the pool or account, removes it.
- **Start from this pool** (`/new?from=<id>`) copies any pool you can see into a new private one.

## Search and past pools

Search covers past tournament pools (the default), public built pools or both; every osu! map via the [hinai mirror](../hinai-mirror/SKILL.md) (**Check first**, **Unranked** tags); and maps played in past pools. The check is guidance: the osu! Tournament Committee decides.

## Links

- Map browser: `/pools/<id>/edit?browse=<query>`, its query URL-encoded as one value: `?browse=lens%3DHR%26sr%3D5-6` opens it under HR at 5 to 6 stars.
- Pools: `/search?q=…`, plus `type=built` or `type=both`.
- All osu! maps: `/search?tab=maps`, plus `status`, `sr`, `len`, `bpm`, `explicit=show`, `q`.
- Played in pools: `/search?tab=maps&scope=played`, plus `ar`, `od`, `cs`, `played=HR,DT`, `used`, `last`, `sort`. Without `scope=played`, `tab=maps` searches all osu! maps.
- Ranges: `sr=6-7`, `bpm=180-`.
- `/maps/<beatmap id>` takes a difficulty id, not a set id.

Every param and the browser's details: [search-links.md](search-links.md).

## Sending a past pool

`/submit`: hosts and community members send past pools, with maps and credits, in the haruhime.moe Discord (https://discord.gg/bKy9kjMV4y) or to contact@haruhime.moe. An admin checks each by hand.

## The API

pools' public API: `GET /api/v1/me`, an `hpl_` key's owner (OpenAPI `/api/v1/openapi.json`, docs `/docs/api`, key panel `/account`). Follows `haruhime-app-standards` for the key, guard and limits. Everything else under `/api` needs a signed-in session: don't script it. Read or write pools by script through the packs API instead (`packs`).

## Common mistakes

- Calling pools a past-pool list, saying only admins sign in, or that every pool comes from otdb.
- Putting private remarks in slot notes: public pages show them.
- Taking mirror mod ratings as osu!'s exact values, or `/search` ratings as with mods.
- A set id in `/maps/<id>`, or a played-in-pools link without `scope=played`.

## Sources

- pools.haruhime.moe [README](https://github.com/haruhimemoe/pools.haruhime.moe#readme) and CHANGELOG (`79607c7`), checked 2026-10-04.
- Pages: https://pools.haruhime.moe/new, `/search`, `/check`, `/data`, `/submit`, `/docs`, `/brand` and `/llms.txt`, checked 2026-10-04.
