<!-- Details for SKILL.md's "In code: @haruhimemoe/osu". The osu repo's README is the source of truth: https://github.com/haruhimemoe/osu#readme -->

# @haruhimemoe/osu client: results, budget and errors

- `getBeatmaps(ids, { beforeCall })` returns `{ found, missing, unchecked }`, `getBeatmapsets(ids, { beforeCall, fallbackLimit })` returns `{ sets, unchecked }`, and `getStarRating(id, mods, { beforeCall })` a number, or null for 404/422.
- **Shared budget:** `beforeCall` runs before each osu! API call; return false to skip it. Back it with one per-app counter (see SKILL.md, "Limits and terms"), stored atomically where every instance sees it (MongoDB, Redis). With no `beforeCall` there is no limit, and token requests and the one 401 retry aren't counted.
- **`unchecked` is not `missing`.** `unchecked` holds ids in batches `beforeCall` refused and rows that failed the schema; in `getBeatmapsets` also sets whose `/beatmapsets/{id}` fallback failed (anything but 404) or was skipped once `fallbackLimit` (10) ran out. Retry them later. `missing` means osu! returned no row for the id (or it wasn't a positive integer, so it was never sent).
- **A failing `/beatmaps` call throws.** A 429, 5xx, timeout, network error or bad body on the main call (or the token request) rejects the whole call with `OsuApiError`, dropping batches already fetched. Catch it and retry after `retryAfterMs`.
- `OsuApiError` has `code` (`timeout`, `network`, `bad_response`, `http_error`, `budget`), `status` (null without a response), `retryAfterMs` (from `Retry-After` on 429/503, capped at 60 s) and `cause`. A refused `getStarRating` rejects with code `budget`. Bad ids, `fallbackLimit`, `timeoutMs` or `baseUrl` throw `RangeError`; empty credentials or `userAgent` throw `TypeError`.
- `baseUrl` receives your client secret (token requests go there too). Point it only at osu! or a local test server; it refuses plain http except localhost.
- The [README](https://github.com/haruhimemoe/osu#readme) has the full API and a MongoDB budget example.
