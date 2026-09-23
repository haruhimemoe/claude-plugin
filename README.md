# haruhime: osu! skills for Claude

A [Claude Code plugin](https://docs.claude.com/en/docs/claude-code/plugins) of skills for building osu! tools: the osu! API v2, the rules for officially supported tournaments, the hinai beatmap mirror, and the `@haruhimemoe/*` packages.

Skills only. No MCP server, no hooks, no commands. Each skill is short and points at the source it summarizes (the osu! wiki, the osu! API docs, a package README) so it stays true when those change.

## Install

```sh
/plugin marketplace add haruhimemoe/claude-plugin
/plugin install haruhime@haruhimemoe
```

## Skills

| Skill | Use it when |
| --- | --- |
| `osu-api-v2` | Calling the osu! API v2: OAuth, scopes, rate limits, beatmaps, star ratings with mods. |
| `osu-mappool-content-rules` | Checking whether a map may be used in an officially supported tournament, by hand or with `@haruhimemoe/compliance`. |
| `osu-official-tournament-support` | Planning a tournament that wants badges and official support: eligibility, screening, badges, what to send the osu! team. |
| `hinai-mirror` | Getting beatmap metadata or `.osz` downloads from mirror.hinamizawa.ai. |

## Develop

- One folder per skill under `skills/`, with a `SKILL.md`. See [AGENTS.md](AGENTS.md) for the rules.
- `node scripts/validate.mjs` checks the frontmatter, word budget, links and sources. CI runs it.

## License

MIT. See [LICENSE](LICENSE) for how the summarized sources are credited.

Not affiliated with osu!, ppy Pty Ltd, the osu! Tournament Committee or the hinai mirror.
