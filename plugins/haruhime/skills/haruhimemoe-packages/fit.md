# How the @haruhimemoe packages fit together

- **`@haruhimemoe/osu` owns the beatmap shapes.** `@haruhimemoe/mirror` uses only its `/shapes`, so mirror and osu! metadata share one type. Keep every app on the same osu version as the libraries it installs; check each package's `peerDependencies` before bumping one alone. next-kit's `/auth-react` needs `@haruhimemoe/ui`. `bbcode` and `compliance` have no dependencies.
- `@haruhimemoe/compliance`'s input type matches the beatmapsets `@haruhimemoe/osu` returns.
- `zod` is a **peer dependency** of `pool`, `osu` and `mirror` (**zod 4, 4.0.16 or later**; not zod 3, and 4.0.0 to 4.0.15 break the published types) and of `next-kit` (4.6.5 or later). Install it yourself: `bun add @haruhimemoe/pool zod`.
- `@haruhimemoe/ui`'s peers are `next` 16 (app router), `react` and `react-dom` 19, and `tailwindcss` 4.1 or later (below 5). It needs `next/link` and `next/navigation`.
- next-kit's other peers are optional, per subpath: `mongodb`, `mongoose`, `better-auth`, `react`, `next`, and for `/testing` `vitest`, `msw` and `mongodb-memory-server`.
- All are ESM only, ship their own types and need Node 22.12 or later. Never import the `@haruhimemoe/osu` root (it holds your secret), the `brand` root (native PNG rendering) or next-kit's server subpaths into browser code.
- Pack keys are forever: no `@haruhimemoe/pool` release may change a key an older version made.
- Every version is published from a GitHub release with npm provenance; `npm audit signatures` checks it.
