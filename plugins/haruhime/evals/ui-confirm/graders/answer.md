---
type: llm
---

PASS if the reply picks `TypeToConfirm` for deleting the pool (its submit stays off until the name is typed exactly) and `InlineConfirm` for removing a map (a two-step confirm in the page, focus on cancel first), and advises against `window.confirm()` in favor of the in-page confirm.
FAIL if it recommends `window.confirm()`, a hand-built modal, or components that don't exist in @haruhimemoe/ui.
