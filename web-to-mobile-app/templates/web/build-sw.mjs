// Template: scripts/build-sw.mjs. Run it after the web build ("build": "vite build && node scripts/build-sw.mjs").
// Writes <outDir>/sw.js from scripts/sw-template.js with this build's file list.
// The version hashes those files, so any deploy that changes one installs a fresh cache and drops the old one.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist"); // the web build output (Capacitor webDir)

// Files that must not be precached (server bundles, a Capacitor redirect page, large share images)
const SKIP = new Set(["sw.js"]); // e.g. add "_worker.js", "og-image.png"

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (name.startsWith(".")) return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const urls = walk(outDir)
  .map((file) => "/" + path.relative(outDir, file).split(path.sep).join("/"))
  .filter((url) => !SKIP.has(url.slice(1)))
  .sort();

const hash = createHash("sha256");
for (const url of urls) hash.update(url).update(readFileSync(path.join(outDir, url)));
const version = hash.digest("hex").slice(0, 12);
const template = readFileSync(path.join(root, "scripts/sw-template.js"), "utf8");
const sw = template
  .replace("__VERSION__", version)
  .replace("__PRECACHE_URLS__", JSON.stringify(urls, null, 2));

writeFileSync(path.join(outDir, "sw.js"), sw);
console.log(`sw.js: ${urls.length} files precached (version ${version})`);
