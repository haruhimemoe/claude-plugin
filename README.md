# haruhime: osu! skills for Claude

A [Claude Code plugin](https://code.claude.com/docs/en/plugins) of skills for building osu! tools: the osu! API v2, the rules for officially supported tournaments, the hinai beatmap mirror, the packs.haruhime.moe pack builder, and the `@haruhimemoe/*` packages, including the shared UI components and brand kit.

Skills only. No MCP server, no hooks, no commands. Each skill is short and points at the source it summarizes (the osu! wiki, the osu! API docs, a package README) so it stays true when those change.

## Install

```sh
/plugin marketplace add haruhimemoe/claude-plugin
/plugin install haruhime@haruhimemoe
```

## Skills

| Skill | Use it when |
| --- | --- |
| `osu-api-v2` | Calling the osu! API v2: OAuth, scopes, rate limits, beatmaps, star ratings with mods, and `@haruhimemoe/osu`. |
| `osu-mappool-content-rules` | Checking whether a map may be used in an officially supported tournament, by hand or with `@haruhimemoe/compliance`. |
| `osu-official-tournament-support` | Planning a tournament that wants badges and official support: eligibility, screening, badges, what to send the osu! team. |
| `hinai-mirror` | Getting beatmap metadata or `.osz` downloads from mirror.hinamizawa.ai, by hand or with `@haruhimemoe/hinai`. |
| `osu-mappool-data` | Modeling a mappool in code: slots, custom slots and their mods, pasted pools, and pack keys (`pk1.`…), with `@haruhimemoe/pool` or in another language. |
| `packs` | Making, opening, sharing or downloading a mappool pack with packs.haruhime.moe, by hand or through its API. |
| `haruhimemoe-packages` | Building on the `@haruhimemoe/*` packages (pool, osu, hinai, compliance, ui, brand): which one does what, where each runs, and installing them. |
| `haruhime-ui` | Building a haruhime.moe tool's pages, or another Next.js page, with `@haruhimemoe/ui`: setup, the theme, which component fits, client vs server, accessibility. |
| `haruhime-brand` | Giving haruhime.moe or one of its tools its wordmark, icons, link preview, README banners and palette with `@haruhimemoe/brand`. |

## Update

```sh
/plugin marketplace update haruhimemoe
/plugin update haruhime@haruhimemoe
```

Restart Claude Code to load the new version.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE) for how the summarized sources are credited.

Not affiliated with osu!, ppy Pty Ltd, the osu! Tournament Committee or the hinai mirror.
