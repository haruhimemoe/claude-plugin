<!-- Details for SKILL.md's "In code: @haruhimemoe/hinai", checked against hinai 0.3.1. The hinai repo's README is the source of truth: https://github.com/haruhimemoe/hinai#readme -->

# @haruhimemoe/hinai client: results, errors and test mocks

## Methods

- `getBeatmaps(ids, { signal })` resolves to `{ found: Map<id, BeatmapMeta>, missing }`, asking the mirror 100 ids at a time. `missing` holds ids the mirror didn't return, and ids that aren't positive integers (never sent).
- `getAvailability(setId, { signal })` resolves to `{ downloadable, reason }`.
- `downloadSet(setId, { video, signal, onProgress })` resolves to a `Blob` and checks the zip signature for you. No video unless `video` is `true`. An error thrown by your `onProgress` rejects the call as it is.
- `setDownloadUrl(setId, baseUrl?, video?)` builds the `.osz` URL without downloading.

## Timeouts

`timeoutMs` (default 10 s) covers each metadata or availability request, body included. A download only times out while waiting for the headers, then streams as long as it takes.

## Errors that aren't a `HinaiError`

- **Aborts:** every method takes a `signal`. An abort rejects with `signal.reason`. A signal that's already aborted rejects at once, before any request, even with nothing to send (in 0.2.0 `getBeatmaps([])` resolved).
- **`createHinaiClient` throws `RangeError`** for a bad `timeoutMs` (an integer from 1 to 2147483647), a `baseUrl` that isn't an absolute http(s) URL or has a query, hash or credentials (0.3.0 and later), or a server-side `userAgent` that isn't a valid header value, such as an emoji or a line break (0.3.0 and later; 0.2.0 failed every request as a retryable `network` error).
- **`setDownloadUrl` throws `RangeError`** for a bad set id or `baseUrl`. From 0.3.0 it checks `baseUrl` like the client, so it never returns a `javascript:` URL.
- **`getAvailability` and `downloadSet` reject with `RangeError`**, before any request, for a set id that isn't a positive integer.

`HinaiError.forensicsUrl` is the mirror's `x-hinai-forensics` only when that's an absolute http(s) URL, else null (0.3.0 and later), so it's safe to render as a link.

## Test mocks: `@haruhimemoe/hinai/testing`

0.3.0 and later. [msw](https://mswjs.io) 2 handlers that answer like the mirror, the same ones the package tests itself with. `msw` ^2.0.0 is an optional peer: install it yourself.

```ts
import { hinaiHandlers, hinaiUnknownSetHandler } from "@haruhimemoe/hinai/testing";
import { setupServer } from "msw/node";

const server = setupServer(...hinaiHandlers);
server.use(hinaiUnknownSetHandler); // in one test: availability answers not_found
```

- `hinaiHandlers`: every endpoint the client calls (`hinaiBatchHandler` plus `hinaiDownloadHandlers`).
- `hinaiUnknownSetHandler`: the mirror's recorded 404 for a set no source knows.
- `recordedBeatmaps` (difficulties 129891, 2116202 and 1872396), `recordedAvailability`, `recordedUnknownSet`: answers recorded from the mirror.
- `fakeOsz(setId)`: a small valid zip holding one stand-in `.osu`. Never put real `.osz` files in a repo; they're copyrighted.
- `HINAI_BATCH_URL`, `HINAI_AVAILABILITY_URL`, `HINAI_DOWNLOAD_URL`: the paths, for your own `http.get` overrides.

The handlers answer on `https://mirror.hinamizawa.ai` only. For another `baseUrl`, write handlers with the recorded answers and `fakeOsz`.

## Compatibility

Browsers need Safari 17.4+, Chrome 120+ or Firefox 124+. Servers need Node 22.12 or later. Dependencies: `zod` ^4.0.16 (peer) and `@haruhimemoe/osu` ^0.4.0 (0.3.0 used ^0.3.0).
