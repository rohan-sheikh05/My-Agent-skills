#!/usr/bin/env node
// Checks WCAG contrast for every theme style × mode at the token level.
//
// Usage: node check-contrast.mjs <tokens.css> [--pairs fg/bg,fg/bg:3]
//
// Reads CSS custom properties from these selectors (`:root` or `html` prefixes are optional):
//   :root                          default style, light
//   .dark                          default style, dark
//   [data-style="x"]               style x, light
//   .dark[data-style="x"]          style x, dark
// and layers them the way the cascade would (default light → default dark → style → style dark).
// Colors can be hex, rgb(), hsl(), oklch(), or var(--other). Translucent colors are blended
// over the pair's background (or over --background). Exits with 1 if any pair fails.
import { readFileSync } from "node:fs";

const DEFAULT_PAIRS = [
  // [foreground, background, minimum ratio]; 4.5 = normal text, 3 = large text and UI parts
  ["foreground", "background", 4.5],
  ["foreground", "card", 4.5],
  ["card-foreground", "card", 4.5],
  ["popover-foreground", "popover", 4.5],
  ["muted-foreground", "background", 4.5],
  ["muted-foreground", "card", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["primary-foreground", "primary", 4.5],
  ["secondary-foreground", "secondary", 4.5],
  ["accent-foreground", "accent", 4.5],
  ["destructive-foreground", "destructive", 4.5],
  ["success-foreground", "success", 4.5],
  ["warning-foreground", "warning", 4.5],
  ["primary", "background", 3],
  ["ring", "background", 3],
];

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
if (!file) {
  console.error("Usage: node check-contrast.mjs <tokens.css> [--pairs fg/bg,fg/bg:3]");
  process.exit(2);
}
const pairsArg = args[args.indexOf("--pairs") + 1];
const pairs = args.includes("--pairs")
  ? pairsArg.split(",").map((p) => {
      const [names, min] = p.split(":");
      const [fg, bg] = names.split("/");
      return [fg, bg, Number(min ?? 4.5)];
    })
  : DEFAULT_PAIRS;

// --- CSS parsing -------------------------------------------------------------

function parseBlocks(css) {
  const blocks = [];
  let i = 0;
  let start = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === "{") {
      const selector = css.slice(start, i).trim();
      let depth = 1;
      let j = i + 1;
      while (j < css.length && depth > 0) {
        if (css[j] === "{") depth++;
        else if (css[j] === "}") depth--;
        j++;
      }
      const body = css.slice(i + 1, j - 1);
      if (body.includes("{")) blocks.push(...parseBlocks(body));
      else blocks.push({ selector, body });
      i = j;
      start = j;
    } else {
      if (ch === ";" || ch === "}") start = i + 1;
      i++;
    }
  }
  return blocks;
}

function classify(selector) {
  if (selector.startsWith("@")) return null;
  const s = selector.replace(/\s+/g, " ").trim();
  if (/[ >+~]/.test(s.replace(/\[[^\]]*\]/g, ""))) return null; // descendant selectors aren't themes
  const styleMatch = s.match(/\[data-style=["']?([\w-]+)["']?\]/);
  const dark = /\.dark\b/.test(s) || /\[data-(?:theme|mode)=["']?dark["']?\]/.test(s);
  const rest = s
    .replace(/\[data-style=[^\]]*\]/, "")
    .replace(/\.dark\b/, "")
    .replace(/\[data-(?:theme|mode)=[^\]]*\]/, "")
    .replace(/^(:root|html)/, "");
  if (rest !== "") return null;
  return { style: styleMatch ? styleMatch[1] : "default", dark };
}

function declarations(body) {
  const vars = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);?/g)) vars[m[1]] = m[2].trim();
  return vars;
}

const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const layers = []; // { style, dark, vars }
for (const block of parseBlocks(css)) {
  for (const sel of block.selector.split(",")) {
    const kind = classify(sel);
    if (kind) layers.push({ ...kind, vars: declarations(block.body) });
  }
}

const styles = [...new Set(layers.map((l) => l.style))];
if (!styles.includes("default")) styles.unshift("default");

function resolveTokens(style, dark) {
  const pick = (st, dk) => layers.filter((l) => l.style === st && l.dark === dk);
  const order = [...pick("default", false)];
  if (dark) order.push(...pick("default", true));
  if (style !== "default") {
    order.push(...pick(style, false));
    if (dark) order.push(...pick(style, true));
  }
  return Object.assign({}, ...order.map((l) => l.vars));
}

// --- Color math --------------------------------------------------------------

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp = (x) => Math.min(1, Math.max(0, x));

function num(token, scale) {
  token = token.trim();
  if (token.endsWith("%")) return (parseFloat(token) / 100) * (scale === 1 ? 1 : scale);
  return parseFloat(token);
}

function parseColor(value, tokens, seen = new Set()) {
  value = value.trim();
  const ref = value.match(/^var\(\s*--([\w-]+)\s*(?:,\s*(.+))?\)$/);
  if (ref) {
    if (seen.has(ref[1])) return null;
    seen.add(ref[1]);
    const next = tokens[ref[1]] ?? ref[2];
    return next ? parseColor(next, tokens, seen) : null;
  }
  if (value === "white") return { r: 1, g: 1, b: 1, a: 1 };
  if (value === "black") return { r: 0, g: 0, b: 0, a: 1 };
  let m = value.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((c) => c + c).join("");
    const n = (k) => parseInt(h.slice(k, k + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  m = value.match(/^(rgba?|hsla?|oklch)\((.*)\)$/i);
  if (!m) return null;
  const fn = m[1].toLowerCase();
  const [main, alphaPart] = m[2].split("/");
  const parts = main.split(/[\s,]+/).filter(Boolean);
  let alpha = alphaPart ? num(alphaPart, 1) : 1;
  if (!alphaPart && parts.length === 4) alpha = num(parts.pop(), 1);
  if (fn.startsWith("rgb")) {
    const [r, g, b] = parts.map((p) => (p.endsWith("%") ? parseFloat(p) / 100 : parseFloat(p) / 255));
    return { r, g, b, a: alpha };
  }
  if (fn.startsWith("hsl")) {
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const k = (n) => (n + h / 30) % 12;
    const f = (n) => l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: f(0), g: f(8), b: f(4), a: alpha };
  }
  // oklch(L C h)
  const L = parts[0].endsWith("%") ? parseFloat(parts[0]) / 100 : parseFloat(parts[0]);
  const C = parseFloat(parts[1]);
  const hRad = ((parseFloat(parts[2]) || 0) * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ].map((c) => toGamma(clamp(c)));
  return { r: lin[0], g: lin[1], b: lin[2], a: alpha };
}

const blend = (top, under) => ({
  r: top.r * top.a + under.r * (1 - top.a),
  g: top.g * top.a + under.g * (1 - top.a),
  b: top.b * top.a + under.b * (1 - top.a),
  a: 1,
});

const luminance = (c) =>
  0.2126 * toLinear(clamp(c.r)) + 0.7152 * toLinear(clamp(c.g)) + 0.0722 * toLinear(clamp(c.b));

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// --- Report ------------------------------------------------------------------

let failures = 0;
let checked = 0;
const skipped = new Set();
for (const style of styles) {
  for (const dark of [false, true]) {
    const tokens = resolveTokens(style, dark);
    const page = parseColor(tokens.background ?? "white", tokens) ?? { r: 1, g: 1, b: 1, a: 1 };
    const opaquePage = page.a < 1 ? blend(page, dark ? { r: 0, g: 0, b: 0, a: 1 } : { r: 1, g: 1, b: 1, a: 1 }) : page;
    const label = `${style} / ${dark ? "dark" : "light"}`;
    const rows = [];
    for (const [fgName, bgName, min] of pairs) {
      if (!(fgName in tokens) || !(bgName in tokens)) {
        skipped.add(`${fgName}/${bgName}`);
        continue;
      }
      const bgRaw = parseColor(tokens[bgName], tokens);
      const fgRaw = parseColor(tokens[fgName], tokens);
      if (!bgRaw || !fgRaw) {
        rows.push(`  ?    ${fgName} on ${bgName}: can't parse color`);
        continue;
      }
      const bg = bgRaw.a < 1 ? blend(bgRaw, opaquePage) : bgRaw;
      const fg = fgRaw.a < 1 ? blend(fgRaw, bg) : fgRaw;
      const ratio = contrast(fg, bg);
      checked++;
      const ok = ratio >= min;
      if (!ok) failures++;
      rows.push(`  ${ok ? "ok  " : "FAIL"} ${fgName} on ${bgName}: ${ratio.toFixed(2)} (needs ${min})`);
    }
    console.log(label);
    console.log(rows.join("\n"));
  }
}

if (skipped.size) console.log(`\nSkipped pairs with a missing token: ${[...skipped].join(", ")}`);
console.log(`\n${checked} checks across ${styles.length} style(s) × 2 modes: ${failures} failing`);
process.exit(failures ? 1 : 0);
