---
name: haruhime-next-kit
description: Use when building the server side of a haruhime.moe-style Next.js app with @haruhimemoe/next-kit (JSON route handlers, body size caps, cross-site guards, rate limits or osu! call budgets in MongoDB, bearer-auth cron or service routes, zod env parsing, one MongoDB client with safe index builds, "sign in with osu!" through better-auth, the signed-in marker, useAccount and the sign-in, account menu and delete-account components in the browser, its docs/guides/legal content registry and mdxToMarkdown, or Vitest with an in-memory MongoDB), or when moving packs or pools code onto it
---

# @haruhimemoe/next-kit

The Next.js server plumbing packs, pools and bb.haruhime.moe share, for app router apps on MongoDB. Names, paths, limits and messages come from your app. The [README](https://github.com/haruhimemoe/next-kit#readme) has every export: read it instead of guessing a signature. This covers 0.11.0.

**There's no root entry.** Import a subpath:

| Subpath | Job | Optional peers it needs |
| --- | --- | --- |
| `/server` | Route helpers: JSON errors, body parsing, cross-site guard, client IP, rate limits/budgets, bearer auth, `safeNextPath`, security.txt | `mongodb` types |
| `/env` | zod env parsing, the osu! app's five variables | none |
| `/mongo` | One MongoClient per process, Mongoose on it, safe index builds | `mongodb` ^7.6, `mongoose` ^9.10.2 |
| `/auth` | better-auth, osu! the only sign-in | `better-auth` ^1.7.5, `mongodb`, `@haruhimemoe/osu` 0.2, 0.3 or 0.4 (0.4 from 0.2.1) |
| `/auth-react` | The browser half: signed-in marker, account store, `useAccount`, `RestoreSignedIn`, and (0.2.0) the account components | `react` ^19.3, `next` ^16.3.6, `@haruhimemoe/ui` ^0.5.0 (0.2.0) |
| `/seo` | SEO builders (0.3.0) | none |
| `/testing` | Vitest helpers | `vitest` ^5, `msw` ^2.15, `mongodb-memory-server` ^11.3 |
| `/api-keys` | Shared API key format, store and `/api/v1` guard (0.5.0) | `mongodb` ^7.6.0 |
| `/docs` | Content registry, markdown, llms/sitemap builders (0.6.0) | none |
| `/docs/files` | Reads an entry's markdown; registry/file drift (0.6.0) | `node:fs` |

```sh
bun add @haruhimemoe/next-kit zod   # zod 4.6.5 or later in 4.x is the one required peer
```

Only `/auth-react` runs in the browser; the rest need Node 22.12+ (`/server` loads `node:crypto`).

## Wiring an app

One file per piece, binding the kit to your names:

1. **`src/env.ts`:** `createServerEnv({ schema: osuAppEnvSchema, placeholders: OSU_APP_PLACEHOLDERS, secretKeys: OSU_APP_SECRET_KEYS })`, exporting its `get`: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `OSU_CLIENT_ID`, `OSU_CLIENT_SECRET`. Parses on first use, never at import; `SKIP_ENV_VALIDATION` lets CI build on placeholders. Errors name variables, never values.
2. **`src/lib/db.ts`:** `createMongo({ dbName, globalKey, uri, onConnect })`, `onConnect` running `ensureIndexes(db, [...AUTH_INDEX_SPECS, counterTtlIndex()])`. A failed connect retries next call.
3. **`src/lib/rate-limit.ts`:** `createRateLimiter({ db: connectedDb })`.
4. **`src/lib/auth.ts` (server):** `createOsuAuth({ clientId, clientSecret, baseURL, secret, db, client, markerCookie })`, built once.
5. **`src/lib/account.ts` (`"use client"`):** `createSignedInMarker(name)` and `createAccount(authClient, marker)`, same cookie name as the server.

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

- Errors are `{ error: { code, message } }`, code from `ERROR_CODES` by status; `parseJsonBody` answers 415, 413 (past 16 KB or your `maxBytes`) or 400.
- Rate limits are fixed windows in MongoDB. Counting fails open; a 429 is no-store with `RateLimit-*` headers. Key by IP (`rateLimitSubject`) or by user (`userSubject(osuId)`).
- **osu! API budget:** `createBudget({ db, global, perSubject })`, pass a fresh `budget.gate()` per request as `@haruhimemoe/osu`'s `beforeCall`: one shared counter, sticky once refused (`osu-api-v2`).
- **Cron/service routes:** `await refuseWithoutBearer(request, { secret, label, notConfigured })`: async, constant-time, 503 `not_configured` when unset.
- After sign-in, redirect only through `safeNextPath` (keeps `next` on-site).
- **API keys (0.5.0):** `/api-keys`'s `createApiKeyStore`/`createApiKeyGuard` → `withApiKey(handler)` for `/api/v1`. Spread `apiKeyIndexSpecs()` into your index list; never call its own `ensureIndexes()` from `onConnect` (deadlocks). Prefixes, limits and the check bin: `haruhime-app-standards`.

## Sign in with osu!

`createOsuAuth` is better-auth on MongoDB, osu! the only way in (`identify` and `public`, PKCE). Tokens are never stored, `/update-user` is off, API errors land on `/signin?error=<code>`. `before*` hooks refuse a write by returning false; `afterUserCreate` never fails sign-in. `getOsuUser(auth, headers)` gives `{ id, osuId, username, avatarUrl }` or null.

In the browser, the marker cookie holds no secret: it only says whether to ask for a session, so a signed-out page makes no session request. Read the account with `useAccount()`, render `RestoreSignedIn` where a session might exist without the marker, and pass `osuSignIn(next)` to `authClient.signIn.social`.

**Account components (0.2.0):** `createAuthComponents(authClient, kit)` binds `SignInWithOsu`, `SignOutButton`, `AccountMenu` (ui's `HeaderMenu`) and `DeleteAccountForm` (from 0.8.0 a "Delete my account" button opening ui's `ConfirmDialog`, username typed there, then `DELETE /api/account`; needs ui 0.14.0). `osuAvatarSrc(url)` allows only `OSU_AVATAR_HOSTS` (a.ppy.sh, osu.ppy.sh).

## SEO (0.3.0)

`/seo`: metadata, robots, sitemap, JSON-LD and llms.txt from one `Site` record, never by hand. See [seo.md](seo.md).

## Docs, guides and legal (0.6.0)

`/docs`: the content registry (`defineContent`), path helpers, `mdxToMarkdown` and the llms/sitemap builders, built from one registry, no runtime imports. `/docs/files`: `readContentMarkdown` and `contentFileDrift`, loading `node:fs`. URLs and the cookie cutter: `haruhime-app-standards`. Every export: [docs.md](docs.md). `/legal` (0.9.0): `LegalSite`, seven MDX blocks, `legalEntries`, `legalMarkdownTransform` (0.11.0).

## Tests

`startMemoryMongo` as Vitest's globalSetup (one in-memory MongoDB per run), `setupTestDb` to empty collections, `setupMsw(...handlers)` (unhandled requests error) and `stubOsuAppEnv()`. Mock the hinai mirror with `@haruhimemoe/mirror/testing`.

## Common mistakes

- `import … from "@haruhimemoe/next-kit"`: there's no root. Use a subpath.
- Importing `/server`, `/env`, `/mongo` or `/auth` into a client component, or reading secrets from `process.env` instead of the parsed env.
- Different marker cookie names on the two sides, or a new auth instance per request.
- Calling `refuseWithoutBearer` without `await`: a promise is truthy, so `if (denied) return denied` fires for the right secret too.
- Hand-rolled error shapes, counters, redirects, sign-in buttons or account menus the kit already has.

## Related

- `osu-api-v2` (budget, scopes), `haruhime-ui` (pages), `haruhimemoe-packages` (the rest), `haruhime-app-standards` (`/api-keys`).

## Sources

- [@haruhimemoe/next-kit README](https://github.com/haruhimemoe/next-kit#readme) and [CHANGELOG](https://github.com/haruhimemoe/next-kit/blob/main/CHANGELOG.md), 0.6.1, checked 2026-10-04.
