---
name: hinai-mirror
description: Use when downloading osu! beatmapsets (.osz) or looking up beatmap metadata without osu! API credentials, especially from the browser, or when working with mirror.hinamizawa.ai (the hinai mirror), its errors, retries or rate limits
---

# hinai beatmap mirror (mirror.hinamizawa.ai)

A public osu! beatmap mirror: `.osz` downloads plus beatmap metadata in the osu! API v2 shape. **No auth**, and CORS is open (`Access-Control-Allow-Origin: *`), so browsers can call it directly. Its OpenAPI document is the contract: `https://mirror.hinamizawa.ai/api/v1/hinai/openapi.json` (185 paths; a CI test keeps it in sync with the live routes).

## The calls most tools need

| Need | Request | Notes |
| --- | --- | --- |
| Difficulty metadata | `GET /api/v2/beatmaps?ids=1,2,3` | **at most 100 ids** per call (csv, repeated keys or `ids[]`); more is a 400 `too_many_ids`. Always a bare array; unknown ids are just absent |
| Download a set, no video | `GET /api/v1/hinai/d/{setId}?noVideo=true` | streams the `.osz` with `content-length`. Also accepts `{setId}n` or `n=0` (other mirrors' dialects) |
| Download a set with video | `GET /api/v1/hinai/d/{setId}` | may be slower: the mirror's own disk keeps no-video archives |
| Can it be downloaded? | `GET /api/s/{setId}/availability` | `{ id, availability: { download_disabled, more_information }, video, cached }`. `download_disabled: true`: don't try. `null`: unknown, try |

- Ids: pools and `/beatmaps` use **difficulty** ids; downloads use **set** ids (`beatmapset_id`).
- Covers aren't in the metadata. Build them: `https://assets.ppy.sh/beatmaps/{setId}/covers/{card|list|cover}[@2x].jpg`.
- Metadata fields match osu!'s beatmap (`difficulty_rating`, `cs`, `ar`, `accuracy` = OD, `drain` = HP, `bpm`, `total_length`, `checksum`, and a `beatmapset` with title, artist, creator). Code that parses osu!'s `/api/v2/beatmaps` rows can parse these.
- When the mirror doesn't know an id, fall back to the osu! API from your server (`osu-api-v2`).

## Limits and errors

- **Downloads: 1000 requests a minute per IP.** JSON endpoints are unmetered.
- **404 is definitive** (cache it). **503 and 429 carry `Retry-After`**: honor it (cap it, say at 60 s), else back off 1 s, 2 s, 4 s. A 429 with `upstream_relay_shed` or `osu_api_relay_shed` means you are being slowed while the mirror protects osu!.
- Error bodies look like `{ "code": "too_many_ids", "error": "…", "hint": "…", "retryable": false }`. A download 404 has no `code` (`"beatmapset not found on any mirror"`).
- **Check the bytes:** a real `.osz` is a zip and starts with `PK\x03\x04`. Reject anything else.
- CORS exposes `retry-after`, `content-disposition`, `x-hinai-request-id` and `x-hinai-forensics`, so browsers can show progress and back off.
- Debugging: every response has `x-hinai-request-id`, and `x-hinai-forensics` is a ready-made lookup URL for that request. Include both when reporting a problem.

## Etiquette

- Identify your tool with a `User-Agent` from servers. Browsers can't set one; don't add custom headers there (they force a CORS preflight). `/api/v1/hinai/*` accepts any User-Agent.
- Limit parallel downloads (4 sets at a time works well) and cache finished files (browsers: OPFS or IndexedDB).
- Don't re-host `.osz` files. Rights holders use the mirror's takedown process: https://mirror.hinamizawa.ai/docs/content-takedowns

## Common mistakes

- Sending difficulty ids to the download endpoint.
- Treating 503/429 as "not found", or retrying without reading `Retry-After`.
- Assuming the mirror covers every map. Some sets are missing or download-disabled; show that, don't fail the whole batch.
- Trusting a 200 without checking for the zip signature.

## Sources

- hinai OpenAPI 2.1.23, https://mirror.hinamizawa.ai/api/v1/hinai/openapi.json, checked 2026-09-23.
- hinai docs, https://mirror.hinamizawa.ai/docs, checked 2026-09-23.
- packs.haruhime.moe's hinai integration notes (production use), checked 2026-09-23.
