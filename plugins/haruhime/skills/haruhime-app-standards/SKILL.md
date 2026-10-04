---
name: haruhime-app-standards
description: Use when building or reviewing a haruhime.moe app (packs, pools, bb, haruhime.moe or a new one) and touching its public API, API keys, rate limits, error responses, robots.txt, sitemap, llms.txt, llms-full.txt or security.txt, or when adding a new app to the family
---

# haruhime app standards

Every haruhime app keeps its own users, keys and database, but they all behave the same way: the same key format, the same limits, the same crawl files. The shared code lives in `@haruhimemoe/next-kit`'s `/api-keys` subpath and its `next-kit check` bin (see `haruhime-next-kit`); this skill is the rulebook that ties them together.

## API keys

- Format: an app prefix (`h` + two lowercase letters + `_`) plus 32 random bytes in base64url (43 characters). Only the SHA-256 hash and the first 12 characters (shown on account pages) are stored, in `api_keys`.
- Registry: `hpk_` packs, `hpl_` pools, `hbb_` bb. A new app picks a free pair of letters and adds a line here.
- One key per user. `createApiKeyStore({ prefix, db })` (`@haruhimemoe/next-kit/api-keys`) returns `issue`, `info`, `revoke`, `authenticate(key)` (the owner's `{ userId, stamp }`, or null for a bad, revoked or replaced key), `deleteFor(userId)` and `ensureIndexes()`.
- **Gotcha:** spread `apiKeyIndexSpecs()` into the app's own index list, built once from `onConnect`. Never call the store's own `ensureIndexes()` from `onConnect`: the database isn't finished connecting at that point, and the store's `ensureIndexes` calls back into `db()` to get it, so it deadlocks.
- Call `deleteFor(userId)` on account deletion, so a deleted user's key doesn't outlive them.

## The /api/v1 guard

`createApiKeyGuard({ store, limiter, resolveCaller, messages, limits?, now? })` (same subpath) returns `withApiKey`; wrap every `/api/v1` handler with it: `export const GET = withApiKey(async (request, caller) => ...)`. Never write a second guard by hand.

- `resolveCaller(userId)` looks the key's owner up and returns null for a deleted or system account (a 401). `stamp()` (recording `lastUsedAt`, at most once an hour) runs only once `resolveCaller` has returned a real caller, so a delete racing a request never stamps a key that no longer has an owner.
- **Gotcha:** build the app's limiter with `now: () => Date.now()`, read per call, not a value captured at import. Otherwise a test's fake timers never reach it.

| scope | limit | window | subject |
|---|---|---|---|
| api | 60 | 60 s | user |
| api-write | 10 | 60 s | user |
| auth-fail | 20 | 60 s | IP |
| key-create | 10 | 3600 s | user |

These are `API_LIMITS` from the same subpath. Tighten only, never loosen. Every answer carries `RateLimit-Limit/Remaining/Reset` and `Cache-Control: no-store`; a 429 adds `Retry-After`. No CORS headers: the API is for servers and bots, not browsers. Errors are `{ "error": { "code", "message" } }`; a missing key's code is `unauthorized`, a bad, revoked or replaced one's is `invalid_api_key`.

## Routes every app with an API serves

- `GET /api/v1/me` (falls under the `/api/` disallow in robots, like the rest of the API), `GET /api/v1/openapi.json` (the one `/api/` path robots allows back in)
- `GET|POST|DELETE /api/me/api-key` (session only, same-site via `refuseCrossSite`, the `key-create` limit on `POST`)
- `/docs/api` (a dynamic `docs/[slug]/page.tsx` counts too)
- a key panel on the account page (packs' is `ApiKeyCard`)

## Crawl files every app serves

`robots.ts` (disallow `/api/` except the OpenAPI document, plus `/admin`, `/signin` and the app's account page: packs' is `/me`, pools' and bb's is `/account` (bb also disallows `/me`, its separate "my templates" page); `aiBots: "allow"`), `sitemap.ts` (real content dates only, never a build timestamp), `llms.txt` and `llms-full.txt` as route handlers, `.well-known/security.txt/route.ts` (`buildSecurityTxt`, with the policy at the repo's `SECURITY.md`; pass `contactUrl` for a GitHub private vulnerability report link, listed before the email).

## Check

`next-kit check [dir]` (the bin is `next-kit`, so `bunx next-kit check`) walks `src/app`, always checks the crawl files above, and checks the API routes once the app has `src/app/api/v1/`. It prints one `pass`/`FAIL` line per standard, names the missing files, and exits 1 on a failure (or when `src/app` is missing). Route groups like `(public)/` don't change the URL, so the check drops them before matching. Add it to CI:

```yaml
- run: bunx next-kit check
```

## New app checklist

1. Pick a free prefix (two lowercase letters) and add it to the registry above.
2. Wire next-kit's `seo`, `server` and `api-keys`: `SEO_SITE`, a limiter built with `now: () => Date.now()`, `createApiKeyStore`, `createApiKeyGuard`.
3. Ship the crawl files, `/api/v1/me`, `openapi.json`, `/docs/api` and the account page's key panel.
4. Add `"standards": "next-kit check"` to `package.json` and run it in CI.

## Coming in phase 2

Shared guides/docs pages, llms files built from the docs, a brand page per app.

## Related

- `haruhime-next-kit` for the rest of the kit (`seo`, `server`, `mongo`, `auth`) this skill's `api-keys` and `check` pieces live beside.
- `packs` and `pools` for each app's own API endpoints past `/api/v1/me`.

## Sources

- [@haruhimemoe/next-kit README](https://github.com/haruhimemoe/next-kit#readme) ("Standards check", the `api-keys` subpath table) and [CHANGELOG](https://github.com/haruhimemoe/next-kit/blob/main/CHANGELOG.md), Unreleased, checked 2026-10-03.
- packs.haruhime.moe, pools.haruhime.moe and bb.haruhime.moe source (`src/lib/api-keys.ts`, `src/lib/api-auth.ts`, `src/lib/rate-limit.ts`, `src/app/api/v1/`, `src/app/.well-known/security.txt/route.ts`), checked 2026-10-03.
