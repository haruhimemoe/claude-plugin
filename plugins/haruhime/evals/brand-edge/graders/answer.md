---
type: llm
---

PASS if the reply says no: @haruhimemoe/brand is build-time only (it renders PNGs with a native module), so run its CLI and commit the generated files instead of rendering per request.
FAIL if it says the package works in middleware or edge routes, or suggests rendering the brand images per request with it.
