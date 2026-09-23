---
type: llm
---

PASS if the reply says all three: don't pass userAgent in the browser (it's ignored there, since a custom header would force a CORS preflight); a cancel rejects with the AbortSignal's reason rather than a HinaiError; and retry only errors whose `retryable` is true, waiting per backoffDelayMs (the mirror's Retry-After when given, else 1 s, 2 s, 4 s).
FAIL if any of the three is missing or wrong (for example it says to set a User-Agent header in the browser, or to retry every error).
