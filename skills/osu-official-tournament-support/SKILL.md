---
name: osu-official-tournament-support
description: Use when planning or running an osu! tournament that wants official support or profile badges, checking a tournament's eligibility (format, rank limits, forum post), preparing registrant screening, designing a badge, or building tools for seeding, filtering or automated refereeing in badged tournaments
---

# Official osu! tournament support

The osu! team gives some community tournaments extra support: player screening, profile badges for the winners, and sometimes a main-menu banner or news posts. It's at their discretion and comes with hard criteria. The wiki page is long and changes; this is the checklist, with the page as the authority.

## Eligibility (hard criteria)

- **At most two runs a year** of the same series.
- **Bracket size:** at least a Round of 16 double elimination or Round of 32 single elimination. LAN: Round of 8 double / Round of 16 single. Group stages or Swiss are fine if they start with at least 16 teams. Draft/auction formats may use a Round of 8 double elimination when open rank with teams of 8 or more (limits on how many divisions apply). Other formats: ask the Tournament Committee.
- **Rank limits** (skip for open rank): nobody ranked worse than **osu! #100,000**, **osu!taiko #10,000**, **osu!catch #5,000**, **osu!mania 4K #40,000**, **osu!mania 7K #5,000**.
- **Forum thread(s)**, including for any preliminary events, must end with a clearly visible, normal-size link to the tournament reports form: `https://tcomm.hivie.tn/reports/create`.
- **Content rules** for the mappool: see `osu-mappool-content-rules`.
- **Personal information:** collect none beyond what's allowed (emails when the tournament needs them; what's legally needed for prizes or tax; other exceptions only with the osu! team's prior OK). If you collect any, publish a privacy policy on the forum post or wiki page: who can see it, how it's stored and processed, what it's for.

## Timeline

1. **Well before play starts** (they suggest 2 to 3 weeks): email tournaments@ppy.sh with a short description (dates, modes, format), links to the forum thread in the Tournaments forum, public Discord/chat, past iterations, and the **registrant list as an attachment**.
2. **Screening:** the account support team screens every registrant **once, before play starts**, and returns who can't play (no reasons given). Send only players and likely substitutes. Format: CSV `username,user_id`, or `username,team,user_id` for teams. **Letting someone who failed screening play ends support immediately.**
3. **During play:** a referee at every match (players can't self-ref); every match made with `!mp make`; one consistent format per stage; results public on or linked from the forum post; rule changes announced to everyone.
4. **After the tournament**, email tournaments@ppy.sh: badge recipients, the badge image, links to match history (all matches, qualifiers too), mappools and qualifier results, and any artist permission proof. Badges are never approved before the tournament ends; send soon after.

## Badges

- **PNG, 172×80 px.**
- Clearly shows the tournament's logo, motif or name; clean and decent quality.
- **No sponsors or promotion, no AI-generated assets.** Every asset made for the tournament or open/public-use, and within the content usage rules; otherwise the original artist's explicit OK.
- Preview tool: https://tcomm.hivie.tn/assets-previewer?tab=badges
- Top-three badges are rare, for exceptional open (unrestricted) tournaments, and requested with the badge request.

## Staff and players

- Streamers, commentators and graphic designers may play. Eliminated players may become referees, playtesters or replay makers. Any other staff role may not play.
- No staff may be currently restricted. Tournament- or staffing-banned users must disclose it and may only take limited roles unless an exemption was requested up front.
- Publish the full staff list, kept in sync everywhere it appears.
- Prizes go to players who took part. Only a player who never played a single map may be denied the badge.

## Tools in badged tournaments

Anything that filters registrants, seeds players or automates refereeing must be **open source, fully documented, and approved by the osu! team for each tournament** it's used in.

- **Filtering/seeding:** reproducible by a third party. Datasets public, downloadable, timestamped, no more than 30 days old, kept for 6 months, with docs (and code) to reproduce. Disclose the dates you seed or filter. Qualifier seeding formulas go in the ruleset. No manual adjustments.
- **Auto-ref bots:** follow the bot account rules; a human referee reachable within 2 to 5 minutes through `!panic`, which stops all automation; a human can take over a lobby with logs intact.

## Banner and news support

Needs at least two past badged iterations (exceptions possible), English results or streams, and an email request (news: about a month ahead). Never guaranteed.

## Sources

- osu! wiki, [Official tournament support](https://osu.ppy.sh/wiki/en/Tournaments/Official_support) (page last updated 2025-10-09; changelog in the [tournament support updates thread](https://osu.ppy.sh/community/forums/topics/1715676)), checked 2026-09-23.
