# Phase 7: Quality gates

A feature is done when it passes these checks, not when it compiles. When
reporting, say which checks ran on a real device and which only in a browser.

## Every feature

- [ ] Works end to end in the real app (use the `run` skill or a device), not
      just in unit tests.
- [ ] No console errors. TypeScript and lint pass.
- [ ] Empty, loading and error states exist.
- [ ] Works at **360 px** width with no horizontal overflow, and on a tablet or
      desktop width.
- [ ] **Accessibility:** axe-core shows no WCAG AA violations in **every theme
      combination** (each style × light/dark); 44 px touch targets; visible
      focus; labels on icon buttons; reduced motion respected.
- [ ] Safe areas are correct (notch, gesture bar) on a real phone.

## Feature-specific

- [ ] **Offline:** with the phone in airplane mode, the app opens, shows cached
      data, saves queue up and sync after reconnecting, and the indicator shows.
      Test this **on the device**: browser DevTools offline mode doesn't catch
      WebView problems.
- [ ] **Notifications / timers:** they fire with the app in the background, with
      the screen locked, and after the app was swiped away. Check the icon and
      text. Check with exact-alarm and battery permissions both granted and
      denied.
- [ ] **Multi-user:** two real accounts on two devices or browsers: create,
      join, live updates, leave. Data never leaks between accounts after
      sign-out and sign-in as someone else.
- [ ] **Auth:** sign-up, sign-in, wrong password, reset, sign-out, account
      deletion.
- [ ] **Security rules:** deployed, and tested against unauthorized reads and writes.
- [ ] **Bulk operations** respect backend limits (e.g. Firestore's 500 writes per
      batch).

## Before a release

- [ ] `code-review` / `security-review` on the changes since the last release.
- [ ] Version name and code bumped.
- [ ] Signed release build installs **over** the previous release on a real
      phone, keeping its data.
- [ ] Cold start, splash and first launch with no network all checked.
