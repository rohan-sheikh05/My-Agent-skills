---
name: web-to-mobile-app
description: End-to-end playbook for building a mobile app (Android first, optionally iOS) with a JavaScript/TypeScript web stack — React, Next.js, Vite, TanStack, Vue, Svelte, Node.js backends — packaged with Capacitor by default, or Expo/React Native for heavy apps. Covers discovery questions, niche and competitor research, design direction, which other skills to bring in (logo, UI/UX, frontend design, motion), the standard features every app needs (light/dark mode plus multiple themes, profile with customizable avatars, offline, notifications), security and performance, ready-made templates (CI signing, Android fixes, service worker, theme tokens, contrast checker), release, and pitfalls learned by trial and error. Use whenever the user asks to make, start, plan or substantially extend a mobile app built with web technologies, or to turn a website or web app into an Android/iOS app. Not for apps written fully natively (Kotlin/Swift) or in Flutter; small native plugins inside a web-stack app are fine.
---

# Web stack → mobile app playbook

A good app is built for one specific user with a specific problem. Most of the
quality comes from the phases *before* code. Small native pieces (a Capacitor
plugin in Java/Kotlin) are allowed when a feature needs them; copy the templates
instead of writing them from scratch.

## Pick the lane first

| Lane | When | What to do |
|---|---|---|
| **Full** | A new app, or turning a website into an app | All phases below, in order |
| **Extend** | An existing app gets a substantial new feature | Read `docs/app-brief/` (or reconstruct a short brief from the code and confirm it), then phases 3 → 6–7 for that feature |
| **Quick** | A small change: one screen, a fix, a tweak | Skip the phases. Follow the standard features, the pitfalls and the quality gates that apply |

**Unattended mode:** if the user says "just build it", "don't ask me" or is
clearly away, don't stop at gates. Choose sensible defaults, record every
assumption in `docs/app-brief/assumptions.md`, and list them in the final report
so the user can overrule them. Always stop and ask before anything irreversible:
the app ID, the signing key, publishing, payments, deleting data.

## Phases (full lane)

Each phase ends with a **gate**: show the result and get the user's OK before
moving on. Save the outputs in `docs/app-brief/` in the project so later
sessions can continue.

| Phase | Output | Read |
|---|---|---|
| 1. Discovery | `01-brief.md` | [discovery.md](references/discovery.md) |
| 2. Niche research | `02-research.md` | [research.md](references/research.md) |
| 3. Product & design direction | `03-direction.md` | [design-direction.md](references/design-direction.md) |
| 4. Skill plan | section in `03-direction.md` | [skill-orchestration.md](references/skill-orchestration.md) |
| 5. Stack & setup | shell running on a phone | [stack.md](references/stack.md) (or [expo.md](references/expo.md)) |
| 6. Build | features in vertical slices | [standard-features.md](references/standard-features.md) |
| 7. Verify | gates passed with real output | [quality-gates.md](references/quality-gates.md) |
| 8. Release | signed AAB, store listing | [release.md](references/release.md) |

1. **Discovery:** before any research or code, ask what the app is, its goal,
   the problem it solves, who the users are and the constraints. Ask at most 4
   questions at a time and offer likely answers. Never invent answers.
2. **Niche research:** successful apps in the category, what reviews praise and
   complain about, communities, patterns, monetization, local context. End with
   the 5–10 implications that most change how the app is built. Cite sources.
3. **Direction:** core loop, MVP features (and what's left out), navigation, 2–3
   visual directions for the user to pick from. Gate only the direction itself and
   the first real screens; don't make the user approve every token.
4. **Skill plan:** check which skills this session has, and assign each job
   (logo, tokens, screens, charts, motion, store graphics) to one. Do the job
   manually if no fitting skill exists.
5. **Stack:** Capacitor by default. **For heavy apps** (gesture-heavy animation,
   maps/camera/AR as the core, huge feeds, heavy background work, a native look),
   explain the trade-off and recommend Expo/React Native; the user decides. Get the
   shell running on a real phone before building features.
6. **Build** in vertical slices (one complete feature at a time).
7. **Verify** with `scripts/check.sh` plus the device checks; report real output.
8. **Release** with signing, version bump and the store checklist.

## Non-negotiable baseline

Every app gets these. They're the user's standing rules, and each has a reason:

- **Light and dark mode plus at least 3 theme styles in Settings.** People use
  phones in very different light and have strong taste; themes are cheap when
  everything uses tokens. Details: "Themes" in
  [standard-features.md](references/standard-features.md). This is the single
  source of truth for the rule.
- **Multi-user apps get a profile with customizable illustrated avatars** (plus
  an optional photo upload), because identity makes shared spaces feel personal.
  The same file has details.
- **Offline-first data** ([offline.md](references/offline.md)), because mobile
  connections drop.
- **Security, performance, crash reporting and a force-update check**
  ([engineering.md](references/engineering.md)).
- **Accessibility:** WCAG AA contrast in every theme, 44 px touch targets,
  reduced motion.

## Read before you touch…

| Doing this | Read first |
|---|---|
| Native code, plugins, the manifest, notifications, background work | [pitfalls.md](references/pitfalls.md) (WebView, Background sections) + `templates/android/` |
| Offline, sync, caching | [offline.md](references/offline.md) |
| CI, signing, Gradle, versions | [release.md](references/release.md), [versions.md](references/versions.md), `templates/ci/` |
| Themes and tokens | [standard-features.md](references/standard-features.md), `templates/web/theme-tokens.css`, `scripts/check-contrast.mjs` |
| Auth, accounts, uploads, rules | [standard-features.md](references/standard-features.md), [engineering.md](references/engineering.md), [pitfalls.md](references/pitfalls.md) (Data & auth) |

## Templates and scripts

- `templates/android/MainActivity.java`: reports the real network state to the
  WebView (the offline fix).
- `templates/android/NativeSettingsPlugin.java` + `templates/web/native-settings.ts`:
  status of and shortcuts to notification, exact-alarm and battery settings.
- `templates/android/signing.gradle` + `templates/ci/build-android.yml`: signed
  APK/AAB in GitHub Actions; fails without the release key.
- `templates/web/build-sw.mjs` + `sw-template.js`: precaching service worker for
  remote-URL or PWA builds.
- `templates/web/theme-tokens.css`: a styles × modes token starter.
- `scripts/check-contrast.mjs <tokens.css>`: WCAG check for every style × mode.
- `scripts/check.sh [tokens.css]`: typecheck, lint, tests, build, audit, contrast.

Replace `com.example.app` and `APP_NAME` placeholders, and adapt rather than
paste blindly.

## Working rules

- Commit messages explain **why**. Bump the native version in the same commit as
  any native change.
- Report honestly: what ran on a device, what only in a browser, what wasn't tested.
  Include the real command output for automated checks.
- Ask before decisions that are expensive to reverse: backend, app ID / package
  name, signing key, store listing text, pricing.
- Keep `docs/app-brief/` and `design-system/MASTER.md` up to date when decisions
  change.
- Version-sensitive facts live in [versions.md](references/versions.md). Look
  them up again before relying on them.

## Learning loop

The skill improves through trial and error. When something went wrong, the user
corrected you, or a non-obvious fix was found:

1. Propose the lesson in one or two lines: the rule, then **Why:** with the
   symptom. Tag it with the stack it applies to if it isn't universal
   (`[Firebase]`, `[Cloudflare]`, `[Expo]`).
2. When the user approves, add it to the right section of
   [pitfalls.md](references/pitfalls.md) (or the relevant reference) with the
   month it was found.
3. Keep pitfalls.md under about 250 lines. When it grows past that, merge
   duplicates, delete rules that no longer apply (e.g. fixed upstream), and
   consider splitting it by topic.
