---
type: llm
---

PASS if the reply says to share one counter across all instances (stored somewhere they all see, like MongoDB or Redis) behind the beforeCall hook, and says unchecked ids were skipped or failed for now and should be retried later, not treated as missing.
FAIL if it treats unchecked ids as maps that don't exist, or suggests a per-function in-memory limit.
