---
name: osu-mappool-content-rules
description: Use when deciding whether a beatmap may go in a mappool for an officially supported (badged) osu! tournament, reviewing a pool for DMCA or artist-permission problems, or checking pools in code with @haruhimemoe/compliance or omc-api
---

# osu! mappool content rules

Officially supported tournaments may only use maps whose music is allowed. The rule has three parts, and **the beatmap's status matters**.

## The rule

1. **DMCA'd maps are never allowed**, whatever their status. On osu! that shows as downloads disabled or a content notice on the set (`availability.download_disabled`, `availability.more_information`).
2. **Maps that break the [Content usage permissions](https://osu.ppy.sh/wiki/en/Rules/Content_usage_permissions) artist rules are not allowed, unless the map is Ranked, Approved or Loved.** Graveyard, WIP, Pending and Qualified maps get no exemption.
3. **Artist permission can override 2.** If an artist lets you use a disallowed song, the host must include the proof in their email to tournaments@ppy.sh **when the tournament ends**.

Featured Artist tracks (a set with a `track_id`) are always licensed for osu!, even from artists who are otherwise restricted. A track from a Featured Artist that isn't on their listing is not licensed.

## Worked answers

| Map | Verdict | Why |
| --- | --- | --- |
| Graveyard map of an Igorrr solo track | Not allowed | Igorrr is "allowed, with exceptions": only his collaborations on Ruby My Dear's Featured Artist listing. Graveyard has no exemption |
| Ranked map of the same song | Allowed | Ranked/Approved/Loved exemption |
| Loved map, source "DJMAX RESPECT V" | Allowed | DJMax (Neowiz) is disallowed, but Loved is exempt |
| Graveyard map, source "DJMAX RESPECT V" | Not allowed | Banned source, no exemption |
| Ranked map with downloads disabled | Not allowed | DMCA beats every exemption |
| Graveyard map of a Featured Artist track | Allowed | Licensed track |
| Graveyard map by an "allowed with exceptions" artist | Read the note | e.g. only their Featured Artist tracks, or one named track banned |

The wiki's artist table has three groups: **Allowed**, **Allowed, with exceptions** (each with a note; this is where "only Featured Artist tracks" and single-track bans live) and **Disallowed**. Always read the current page: artists opt in and out, and the page shows when that section was last updated.

## In code: `@haruhimemoe/compliance`

A dependency-free TypeScript port of [hburn7/omc-api](https://github.com/hburn7/omc-api)'s rules, the engine behind the osu! Mappool Compliance checker and the Tournament Committee's tools. omc-api's own service doesn't take outside callers.

```ts
import { evaluateBeatmapset, factsFromOsuBeatmapset, verdictText } from "@haruhimemoe/compliance";

const facts = factsFromOsuBeatmapset(row.beatmapset); // from GET /api/v2/beatmaps?ids[]=…
if (facts) {
  const verdict = evaluateBeatmapset(facts); // { status: "ok" | "potential" | "disallowed", reason?, notes? }
  console.log(verdictText(verdict));
}
```

- `null` from `factsFromOsuBeatmapset` means a compact beatmapset: fetch `GET /api/v2/beatmapsets/{id}`.
- Verdicts are per **set**. Check each set once, apply the verdict to every difficulty in it.
- `reason` on a disallowed verdict: `dmca`, `artist`, `fa_only`, `source` or `rightsholder`.
- `potential` means a person must read `notes` (markdown) and decide.
- The package README has the full rule order, reasons and known deviations: https://github.com/haruhimemoe/compliance#readme

## Limits

- The data is a snapshot (`UPSTREAM.committedAt` in the package). It can lag the wiki. gxxberlol's two banned tracks ("KICKICKICKICKICKICKIKI" and "newb artist rave", added to the wiki on 2026-04-18) aren't in omc's data, so code says ok for them. Igorrr moved to "allowed, with exceptions" on the wiki, but the data still says disallowed, so code refuses his allowed collaborations too. Check the wiki for any verdict you're unsure of.
- Tags follow omc-api exactly (comma split), so tools agree with the Tournament Committee's; the `source` field catches most banned sources.
- A tool's answer is a guide. The Tournament Committee decides.
- Visual assets (backgrounds, storyboards, videos) follow the same permission rules, but no tool checks them.

## Common mistakes

- Treating "restricted artist" as always banned. Ranked, Approved and Loved maps are exempt; DMCA isn't.
- Treating graveyard as banned by itself. Status only matters when the music breaks the rules.
- Checking per difficulty and calling osu! once per map. Group by set.
- Sending permission proof before play. It goes with the end-of-tournament email.

## Related

- `osu-official-tournament-support` covers everything else a badged tournament needs.
- `osu-api-v2` covers fetching the beatmapset fields.

## Sources

- osu! wiki, [Official tournament support](https://osu.ppy.sh/wiki/en/Tournaments/Official_support), "Eligibility" (page last updated 2025-10-09), checked 2026-09-23.
- osu! wiki, [Content usage permissions](https://osu.ppy.sh/wiki/en/Rules/Content_usage_permissions) (the "Allowed, with exceptions" section says last updated 2026-02-18; rows were added after, e.g. gxxberlol on 2026-04-18), checked 2026-09-23.
- [@haruhimemoe/compliance](https://github.com/haruhimemoe/compliance) 0.1.0, rules from omc-api `bb356b3` (2026-06-28), checked 2026-09-23.
