---
type: llm
---

PASS if the reply says all three: load Tailwind 4 through `@tailwindcss/postcss` in a PostCSS config; import `@haruhimemoe/ui/theme.css` after `@import "tailwindcss"` in the global stylesheet (its `@source` line is what makes Tailwind generate the components' classes); and no, a Server Component can't pass a function to a Client Component, so the `onChange` has to come from the app's own `"use client"` file that holds the state.
FAIL if any of the three is missing or wrong (for example it says to add `"use client"` to the whole page without explaining why, or that a Server Component can pass `onChange` directly).
