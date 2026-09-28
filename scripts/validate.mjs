/**
 * @file scripts/validate.mjs
 * @desc Checks the plugin in plugins/haruhime. Each skills/<name>/SKILL.md needs frontmatter
 *       under 1024 characters with `name` equal to the folder and a `description` starting with
 *       "Use when", a body under the word budget, relative links that resolve (in SKILL.md and
 *       its reference files), a "## Sources" section with a "checked YYYY-MM-DD" date in it, and
 *       at least one eval case whose skill-fired grader names it. Every eval case with a
 *       skill-fired grader also grades the answer, and every no-trigger case's negative pattern
 *       catches every skill. Also checks the manifests agree on name, version, source and
 *       description, and that the README's skill table and llms.txt's skill and reference file
 *       lists name exactly the skills and reference files there are.
 *       Run: node scripts/validate.mjs
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Mon Sep 28, 2026
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PLUGIN = path.join(ROOT, "plugins/haruhime");
const SKILLS = path.join(PLUGIN, "skills");
const EVALS = path.join(PLUGIN, "evals");
const MAX_WORDS = 900;
const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);
const dirs = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [];

const plugin = JSON.parse(readFileSync(path.join(PLUGIN, ".claude-plugin/plugin.json"), "utf8"));
const market = JSON.parse(readFileSync(path.join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
const entry = market.plugins?.find((candidate) => candidate.name === plugin.name);
if (!entry) fail("marketplace.json", `no plugin named ${plugin.name}`);
else {
  if (entry.version !== undefined && entry.version !== plugin.version) {
    fail("marketplace.json", `version ${entry.version} differs from plugin.json's ${plugin.version}`);
  }
  if (path.resolve(ROOT, entry.source ?? "") !== PLUGIN) {
    fail("marketplace.json", `source ${entry.source} isn't ./plugins/haruhime`);
  }
  if (entry.description !== plugin.description) {
    fail("marketplace.json", "the plugin entry's description differs from plugin.json's");
  }
}

// Relative markdown links in `text` must resolve from `dir`.
const checkLinks = (where, dir, text) => {
  for (const [, target] of text.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) {
    if (!existsSync(path.join(dir, target.split("#")[0]))) fail(where, `broken link ${target}`);
  }
};

// Skill names each eval case's skill-fired grader expects. A case with one also needs a grader
// on the answer. No-trigger cases' negative patterns (`max: 0`) are kept to test below.
const evaluated = new Set();
const negatives = [];
for (const name of dirs(EVALS)) {
  const graders = path.join(EVALS, name, "graders");
  if (!existsSync(graders)) continue;
  const files = readdirSync(graders).filter((file) => file.endsWith(".md"));
  for (const file of files) {
    const text = readFileSync(path.join(graders, file), "utf8");
    const pattern = /^input_match:\s*'(.*)'\s*$/m.exec(text)?.[1];
    if (pattern && /^max:\s*0\s*$/m.test(text)) negatives.push({ where: `evals/${name}/graders/${file}`, pattern });
  }
  if (!files.includes("skill-fired.md")) continue;
  const grader = path.join(graders, "skill-fired.md");
  const skill = /\?([a-z0-9-]+)"'\s*$/m.exec(readFileSync(grader, "utf8"))?.[1];
  if (skill) evaluated.add(skill);
  if (files.length < 2) fail(`evals/${name}`, "has a skill-fired grader but no grader on the answer");
}

const skills = dirs(SKILLS);
if (skills.length === 0) fail("skills/", "no skills");

// Every no-trigger pattern must catch every skill, with or without the plugin prefix.
for (const { where, pattern } of negatives) {
  const regex = new RegExp(pattern);
  for (const dir of skills) {
    if (!regex.test(`"skill":"${dir}"`) || !regex.test(`"skill": "haruhime:${dir}"`)) {
      fail(where, `negative pattern doesn't catch the ${dir} skill`);
    }
  }
}

for (const dir of skills) {
  const where = `skills/${dir}/SKILL.md`;
  const folder = path.join(SKILLS, dir);
  const file = path.join(folder, "SKILL.md");
  if (!existsSync(file)) {
    fail(where, "missing");
    continue;
  }
  const text = readFileSync(file, "utf8");
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match) {
    fail(where, "no frontmatter");
    continue;
  }
  const [, front = "", body = ""] = match;
  const field = (key) => new RegExp(`^${key}:\\s*(.+)$`, "m").exec(front)?.[1]?.trim();
  const name = field("name");
  const description = field("description")?.replace(/^["']|["']$/g, "");
  if (name !== dir) fail(where, `name "${name}" must equal the folder "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dir)) fail(where, "folder must be kebab-case");
  if (!description) fail(where, "no description");
  else if (!description.startsWith("Use when")) fail(where, 'description must start with "Use when"');
  if (front.length > 1024) fail(where, `frontmatter is ${front.length} characters (max 1024)`);
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words > MAX_WORDS) fail(where, `${words} words (max ${MAX_WORDS}); move detail to a reference file`);
  const sources = /^## Sources$([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(body)?.[1];
  if (sources === undefined) fail(where, 'no "## Sources" section');
  else if (!/checked \d{4}-\d{2}-\d{2}/.test(sources)) {
    fail(where, 'Sources needs a "checked YYYY-MM-DD" date');
  }
  checkLinks(where, folder, body);
  for (const extra of readdirSync(folder)) {
    if (extra !== "SKILL.md" && extra.endsWith(".md")) {
      checkLinks(`skills/${dir}/${extra}`, folder, readFileSync(path.join(folder, extra), "utf8"));
    }
  }
  if (!evaluated.has(dir)) fail(where, "no eval case with a skill-fired grader for this skill");
}

// The README's skill table lists every skill, and only those.
const readme = readFileSync(path.join(ROOT, "README.md"), "utf8");
const listed = new Set([...readme.matchAll(/^\| `([a-z0-9-]+)` \|/gm)].map((row) => row[1]));
for (const dir of skills) {
  if (!listed.has(dir)) fail("README.md", `skill table has no row for ${dir}`);
  listed.delete(dir);
}
for (const extra of listed) fail("README.md", `skill table lists ${extra}, which has no folder`);

// llms.txt links every skill's SKILL.md under "## Skills" and every reference file under
// "## Reference files", each at its path on main, and nothing else.
const llms = readFileSync(path.join(ROOT, "llms.txt"), "utf8");
const section = (title) => new RegExp(`^## ${title}$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(llms)?.[1] ?? "";
const BLOB = "https://github.com/haruhimemoe/claude-plugin/blob/main/plugins/haruhime/skills/";
const bullets = (title) =>
  [...section(title).matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)].map(([, label, href]) => ({ label, href }));
const compare = (title, expected, labelOf) => {
  const seen = new Map(bullets(title).map(({ label, href }) => [label, href]));
  for (const file of expected) {
    const label = labelOf(file);
    if (!seen.has(label)) fail("llms.txt", `"## ${title}" has no line for ${label}`);
    else if (seen.get(label) !== `${BLOB}${file}`) fail("llms.txt", `${label} should link ${BLOB}${file}`);
    seen.delete(label);
  }
  for (const extra of seen.keys()) fail("llms.txt", `"## ${title}" lists ${extra}, which doesn't exist`);
};
compare("Skills", skills.map((dir) => `${dir}/SKILL.md`), (file) => file.split("/")[0]);
const references = skills.flatMap((dir) =>
  readdirSync(path.join(SKILLS, dir))
    .filter((file) => file !== "SKILL.md" && file.endsWith(".md"))
    .map((file) => `${dir}/${file}`),
);
compare("Reference files", references, (file) => file);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`validate: ${skills.length} skills ok`);
