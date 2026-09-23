# AGENTS.md

A Claude Code plugin of osu! skills. Skills only: no MCP servers, hooks or commands.

## Writing a skill

- One folder per skill in `skills/`, kebab-case, with `SKILL.md`. The frontmatter `name` equals the folder.
- `description` says only **when** to use the skill, starting with "Use when". Never summarize the skill's steps there.
- Keep `SKILL.md` under 900 words. Move long tables and endpoint lists to a reference file next to it and link it.
- Summarize sources in your own words and link to them. Never paste osu! wiki text: it's CC BY-NC.
- End every skill with `## Sources`: each source's link and the date you last checked it (`checked YYYY-MM-DD`).
- When a skill covers a `@haruhimemoe/*` package, link its README and don't repeat its API. The README is the source of truth.
- A reference file may copy one of our own docs (like `osu-mappool-data/pack-key-format.md`, from the pool repo) when an agent needs it offline. Say at its top where it comes from, and recopy it when the source changes.
- Test a new or changed skill: ask a fresh agent the questions the skill should answer, without it and then with it. The skill ships when the "with" answers are right.
- Every skill has at least one eval case in `evals/<case>/` (a `prompt.md` phrased the way a user would ask, a `skill-fired` grader, and a grader on the answer). Prefer `regex` graders; use `llm` only where wording varies. Grant only `Skill` (plus `Read` when the skill has a reference file the answer needs): with more tools, agents explore the empty workspace or read skill files directly instead of loading the skill. `evals/no-trigger-unrelated` checks that no skill loads for an unrelated request.
- Run `node scripts/validate.mjs` and `claude plugin validate . --strict` before committing.
- Run the evals when a skill or its description changes. They call the model on your account: `claude plugin eval . --runs 1 --max-cost-usd 5` while iterating, the default 3 runs before a release.
