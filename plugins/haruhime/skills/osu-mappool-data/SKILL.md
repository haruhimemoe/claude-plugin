---
name: osu-mappool-data
description: Use when modeling an osu! tournament mappool in code (slots like NM1, HD2, TB1, custom slots like EZ1 or RC2, forced mods, freemod), parsing a pasted pool or spreadsheet rows, validating pool limits, or reading, writing or decoding pack keys (text starting pk1., pk2. or pk3.) with @haruhimemoe/pool or in another language
---

# osu! mappools as data

A mappool is a name plus **slots**: a mod bucket, a slot number and a beatmap (difficulty) id. `NM1 129891` is "No Mod slot 1 plays difficulty 129891". `@haruhimemoe/pool` holds the shape, the editing rules and the **pack key** format. It has no network, storage or UI, and runs in browsers, Node 22.12+, Bun and edge runtimes.

```sh
bun add @haruhimemoe/pool zod   # zod 4.x, 4.0.16 or later: a peer dependency, not zod 3
```

## The model

- **Built-in buckets**, in default order: `NM` (no mod), `HD`, `HR`, `DT` (each forces that mod), `FM` (freemod) and `TB` (tiebreaker, freemod). Every pool has all six.
- **Custom slots** (`EZ`, `RC`, `LN`, …): a code of 1 to 12 letters or digits, one of 10 palette colors (`PALETTE`, names only: each app styles them), and optional mods: forced (1 to 3 of `EZ HD HR DT HT FL`) or freemod.
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

`addSlot`, `removeSlot`, `moveSlot`, `mergeSlots`, `addBucket`, `renameBucket`, `setBucketMods`, … are pure: each returns a new pool. **A refused edit returns the same object and throws nothing** (the pool already has 64 maps, the group reached 99, the bucket doesn't exist, a mod set breaks the rules, removing a custom slot that still has maps). In React, `next === pool` means "refused": tell the user why instead of assuming a lost state update.

## Pasted pools

`parsePoolText(text, pool)` reads slot lines (`NM1 129891`, `EZ2: <osu! link>`) and bare ids or links, one or more per line. It returns `{ slots, newBuckets, errors }`: `newBuckets` are custom slots to create for codes the pool doesn't have yet (like `RC`), and each error has a 1-based `line`, a `code` (`set-only`, `unrecognized`, `bad-index`, `bad-beatmap`, `full`, `duplicate`, `full-group` when a slot number would pass 99) and English `reason`. Apply it as `mergeSlots(addBuckets(pool, newBuckets), slots)`: create the new custom slots first, or their maps have nowhere to go. A beatmapset link (`/beatmapsets/1` with no difficulty) is `set-only`: pools need difficulty ids.

## Pack keys

A pack key (`pk1.…`, `pk2.…`, `pk3.…`) is the whole pool as base64url text, safe in chat and URL fragments. "Pack" because packs.haruhime.moe published it; the data is still a `Pool`.

```ts
const key = extractPackKey(message); // first key inside a message or link, or null
const pool = key ? decodePackKey(key) : null; // validated, slots in pool order
encodePackKey(pool); // the same pool always gives the same key
```

- `encodePackKey` validates first and throws zod's **`ZodError`** for an incomplete pool (usually an empty name or a bad slot).
- `decodePackKey` throws **`PackKeyError`**; its **`code`** is `empty`, `prefix`, `version`, `encoding`, `checksum` or `malformed`. `PACK_KEY_ERROR_MESSAGES` has default wording.
- **Keys hold ids only**: never titles, stats or star ratings. Apps fetch those when a key opens, so keys never go stale. Don't add data a lookup can answer.
- **Keys are forever.** Never change what an existing version's bytes mean. A new capability is a new version (`pk4.`) used only by pools that need it, with its own section in the spec; every older pool keeps its exact key.
- A pool gets the oldest version that can hold it: `pk1.` for built-ins only, `pk2.` for custom slots, a changed order or no-slot maps, `pk3.` when a custom slot has mods.

**Another language:** bytes are a version byte, varints (unsigned LEB128), UTF-8 strings, and a trailing **CRC-16/CCITT-FALSE** of everything before it, **high byte first**. Base64url without padding. Read [pack-key-format.md](pack-key-format.md) before writing one: it has each version's byte layout and the complete "Decoder rules" (what to accept, what to refuse, and with which error code). Test against [`tests/fixtures/packs-keys.json`](https://github.com/haruhimemoe/pool/blob/main/tests/fixtures/packs-keys.json) in the pool repo (not in the npm package): 400 pools and 400 damaged keys with the expected answers.

## Common mistakes

- Forcing NC, EZ+HR or DT+HT, or a fourth mod on a custom slot.
- Treating a beatmapset id as a slot's map. Slots hold difficulty ids.
- Catching `PackKeyError` around `encodePackKey` (it throws `ZodError`) or reading `.message` instead of `.code`.
- Guessing a checksum (it isn't CRC32, and it isn't little-endian).

## Related

- `osu-api-v2` and `hinai-mirror` fill in a pool's metadata; `osu-mappool-content-rules` checks its maps.
- `haruhimemoe-packages` maps the other packages.

## Sources

- [@haruhimemoe/pool README](https://github.com/haruhimemoe/pool#readme) 0.1.0, checked 2026-09-23.
- [Pack key spec](https://github.com/haruhimemoe/pool/blob/main/docs/pack-key.md) (pk1 to pk3), copied to `pack-key-format.md`, checked 2026-09-23.
