# Phase 7: Quality gates

A feature is done when it passes these checks, not when it compiles. When
reporting, include the **real output** of the automated checks, and say which
checks ran on a real device and which only in a browser.

## Automated (every feature)

- [ ] `bash <skill>/scripts/check.sh <tokens.css>`: typecheck, lint, tests,
      build, `npm audit`, and theme contrast for every style × mode. Paste the
      summary into the report.
- [ ] No console errors or warnings in the running app (other than the one
      expected theme hydration warning, if any).

## Manual (every feature)

- [ ] Works end to end in the real app. Use the `run` skill if available,
      otherwise the project's dev command plus a phone or emulator; unit tests
      alone don't count.
- [ ] Empty, loading and error states exist.
- [ ] Works at **360 px** width with no horizontal overflow, and on a tablet or
      desktop width.
- [ ] **Accessibility:** contrast is covered by the token check above. Also run
      axe-core (browser extension or `@axe-core/playwright`) on **2–3 key
      screens** in the default theme plus one dark theme. Check 44 px touch
      targets, visible focus, labels on icon buttons, and reduced motion.
- [ ] Safe areas correct (notch, gesture bar, edge-to-edge) on a real phone.

## Feature-specific

- [ ] **Offline** ([offline.md](offline.md)): in airplane mode **on the device**,
      the app opens cold, shows cached data, queues saves that survive a restart,
      syncs exactly once after reconnecting, and the indicator shows.
- [ ] **Notifications / timers:** fire with the app in the background, with the
      screen locked, and after the app was swiped away. Correct icon and text.
      Checked with exact-alarm and battery permissions both granted and denied.
- [ ] **Multi-user:** two real accounts on two devices or browsers: create,
      join, live updates, leave. No data leaks after signing out and in as
      someone else.
- [ ] **Auth:** sign-up, sign-in, wrong password, reset, sign-out, account
      deletion (including that the data and files are gone).
- [ ] **Security rules:** deployed, and tested so that they **reject** another
      user's and a signed-out user's reads and writes (emulator tests or a
      second account).
- [ ] **Uploads:** an oversized or non-image file is rejected by the rules, and
      EXIF is stripped.
- [ ] **Bulk operations** respect backend limits (e.g. Firestore's 500 writes per
      batch).
- [ ] **Payments:** test purchases with license testers; cancel, pending and
      restore all work.

## Before a release

- [ ] `code-review` / `security-review` skills on the changes since the last
      release, or a manual review of the diff if those skills aren't available.
- [ ] The security baseline in [engineering.md](engineering.md): token storage,
      `allowBackup`, CSP, no cleartext, no release WebView debugging.
- [ ] **Performance** on a low-end phone (or 4× CPU throttling + Slow 4G): cold
      start to an interactive screen in under 2–3 s, the first-route JS within
      budget (check.sh lists the largest files), and smooth scrolling on the
      longest list.
- [ ] Version name and code bumped; [versions.md](versions.md) requirements
      re-checked (target API level).
- [ ] Signed release build installs **over** the previous release on a real
      phone, keeping its data.
- [ ] Cold start, splash, first launch with no network, and the force-update
      screen (by temporarily raising the minimum version) all checked.
