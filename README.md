# My Agent Skills

AI agent skills by **Rohan Sheikh** (BUET). Each skill is a folder of
instructions an AI follows for a specific kind of job. They're written for Claude,
and they work with any AI that can read files.

---

## Skills in this repo

| Skill | What it does |
|---|---|
| [`web-to-mobile-app`](web-to-mobile-app/) | Builds Android/iOS apps from a web stack (React, Next.js, Vite, Vue, Svelte, Node.js) with Capacitor (or Expo/React Native for heavy apps), from the first idea to a signed Play Store release |
| `Organized-question-bank-generation-skill-main.zip` | Turns past term-final question papers into a single-file HTML question bank with topic analysis, heatmaps and repeat detection (see the README inside the zip) |

---

## web-to-mobile-app

A step-by-step playbook so the AI builds an app the way an experienced team
would, instead of jumping straight into code.

### How it works

It first picks a lane: **full** (a new app), **extend** (a big feature in an
existing app) or **quick** (a small change that skips the phases). If you say
"just build it", it skips the approval stops and writes down every assumption
for you to check afterwards.

In the full lane, the AI goes through 8 phases and stops at the key points for
your approval:

1. **Discovery:** asks what the app is, its goal, the problem it solves and who
   it's for.
2. **Niche research:** studies successful apps in the category, their user
   reviews, communities and patterns, then lists what that means for your app.
3. **Product & design direction:** the core loop, the MVP features and 2–3
   visual directions for you to choose from.
4. **Skill plan:** decides which other skills (logo design, UI/UX, frontend
   design, charts, motion) handle which part of the app.
5. **Architecture & setup:** Capacitor by default, Expo/React Native suggested
   for heavy apps (you decide); backend choice; the app running on a real phone
   early.
6. **Build:** one complete feature at a time.
7. **Quality gates:** an automated check script (typecheck, lint, tests, build,
   audit, theme contrast), then a 360 px layout check, offline and notification
   tests on a real device, security and performance checks, and multi-account tests.
8. **Release:** signing, versioning, GitHub Actions CI, a Play Store checklist.

### Built-in rules

- Every app gets **light and dark mode plus at least 3 themes** in Settings.
- Multi-user apps get a **profile with customizable avatars** (an illustrated set
  plus photo upload), account deletion, and a sign-out that clears all user data.
- Offline-first with any backend: local data, a queue of pending saves, a
  conflict policy and a sync indicator.
- Security, performance, crash reporting and a force-update check before the
  first public release.
- A **pitfalls list** learned by trial and error on real apps: WebView offline
  detection, Android background alarms and battery limits, release signing,
  Gradle upgrades, Firestore limits and more. It grows with every project.

### Files

| File | Contents |
|---|---|
| `SKILL.md` | The workflow and rules (start here) |
| `references/discovery.md` | Questions to ask and the brief template |
| `references/research.md` | How to research the app's niche |
| `references/design-direction.md` | Turning research into product and design decisions |
| `references/skill-orchestration.md` | Which skill to use for which job |
| `references/stack.md` | Stack choices and Capacitor setup |
| `references/expo.md` | When and how to use Expo/React Native instead |
| `references/standard-features.md` | Features every app should have (themes, avatars, i18n, payments…) |
| `references/offline.md` | Offline-first pattern for any backend, with a conflict policy |
| `references/engineering.md` | Security, performance, testing, crash reporting, force-update |
| `references/quality-gates.md` | Checklists before calling a feature done |
| `references/release.md` | Signing, versioning, CI, Play Store, iOS |
| `references/versions.md` | Dated tool and store requirements to re-check |
| `references/pitfalls.md` | Mistakes already made, so they aren't repeated |
| `templates/android/` | Offline-detection fix, native settings plugin, release signing |
| `templates/ci/` | GitHub Actions workflow for a signed APK and AAB |
| `templates/web/` | Theme token starter, service worker, native-settings wrapper |
| `scripts/check-contrast.mjs` | WCAG contrast check for every theme × light/dark |
| `scripts/check.sh` | Runs all the automated checks in one go |

---

## How to install

### Claude Code

Copy the skill folder into your skills directory:

```bash
git clone https://github.com/rohan-sheikh05/My-Agent-skills.git
cp -r My-Agent-skills/web-to-mobile-app ~/.claude/skills/
```

On Windows the folder is `C:\Users\<you>\.claude\skills\`. Start a new session,
then ask something like *"Make a habit tracker app with React"*.

### Claude (claude.ai)

1. Zip the `web-to-mobile-app` folder (the zip should contain the folder itself).
2. Go to **Settings → Capabilities → Skills** (or **Customize** in the left
   panel) and upload the zip.

### Other AIs (ChatGPT, Gemini, …)

Upload `SKILL.md` and the `references/` files to a chat or project, and ask the
AI to follow `SKILL.md`.

---

## License

[MIT](LICENSE)
