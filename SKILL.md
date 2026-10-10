---
name: term-final-question-bank
description: Turn past term-final / exam question papers (PDFs or photos) into a single-file HTML question bank with topic-wise questions and a year-by-year analysis dashboard.
---

# Term-Final Question Bank & Analysis

Build **one self-contained HTML file** from a course's past term-final papers. The page shows:

- every question, grouped by topic, with year / marks / section / question-number badges
- an analysis dashboard: KPI cards, a topic × year heatmap, weight by section or unit, repeated questions, paper pattern, and key takeaways
- search, filters (year, section, view, repeats only), jump-to-topic, LaTeX maths (MathJax), a phone layout and print styles
- optionally a back link to a portal and a "Report a mistake" popup (Gmail compose or mailto)

Works with any AI that can read PDFs/images and write a file. The template at the end does all the rendering; your job is the **data** and the **analysis judgement**.

---

## Workflow

### 0. Collect inputs (ask only if missing)

- **Required:** the question papers (all years), plus the course code and name.
- **Optional:** a portal link (`"../index.html"`), a report email, a preferred colour theme.

If the user just says "do the same for course X" and attaches papers, don't ask; use sensible defaults.

### 1. Read every page

- Read **every page of every paper.** Scanned PDFs: view the pages as images. Note for each paper:
  - session (e.g. *2022–2023*) and exam date
  - full marks, time, and the answering rule (e.g. "any THREE of FOUR", "Q1 compulsory")
  - section split (what Section A / B cover)
- Transcribe each **question part** separately: question no., part label, marks, full text.
  - Keep data tables as tables.
  - Keep code as code.
  - Write maths in LaTeX.
- **Figures and charts** (diagrams, statistical tables, view-factor charts…): don't redraw them. Describe them in words inside the question ("figure in paper: …").
- **Misprints:** copy as printed and add *(as printed)*. Never silently "fix" a question. Mention notable misprints to the user.
- **Multi-part marks** like `(7+10=17)`: use the total; keep the breakdown in italics in the text if useful.
- **Fractional marks** (e.g. 20⅔): use exact numbers in JS (`20+2/3`).

### 2. Design the topic structure

- Aim for **8–15 topics**. Each question part belongs to exactly **one** topic. Choose topics the way a syllabus would, not one per question.
- Group topics into **GROUPS**:
  - If the paper's Section A/B content is **fixed** every year → group by section (`"A"`, `"B"`).
  - If the halves **swap sections** between years → group by **units** (`"1"`…`"6"`) and keep each question's actual section in `sec`.
- Topic titles: short, specific, use `&mdash;` for a subtitle (e.g. `"Joint distributions &mdash; marginal, conditional &amp; covariance"`).

### 3. Tag repeats

Compare questions across years and create `REP` groups.

- `v:1` → **same question / same data** (verbatim or only trivially changed). Shown red as "Repeat ×n".
- no `v` → **same type of question** with different numbers or context. Shown blue as "Pattern ×n".
- A group only counts if it spans **≥ 2 different years.**
- Write each description so a student instantly recognises the question.

### 4. Write the analysis content

- **TIPS** (4–10 bullets): concrete, evidence-based advice. Every claim like "every year", "3 of 4 papers" or "verbatim" **must match the data**. Check against the heatmap after building. Good tips name the exact recurring problem, the marks at stake, and the method to practise.
- **PATTERN** rows (one per session): answering rule + what each section covered. Add `PATTERN_NOTE` with the key structural insight (e.g. "sections swap every year — prepare by half, not by letter").
- **PAPER** (optional): printed marks per paper (sum of all questions printed). Fill it when paper sizes differ between years, so shading uses % of paper.

### 5. Build the file

- Copy the **template** below exactly.
- Edit **only** the CONFIG block and the THEME colours.
- File name: `CODE_Question_Bank.html` (no spaces), e.g. `MME219_Question_Bank.html`.

### 6. Verify (don't skip)

- **Per-paper totals:** sum `m` per year and compare with the paper (all questions printed, usually 8 × marks-per-question). Every question part must be present.
- **Open the page in a browser** (headless if available):
  - no console errors
  - no `mjx-merror` elements
  - question count correct
  - no horizontal scroll at 390 px width
- **Re-check every TIP** against the computed heatmap / repeat list.
- Make sure no local or test paths are left in the file (MathJax must load from the CDN).

### 7. Deliver

Give the file. In 3–6 sentences tell the user:

- the main findings (most repeated questions, guaranteed topics, heaviest topic)
- anything you couldn't reproduce (figures and tables)
- any misprints found

---

## Data format (CONFIG block)

```js
const COURSE = { code:"MME 219", name:"Corrosion &amp; Degradation of Metals and Alloys", portal:"../index.html", email:"you@gmail.com" };
const YEARS  = ["2020","2021","2022","2023"];                 // session START year, oldest → newest
const YL     = { "2020":"2020&ndash;21", "2021":"2021&ndash;22", "2022":"2022&ndash;23", "2023":"2023&ndash;24" };
const PAPER  = { "2020":270, "2021":280, "2022":280, "2023":280 };   // optional
const GROUPS = { "A":"Section A &mdash; Electrochemistry &amp; protection", "B":"Section B &mdash; Forms of corrosion" };
const REP = {
  galv8: { v:1, d:"Galvanic coupling of noble M and active N on an Evans diagram — explain the 8 numbered points" },
  crevice: { d:"Crevice corrosion under washers / bolt heads" },
};
const PATTERN = [ { yr:"2023", rule:"Any 3 of 4 per section", a:"Mixed potential, passivity, CP/AP…", b:"Cells, EMF, crevice, SCC…" } ];
const PATTERN_NOTE = "Section A is always theory; Section B is always forms of corrosion.";
const TIPS = [ "<b>The 8-point galvanic diagram</b> came word for word in 3 of 4 papers (20 marks) — learn to label every point." ];
const DATA = [
  { grp:"A", id:"t1", num:"01", title:"Galvanic coupling on mixed-potential diagrams", qs:[
    { yr:"2023", sec:"A", q:"3(a)", m:20, rep:"galv8", parts:[["a","Figure 2 shows galvanic coupling … points 1 to 8 …"]] },
    { yr:"2021", sec:"A", q:"4(a)", m:20, rep:"galv8", comp:1, parts:[["a","…"]] },
  ]},
];
```

### Field rules

- `grp` must be a key of `GROUPS`. `id` must be unique (`t1`, `t2`, …). `num` is a 2-digit display number.
- `yr` must be in `YEARS`. `sec` is `"A"`/`"B"` (omit if the paper has no sections). `q` is the printed question number (`"5(c)"`, `"7"`). `m` is marks (number).
- `parts`: `[label, html]`. Use a single-letter label like `"a"` (shown as "(a)"), or `"&mdash;"` for unlabeled text. Several parts may share one card (e.g. a data table, then (a), (b), (c)).
- **Maths:** `\\( … \\)` inline, `\\[ … \\]` display. Backslashes are **doubled** inside JS strings (`\\frac`, `\\alpha`). A literal dollar sign → `&#36;`.
- **HTML entities** for special characters: `&amp; &mdash; &ndash; &deg; &plusmn; &times; &rarr; &le; &ge;`, plus `<sub>`/`<sup>` for chemistry (`Fe<sub>3</sub>C`).
- **Tables:**
  - `tb(row1,row2,…)` → horizontal table, first cell of each row is a header: `tb(["x","1","2"],["y","3","5"])`
  - `g(header,row,…)` → grid with header row and header column
- **Code:** `code("int main(){…}")` (escapes `<` and `&` automatically).
- **Text with `"` inside a JS string:** use `&quot;` or `\"`.

---

## Theme presets

Change the 7 values at the top of `:root` (`--dark --dark2 --main --light --mid --accent --heat`, plus `--muted` for small header text). Pick a different preset per course so pages are recognisable.

| Preset | --dark | --dark2 | --main | --light | --mid | --accent | --heat | --muted |
|---|---|---|---|---|---|---|---|---|
| Navy & gold (default) | #0f2744 | #1a3a5c | #1e5fa8 | #d6e8f7 | #4a90d9 | #c8922a | 30,95,168 | #9fbcd8 |
| Teal & amber | #0b3536 | #134e4a | #0f766e | #d3efea | #2aa198 | #e0a43a | 15,118,110 | #8cc7bf |
| Plum & pink | #24123d | #38205c | #6b3fa0 | #ebe2f7 | #9a6fd1 | #d9467a | 107,63,160 | #b9a3d8 |
| Burgundy & gold | #360c16 | #521624 | #9f2a43 | #f6e1e5 | #c9586f | #d4a24c | 159,42,67 | #dca3ae |
| Slate & orange | #1c2633 | #2c3a4b | #c2410c | #fde6d6 | #ea7a3c | #f59e0b | 194,65,12 | #a9b6c6 |
| Forest & copper | #132b1c | #1e432c | #2f7d4a | #dcefe1 | #4caf6e | #b87333 | 47,125,74 | #9fc9ab |
| Indigo & violet | #1e1b4b | #2d2a6e | #4c3d9e | #ede9fe | #7c6fd4 | #a78bfa | 76,61,158 | #a5b4fc |
| Ocean & cyan | #082f49 | #0c4a6e | #0369a1 | #e0f2fe | #0ea5e9 | #06b6d4 | 3,105,161 | #7dd3fc |

---

## Quality bar (what made the originals good)

- **Completeness:** every part of every question, with exact marks. Totals verified.
- **Honest analysis:** "Same question" only when it really is. Takeaways name concrete problems ("the 24xy joint density came in 3 of 4 papers") rather than generic advice.
- **Structural insight:** state whether sections are fixed or swap, whether there are compulsory questions, and how the format changed over the years.
- **Clean header:** only `CODE — Course name`. No university or level/term line under it.
- **No invented content:** if something is unreadable, write `[illegible]` and tell the user.

---

## Template (copy exactly, then fill CONFIG)

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{CODE}} — {{NAME}} · Question Bank</title>
<script>
window.MathJax = { tex: { inlineMath: [['\\(','\\)']], displayMath: [['\\[','\\]']] },
  options: { skipHtmlTags: ['script','noscript','style','textarea'] } };
</script>
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" async></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* ===== THEME — change these 7 colours per course (dark, dark2, main, light, mid, accent, heat rgb) ===== */
:root{
  --dark:#0f2744; --dark2:#1a3a5c; --main:#1e5fa8; --light:#d6e8f7; --mid:#4a90d9; --accent:#c8922a; --heat:30,95,168;
  --muted:#9fbcd8; --text:#1a1a1a; --text2:#4a5568; --text3:#718096; --bg:#f7f6f3; --card:#fff; --border:#e2ddd6; --border2:#c8c0b5;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);font-size:15px;line-height:1.6}
.hdr{background:var(--dark);position:sticky;top:0;z-index:100;border-bottom:3px solid var(--accent)}
.hdr-in{max-width:1180px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.hdr h1{font-family:'Source Serif 4',serif;font-size:20px;font-weight:600;color:#fff;line-height:1.3}
.back{display:inline-block;font-size:11.5px;color:var(--muted);text-decoration:none;margin-bottom:4px}.back:hover{color:#fff}
.hdr-r{display:flex;align-items:center;gap:26px}
.stat{text-align:center}.stat-n{font-size:22px;font-weight:600;color:#fff;line-height:1}
.stat-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.8px;margin-top:3px}
.rbtn{display:inline-flex;gap:6px;align-items:center;padding:6px 12px;border:1px solid rgba(255,255,255,.3);border-radius:7px;color:#fff;font-size:12px;background:none;cursor:pointer;font-family:inherit}
.rbtn:hover{background:rgba(255,255,255,.12)}
.layout{max-width:1180px;margin:0 auto;padding:28px 32px;display:grid;grid-template-columns:220px 1fr;gap:28px;align-items:start}
.side{position:sticky;top:96px;max-height:calc(100vh - 110px);overflow-y:auto}
.side h3{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text3);font-weight:600;margin:16px 0 7px 2px}
.search{width:100%;padding:8px 12px;font:inherit;font-size:13px;border:1px solid var(--border2);border-radius:8px;background:var(--card);outline:none}
.search:focus{border-color:var(--mid)}
.pill{display:block;width:100%;text-align:left;padding:6px 10px;font:inherit;font-size:12.5px;background:none;border:none;border-radius:8px;color:var(--text2);cursor:pointer;margin-bottom:2px;line-height:1.4}
.pill:hover{background:var(--light);color:var(--main)}.pill.on{background:var(--dark);color:#fff;font-weight:500}
.chk{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--text2);padding:3px 2px;cursor:pointer}
.chk input{accent-color:var(--main)}
main{min-width:0}
.banner{background:var(--dark2);color:#fff;opacity:.95;padding:9px 18px;font-size:10.5px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;border-radius:8px;margin-bottom:14px;border-left:4px solid var(--accent)}
.topic{margin-bottom:18px;background:var(--card);border:1px solid var(--border);border-radius:12px;overflow:hidden;scroll-margin-top:100px}
.topic-h{background:var(--light);border-bottom:1px solid var(--border);padding:10px 16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.tnum{font-family:'JetBrains Mono',monospace;font-size:10px;background:var(--dark);color:var(--muted);padding:2px 7px;border-radius:4px}
.topic-h h2{font-size:13.5px;font-weight:600;color:var(--dark);flex:1;min-width:160px}
.tstat{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--dark2);background:#fff;border:1px solid var(--border);padding:1px 7px;border-radius:4px}
.q{padding:13px 16px;border-bottom:1px solid var(--border)}.q:last-child{border-bottom:none}
.meta{display:flex;gap:7px;margin-bottom:9px;flex-wrap:wrap}
.b{font-size:10.5px;font-family:'JetBrains Mono',monospace;padding:2px 8px;border-radius:4px;border:1px solid var(--border)}
.b-yr{background:var(--light);color:var(--main)}.b-m{background:var(--dark);color:var(--muted);border-color:var(--dark)}
.b-sA{background:#e8f5ee;color:#1a6636}.b-sB{background:#fdf3e3;color:#7a4f1a}.b-q{background:#f3f1ed;color:var(--text2)}
.b-rep{background:#fde8e8;color:#9b1c1c;border-color:#f5b5b5}.b-pat{background:#eef0fb;color:#3b4a9e;border-color:#c7cdf0}
.b-comp{background:#efe9fb;color:#5b3a9e}
.part{display:flex;gap:9px}.plbl{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--main);min-width:22px;padding-top:3px}
.ptxt{font-family:'Source Serif 4',serif;font-size:14px;line-height:1.78;flex:1;min-width:0}
.dt{border-collapse:collapse;margin:8px 0;font-family:'JetBrains Mono',monospace;font-size:12px;display:block;overflow-x:auto;max-width:100%}
.dt th,.dt td{border:1px solid var(--border2);padding:3px 9px;text-align:center;white-space:nowrap}.dt th{background:#f3f1ed;font-weight:500}
.dt.g tr:first-child td{background:#f3f1ed;font-weight:500}
pre.code{background:#0f0e1a;color:#e2e0ff;padding:10px 12px;border-radius:8px;font-size:12px;overflow-x:auto;margin:6px 0}
mjx-container{overflow-x:auto;overflow-y:hidden;max-width:100%}
.empty{text-align:center;padding:60px 20px;color:var(--text3)}
/* analysis */
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.kpi{background:var(--card);border:1px solid var(--border);border-top:3px solid var(--accent);border-radius:12px;padding:12px 14px}
.kpi-n{font-size:22px;font-weight:600;color:var(--dark);line-height:1.15}.kpi-n.sm{font-size:15.5px;padding-top:4px}
.kpi-l{font-size:11px;color:var(--text3);margin-top:3px;line-height:1.35}
.panel{background:var(--card);border:1px solid var(--border);border-radius:12px;margin-bottom:16px;overflow:hidden}
.ph{background:var(--light);border-bottom:1px solid var(--border);padding:10px 16px;font-size:13.5px;font-weight:600;color:var(--dark);display:flex;gap:10px;align-items:center}
.pb{padding:14px 16px}.note{font-size:11.5px;color:var(--text3);margin-top:8px;line-height:1.5}
.scroll{overflow-x:auto}
table.heat{border-collapse:separate;border-spacing:3px;width:100%;font-size:12.5px;min-width:600px}
table.heat th{font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:var(--text3);font-weight:600;padding:4px;text-align:center}
table.heat th.l{text-align:left}
table.heat td{padding:5px 6px;text-align:center;border-radius:5px;font-family:'JetBrains Mono',monospace;font-size:11.5px}
table.heat td.tn{text-align:left;font-family:inherit;font-size:12.5px;cursor:pointer}table.heat td.tn:hover{color:var(--main);text-decoration:underline}
table.heat tr.gr td{font-family:inherit;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--accent);font-weight:700;text-align:left;padding-top:10px}
.c0{background:#f3f1ed;color:#b8b0a5}
.tier{font-family:inherit;font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:10px}
.t-top{background:#9b1c1c;color:#fff}.t-high{background:var(--accent);color:#fff}.t-med{background:var(--light);color:var(--dark)}
.grid2{display:grid;grid-template-columns:1fr 1.2fr;gap:16px}
.brow{display:grid;grid-template-columns:minmax(90px,180px) 1fr 80px;gap:10px;align-items:center;font-size:12.5px;margin-bottom:9px}
.track{background:#f3f1ed;border-radius:4px;height:13px;overflow:hidden}.fill{height:100%;background:var(--main);border-radius:4px}
.bval{font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--text2);text-align:right}
.rep{display:flex;gap:10px;font-size:13px;padding-bottom:9px;margin-bottom:9px;border-bottom:1px dashed var(--border);line-height:1.55}
.rep:last-child{border:none;margin:0;padding:0}
.rn{font-family:'JetBrains Mono',monospace;font-size:11px;background:#fde8e8;color:#9b1c1c;border-radius:4px;padding:1px 6px;height:fit-content}
.rn.p{background:#eef0fb;color:#3b4a9e}
.rk{font-size:9.5px;text-transform:uppercase;letter-spacing:.6px;font-weight:700;margin-left:6px;color:#9b1c1c}.rk.p{color:#3b4a9e}
.ry{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--text3)}
table.pat{width:100%;border-collapse:collapse;font-size:12.5px}
table.pat th,table.pat td{border-bottom:1px solid var(--border);padding:7px 8px;text-align:left;vertical-align:top}
table.pat th{font-size:10px;text-transform:uppercase;color:var(--text3)}
ul.tips{padding-left:18px;font-family:'Source Serif 4',serif;font-size:14px;line-height:1.65;display:flex;flex-direction:column;gap:6px}
ul.tips b{font-family:'DM Sans',sans-serif;color:var(--dark)}
/* report popup */
.rm{position:fixed;inset:0;background:rgba(15,20,30,.55);display:none;align-items:center;justify-content:center;z-index:500;padding:16px}
.rm.open{display:flex}
.rm-box{background:var(--card);border-radius:14px;width:100%;max-width:440px;padding:22px;box-shadow:0 18px 50px rgba(0,0,0,.25)}
.rm-box h3{font-size:18px;margin-bottom:6px}.rm-box p{font-size:13px;color:var(--text3);margin-bottom:12px}
.rm-box label{display:block;font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text3);margin:8px 0 4px}
.rm-box input,.rm-box textarea{width:100%;padding:9px 11px;border:1px solid var(--border2);border-radius:8px;font:inherit;font-size:13.5px;background:var(--bg)}
.rm-act{display:flex;flex-direction:column;gap:8px;margin-top:14px}
.rm-act a{display:block;text-align:center;padding:10px;border-radius:9px;font-weight:600;font-size:13.5px;text-decoration:none}
.rm-g{background:var(--main);color:#fff}.rm-o{border:1px solid var(--border2);color:var(--text)}
.rm-x{float:right;border:none;background:none;font-size:22px;cursor:pointer;color:var(--text3)}
@media (max-width:860px){
  .hdr{position:static}.hdr-in{flex-direction:column;align-items:flex-start;padding:14px 16px;gap:10px}.hdr-r{flex-wrap:wrap;gap:18px}
  .layout{grid-template-columns:1fr;padding:16px;gap:16px}.side{position:static;max-height:none}
  .kpis{grid-template-columns:repeat(2,1fr)}.grid2{grid-template-columns:1fr}.brow{grid-template-columns:110px 1fr 70px}
}
@media print{.hdr{position:static}.side,.rbtn,.back{display:none}.layout{grid-template-columns:1fr}.topic,.panel{break-inside:avoid}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
<header class="hdr"><div class="hdr-in">
  <div><a class="back" id="backLink" href="#">&larr; Back to portal</a><h1 id="title"></h1></div>
  <div class="hdr-r">
    <button class="rbtn" id="reportBtn" onclick="openReport()">&#9873; Report a mistake</button>
    <div class="stat"><div class="stat-n" id="sTopics"></div><div class="stat-l">Topics</div></div>
    <div class="stat"><div class="stat-n" id="sYears"></div><div class="stat-l">Years</div></div>
    <div class="stat"><div class="stat-n" id="sCount"></div><div class="stat-l">Questions</div></div>
  </div>
</div></header>

<div class="layout">
  <aside class="side">
    <input class="search" id="q" placeholder="Search questions…" oninput="render()">
    <h3>View</h3><div id="views"></div>
    <h3>Jump to topic</h3><div id="jump"></div>
    <h3>Filter by year</h3><div id="years"></div>
    <h3>Filter by type</h3>
    <label class="chk"><input type="checkbox" id="repOnly" onchange="render()"> Repeats &amp; patterns only</label>
    <div id="secChecks"></div>
  </aside>
  <main><div id="analysis"></div><div id="list"></div></main>
</div>

<div class="rm" id="rm" onclick="if(event.target===this)this.classList.remove('open')"><div class="rm-box">
  <button class="rm-x" onclick="rm.classList.remove('open')">&times;</button>
  <h3>Report a mistake</h3><p>Fill this in and send — it opens a ready-to-send email.</p>
  <label>Where (year, question no.)</label><input id="rmWhere">
  <label>What is wrong?</label><textarea id="rmWhat" rows="3"></textarea>
  <div class="rm-act"><a class="rm-g" id="rmG" target="_blank" rel="noopener">Send with Gmail</a><a class="rm-o" id="rmM">Use my email app</a></div>
  <p style="margin:12px 0 0">Or email: <b id="rmAddr"></b></p>
</div></div>

<script>
/* =====================================================================
   1. CONFIG  — fill these in
   ===================================================================== */
const COURSE = { code: "{{CODE}}", name: "{{NAME}}", portal: "", email: "" };   // portal/email: "" hides back link / report button
const YEARS  = ["2021","2022","2023"];                                      // session START years, oldest → newest
const YL     = { "2021":"2021&ndash;22", "2022":"2022&ndash;23", "2023":"2023&ndash;24" };  // labels shown
const PAPER  = {};             // optional printed marks per paper, e.g. {"2021":280}. If set, shading/share use % of paper
const GROUPS = { "A":"Section A &mdash; …", "B":"Section B &mdash; …" };    // banner per group (sections or units), in display order
const REP = {                  // repeat groups: v:1 = same question/data (red), omit v = same type of question (blue)
  // key: { v:1, d:"Short description" },
};
const PATTERN = [              // optional paper-pattern rows; [] hides the panel
  // { yr:"2023", rule:"Any 3 of 4 per section", a:"Section A topics…", b:"Section B topics…" },
];
const PATTERN_NOTE = "";
const TIPS = [                 // 4–10 key takeaways (HTML allowed)
  // "<b>X is guaranteed</b> — appeared in every paper …",
];
/* helpers for data tables inside questions */
const tb  = (...r) => '<table class="dt">' + r.map(x => '<tr>' + x.map((c,i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join('') + '</tr>').join('') + '</table>';
const g   = (...r) => '<table class="dt g">' + r.map((x,ri) => '<tr>' + x.map((c,i) => (i===0&&ri>0) ? `<th>${c}</th>` : `<td>${c}</td>`).join('') + '</tr>').join('') + '</table>';
const code = s => '<pre class="code">' + s.replace(/&/g,'&amp;').replace(/</g,'&lt;') + '</pre>';
/* DATA: topics → questions. grp = key in GROUPS. Each q: yr, sec ("A"/"B"), q ("3(b)"), m (marks), parts [[label, html]].
   optional: rep (key in REP), comp:1 (compulsory). Maths: \\( … \\) inline, \\[ … \\] display (double backslashes!). */
const DATA = [
  { grp:"A", id:"t1", num:"01", title:"Topic title", qs:[
    { yr:"2023", sec:"A", q:"1(a)", m:10, parts:[["a","Question text with \\(x^2\\)."]] },
  ]},
];

/* =====================================================================
   2. ENGINE — no need to edit below
   ===================================================================== */
const $ = id => document.getElementById(id);
const dec = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
const plain = s => dec(String(s).replace(/<[^>]+>/g,' '));
const fm = m => { const w = Math.floor(m + 1e-6), f = m - w; return f > .5 ? w + '&frac23;' : f > .2 ? w + '&frac13;' : String(w); };
const ALL = DATA.flatMap(t => t.qs.map(q => ({ ...q, t })));
const repYears = k => new Set(ALL.filter(x => x.rep === k).map(x => x.yr)).size;
const share = (v, y) => PAPER[y] ? v / PAPER[y] : v;
let view = 'all';

function init() {
  $('title').innerHTML = `${COURSE.code} &mdash; ${COURSE.name}`;
  if (COURSE.portal) $('backLink').href = COURSE.portal; else $('backLink').remove();
  if (!COURSE.email) $('reportBtn').remove();
  $('sTopics').textContent = DATA.length; $('sYears').textContent = YEARS.length;
  $('views').innerHTML = [['all','Analysis + all questions'],['analysis','Analysis only'],...Object.entries(GROUPS).map(([k,v]) => [k, plain(v)])]
    .map(([k,v]) => `<button class="pill${k==='all'?' on':''}" data-v="${k}">${v}</button>`).join('');
  $('views').onclick = e => { const b = e.target.closest('.pill'); if (!b) return; view = b.dataset.v;
    document.querySelectorAll('#views .pill').forEach(p => p.classList.toggle('on', p === b)); render(); scrollTo({top:0}); };
  $('jump').innerHTML = DATA.map(t => `<button class="pill" data-j="${t.id}">${+t.num} &middot; ${t.title.split(/ &mdash; | — /)[0]}</button>`).join('');
  $('jump').onclick = e => { const b = e.target.closest('.pill'); if (!b) return; jump(b.dataset.j); };
  $('years').innerHTML = [...YEARS].reverse().map(y => `<label class="chk"><input type="checkbox" value="${y}" checked onchange="render()"> ${YL[y]}</label>`).join('');
  const secs = [...new Set(ALL.map(x => x.sec).filter(Boolean))];
  if (secs.length > 1) $('secChecks').innerHTML = secs.map(s => `<label class="chk"><input type="checkbox" data-sec="${s}" checked onchange="render()"> Asked in Section ${s}</label>`).join('');
  buildAnalysis(); render();
}
function jump(id) {
  const t = DATA.find(d => d.id === id);
  if (view === 'analysis' || (view !== 'all' && t.grp !== view)) document.querySelector('#views .pill[data-v="all"]').click();
  setTimeout(() => { const el = $(id); if (el) el.scrollIntoView({behavior:'smooth'}); }, 60);
}
function buildAnalysis() {
  const totalM = ALL.reduce((s,x) => s + x.m, 0), NY = YEARS.length;
  const recur = ALL.filter(x => x.rep && repYears(x.rep) >= 2).length;
  const st = DATA.map(t => { const by = {}; YEARS.forEach(y => by[y] = 0); t.qs.forEach(q => by[q.yr] += q.m);
    const tot = Object.values(by).reduce((a,b) => a + b, 0), yrs = YEARS.filter(y => by[y] > 0).length;
    const avg = YEARS.reduce((s,y) => s + share(by[y], y), 0) / NY; return { t, by, tot, yrs, avg }; });
  const cut = [...st].sort((a,b) => b.avg - a.avg)[Math.max(0, Math.floor(st.length/3) - 1)].avg;
  st.forEach(s => { [s.tier, s.tc] = s.yrs === NY && s.avg >= cut ? ['Top','t-top'] : s.yrs >= Math.ceil(NY*.6) ? ['High','t-high'] : ['Medium','t-med']; });
  const mx = Math.max(...st.flatMap(s => YEARS.map(y => share(s.by[y], y))));
  const bg = (v,y) => { if (!v) return ''; const a = .12 + .78 * share(v,y) / mx; return `background:rgba(var(--heat),${a.toFixed(2)});color:${a > .5 ? '#fff' : 'var(--dark)'}`; };
  const top = [...st].sort((a,b) => b.avg - a.avg)[0], every = st.filter(s => s.yrs === NY).length;
  const short = t => t.title.split(/ &mdash; | — /)[0];
  const avgTxt = s => PAPER[YEARS[0]] ? (100*s.avg).toFixed(1) + '%' : s.avg.toFixed(1);
  let h = `<div class="kpis">
   <div class="kpi"><div class="kpi-n">${ALL.length}</div><div class="kpi-l">question parts (${fm(totalM)} marks across ${NY} papers)</div></div>
   <div class="kpi"><div class="kpi-n">${every} / ${DATA.length}</div><div class="kpi-l">topics that appeared in <b>every</b> paper</div></div>
   <div class="kpi"><div class="kpi-n">${Math.round(100*recur/ALL.length)}%</div><div class="kpi-l">of questions repeat or follow a pattern from another year</div></div>
   <div class="kpi"><div class="kpi-n sm">${short(top.t)}</div><div class="kpi-l">heaviest topic &mdash; ${fm(top.tot)} marks</div></div></div>`;
  h += `<div class="panel"><div class="ph">Topic &times; year heatmap (marks per paper)</div><div class="pb"><div class="scroll"><table class="heat"><tr><th class="l">Topic</th>${YEARS.map(y => `<th>${YL[y]}</th>`).join('')}<th>Total</th><th>${PAPER[YEARS[0]] ? 'Avg share' : 'Avg / paper'}</th><th>Seen</th><th>Priority</th></tr>`;
  Object.keys(GROUPS).forEach(gk => { const rows = st.filter(s => s.t.grp === gk); if (!rows.length) return;
    h += `<tr class="gr"><td colspan="${YEARS.length + 5}">${GROUPS[gk]}</td></tr>`;
    rows.forEach(s => h += `<tr><td class="tn" onclick="jump('${s.t.id}')">T${s.t.num} &middot; ${s.t.title}</td>${YEARS.map(y => `<td class="${s.by[y]?'':'c0'}" style="${bg(s.by[y],y)}">${s.by[y] ? fm(s.by[y]) : '&ndash;'}</td>`).join('')}<td><b>${fm(s.tot)}</b></td><td>${avgTxt(s)}</td><td>${s.yrs}/${NY}</td><td><span class="tier ${s.tc}">${s.tier}</span></td></tr>`); });
  h += `</table></div><div class="note">Marks printed for each topic (optional questions included). Darker = heavier. Click a topic to jump to it. <b>Top</b> = every year &amp; among the heaviest third; <b>High</b> = most years; <b>Medium</b> = occasional.</div></div></div>`;
  const gt = {}; Object.keys(GROUPS).forEach(k => gt[k] = 0); st.forEach(s => gt[s.t.grp] += s.tot); const gmx = Math.max(...Object.values(gt));
  h += `<div class="grid2"><div class="panel"><div class="ph">Weight by ${Object.keys(GROUPS).length > 2 ? 'unit' : 'section'}</div><div class="pb">` +
    Object.keys(GROUPS).map(k => `<div class="brow"><span>${plain(GROUPS[k]).split(/—|–/).pop().trim()}</span><div class="track"><div class="fill" style="width:${(100*gt[k]/gmx).toFixed(1)}%"></div></div><span class="bval">${fm(gt[k])} &middot; ${Math.round(100*gt[k]/totalM)}%</span></div>`).join('') + `</div></div>`;
  const grpd = {}; ALL.filter(x => x.rep).forEach(x => (grpd[x.rep] = grpd[x.rep] || []).push(x));
  const gl = Object.entries(grpd).map(([k,qs]) => ({ k, qs, n: new Set(qs.map(x => x.yr)).size })).filter(x => x.n >= 2)
    .sort((a,b) => (REP[b.k]?.v ? 1 : 0) - (REP[a.k]?.v ? 1 : 0) || b.n - a.n);
  h += `<div class="panel"><div class="ph">Repeated questions &amp; recurring patterns</div><div class="pb">` + (gl.length ? gl.map(x => { const v = REP[x.k]?.v;
    return `<div class="rep"><span class="rn ${v?'':'p'}">&times;${x.n}</span><div>${REP[x.k]?.d || x.k}<span class="rk ${v?'':'p'}">${v ? 'Same question' : 'Same type'}</span><div class="ry">${x.qs.sort((a,b) => a.yr.localeCompare(b.yr)).map(q => `${YL[q.yr]} ${q.sec||''}${q.q}`).join(' &middot; ')}</div></div></div>`; }).join('') : '<div class="note">No repeats tagged.</div>') + `</div></div></div>`;
  if (PATTERN.length) h += `<div class="panel"><div class="ph">Paper pattern</div><div class="pb"><div class="scroll"><table class="pat"><tr><th>Session</th><th>Format</th><th>Section A</th><th>Section B</th></tr>` +
    PATTERN.map(p => `<tr><td>${YL[p.yr] || p.yr}</td><td>${p.rule}</td><td>${p.a}</td><td>${p.b}</td></tr>`).join('') + `</table></div>${PATTERN_NOTE ? `<div class="note">${PATTERN_NOTE}</div>` : ''}</div></div>`;
  if (TIPS.length) h += `<div class="panel"><div class="ph">Key takeaways for preparation</div><div class="pb"><ul class="tips">${TIPS.map(t => `<li>${t}</li>`).join('')}</ul></div></div>`;
  $('analysis').innerHTML = h;
}
function render() {
  const q = $('q').value.toLowerCase().trim();
  const yrs = new Set([...document.querySelectorAll('#years input:checked')].map(c => c.value));
  const secOff = new Set([...document.querySelectorAll('#secChecks input:not(:checked)')].map(c => c.dataset.sec));
  const repOnly = $('repOnly').checked;
  $('analysis').style.display = (view === 'all' || view === 'analysis') ? '' : 'none';
  let html = '', total = 0;
  if (view !== 'analysis') Object.keys(GROUPS).forEach(gk => {
    if (view !== 'all' && view !== gk) return; let sh = '';
    DATA.filter(t => t.grp === gk).forEach(t => {
      const qs = t.qs.filter(x => yrs.has(x.yr) && !secOff.has(x.sec) && (!repOnly || (x.rep && repYears(x.rep) >= 2)) &&
        (!q || plain(x.parts.map(p => p[1]).join(' ')).toLowerCase().includes(q))).sort((a,b) => b.yr.localeCompare(a.yr));
      if (!qs.length) return; total += qs.length;
      const cards = qs.map(x => { let rb = ''; if (x.rep) { const n = repYears(x.rep); if (n >= 2) rb = REP[x.rep]?.v ? `<span class="b b-rep">Repeat &times;${n}</span>` : `<span class="b b-pat">Pattern &times;${n}</span>`; }
        return `<div class="q"><div class="meta"><span class="b b-yr">${YL[x.yr]}</span><span class="b b-m">${fm(x.m)} marks</span>${x.sec ? `<span class="b b-s${x.sec}">Sec ${x.sec}</span>` : ''}<span class="b b-q">Q${x.q}</span>${x.comp ? '<span class="b b-comp">Compulsory</span>' : ''}${rb}</div>` +
          x.parts.map(p => `<div class="part"><span class="plbl">${p[0].length === 1 ? '(' + p[0] + ')' : p[0]}</span><span class="ptxt">${p[1]}</span></div>`).join('') + `</div>`; }).join('');
      sh += `<div class="topic" id="${t.id}"><div class="topic-h"><span class="tnum">T${t.num}</span><h2>${t.title}</h2><span class="tstat">${qs.length} Q &middot; ${fm(qs.reduce((s,x) => s + x.m, 0))} marks &middot; ${new Set(qs.map(x => x.yr)).size}/${YEARS.length} yrs</span></div>${cards}</div>`;
    });
    if (sh) html += `<div class="banner">${GROUPS[gk]}</div>${sh}`;
  });
  if (view !== 'analysis' && !total) html = '<div class="empty">No questions match your filters.</div>';
  $('list').innerHTML = html; $('sCount').textContent = view === 'analysis' ? ALL.length : total;
  if (window.MathJax?.typesetPromise) MathJax.typesetPromise([$('list')]).catch(() => {});
}
function openReport() {
  const sync = () => { const subj = `[Question bank] Mistake — ${plain(COURSE.code + ' ' + COURSE.name)}`;
    const body = `Course: ${plain(COURSE.code + ' — ' + COURSE.name)}\nWhere: ${$('rmWhere').value}\nWhat is wrong: ${$('rmWhat').value}\n`;
    $('rmG').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(COURSE.email)}&su=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
    $('rmM').href = `mailto:${COURSE.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`; };
  $('rmAddr').textContent = COURSE.email; ['rmWhere','rmWhat'].forEach(i => $(i).oninput = sync); sync(); $('rm').classList.add('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('rm').classList.remove('open'); });
document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', () => window.MathJax?.typesetPromise && MathJax.typesetPromise().catch(() => {}));
</script>
</body>
</html>

```
