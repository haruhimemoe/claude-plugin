---
name: haruhime-app-standards
description: Use when building or reviewing a haruhime.moe app (packs, pools, bb, haruhime.moe or a new one) and touching its public API, API keys, rate limits, error responses, robots.txt, sitemap, llms.txt, llms-full.txt, security.txt, its /docs, /guides, /legal or /brand pages, or when adding a new app to the family
---

# haruhime app standards

Every haruhime app keeps its own users, keys and database, but behaves the same way: same key format, same limits, same crawl files. The shared code lives in `@haruhimemoe/next-kit`'s `/api-keys` and `/docs` subpaths and its `next-kit check` bin (see `haruhime-next-kit`); this skill is the rulebook that ties them together.

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

- `GET /api/v1/me` (falls under `/api/`'s disallow in robots, like the rest of the API), `GET /api/v1/openapi.json` (the one `/api/` path robots allows back in)
- `GET|POST|DELETE /api/me/api-key` (session-only, same-site via `refuseCrossSite`, the `key-create` limit on `POST`)
- `/docs/api` (`content/docs/api.mdx`, below)
- a key panel on the account page (packs' is `ApiKeyCard`)

## Crawl files every app serves

`robots.ts` (disallow `/api/` except the OpenAPI document, plus `/admin`, `/signin` and the app's account page: packs' is `/me`, pools' and bb's is `/account` (bb also disallows `/me`, its separate "my templates" page); `aiBots: "allow"`), `sitemap.ts` (real content dates only, never a build timestamp), `llms.txt` and `llms-full.txt` as route handlers, `.well-known/security.txt/route.ts` (`buildSecurityTxt`, policy at the repo's `SECURITY.md`; pass `contactUrl` for a GitHub private vulnerability report link, listed before the email).

## Content pages, llms and brand

`/docs`, `/guides`, `/legal` and `/brand` come from one content registry (`@haruhimemoe/next-kit/docs`) and ui's content/`BrandPage` components. Sections are opt-in: `/legal` and `/brand` always; `/docs` once there's an API or `content/docs/*.mdx`; `/guides` once there's `content/guides/*.mdx`. Each section is `/<section>`, `/<section>/<slug>` and a `.md` mirror; an empty section ships no routes. No redirects: packs' `/guide/*` is now `/guides/*`, bb's `/docs/guides/*` is `/guides/*`. `/brand` is `<BrandPage {...brandPageData("packs")} />`, contact `haruhime@haruhime.moe`. URL table, cookie cutter files, five legal pages, command palette, per-app notes: [content-pages.md](content-pages.md).

## Check

`next-kit check [dir]` (the bin is `next-kit`, so `bunx next-kit check`) walks `src/app` and `content/`, always checks the crawl files above plus `brand` and `legal` (the five legal pages, 0.10.0), checks `docs`/`guides` once required (above), and the API routes once `src/app/api/v1/` exists. It prints one `pass`/`FAIL` line per standard, names the missing files, and exits 1 on a failure (or when `src/app` is missing). Route groups like `(public)/` don't change the URL, so the check drops them first. `contentFileDrift(content, { root })` (`@haruhimemoe/next-kit/docs/files`) runs the same drift check from a test. Each app pins next-kit and names it as a `standards` script, run in CI right after Biome:

```json
"standards": "next-kit check"
```

```yaml
- name: Standards
  run: bun run standards
```

## New app checklist

1. Pick a free prefix (two lowercase letters) and add it to the registry above.
2. Wire next-kit's `seo`, `server` and `api-keys`: `SEO_SITE`, a limiter built with `now: () => Date.now()`, `createApiKeyStore`, `createApiKeyGuard`.
3. Ship the crawl files, `/api/v1/me`, `openapi.json`, `/legal`, `/brand` and the account page's key panel.
4. Add `"standards": "next-kit check"` to `package.json` and run it in CI.

## Related

- `haruhime-next-kit` for the rest of the kit (`seo`, `server`, `mongo`, `auth`) this skill's `api-keys`/`check` pieces live beside.
- `packs` and `pools` for each app's own API endpoints past `/api/v1/me`.
- `haruhime-repo-standards` for changelogs and version bumps.

## Sources

- [@haruhimemoe/next-kit README](https://github.com/haruhimemoe/next-kit#readme) and [CHANGELOG](https://github.com/haruhimemoe/next-kit/blob/main/CHANGELOG.md), 0.6.1, checked 2026-10-04.
- packs.haruhime.moe (30c9530), pools.haruhime.moe (79607c7) and bb.haruhime.moe (8c7e9a6) source, checked 2026-10-04.
