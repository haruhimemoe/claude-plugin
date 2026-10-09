<p align="center"><a href="https://github.com/haruhimemoe/claude-plugin"><picture><source media="(prefers-color-scheme: light)" srcset="https://www.haruhime.moe/brand/repos/claude-plugin-banner-on-light.svg"><img alt="haruhime claude-plugin" src="https://www.haruhime.moe/brand/repos/claude-plugin-banner.svg" width="640"></picture></a></p>

# haruhime: osu! skills for Claude

A [Claude Code plugin](https://code.claude.com/docs/en/plugins) of skills from haruhime.moe, which makes osu! tools for players, mappers and hosts. It covers the osu! API v2, osu! BBCode (userpages, forum posts, beatmap descriptions and `@haruhimemoe/bbcode`), the rules for officially supported tournaments, the hinai beatmap mirror, the packs.haruhime.moe pack builder and its API, the pools.haruhime.moe pool builder, the API key, rate limit and crawl-file standards every haruhime.moe app (including bb.haruhime.moe) follows, and the `@haruhimemoe/*` packages, including the shared UI components, the brand kit and the Next.js server kit.

Skills only. No MCP server, no hooks, no commands. Each skill is short and points at the source it summarizes (the osu! wiki, the osu! API docs, a package README) so it stays true when those change.

## Install

```sh
/plugin marketplace add haruhimemoe/claude-plugin
/plugin install haruhime@haruhimemoe
```

## Skills

| Skill | Use it when |
| --- | --- |
| `osu-api-v2` | Calling the osu! API v2: OAuth, scopes, rate limits, beatmaps, star ratings with mods, and `@haruhimemoe/osu`, including its `/collections` reader and writer for `collection.db`. |
| `osu-bbcode` | Writing or fixing osu! BBCode for a userpage, forum post or beatmap description: the tags osu! reads, sizes, imagemaps, flags, gradients and the 60,000 character limit, and `@haruhimemoe/bbcode` to parse, render, lint, count and build it from code, including templates. bb.haruhime.moe, its editor, is live. |
| `osu-mappool-content-rules` | Checking whether a map may be used in an officially supported tournament, by hand or with `@haruhimemoe/compliance`. |
| `osu-official-tournament-support` | Planning a tournament that wants badges and official support: eligibility, screening, badges, what to send the osu! team. |
| `hinai-mirror` | Getting beatmap metadata or `.osz` downloads from mirror.hinamizawa.ai, by hand or with `@haruhimemoe/mirror`. |
| `osu-mappool-data` | Modeling a mappool in code: slots, custom slots and their mods, pasted pools, and pack keys (`pk1.`…), with `@haruhimemoe/pool` or in another language. |
| `packs` | Making, opening, sharing or downloading a mappool pack with packs.haruhime.moe, by hand or through its API. |
| `pools` | Building an osu! tournament mappool on pools.haruhime.moe (in beta): templates and slot targets, searching maps under a mod, the editor (notes, undo, export as IDs, `!mp` lines or CSV, recent changes), co-editors, visibility and its pack on packs, plus past pools as reference, search and map browser links, sending a past pool, and its small `GET /api/v1/me` API. |
| `haruhimemoe-packages` | Building on the `@haruhimemoe/*` packages (pool, osu, hinai, compliance, bbcode, ui, brand, next-kit): which one or which entry point does what, where each runs, which versions go together, and installing them. |
| `haruhime-ui` | Building a haruhime.moe tool's pages, or another Next.js page, with `@haruhimemoe/ui`: setup, the theme, which component fits, client vs server, accessibility. |
| `haruhime-next-kit` | Building a haruhime.moe-style Next.js app's server side with `@haruhimemoe/next-kit`: route handlers, rate limits and osu! budgets in MongoDB, env, the MongoDB client, sign in with osu! through better-auth, and test helpers. |
| `haruhime-brand` | Giving haruhime.moe or one of its tools its wordmark, icons, link preview, README banners and palette with `@haruhimemoe/brand`. |
| `haruhime-app-standards` | The rules every haruhime.moe app (packs, pools, bb or a new one) follows for its public API, API keys, rate limits, error responses, robots.txt, sitemap, llms.txt, llms-full.txt, security.txt, its `/docs`, `/guides`, `/legal` and `/brand` content pages, and how it works on a phone and installs as a PWA. |
| `haruhime-repo-standards` | How every haruhimemoe repo keeps its CHANGELOG.md: Keep a Changelog sections, `[Unreleased]`, dated semver releases for packages and apps, compare links, and which bump a change needs. |

## Update

```sh
/plugin marketplace update haruhimemoe
/plugin update haruhime@haruhimemoe
```

Restart Claude Code to load the new version.

## Help

Ask questions in the haruhime.moe [Discord server](https://haruhime.moe/discord), and report bugs in [GitHub issues](https://github.com/haruhimemoe/claude-plugin/issues). Report security issues privately, as [SECURITY.md](SECURITY.md) describes.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE) for how the summarized sources are credited.

Not affiliated with osu!, ppy Pty Ltd, the osu! Tournament Committee or the hinai mirror.
