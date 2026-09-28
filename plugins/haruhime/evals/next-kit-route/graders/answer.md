---
type: llm
---

PASS if the reply says all three: the package has no root entry, so import from a subpath (`@haruhimemoe/next-kit/server` for `jsonError`); the cron route calls `refuseWithoutBearer` with `await` (it's async) and returns its response when it isn't null; and the shared budget comes from `createBudget` in MongoDB, with its `gate()` passed as `@haruhimemoe/osu`'s `beforeCall`.
FAIL if it invents a root export, suggests an in-memory per-instance counter for the budget, or calls `refuseWithoutBearer` without `await`.
