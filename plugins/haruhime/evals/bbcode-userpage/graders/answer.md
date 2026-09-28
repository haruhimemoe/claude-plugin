---
type: llm
---

PASS if the reply says osu! spells the tag `[centre]` (`[center]` isn't a tag), that `[size=…]` is clamped to 30..200 (so 300 is wrong; 150 or 200 works), and suggests `@haruhimemoe/bbcode`'s helpers for the staff list (`flag`, `profile` or `list`, with `escapeBBCode` for typed names).
FAIL if it keeps `[center]`, says any size works, or invents functions the package doesn't have.
