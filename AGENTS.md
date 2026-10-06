# AGENTS.md

A Claude Code plugin of osu! skills from haruhime.moe, which makes osu! tools for players, mappers and hosts (not only tournament tools). Skills only: no MCP servers, hooks or commands.

## Layout

- `.claude-plugin/marketplace.json`: the `haruhimemoe` marketplace. It lists one plugin, `haruhime`, with `source` `./plugins/haruhime`.
- `plugins/haruhime/.claude-plugin/plugin.json`: the plugin manifest (name, version, description). Its description and the marketplace entry's stay the same text.
- `plugins/haruhime/skills/<name>/SKILL.md`: one skill per folder. Reference files sit next to the skill that links them (`osu-api-v2/client.md`, `osu-bbcode/tags.md`, `hinai-mirror/client.md`, `haruhime-ui/components.md`, `haruhime-next-kit/seo.md`, `haruhime-brand/page-cards.md`, `osu-mappool-data/pack-key-format.md`, `packs/api.md`, `pools/editor.md`, `pools/search-links.md`), and `llms.txt` lists each one.
- `plugins/haruhime/evals/<case>/`: `prompt.md` and `graders/` for `claude plugin eval`. `evals/results/` is eval output and stays out of git.
- `scripts/validate.mjs`: the checks CI runs on the skills, evals, manifests and README.
- `README.md` is for users, `CONTRIBUTING.md` for contributors, and `llms.txt` lists the skills and reference files for LLMs, with a GitHub link to each.
- `.github/`: CI, Dependabot, the issue and pull request templates, and `CODEOWNERS`.

## Writing a skill

- One folder per skill in `plugins/haruhime/skills/`, kebab-case, with `SKILL.md`. The frontmatter `name` equals the folder.
- `description` says only **when** to use the skill, starting with "Use when". Never summarize the skill's steps there.
- Keep `SKILL.md` under 900 words. Move long tables and endpoint lists to a reference file next to it and link it.
- Summarize sources in your own words and link to them. Never paste osu! wiki text: it's CC BY-NC.
- End every skill with `## Sources`: each source's link and the date you last checked it (`checked YYYY-MM-DD`).
- When a skill covers a `@haruhimemoe/*` package, link its README and don't repeat its API. The README is the source of truth. When the README on `main` describes a version npm doesn't have yet, mark those features "0.2.0 and later" (with the right version) instead of presenting them as current.
- A reference file may copy one of our own docs (like `osu-mappool-data/pack-key-format.md`, from the pool repo) when an agent needs it offline. Say at its top where it comes from, and recopy it when the source changes.
- Test a new or changed skill: ask a fresh agent the questions the skill should answer, without it and then with it. The skill ships when the "with" answers are right.
- Every skill has at least one eval case in `plugins/haruhime/evals/<case>/` (`scripts/validate.mjs` checks) (a `prompt.md` phrased the way a user would ask, a `skill-fired` grader, and a grader on the answer). Prefer `regex` graders; use `llm` only where wording varies. Grant only `Skill` (plus `Read` when the skill has a reference file the answer needs): with more tools, agents explore the empty workspace or read skill files directly instead of loading the skill. The `no-trigger-*` cases check that no skill loads for unrelated or near-miss requests; negative graders use the same `(?:[\w-]+:)?` prefix pattern as positive ones.
- Adding, renaming or removing a skill: update the skill table in `README.md` (`scripts/validate.mjs` checks it), the list in `llms.txt`, and the manifests' description when the plugin's scope changes.
- Skills describe only what's public: link public sources, never private repos or notes.
- pools.haruhime.moe is in beta. It gets pools from tournament hosts, community submissions and sources like otdb: never say its pools come "from otdb" alone.
- Keep maintainer-only steps (releasing a package) out of skills; they belong in that package's repo.

## Checks and changes

- Run `node scripts/validate.mjs`, `claude plugin validate . --strict` and `claude plugin validate plugins/haruhime --strict` before committing. The validator also checks the README table, `llms.txt`, the manifests' descriptions and the eval graders.
- GitHub Actions in `.github/workflows` are pinned to full commit SHAs with the version in a comment; Dependabot (`github-actions`) opens the updates.
- Run the evals when a skill or its description changes. They call the model and bill the account they run on, so ask before running them: `claude plugin eval plugins/haruhime --runs 1 --max-cost-usd 5` while iterating, the default 3 runs before a release.
- The haruhime.moe Discord server (https://haruhime.moe/discord) goes wherever the docs list help: `README.md`, `CONTRIBUTING.md`, `SECURITY.md` and `llms.txt`.
- Note every change in `CHANGELOG.md` under `## [Unreleased]`, in the right [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) section. Never edit a released entry.
- Don't bump the version, tag or publish. Releases are cut by the maintainers. Claude Code updates an installed plugin only when `version` in `plugin.json` changes, so skill changes on `main` reach existing installs with the next release, not before.
