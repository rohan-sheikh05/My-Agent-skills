# Phase 4: Skill plan

Different skills are installed in different sessions, so first **check the
session's skill list** and match by purpose, not by exact name. Load a skill
only when its step starts. Note in the plan which skills were missing and what
you'll do instead. **No skill for a job never means skipping the job:** do it
manually with the guidance in these references (e.g. review the diff yourself if
there's no `code-review` skill, or launch the app with the project's own dev
commands if there's no `run` skill).

## Matching skills to jobs

| Job | Look for a skill like | Use it for | Notes |
|---|---|---|---|
| Name, logo, app icon | `logo-design` | Brief → concepts → SVG mark → icon tests at 16–48 px → adaptive icon layers, monochrome icon, notification silhouette, splash | Do this before the design tokens so the palette can come from the brand |
| Brand voice & identity | `ui-ux-pro-max:brand`, `ui-ux-pro-max:design` | Tone of voice, microcopy style, brand kit | Optional for small apps |
| Design tokens & system | `ui-ux-pro-max:design-system`, `ui-ux-pro-max:ui-ux-pro-max` | Token architecture, palettes for the product type, font pairings, UX guidelines, accessibility rules | Use its searchable palettes and pairings to back up the direction chosen in Phase 3 |
| Distinctive visual direction | `frontend-design` | Avoiding a templated look; the signature detail; layout choices | Use it when building the shell and key screens |
| Component implementation | `ui-ux-pro-max:ui-styling` | shadcn/ui + Tailwind patterns, accessible dialogs, sheets, forms, dark mode | |
| Visual mockups / canvas designs | Figma tools, `DesignSync` / Claude design types, artifacts | Comparing 2–3 directions, key-screen mockups the user can react to | Only if the user wants mockups before code |
| Charts & stats screens | `dataviz` | Any chart, KPI tile, heatmap, progress ring | |
| In-app motion | `frontend-design` + the motion library (motion.dev) | Transitions, micro-interactions, celebration moments | Respect reduced motion |
| Promo video / store video | `motion-graphics-studio` | Play Store promo video, launch clips | It makes *videos*, not in-app animation |
| Store graphics | `banner-design`, `ui-ux-pro-max:design` | Feature graphic (1024×500), screenshots with captions, social posts | |
| Backend | `firebase:*` skills, Supabase docs, `vercel:*` | Auth, database, security rules, hosting, functions | Delegate security rules to a rules specialist if available |
| Code quality | `code-review`, `simplify`, `security-review` | After each large slice and before a release | |
| Running the app | `run` | Launching and screenshotting to verify changes | |

## Writing the plan

In `03-direction.md`, add a table: step → skill → input it needs → output →
gate. For example:

```
1. logo-design      ← brief + direction      → logo SVGs, icon set     → user picks a concept
2. ui-ux-pro-max    ← direction + logo colors → tokens, fonts          → contrast check passes
3. frontend-design  ← tokens                  → app shell + key screens → user reviews on phone
4. dataviz          ← stats screen spec       → charts                 → readable in both themes
5. code-review      ← each slice              → fixes                  → clean
```

Keep the user involved at visual decisions (logo concept, direction, first
screens). Don't make them review every token.

## Running work in parallel

- **Give each agent its own files** (e.g. avatars → `src/components/app/avatars/`,
  icons → `src/components/app/icons/`) and wire their output in yourself.
- **Stage only your own paths when committing** (`git add <paths>`, not
  `git add -A`). *Why:* `-A` swept an agent's unfinished files into an unrelated
  commit.
- **If a specialist agent can't start** (e.g. a plugin agent with no usable
  tools), give the same brief to a general agent that loads the matching skill;
  don't skip the work.
- **An agent cut off by a usage limit can be resumed** with a message; its work so
  far is kept. Resume it instead of starting over.

## Code that scripts write

Read back any file a script edited before trusting it, especially regexes and
escapes. *Why:* `\d` passed through a heredoc and a template literal came out as
`d`, so a backup-restore date check matched nothing and every dated row was
silently skipped. For exact multi-line or escaped text, use a direct file edit.
