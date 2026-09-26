---
type: llm
---

PASS if the reply links the map's history page, https://pools.haruhime.moe/maps/129891, gives a search link with `tab=maps`, `status=loved` and `sr=6-7` (no `scope`, or `scope=all`), and says pools has no public API, without naming any endpoint for the bot to call.
FAIL if it says pools has a public API or invents endpoints, adds `scope=played` to the all-maps link, or says pools' pools all come from otdb.
