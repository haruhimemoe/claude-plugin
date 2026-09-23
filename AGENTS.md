# AGENTS.md

A Claude Code plugin of osu! skills. Skills only: no MCP servers, hooks or commands.

## Writing a skill

- One folder per skill in `skills/`, kebab-case, with `SKILL.md`. The frontmatter `name` equals the folder.
- `description` says only **when** to use the skill, starting with "Use when". Never summarize the skill's steps there.
- Keep `SKILL.md` under 900 words. Move long tables and endpoint lists to a reference file next to it and link it.
- Summarize sources in your own words and link to them. Never paste osu! wiki text: it's CC BY-NC.
- End every skill with `## Sources`: each source's link and the date you last checked it (`checked YYYY-MM-DD`).
- When a skill covers a `@haruhimemoe/*` package, link its README and don't repeat its API. The README is the source of truth.
- Test a new or changed skill: ask a fresh agent the questions the skill should answer, without it and then with it. The skill ships when the "with" answers are right.
- Run `node scripts/validate.mjs` before committing.
