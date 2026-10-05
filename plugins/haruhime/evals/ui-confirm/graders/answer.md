---
type: llm
---

PASS if the reply picks a type-to-confirm for deleting the pool, either `ConfirmDialog` with `typeToConfirm` set to the pool's name (deleting a pool other people edit) or the in-page `TypeToConfirm`, picks `InlineConfirm` for removing a map (a two-step confirm in the row, focus on cancel first), and advises against `window.confirm()` in favor of those components.
FAIL if it recommends `window.confirm()`, a hand-built modal or raw `<dialog>` for the confirm, or components that don't exist in @haruhimemoe/ui.
