---
name: osu-api-v2
description: Use when writing code that calls the osu! API v2 (osu.ppy.sh/api/v2) or imports @haruhimemoe/osu, including its browser-safe /shapes types, links and cover image URLs in client components; setting up "sign in with osu!" OAuth or scopes; fetching beatmaps, beatmapsets or star ratings with mods; or deciding how often a tool may call osu!
---

# osu! API v2

The official osu! web API. OAuth 2 only; the old v1 API (per-user API keys) is legacy. The docs live at https://osu.ppy.sh/docs and are the source of truth for field shapes.

## Limits and terms

- **Stay at or under 60 requests a minute.** osu! enforces higher internal limits with some burst, but going past 60 can get your tokens revoked, and serious abuse gets API access restricted.
- The terms, in short: be a good citizen, keep usage modest, and check with the osu! team before building something big and long-lived on it. **Cache what you fetch.** Don't poll the same user or beatmap more than once a minute. Don't use the API as your database, harvest mass data (data.ppy.sh has dumps) or chase a competitive advantage.
- **Budget per OAuth app**, not per handler or instance: everything using one client shares one counter, with headroom (about 50/min) for retries and token calls.
- Send an honest `User-Agent` naming your app and a contact.

## Auth

Register an app at https://osu.ppy.sh/home/account/edit#oauth. An app can list **several callback URLs** (for example localhost and production); the redirect must match one exactly.

| Flow | Use | Token request |
| --- | --- | --- |
| Authorization code | Acting as a user ("sign in with osu!") | `GET https://osu.ppy.sh/oauth/authorize?client_id=…&redirect_uri=…&response_type=code&scope=identify+public&state=…`, then `POST https://osu.ppy.sh/oauth/token` with `grant_type=authorization_code` and `code` |
| Client credentials | Server-to-server reads (beatmaps, ratings) | `POST https://osu.ppy.sh/oauth/token`, form body `client_id`, `client_secret`, `grant_type=client_credentials`, `scope=public` |

- `identify` reads `/api/v2/me`; `public` reads public data. Sign-in needs `identify` (add `public` if you'll read other data with the user's token). Ask for no other scope you don't use.
- Cache the client-credentials token (`expires_in`, 86400 s in the docs' example); refresh it early, and once after a 401.
- osu! never shares a user's email. Key accounts on the osu! user id.

## Endpoints tools use most

| Need | Request | Notes |
| --- | --- | --- |
| Current user | `GET /api/v2/me` | user token, `identify` |
| Many difficulties | `GET /api/v2/beatmaps?ids[]=1&ids[]=2` | **up to 50 ids**. Each row's `beatmapset` carries `availability`, `track_id`, `tags` and `source` (the fields tournament checks read) |
| One set, all difficulties | `GET /api/v2/beatmapsets/{id}` | the fallback when a row's `beatmapset` lacks those fields |
| Star rating with mods | `POST /api/v2/beatmaps/{id}/attributes`, body `{"mods":["HD","HR"]}` | answer is `{ "attributes": { "star_rating": …, "max_combo": … } }`. `mods` may also be a bitmask. Omit `ruleset` to rate the map in its own mode |
| Lookup by checksum/filename | `GET /api/v2/beatmaps/lookup?checksum=…` | |

- **Two id spaces:** a beatmap (difficulty) id and a beatmapset id are different numbers. Pools list difficulties; downloads and content rules work per set.
- Missing ids are left out of `/beatmaps` answers, not errors. A deleted map on `/attributes` gives 404; mods osu! won't rate give 422.
- HD changes star rating in current osu! (lazer-era difficulty), so ask osu! instead of assuming only DT/HT/HR/EZ/FL matter.
- The `x-api-version` header selects newer response shapes on some endpoints; without it you get version 0.

## In code: `@haruhimemoe/osu`

`bun add @haruhimemoe/osu zod` (zod 4.0.16+, a peer). Two entry points:

- **`@haruhimemoe/osu/shapes`** is browser-safe: `BeatmapMeta`, osu!'s row schemas, `coverUrl`, `beatmapUrl`, `userUrl`, `OSU_OAUTH`, `OSU_SIGN_IN_SCOPES`, `toOsuUser`. Client components import from here.
- **`@haruhimemoe/osu`** adds `createOsuClient` for servers. It holds your client secret: **never import the root entry in browser code.**
- Before writing code with the client, read [client.md](client.md): what lands in `unchecked` vs `missing`, when a call throws instead, the shared rate budget (`beforeCall`), and `OsuApiError`'s codes.

## Common mistakes

- Calling osu! from the browser. The secret stays on your server; proxy and cache there.
- Fetching the same rating or beatmap on every page view. Cache (ratings change rarely; a 30-day cache is reasonable) and put a CDN in front.
- Assuming one callback URL per app, or one token per request.
- Treating a 429 or 5xx as "map doesn't exist". It means "try later".

## Related

- `osu-mappool-content-rules` uses the beatmapset fields above.
- `hinai-mirror` serves the same beatmap shape without auth and is the place to download `.osz` files; the API has no download endpoint for third-party apps.
- `haruhimemoe-packages` maps the other `@haruhimemoe/*` packages.

## Sources

- osu! API v2 documentation, https://osu.ppy.sh/docs (terms of use, scopes, beatmaps, attributes), checked 2026-09-23.
- osu! wiki, [osu!api](https://osu.ppy.sh/wiki/en/osu!api), checked 2026-09-23.
- Production use of these calls at packs.haruhime.moe, checked 2026-09-23.
- [@haruhimemoe/osu README](https://github.com/haruhimemoe/osu#readme) 0.1.0, checked 2026-09-23.
