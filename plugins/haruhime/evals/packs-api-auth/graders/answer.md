---
type: llm
---

PASS if the reply says all three: get the key on the packs.haruhime.moe `/me` page (Create API key, shown once); send it as `Authorization: Bearer hpk_…`; and calling it straight from a browser extension is wrong because the API sends no CORS headers and the key would leak, so a bot should call it from a server and keep the key out of client-side code. It should also say going over 60 requests a minute gets a `429` with a `Retry-After` header to wait out.
FAIL if it says a browser or extension can call the API directly, omits the no-CORS/keep-the-key-server-side point, or gets the rate limit response wrong.
