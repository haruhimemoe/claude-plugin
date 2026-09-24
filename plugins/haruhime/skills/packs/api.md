<!-- Details for SKILL.md's "The API" section. https://packs.haruhime.moe/docs/api (and its Markdown twin, /docs/api.md) is the source of truth; recopy this when it changes. -->

# packs API reference

Base URL: `https://packs.haruhime.moe/api/v1`. Every request needs `Authorization: Bearer hpk_…` (a key is `hpk_` plus 43 letters, digits, `-` and `_`), except map usage, which needs none. No CORS headers are sent, by design.

## Rate limits

Per account unless noted, fixed one-minute (or one-hour) windows:

| Limit | Window | Notes |
| --- | --- | --- |
| 60 requests | 1 minute | every `/api/v1` call, all methods |
| 10 writes | 1 minute | `POST`/`PUT`/`DELETE`; counts toward the 60 too. Saving, editing or deleting a pack or its magnet links on the site itself counts against the same 10 |
| 20 failed key attempts | 1 minute | per IP address (an IPv6 /64 counts as one) |
| 10 new keys | 1 hour | per account, from `/me` |
| 60 map usage requests | 1 minute | per IP address; no key, and they don't count toward the account's 60 |

Every response carries `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` (seconds until the window resets); on a `401` these describe the failed-attempt limit instead. Map usage answers are the exception: a CDN can answer them from its cache, so they carry `Cache-Control` and no rate-limit headers (a `429` still carries all four). Over a limit: `429` with `Retry-After` in seconds. Wait that long before retrying.

## Errors

Always `{ "error": { "code": "...", "message": "..." } }`. `code` is stable; `message` is for people and may change.

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | `bad_request` | the body, `page` or a beatmap id isn't valid; the message says what to fix |
| 401 | `unauthorized` | no key sent |
| 401 | `invalid_api_key` | the key is wrong, revoked or replaced |
| 404 | `not_found` | the pack doesn't exist, or it's private/hidden and not yours (the API doesn't say which) |
| 409 | `conflict` | you already have 200 saved packs; delete one first |
| 413 | `too_large` | the request body is over 16 KB |
| 415 | `unsupported_media_type` | send the body as `Content-Type: application/json` |
| 429 | `rate_limited` | see Rate limits |
| 500 | `internal_error` | failed on their side; retry later |

A `401` also sends `WWW-Authenticate: Bearer`.

## Pagination

`?page=` starts at 1, up to 999999. Every paged response includes `page`, `pageCount` and `total`; a page past the end comes back with an empty `packs` array. To list public packs (slug, name, owner, map count) without a key or a rate limit, fetch `/packs/index.json` instead (a static search index, not part of `/api/v1`, up to 5,000 packs: community packs newest created first, then archive packs newest created first; `t` is when a pack was created, an archive pack's when it was imported). Entries carry stats in short form once known: `r` star rating range, `a` average stars, `l` length range in seconds, `b` BPM range, `m` mods and `g` rulesets (comma-separated), `k` for `complete`. Archive packs also carry `x` (always `1`), `xk` (the source: `otdb`, `otr` or `wybin`) and `xu` (the pool's page there). It has no `slots`, `packKey` or `exports`: for a pack's maps, call `GET /packs/{slug}`.

## The pack object

```json
{
  "slug": "V1StGXR8_Z",
  "name": "Spring Cup Finals",
  "visibility": "public",
  "description": "Grand finals pool.",
  "slots": [
    { "mod": "NM", "index": 1, "beatmapId": 129891 },
    { "mod": "HD", "index": 1, "beatmapId": 75 }
  ],
  "exports": [],
  "packKey": "pk1.…",
  "ownerName": "player1",
  "createdAt": "2026-09-22T12:00:00.000Z",
  "updatedAt": "2026-09-22T12:00:00.000Z"
}
```

- `slots` holds beatmap (difficulty) ids only, by slot. No titles, star ratings or other beatmap data: look those up via the osu! API or a mirror (see `hinai-mirror`).
- `buckets` appears only when the pack has custom slots or a non-default slot order.
- `packKey` is the pack's pack key; anyone can open it at `https://packs.haruhime.moe/k#` plus the key.
- `exports` lists the owner's recorded magnet links, newest first.
- `hiddenAt` appears only on your own packs, when a moderator hid one.
- `stats` sums up the pack's maps (star rating, length and BPM ranges, mods, rulesets, count, `complete`, `computedAt`). It's worked out a few seconds after a save, so it's missing from the answer to `POST` and to a `PUT` that changes the maps.
- `archive` appears only on archive packs (past tournament pools, hosted by `haruhime archive`). Read-only: `POST` and `PUT` ignore it.

### Archive packs

```json
"archive": {
  "tournament": "osu! World Cup 2023",
  "round": "Grand Finals",
  "year": 2023,
  "badged": null,
  "fingerprint": "5e0c…",
  "sources": [
    { "kind": "otdb", "id": "657", "url": "https://otdb.sheppsu.me/db/mappools/657/", "importedAt": "2026-09-24T12:00:00.000Z" }
  ]
}
```

- `tournament`, `round`, `year`: read from the pool's name at its source; `round` and `year` are `null` when the name has none.
- `badged`: whether the tournament was badged; `null` until a source says.
- `fingerprint`: the pool's identity, a sha256 of its sorted `beatmapId:mods` entries. The same pool from two sources is one pack with two sources.
- `sources`: where the pool came from, first import first: `kind`, the pool's `id` there, its `url`, `importedAt`.

## Map usage

Which archive packs used a map. Only public archive packs count; community packs don't.

```json
{
  "beatmapId": 129891,
  "count": 2,
  "entries": [
    { "slug": "V1StGXR8_Z", "tournament": "osu! World Cup 2023", "round": "Grand Finals", "year": 2023, "badged": null, "slot": "NM1", "mods": "NM", "fingerprint": "5e0c…" }
  ]
}
```

- `entries`: one per slot the map filled, most recent `year` first, then pools without a year. A pack's page is `https://packs.haruhime.moe/p/` plus its `slug`.
- `count`: how many pools used the map. A pool with the map in two slots has two entries and counts once.
- `tournament`, `round`, `year`, `badged`: as in the pack's `archive`.
- `slot`: the slot label in that pool (`NM1`, `HDHR2`, `TB1`), or just the number for a map without a slot.
- `mods`: what the slot plays with: a built-in slot's code (`NM`, `HD`, `HR`, `DT`, `FM`, `TB`), a custom slot's forced mods (`HDHR`), `FM` for free mod, `NM` for none and for a map without a slot.
- `fingerprint`: the pool's fingerprint, as in its pack's `archive`. To show a pool without counting it, leave out the entries whose `fingerprint` is that pool's own.

A map no archive pack used comes back with `count` 0 and no entries, never a 404. Answers can be up to an hour old.

## Endpoints

### `GET /me`

The key's owner: `{ "user": { "id", "osuId", "username" } }`.

### `GET /packs`

Public packs, most recently updated first, 50 a page. Query: `?page=`. Response: `{ "packs": [...], "page", "pageCount", "total" }`, each entry a full pack object.

### `GET /me/packs`

Your own packs, any visibility, most recently updated first, 50 a page. Same query and response shape as `GET /packs`.

### `GET /packs/{slug}`

One pack: `{ "pack": {...} }`. Public and unlisted packs open with any key; private and hidden ones only with their owner's.

### `POST /packs`

Save a new pack. Body: `name` (1-64 characters), `slots` (1-64 maps), optional `description` (up to 500 characters), optional `visibility` (`private`, `unlisted` or `public`; default `unlisted`), optional `buckets` (custom slots and their order, as in the pack object; see `osu-mappool-data`). Same rules as the site, including the language filter on `name` and `description`. `201` with `{ "pack": {...} }`.

```sh
curl https://packs.haruhime.moe/api/v1/packs \
  -H "Authorization: Bearer hpk_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"name":"Spring Cup Finals","visibility":"unlisted","slots":[{"mod":"NM","index":1,"beatmapId":129891}]}'
```

### `PUT /packs/{slug}`

Replace one of your own packs. Send the whole pack, as for `POST`; leaving out `description` clears it. Changing the maps, slots or name clears any recorded magnet links (they no longer match). `200` with `{ "pack": {...} }`, or `404` if it isn't yours.

### `DELETE /packs/{slug}`

Delete one of your own packs. `204`, no body, or `404` if it isn't yours.

### `GET /beatmaps/{id}/usage`

The archive pools one map was used in, in the Map usage shape. `id` is a beatmap (difficulty) id. No key.

### `GET /beatmaps/usage`

The same for up to 100 maps: `?ids=129891,75`. Each id is answered once, in the order sent: `{ "beatmaps": [...] }`. No key.

The full reference, including the OpenAPI 3.1 document, is at https://packs.haruhime.moe/docs/api and https://packs.haruhime.moe/api/v1/openapi.json.
