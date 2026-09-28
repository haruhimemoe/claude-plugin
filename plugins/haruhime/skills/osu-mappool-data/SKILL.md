---
name: osu-mappool-data
description: Use when modeling an osu! tournament mappool in code (slots like NM1, HD2, TB1, custom slots like EZ1 or RC2, forced mods, freemod), parsing a pasted pool or spreadsheet rows, validating pool limits, or reading, writing or decoding pack keys (text starting pk1., pk2. or pk3.) with @haruhimemoe/pool or in another language, deciding which mods change a star rating or a map's speed, or filtering published pool names
---

# osu! mappools as data

A mappool is a name plus **slots**: a mod bucket, a slot number and a beatmap (difficulty) id. `NM1 129891` is "No Mod slot 1 plays difficulty 129891". `@haruhimemoe/pool` holds the shape, the editing rules and the **pack key** format. No network, storage or UI; it runs anywhere, edge runtimes included.

```sh
bun add @haruhimemoe/pool zod   # zod 4.x, 4.0.16 or later: a peer dependency, not zod 3
```

## The model

- **Built-in buckets**, in default order: `NM` (no mod), `HD`, `HR`, `DT` (each forces that mod), `FM` (freemod) and `TB` (tiebreaker, freemod). Every pool has all six.
- **Custom slots** (`EZ`, `RC`, `LN`, …): a code of 1 to 12 letters or digits with a letter, never another slot's code plus a number (0.2.0 refuses `NM1` beside `NM` as `clash`), one of 10 palette colors (`PALETTE`, names only: each app styles them), and optional mods: forced (1 to 3 of `EZ HD HR DT HT FL`) or freemod.
- **Forced-mod rules:** never EZ with HR, never DT with HT. There is no NC: Nightcore plays like DT, so force DT. Check a set with `modSetProblem`.
- **Maps without a slot** are allowed (`mod: null`, shown as "No slot") and come first in pool order.
- The data type is `Pool` (`{ name, slots, buckets? }`); `buckets` is present only when the list isn't the six built-ins in default order.

| Limit | Value | Export |
| --- | --- | --- |
| Maps per pool | 64 | `MAX_SLOTS` |
| Slot number (the 7 in NM7) | 1 to 99 | `MAX_SLOT_INDEX` |
| Custom slots | 8 | `MAX_CUSTOM_BUCKETS` |
| Custom code length | 12 | `MAX_BUCKET_CODE_LENGTH` |
| Name | 1 to 64 characters, trimmed | `MAX_NAME_LENGTH` |

Validate with `poolSchema` (complete) or `poolDraftSchema` (name may be empty while typing).

## Editing

`addSlot`, `removeSlot`, `moveSlot`, `mergeSlots`, `addBucket`, `renameBucket`, `setBucketMods`, … are pure: each returns a new pool. **A refused edit returns the same object and throws nothing** (the pool already has 64 maps, the group reached 99, the bucket doesn't exist, a mod set breaks the rules, removing a custom slot that still has maps). In React, `next === pool` means "refused": tell the user why.

## Pasted pools

`parsePoolText(text, pool)` reads slot lines (`NM1 129891`, `EZ2: <osu! link>`) and bare ids or links, one or more per line. It returns `{ slots, newBuckets, errors }`: `newBuckets` are custom slots to create for codes the pool doesn't have yet (like `RC`), and each error has a 1-based `line`, a `code` (`set-only`, `unrecognized`, `bad-index`, `bad-beatmap`, `full`, `duplicate`, `full-group` when a slot number would pass 99, `clash` in 0.2.0) and English `reason`. Apply it as `mergeSlots(addBuckets(pool, newBuckets), slots)`: custom slots first, or their maps have nowhere to go. A beatmapset link (`/beatmapsets/1` with no difficulty) is `set-only`: pools need difficulty ids.

## Mods, names and shared rules (0.2.0)

- `changesStarRating(mods)`, `ratingMods(mods)` and `speedRate(mods)`: which mods change a star rating (EZ, HR, DT, HT, FL; NC reads as DT, DC as HT) and the speed (1.5 or 0.75).
- Key names are as typed: pass them through `displayPoolName` before showing or storing them.
- `@haruhimemoe/pool/content-filter` has `hasBlockedLanguage(text)`, the slur blocklist packs and pools share for published names. `/service` holds the schemas pools and packs send each other.

## Pack keys

A pack key (`pk1.…`, `pk2.…`, `pk3.…`) is the whole pool as base64url text, safe in chat and URL fragments. The data is a `Pool`.

```ts
const key = extractPackKey(message); // first key inside a message or link, or null
const pool = key ? decodePackKey(key) : null; // validated, slots in pool order
encodePackKey(pool); // the same pool always gives the same key
```

- `encodePackKey` validates first and throws zod's **`ZodError`** for an incomplete pool (an empty name, a bad slot).
- `decodePackKey` throws **`PackKeyError`**; its **`code`** is `empty`, `prefix`, `version`, `encoding`, `checksum` or `malformed`. `PACK_KEY_ERROR_MESSAGES` has default wording.
- **Keys hold ids only**, never titles or star ratings: apps look those up when a key opens.
- **Keys are forever.** Never change what an existing version's bytes mean; a new capability is a new version (`pk4.`), used only by pools that need it.
- A pool gets the oldest version that can hold it: `pk1.` for built-ins only, `pk2.` for custom slots, a changed order or no-slot maps, `pk3.` when a custom slot has mods.

**Another language:** bytes are a version byte, varints (unsigned LEB128), UTF-8 strings, and a trailing **CRC-16/CCITT-FALSE** of everything before it, **high byte first**. Base64url without padding. Read [pack-key-format.md](pack-key-format.md) before writing one: it has each version's byte layout and the complete "Decoder rules" (what to refuse, with which error code). Test against [`tests/fixtures/packs-keys.json`](https://github.com/haruhimemoe/pool/blob/main/tests/fixtures/packs-keys.json) in the pool repo (not on npm): 400 pools and 400 damaged keys.

## Common mistakes

- Forcing NC, EZ+HR or DT+HT, or a fourth mod on a custom slot.
- A beatmapset id as a slot's map. Slots hold difficulty ids.
- Catching `PackKeyError` around `encodePackKey` (it throws `ZodError`) or reading `.message` instead of `.code`.
- Guessing a checksum (it isn't CRC32, and it isn't little-endian).

## Related

- `osu-api-v2` and `hinai-mirror` fill in metadata, `osu-mappool-content-rules` checks maps, `haruhimemoe-packages` maps the packages.

## Sources

- [@haruhimemoe/pool README](https://github.com/haruhimemoe/pool#readme) and [CHANGELOG](https://github.com/haruhimemoe/pool/blob/main/CHANGELOG.md) 0.2.0, checked 2026-09-28.
- [Pack key spec](https://github.com/haruhimemoe/pool/blob/main/docs/pack-key.md) (pk1 to pk3), copied to `pack-key-format.md`, unchanged in 0.2.0, checked 2026-09-28.
