# Mobile and PWA

Every haruhime app works on a phone first and installs to a home screen. ui 0.24.0 and next-kit 0.16.0 carry most of it; these are the rules for the code an app writes itself.

## Layout

- Build at 375px wide (an iPhone mini) first, then check 320px. Widen from there with `sm:` and up, never the other way round.
- The page never scrolls sideways. On a phone, anything wider than the screen makes the browser lay the whole page out wider and open it zoomed out, even when the wide thing is clipped further in.
- Grids start at one column: `grid gap-4 sm:grid-cols-2`, not `grid-cols-2`.
- Wide content scrolls in its own box: `relative overflow-x-auto` around a table, code block or bracket. ui's `Table`, `MdxTable`, `CodeBlock`, `BracketView` and Prose code blocks already do.
- **Gotcha:** a box that clips (`overflow-hidden`, `overflow-x-auto`, `truncate`) needs `relative` when it holds `.sr-only` text, such as an `<abbr>` expansion or an icon button's label. `sr-only` is `position: absolute`, so without a positioned ancestor inside the clip, the span escapes it and widens the page. ui fixed this in 0.24.0. Watch for it in an app's own tables and one-line stat rows.
- A flex child that truncates needs `min-w-0`. User text (names, URLs, inline code) gets `wrap-anywhere`. `Prose` does this for inline code and links from 0.24.0.
- Use `min-h-dvh`, not `h-screen`: a phone's address bar changes the viewport height.
- Never disable zoom: no `maximumScale` or `userScalable: false`. `pwaViewport` leaves zoom on.
- Anything that shows on hover needs a tap path too.

## Touch targets

- 24px is the floor for every control (WCAG 2.5.8). On a touchscreen, aim for 44px. ui's `coarse:` variant (`@media (pointer: coarse)`, from `theme.css`) adds the extra size only there, so desktop stays compact.
- A button or select: `h-8 coarse:h-11` (plus `min-w-8 coarse:min-w-11` when the label is one character).
- A 20px icon link: `coarse:-m-3 coarse:p-3`. That's a 44px hit area with nothing moved on screen. Widen the gap between neighbors (`gap-4 coarse:gap-6`) so the hit areas don't overlap.
- A list of text links: `coarse:inline-block coarse:py-2` on the link, and drop the list gap on touch (`gap-2 coarse:gap-0`).
- Color swatches, radio dots and similar: the `label` gets `coarse:size-11` and centers the swatch.
- A text field's font is 16px or more on touch (`coarse:text-base`), or iOS zooms in when it's focused. ui's fields already do this. An app's own `<input>` or `<textarea>` copies ui's field classes (`fieldClasses()`).
- Inline links inside a sentence are exempt from all of this.

## Checking a page

Run Playwright with the `iPhone 13 Mini` device (375px wide, coarse pointer) and check two numbers on each page: `innerWidth` should be 375, and `document.documentElement.scrollWidth` should equal `clientWidth`. If either is off, hide subtrees one at a time until the width comes back to 375 to find the element. Then list every link, button and field whose box is under 24px and isn't inline text. The hub's `/ui` showcase renders every ui component, so run the check there before every ui release.

## Installable app (next-kit `/pwa`)

Every app ships these. The code is in `haruhime-next-kit`'s `/pwa` subpath; don't add `next-pwa`, Serwist or Workbox.

| File | What it holds |
| --- | --- |
| `src/constants/pwa.ts` | `PWA: PwaApp`: `name` and `description` from `SEO_SITE`, `shortName` (12 characters or fewer), `hue` (globals.css's `--hue`), `scheme: "light"` for a light app (harumin) |
| `src/app/manifest.ts` | `pwaManifest(PWA, { shortcuts })`, with two or three shortcuts to the app's main actions (`/new`, `/browse`) |
| `src/app/sw.js/route.ts` | `dynamic = "force-static"`, `GET = () => serviceWorkerResponse(PWA, { version: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev" })` |
| `src/app/layout.tsx` | `metadata = { ...siteMetadata(SEO_SITE), ...pwaMetadata(PWA) }`, `viewport = pwaViewport(PWA)`, `<ServiceWorkerRegister />` last in `<body>` |
| `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Rendered from `src/app/icon.svg`. The maskable one fills the square with the icon's background and keeps the mark at 70% in the middle, so Android's circle and squircle masks don't clip it |

The theme color and splash background are the ui theme's `b5` at the app's hue, so the status bar matches the page.

What the service worker does, and why it stays small:

- `/_next/static/` (hashed, immutable build files) is cache-first, cached after the first fetch.
- A page load that fails gets an offline page in the app's colors, with a Try again button.
- Nothing else is touched. No API, auth or HTML response is cached, so a signed-in page or an API answer never goes stale, and sign-in redirects pass straight through.
- Each deploy has a new version (the commit SHA), and activating it drops the old caches. `/sw.js` is served `no-cache`, so a deploy reaches visitors on their next load.
- It registers in production builds only, so `next dev` never runs it.

If an app adds `script-src`, `worker-src` or `default-src` to its CSP, keep `'self'` in them for `/sw.js`, and keep `manifest-src` at `'self'`. Today's CSPs only set `frame-ancestors`, `img-src` and `media-src`, so nothing is needed.

Check a deploy: `/manifest.webmanifest` answers 200 as `application/manifest+json`, `/sw.js` answers 200 as JavaScript with `cache-control: no-cache`, and Chrome DevTools > Application shows the manifest with no installability errors and the worker activated.
