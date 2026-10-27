# Engineering baseline: security, performance, testing, operations

Users never see these directly, but they decide whether the app survives its
first few months.

## Security (Capacitor-specific)

- **Secrets:** nothing secret in the web bundle; it's readable by anyone. API keys
  that must stay private live on a server or in a function. A public config (the
  Firebase web config, the Supabase anon key) is fine only when security rules or
  RLS protect the data.
- **Token storage:** `@capacitor/preferences` is plain SharedPreferences /
  UserDefaults, not encrypted. Keep refresh tokens and other secrets in a
  secure-storage plugin (Android Keystore / iOS Keychain). Firebase Auth manages
  its own persistence; don't copy its tokens elsewhere.
- **Backups:** decide on `android:allowBackup` in the manifest. The Capacitor
  template ships `true`, which copies app data (including local caches and
  tokens) into Google backups. Use `false`, or `fullBackupContent` /
  `dataExtractionRules` that exclude sensitive files, unless restoring data
  across devices is a deliberate feature.
- **Network:** HTTPS only. Keep `cleartext: false` in `capacitor.config` and don't
  add `usesCleartextTraffic="true"`.
- **WebView debugging:** Capacitor enables it only for debuggable builds by
  default. Never set `webContentsDebuggingEnabled: true` for release.
- **Content Security Policy:** add a CSP `<meta>` tag (or header) that lists only the
  origins the app really calls (backend, auth, analytics, fonts). Avoid
  `unsafe-eval`. Test that the app still works on a device after adding it.
- **Remote-URL apps:** set `server.allowNavigation` narrowly. Never let the WebView
  navigate to arbitrary sites with the native bridge exposed; open external links
  in the system browser (`@capacitor/browser` or `App.openUrl`).
- **Backend rules:** Firestore/Storage rules or Postgres RLS ship with each feature.
  Test that they **reject** reads and writes from another user and from signed-out
  users, not only that they allow the owner.
- **Uploads:** size caps enforced in rules (not just the UI), content-type checks,
  and EXIF stripping (location data) on photos before upload.
- **Dependencies:** `npm audit --omit=dev` before release; keep Capacitor plugins
  on the same major as core.

## Performance

Budgets for a mid-range or budget Android phone (the real target in most
markets):

- **Cold start to an interactive first screen:** under 2–3 s with no network.
  Hide the splash only once the first real screen renders.
- **JS bundle:** keep the first-route JS under about 300 KB gzipped. Split routes,
  lazy-load heavy screens (charts, editors, maps), and avoid shipping a whole
  icon or date library.
- **Lists:** virtualize anything that can pass about 100 rows.
- **Animations:** animate only `transform` and `opacity`; respect reduced motion.
- **Images:** right-sized, modern formats, lazy-loaded.
- **Fonts:** self-hosted, subset to the scripts in use, `font-display: swap`.
- **Test** on the slowest phone you can get (or Chrome DevTools at 4× CPU slowdown
  + "Slow 4G") as well as a real low-end device before release.

## Testing & CI

- `scripts/check.sh` runs typecheck, lint, tests, build, audit and theme contrast.
  Run it before reporting a feature done, and **paste the real output summary**
  into the report. "It should work" isn't a pass.
- Unit-test the logic that's easy to get wrong: date/time maths, streaks,
  scoring, sync and conflict rules, permission checks.
- E2E (Playwright against the web build) for the core flow is worth it once the
  app has users. It's optional for a first MVP.
- CI (`templates/ci/build-android.yml`) runs the checks before the Gradle build.

## Operations

- **Crash and error reporting from day one:** Firebase Crashlytics (native) +
  Sentry or similar for the JS side, or at least a global `error` /
  `unhandledrejection` handler that reports. Strip personal data from reports.
- **Analytics:** only if the user wants it. Prefer privacy-respecting tools, track
  a few product events (core action done, retention), and declare it in the data
  safety form. No analytics in children's apps without checking the policy.
- **Force-update / minimum version:** keep a `minSupportedVersion` (and
  `latestVersion`) in Remote Config or a small JSON endpoint. On launch and resume,
  compare it with the native app version (`@capacitor/app` `getInfo()`). Below
  the minimum, show a blocking "Update" screen linking to the store; below the
  latest, show a dismissible prompt. Add this **before** the first public
  release; older installs can't be fixed afterwards.
- **Live updates** (bundled apps): an OTA service (Capgo, Ionic Appflow, or a
  self-hosted one) can ship web-only fixes without a store release. Google Play
  allows updating JS/HTML that runs in the WebView, but not changing the app's
  core purpose. Native changes still need a store release. Use it for urgent
  fixes, not to skip review of big feature changes.
- **Backend changes must stay compatible** with the oldest supported app version.
  Add fields; don't rename or remove them until the minimum version moves past
  the old clients.
