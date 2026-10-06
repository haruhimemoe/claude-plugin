# Contributing

Read [AGENTS.md](AGENTS.md) first: it has the rules for writing and testing a skill. Open an issue before a big change. Questions are welcome in the haruhime.moe [Discord server](https://haruhime.moe/discord).

## Layout

The plugin lives in `plugins/haruhime/` (its manifest, `skills/` and `evals/`). The marketplace manifest and the dev tooling stay at the root, so an install copies only the plugin. One folder per skill under `plugins/haruhime/skills/`, with a `SKILL.md`.

A new or renamed skill also needs a row in the README's skill table and a line in `llms.txt`.

## Setup

No install step: the scripts use only Node's standard library. Use the Node version in `.nvmrc` (24).

## Checks

Every pull request needs these three to pass; CI runs them too, and the pull request template lists them with the rest of the checklist:

```sh
node scripts/validate.mjs
claude plugin validate . --strict
claude plugin validate plugins/haruhime --strict
```

`scripts/validate.mjs` checks each skill's frontmatter, word budget, links, sources and eval coverage (a skill-fired grader plus a grader on the answer, and no-trigger patterns that catch every skill), the README's skill table, the skill and reference file lists in `llms.txt`, and that both manifests carry the same description. The `claude plugin validate` calls check the marketplace and plugin manifests.

## Evals

`plugins/haruhime/evals/` is a [`claude plugin eval`](https://code.claude.com/docs/en/plugin-evals) suite: realistic questions per skill, graded on whether the skill loaded and the answer has the facts, against a no-plugin baseline. It calls the model on your own Claude account, so run it yourself when a skill or its description changes:

```sh
claude plugin eval plugins/haruhime --runs 1 --max-cost-usd 5
```

## Changelog

Note every change in `CHANGELOG.md` under `## [Unreleased]`, in the right [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) section.

Releases are cut by the maintainers. Claude Code updates an installed plugin only when the `version` in `plugins/haruhime/.claude-plugin/plugin.json` changes, so a merged change reaches existing installs with the next release.
