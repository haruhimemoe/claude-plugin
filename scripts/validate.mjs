/**
 * @file scripts/validate.mjs
 * @desc Checks the plugin in plugins/haruhime. Each skills/<name>/SKILL.md needs frontmatter
 *       under 1024 characters with `name` equal to the folder and a `description` starting with
 *       "Use when", a body under the word budget, relative links that resolve (in SKILL.md and
 *       its reference files), a "## Sources" section with a "checked YYYY-MM-DD" date in it, and
 *       at least one eval case whose skill-fired grader names it. Also checks the manifests
 *       agree on name, version and source, and that the README's skill table lists exactly the
 *       skills there are.
 *       Run: node scripts/validate.mjs
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
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
}

// Relative markdown links in `text` must resolve from `dir`.
const checkLinks = (where, dir, text) => {
  for (const [, target] of text.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) {
    if (!existsSync(path.join(dir, target.split("#")[0]))) fail(where, `broken link ${target}`);
  }
};

// Skill names each eval case's skill-fired grader expects.
const evaluated = new Set();
for (const name of dirs(EVALS)) {
  const grader = path.join(EVALS, name, "graders/skill-fired.md");
  if (!existsSync(grader)) continue;
  const skill = /\?([a-z0-9-]+)"'\s*$/m.exec(readFileSync(grader, "utf8"))?.[1];
  if (skill) evaluated.add(skill);
}

const skills = dirs(SKILLS);
if (skills.length === 0) fail("skills/", "no skills");

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

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`validate: ${skills.length} skills ok`);
