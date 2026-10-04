---
name: haruhime-next-kit
description: Use when building the server side of a haruhime.moe-style Next.js app with @haruhimemoe/next-kit (JSON route handlers, body size caps, cross-site guards, rate limits or osu! call budgets in MongoDB, bearer-auth cron or service routes, zod env parsing, one MongoDB client with safe index builds, "sign in with osu!" through better-auth, the signed-in marker, useAccount and the sign-in, account menu and delete-account components in the browser, or Vitest with an in-memory MongoDB), or when moving packs or pools code onto it
---

# @haruhimemoe/next-kit

The Next.js server plumbing packs.haruhime.moe, pools.haruhime.moe and bb.haruhime.moe share, for app router apps on MongoDB. Names, paths, limits and messages come from your app. The [README](https://github.com/haruhimemoe/next-kit#readme) has every export: read it instead of guessing a signature. This covers 0.4.0, plus `api-keys` (unreleased).

**There's no root entry.** Import a subpath:

| Subpath | Job | Optional peers it needs |
| --- | --- | --- |
| `/server` | Route helpers: JSON errors, body parsing, cross-site guard, client IP, rate limits and budgets, bearer auth, `safeNextPath`, security.txt | `mongodb` types |
| `/env` | zod env parsing, the osu! app's five variables | none |
| `/mongo` | One MongoClient per process, Mongoose on it, safe index builds | `mongodb` ^7.6, `mongoose` ^9.10.2 |
| `/auth` | better-auth with osu! as the only sign-in | `better-auth` ^1.7.5, `mongodb`, `@haruhimemoe/osu` 0.2, 0.3 or 0.4 (0.4 from 0.2.1) |
| `/auth-react` | The browser half: signed-in marker, account store, `useAccount`, `RestoreSignedIn`, and (0.2.0) the account components | `react` ^19.3, `next` ^16.3.6, `@haruhimemoe/ui` ^0.5.0 (0.2.0) |
| `/seo` | SEO builders (0.3.0) | none |
| `/testing` | Vitest helpers | `vitest` ^5, `msw` ^2.15, `mongodb-memory-server` ^11.3 |
| `/api-keys` | Shared API key format, store and `/api/v1` guard (unreleased) | `mongodb` ^7.6.0 |

```sh
bun add @haruhimemoe/next-kit zod   # zod 4.6.5 or later in 4.x is the one required peer
```

Only `/auth-react` runs in the browser; the rest run on Node 22.12+ (`/server` loads `node:crypto`).

## Wiring an app

One file per piece, binding the kit to your names:

1. **`src/env.ts`:** `createServerEnv({ schema: osuAppEnvSchema, placeholders: OSU_APP_PLACEHOLDERS, secretKeys: OSU_APP_SECRET_KEYS })`, exporting its `get`. That's `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `OSU_CLIENT_ID` and `OSU_CLIENT_SECRET`. It parses on first use, never at import. `SKIP_ENV_VALIDATION` lets a CI build run on placeholders (a production server throws instead). Errors name variables, never values. Read admin lists with `readIdSet("ADMIN_OSU_IDS")` on every call.
2. **`src/lib/db.ts`:** `createMongo({ dbName, globalKey, uri, onConnect })`, with `onConnect` running `ensureIndexes(db, [...AUTH_INDEX_SPECS, counterTtlIndex()])`. A failed connect retries next call; `ensureIndexes` never throws (skips and logs a duplicate-breaking index).
3. **`src/lib/rate-limit.ts`:** `createRateLimiter({ db: connectedDb })`.
4. **`src/lib/auth.ts` (server):** `createOsuAuth({ clientId, clientSecret, baseURL, secret, db, client, markerCookie })`, built once (memoize the getter).
5. **`src/lib/account.ts` (`"use client"`):** `createSignedInMarker(name)` and `createAccount(authClient, marker)` with your better-auth client. Use the same cookie name as the server.

## A route handler

Each guard returns a `Response` to send, or null:

```ts
const foreign = refuseCrossSite(request, { siteUrl, siteTitle });
if (foreign) return foreign;
const limited = await limiter.refuseOverLimit(RATE_LIMITS.save, rateLimitSubject(clientIp(request.headers)));
if (limited) return limited;
const body = await parseJsonBody(request, saveBodySchema); // z.strictObject refuses unknown keys
if (!body.ok) return body.response;
return jsonError(404, "Pack not found.");
```

- Errors are `{ error: { code, message } }`; the code comes from `ERROR_CODES` by status. `parseJsonBody` answers 415, 413 (past 16 KB, or your `maxBytes`) or 400.
- Rate limits are fixed windows in MongoDB. Counting fails open (and logs); a 429 is no-store with `RateLimit-*` headers. Key by IP (`rateLimitSubject`, IPv6 by its /64) or by user (`userSubject(osuId)`).
- **osu! API budget:** `createBudget({ db, global, perSubject })`, and pass a fresh `budget.gate()` per request as `@haruhimemoe/osu`'s `beforeCall`: one shared counter, sticky once it says no (see `osu-api-v2`).
- **Cron and service routes:** `await refuseWithoutBearer(request, { secret, label, notConfigured })`: async, constant-time, 503 `not_configured` when unset.
- After sign-in, redirect only through `safeNextPath`, keeping `next` on your site.
- **API keys (unreleased):** `/api-keys`'s `createApiKeyStore`/`createApiKeyGuard` → `withApiKey(handler)` for `/api/v1`. Spread `apiKeyIndexSpecs()` into your index list; never call its own `ensureIndexes()` from `onConnect` (deadlocks). Prefixes, limits and the check bin: `haruhime-app-standards`.

## Sign in with osu!

`createOsuAuth` is better-auth on MongoDB with osu! as the only way in (`identify` and `public`, PKCE). osu!'s tokens are never stored, `/update-user` is off, and API errors land on `/signin?error=<code>`. `before*` hooks refuse a write by returning false; `afterUserCreate` never fails a sign-in. `getOsuUser(auth, headers)` gives `{ id, osuId, username, avatarUrl }` or null.

In the browser, the marker cookie holds no secret: it only says whether to ask for a session, so a signed-out page makes no session request. Read the account with `useAccount()`, render `RestoreSignedIn` where a session might exist without the marker, and pass `osuSignIn(next)` to `authClient.signIn.social`.

**Account components (0.2.0),** styled with `@haruhimemoe/ui`: `createAuthComponents(authClient, kit)` in a `"use client"` module binds `SignInWithOsu`, `SignOutButton`, `AccountMenu` (ui's `HeaderMenu`) and `DeleteAccountForm` (type the username, then `DELETE /api/account`). `osuAvatarSrc(url)` keeps an avatar only on `OSU_AVATAR_HOSTS` (a.ppy.sh, osu.ppy.sh).

## SEO (0.3.0)

`/seo`: metadata, robots, sitemap, JSON-LD and llms.txt from one `Site` record, never by hand. See [seo.md](seo.md).

## Tests

`startMemoryMongo` as Vitest's globalSetup (one in-memory MongoDB per run), `setupTestDb` to empty collections before each test, `setupMsw(...handlers)` (an unhandled request errors) and `stubOsuAppEnv()`. Mock the hinai mirror with `@haruhimemoe/hinai/testing`'s handlers.

## Common mistakes

- `import … from "@haruhimemoe/next-kit"`: there's no root. Use a subpath.
- Importing `/server`, `/env`, `/mongo` or `/auth` into a client component.
- Reading secrets from `process.env` instead of the parsed env.
- Different marker cookie names on the two sides, or a new auth instance per request.
- Calling `refuseWithoutBearer` without `await`: a promise is truthy, so `if (denied) return denied` fires even for the right secret.
- Hand-rolled error shapes, counters, redirects, sign-in buttons or account menus the kit already has.

## Related

- `osu-api-v2` (budget, scopes), `haruhime-ui` (pages), `haruhimemoe-packages` (the rest), `haruhime-app-standards` (`/api-keys`'s rules).

## Sources

- [@haruhimemoe/next-kit README](https://github.com/haruhimemoe/next-kit#readme) and [CHANGELOG](https://github.com/haruhimemoe/next-kit/blob/main/CHANGELOG.md), 0.4.0 plus Unreleased, checked 2026-10-03.
