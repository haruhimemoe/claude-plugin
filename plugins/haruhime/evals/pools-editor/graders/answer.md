---
type: llm
---

PASS if the reply says the pool's export (on the pool page or in the editor) copies `!mp map <id> 0` and `!mp mods` lines per slot, with `None`, the forced mods or `Freemod`, and says undo only takes back your own changes from your own session (up to 20 steps, no redo), so you can't undo your co-editor's removal: add the map back instead (or they undo it themselves).
FAIL if it says you can undo another editor's change, invents a redo or version history restore, or says pools has no export.
