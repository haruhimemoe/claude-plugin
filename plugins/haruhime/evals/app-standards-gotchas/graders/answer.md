---
type: llm
---

PASS if the reply says all three: the prefix is a free two-lowercase-letter pair after "h" (the registry already has `hpk_` packs, `hpl_` pools, `hbb_` bb, so the new app picks a different unused pair, not one of those); the standard limits are 60 requests/minute per user (`api`), 10 writes/minute per user (`api-write`, also counted by `api`), 20/minute per IP for a missing or bad key (`auth-fail`), and 10/hour per user for creating or regenerating a key (`key-create`); and never call the API key store's own `ensureIndexes()` from `onConnect` — spread `apiKeyIndexSpecs()` into the app's own index list instead, because calling the store's `ensureIndexes()` from `onConnect` deadlocks (it calls back into `db()` while the connection is still resolving).
FAIL if it invents a prefix already in the registry, gets a limit's number, window or subject (user vs IP) wrong, or says it's fine to call the store's `ensureIndexes()` from `onConnect`.
