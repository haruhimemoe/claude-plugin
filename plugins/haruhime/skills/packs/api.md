<!-- Details for SKILL.md's "The API" section. https://packs.haruhime.moe/docs/api (and its Markdown twin, /docs/api.md) is the source of truth; recopy this when it changes. -->

# packs API reference

Base URL: `https://packs.haruhime.moe/api/v1`. Every request needs `Authorization: Bearer hpk_…` (a key is `hpk_` plus 43 letters, digits, `-` and `_`). No CORS headers are sent, by design.

## Rate limits

Per account unless noted, fixed one-minute (or one-hour) windows:

| Limit | Window | Notes |
| --- | --- | --- |
| 60 requests | 1 minute | every `/api/v1` call, all methods |
| 10 writes | 1 minute | `POST`/`PUT`/`DELETE`; counts toward the 60 too. Saving, editing or deleting a pack or its magnet links on the site itself counts against the same 10 |
| 20 failed key attempts | 1 minute | per IP address (an IPv6 /64 counts as one) |
| 10 new keys | 1 hour | per account, from `/me` |

Every response carries `RateLimit-Limit`, `RateLimit-Remaining` and `RateLimit-Reset` (seconds until the window resets); on a `401` these describe the failed-attempt limit instead. Over a limit: `429` with `Retry-After` in seconds. Wait that long before retrying.

## Errors

Always `{ "error": { "code": "...", "message": "..." } }`. `code` is stable; `message` is for people and may change.

| Status | Code | Meaning |
| --- | --- | --- |
| 400 | `bad_request` | the body or `page` isn't valid; the message says what to fix |
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

`?page=` starts at 1, up to 999999. Every paged response includes `page`, `pageCount` and `total`; a page past the end comes back with an empty `packs` array. To read every public pack without a key or a rate limit, fetch `/packs/index.json` instead (a static search index, not part of `/api/v1`).

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

Save a new pack. Body: `name` (1-64 characters), `slots` (1-64 maps), optional `description` (up to 500 characters), optional `visibility` (`private`, `unlisted` or `public`; default `unlisted`). Same rules as the site, including the language filter on `name` and `description`. `201` with `{ "pack": {...} }`.

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

The full reference, including the OpenAPI 3.1 document, is at https://packs.haruhime.moe/docs/api and https://packs.haruhime.moe/api/v1/openapi.json.
