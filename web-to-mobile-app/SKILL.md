---
name: web-to-mobile-app
description: End-to-end playbook for building a mobile app (Android, optionally iOS) with a web stack — React, Next.js, Vite, TanStack, Vue, Svelte, Node.js backends — packaged with Capacitor. Covers discovery questions, niche and competitor research, design direction, which other skills to bring in (logo, UI/UX, frontend design, motion), the standard features every app needs (auth, profile with customizable avatars, settings, offline, notifications), release signing and the pitfalls learned by trial and error. Use whenever the user asks to make, start, plan or substantially extend a mobile app built from web technologies, or to turn a website or web app into an Android/iOS app. Not for Kotlin/Swift native or Flutter apps.
---

# Web stack → mobile app playbook

A good app is built for one specific user with a specific problem. Most of the
quality comes from the phases *before* code. Don't skip ahead to coding, even when
the user is eager. Keep each phase short, but do every one.

Work through the phases in order. Each phase ends with a **gate**: show the user
what you produced and get their confirmation before moving on. Keep the phase
outputs in `docs/app-brief/` in the project, so later sessions (and other agents)
can pick up where you left off.

| Phase | Output | Reference |
|---|---|---|
| 1. Discovery | `docs/app-brief/01-brief.md` | [references/discovery.md](references/discovery.md) |
| 2. Niche research | `docs/app-brief/02-research.md` | [references/research.md](references/research.md) |
| 3. Product & design direction | `docs/app-brief/03-direction.md` | [references/design-direction.md](references/design-direction.md) |
| 4. Skill plan | section in `03-direction.md` | [references/skill-orchestration.md](references/skill-orchestration.md) |
| 5. Architecture & setup | working shell on a phone | [references/stack.md](references/stack.md) |
| 6. Build | features in vertical slices | [references/standard-features.md](references/standard-features.md) |
| 7. Verify | checklist passed | [references/quality-gates.md](references/quality-gates.md) |
| 8. Release | signed AAB, store listing | [references/release.md](references/release.md) |
| Always | avoid known traps | [references/pitfalls.md](references/pitfalls.md) |

If the user is extending an existing app instead of starting one, read the existing
`docs/app-brief/` (or reconstruct a short brief from the code and ask the user to
confirm it). Then jump to the phase that fits.

## Phase 1: Discovery (always ask first)

Before any research or code, ask the user the core questions in
[references/discovery.md](references/discovery.md): what the app is, its goal, the
problem it solves, who the users are, what success looks like, and the
constraints. Ask at most 4 questions at a time and offer likely answers as options.
Don't invent answers. If the user says "you decide", propose a choice and get it
confirmed. Write the brief and confirm it. **Gate.**

## Phase 2: Niche research

Research the app's category broadly and in depth: successful apps in the niche,
what users praise and complain about in reviews, onboarding and retention patterns,
monetization, and what's missing. Follow the method and output template in
[references/research.md](references/research.md). Cite sources. For broad research,
run several searches in parallel (or use subagents when they're available), and
check the claims that matter most against a second source. **Gate:** present
the 5–10 findings that will most change how the app is built.

## Phase 3: Product & design direction

Turn the brief and research into decisions: the core loop, the MVP feature list
(and what's deliberately left out), the navigation model, the emotional tone and
visual direction, and the key screens. Use
[references/design-direction.md](references/design-direction.md). Present 2–3
distinct visual directions when the look isn't obvious, and let the user pick.
**Gate.**

## Phase 4: Skill plan

List the skills available in this session, and decide which one handles which
part of the app and in what order, using
[references/skill-orchestration.md](references/skill-orchestration.md). Write the
plan into `03-direction.md`, so it's explicit which skill owns the logo, the
design tokens, each screen's UI, motion, and so on. Load each skill when its step
begins, not all at once.

## Phase 5–6: Architecture and build

Choose the stack with [references/stack.md](references/stack.md). Get a minimal
shell running **on a real phone** early, before building features: the signed
debug build, splash, status bar and safe areas. Then build in vertical slices
(one complete feature at a time, usable end to end).

Every app gets the baseline in
[references/standard-features.md](references/standard-features.md) where it applies.
For example, **any app with user accounts gets a profile section with
customizable avatars** (an illustrated set plus an optional photo upload), account
deletion, sign-out that clears all per-user data, settings, empty states and an
offline mode. **Every app always gets light and dark mode plus multiple themes
(at least 3 styles) selectable in Settings.** This rule has no exceptions.

Read [references/pitfalls.md](references/pitfalls.md) before touching native code,
notifications, background work, offline sync, CI or signing. Each of those traps
already cost real debugging time.

## Phase 7–8: Verify and release

Don't call a feature done until it passes
[references/quality-gates.md](references/quality-gates.md): accessibility in every
theme, a 360 px layout check, real-device tests for offline, notifications and
background behavior, and multi-account tests for shared features. Release with
[references/release.md](references/release.md).

## Working rules

- Explain **why** in commit messages. Bump the native version in the same commit
  as any native change.
- Report honestly: say what you verified on a device, what you only verified in a
  browser, and what you didn't test.
- Ask before decisions that are expensive to reverse: backend choice, app ID /
  package name, the signing key, store listing text, pricing.
- Keep `docs/app-brief/` and a design-system doc (`design-system/MASTER.md`) up to
  date when decisions change.

## Learning loop

This skill improves through trial and error. At the end of a session where
something went wrong, the user corrected you, or a non-obvious fix was found:

1. Propose the lesson in one or two lines: the rule, then **Why:** with the
   symptom you saw.
2. When the user approves, add it to the right section of
   [references/pitfalls.md](references/pitfalls.md) (or the relevant reference
   file). Keep it general: describe the trap, not the project.
3. Edit or remove rules that turn out to be wrong instead of piling up exceptions.
