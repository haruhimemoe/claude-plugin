---
type: llm
---

PASS if the reply says both: the `.sr-only` spans are `position: absolute`, and with no positioned ancestor inside the `overflow-hidden` row they escape the clip and widen the page, so the fix is `relative` on the clipping box; and the app becomes installable through `@haruhimemoe/next-kit/pwa` (`pwaManifest` in `app/manifest.ts`, `serviceWorkerResponse` in `app/sw.js/route.ts`, `pwaViewport`/`pwaMetadata` and `<ServiceWorkerRegister />` in the layout, plus 192, 512 and maskable icons), with a service worker that caches only `/_next/static/` and shows an offline page.
FAIL if it blames the visible content, suggests `overflow-x: hidden` on `body` as the fix, recommends `next-pwa`, Serwist or Workbox, or has the service worker cache API, auth or HTML responses.
