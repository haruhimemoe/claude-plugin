# Changelog

## 0.1.0 (unreleased)

- First skills: `osu-api-v2`, `osu-mappool-content-rules`, `osu-official-tournament-support`, `hinai-mirror`.
- `osu-mappool-data`, `haruhimemoe-packages` and `haruhime-brand`; `osu-api-v2` and `hinai-mirror` cover `@haruhimemoe/osu` and `@haruhimemoe/hinai`.
- The marketplace is named `haruhimemoe`, so the plugin installs as `haruhime@haruhimemoe`.
- The plugin lives in `plugins/haruhime/`, so installs copy only the plugin, not the repo's tooling.
- Every skill has an eval case, plus near-miss negatives; `scripts/validate.mjs` enforces it.
