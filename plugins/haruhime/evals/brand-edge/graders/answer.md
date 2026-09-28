---
type: llm
---

PASS if the reply says no for rendering: @haruhimemoe/brand draws and renders its PNGs at build time only (with a native module), so run its CLI and commit the generated files instead of rendering per request. Saying that the `@haruhimemoe/brand/palette` entry (colors only) is safe in an edge runtime is fine.
FAIL if it says the package's root entry or its drawing and PNG functions work in middleware or edge routes, or suggests rendering the brand images per request with it.
