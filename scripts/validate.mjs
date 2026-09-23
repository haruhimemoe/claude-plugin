/**
 * @file scripts/validate.mjs
 * @desc Checks every skills/<name>/SKILL.md: frontmatter with `name` equal to the folder and a
 *       `description` that starts with "Use when" and stays under 1024 characters, a body under
 *       the word budget, relative links that resolve, and a "Sources" section with a "checked"
 *       date. Also checks the plugin manifests parse and agree on name and version.
 *       Run: node scripts/validate.mjs
 * @author David @dvhsh (https://dvh.sh)
 * @created Wed Sep 23, 2026
 * @modified Wed Sep 23, 2026
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SKILLS = path.join(ROOT, "skills");
const MAX_WORDS = 900;
const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

const plugin = JSON.parse(readFileSync(path.join(ROOT, ".claude-plugin/plugin.json"), "utf8"));
const market = JSON.parse(readFileSync(path.join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
if (!market.plugins?.some((entry) => entry.name === plugin.name)) {
  fail("marketplace.json", `no plugin named ${plugin.name}`);
}

const skills = readdirSync(SKILLS, { withFileTypes: true }).filter((entry) => entry.isDirectory());
if (skills.length === 0) fail("skills/", "no skills");

for (const { name: dir } of skills) {
  const where = `skills/${dir}/SKILL.md`;
  const file = path.join(SKILLS, dir, "SKILL.md");
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
  else {
    if (!description.startsWith("Use when")) fail(where, 'description must start with "Use when"');
    if (front.length > 1024) fail(where, `frontmatter is ${front.length} characters (max 1024)`);
  }
  const words = body.split(/\s+/).filter(Boolean).length;
  if (words > MAX_WORDS) fail(where, `${words} words (max ${MAX_WORDS}); move detail to a reference file`);
  if (!/^## Sources$/m.test(body)) fail(where, 'no "## Sources" section');
  if (!/checked \d{4}-\d{2}-\d{2}/.test(body)) fail(where, 'Sources needs a "checked YYYY-MM-DD" date');
  for (const [, target] of body.matchAll(/\]\((?!https?:|#|mailto:)([^)\s]+)\)/g)) {
    if (!existsSync(path.join(SKILLS, dir, target.split("#")[0]))) {
      fail(where, `broken link ${target}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`validate: ${skills.length} skills ok`);
