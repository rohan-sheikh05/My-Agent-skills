# Pitfalls learned by trial and error

Each rule here cost real debugging time. Format: the rule, then **Why:** with the
symptom, then *(found month year)*. A tag such as `[Firebase]`, `[Cloudflare]` or
`[Expo]` marks rules that only apply to that stack; untagged rules apply to every
Capacitor app. Add new ones through the learning loop in SKILL.md. Keep them
general: describe the trap, not the project. Keep this file under about 250 lines,
and prune rules that no longer apply.

Rules below without a date were found in Oct 2026 (Capacitor 8, AGP 8.13,
Android 14–16).

## Build, CI, deploy

- **Keep one package manager and one lockfile.** **Why:** a stray `bun.lock` next
  to `package-lock.json` made Cloudflare Pages use the wrong installer.
- `[Cloudflare]` **Keep Cloudflare Pages and Workers configs in separate files.** **Why:** one
  shared `wrangler.jsonc` failed Pages validation.
- **Match CI Node/JDK versions to the framework's minimums.** **Why:** Capacitor 8
  failed on an older Node runner.
- **Check `android/` diffs for IDE upgrades before every commit; upgrade Gradle and
  AGP together.** **Why:** Android Studio silently moved the Gradle wrapper to 9.x
  inside an unrelated commit. Gradle 9.6+ removed an API that AGP 8.x uses, and
  CI broke.
- **Android resource XML comments can't contain `--`.** **Why:** a comment like
  `<!-- light -- dark -->` in `colors.xml` failed the resource merge with an
  unclear error.
- **Exclude `android/`, `ios/` and other generated folders from ESLint and
  Prettier.** **Why:** `eslint .` crawled the Gradle build output and the
  lint step seemed to hang.
- **On Windows, add `.gitattributes` with `gradlew text eol=lf`, and write
  `sdk.dir` in `local.properties` with forward slashes.** **Why:** a CRLF
  `gradlew` fails on Linux CI, and unescaped backslashes in `sdk.dir` broke the
  build.
- **When renaming an app, keep existing storage keys and check that the new name
  is free first** (Play search, domains, the web). The app ID can't change after
  the first Play upload, so confirm it with the user before that. **Why:**
  renaming `localStorage`/Preferences keys silently resets every existing
  user's settings.
- **Finish backend migrations completely** (client, packages, env, migrations,
  old field reads). **Why:** leftovers caused confusing reads from fields that no
  longer existed.

## Signing & releases

- **Never sign with a throwaway key; fail CI if the release key is missing.**
  **Why:** debug builds signed with a key generated fresh on each runner couldn't
  install over the existing app.
- **Bump the version with every native change.** **Why:** without a higher
  `versionCode`, Android refuses the update.

## WebView / Capacitor

- **Android WebView reports `navigator.onLine === true` even with no network.**
  In `MainActivity`, watch the default network with `ConnectivityManager` and call
  `webView.setNetworkAvailable(...)` (which also fires `online`/`offline`
  events). Copy `templates/android/MainActivity.java`. **Why:** offline mode never turned on; reads waited on the network
  instead of the cache.
- **When the shell redirects to a live URL, do it only inside the native app.**
  **Why:** the Vite dev server served the shell's `index.html`, so `localhost`
  bounced to production.
- **Hide the splash when the app renders, and keep an auto-hide fallback.**
  **Why:** on a slow network the app could sit on the splash.
- **Notification small icons must be white-on-transparent silhouettes** in
  `res/drawable`, configured in the LocalNotifications plugin. **Why:** Android
  showed a generic icon.
- **Bundle fonts with the app (e.g. `@fontsource`), don't link Google Fonts.**
  **Why:** the first launch offline showed fallback fonts and the layout
  shifted once a network came back.
- **Expect a theme-class hydration warning on `<html>` when a pre-paint script
  sets the theme.** Suppress that one only, and don't hide other hydration errors.

## Background work, timers, notifications

- **For timed alerts, the native scheduled notification is the source of truth.**
  If JS finishes the timer while the app is in the background, fire the
  pending alarm immediately instead of cancelling it. **Why:** JS kept running in
  the background, completed the session and cancelled the alarm, leaving only an
  in-app sound nobody heard.
- **Exact alarms are denied by default on fresh installs on Android 14+; battery
  optimisation and OEM battery managers delay alarms.** Check and request
  notification permission, exact alarms and unrestricted battery use (a small
  native plugin can report status and open each settings screen). Point users to
  App info for OEM-specific switches, and re-ask occasionally. **Why:** alarms
  arrived late or not at all.
- **Build notification text from the actual state, not the preset label.**
  **Why:** it said "Completed 25m" after the user changed the session length.
- **Make completion events idempotent across hook instances and tabs.** **Why:**
  several mounted hooks each logged the same session.

## Offline-first

The full pattern is in [offline.md](offline.md). These are the traps that were
actually hit:

- **Writes must not wait for server confirmation.** Settle when queued (or after
  a short timeout); still show online rejections. **Why:** saves hung forever
  while offline.
- `[Firebase]` **Firestore: enable the persistent (IndexedDB) cache**, and read from the cache
  when offline. **Why:** otherwise data disappears offline and queued writes are
  lost on restart.
- **React Query: `networkMode: 'offlineFirst'`.** **Why:** the default pauses
  queries offline, so screens stay stuck loading.
- **Service worker: precache the shell and build files, with a new cache per
  deploy.** **Why:** without it the app can't open offline; with a fixed cache
  name, users get stale builds.
- **Features that need a connection must say so.** **Why:** room creation hung
  silently offline.
- **Test offline on a real device.** **Why:** the WebView `onLine` bug doesn't
  show up in desktop browsers.
- **In Playwright, simulate offline by blocking only the backend (or emulator
  ports) and overriding `navigator.onLine`, not with `context.setOffline`.**
  **Why:** `setOffline` also cut off the Vite dev server, so lazy chunks failed
  and the page went blank. That failure can't happen in a bundled APK, so the
  test was measuring the wrong thing.
- `[Firebase]` **Create default documents (e.g. the profile) only from a
  server snapshot** (`!snapshot.metadata.fromCache`) that says the document
  doesn't exist. **Why:** on an offline cold start the cache is empty, and
  creating "missing" defaults would overwrite the real document when the
  device syncs.
- `[Firebase]` **On sign-out, wait for pending writes first (with a timeout)
  and refuse if they haven't synced, then `terminate`,
  `clearIndexedDbPersistence` and reload.** **Why:** signing out with queued
  offline writes discards them, and the next user can see the cached data.

## Data & auth

- **Clear every per-user cache and timer on sign-out; key local caches by user
  ID.** **Why:** the next account saw the previous user's profile and timer.
- `[Firebase]` **Firestore batches cap at 500 writes; split bulk deletes into chunks.** **Why:**
  "reset data" failed for active users.
- **Re-authenticate before password, email or account-deletion changes.** **Why:**
  Firebase rejects them with `requires-recent-login` (other auth providers have
  similar rules).
- **Store numbers as numbers; save every profile field through one update path.**
  **Why:** a weekly target saved as a string broke the goal maths, and some fields
  never saved.
- **Don't silently limit queries** (e.g. "last 30 days") when a screen promises
  full history.
- **Never put the user's personal email or other private details in public
  pages** (privacy policy, store listing, about screen). Use the store developer
  contact the user chooses. **Why:** a generated privacy page published the
  user's university email.
- **Ship security rules with the feature, and degrade gracefully until they're
  deployed.** **Why:** without that, a missing rule deployment broke the whole app
  instead of one feature.
- **Every new stored field means: update the rules, the rules tests and the backup
  restore, then tell the user the rules must be deployed again.** **Why:** strict
  rules (`keys().hasOnly`) on the server refused a new profile name and avatar;
  the app looked fine locally and failed only against the live project.
- **Offline-queued writes resolve before the server answers, so "Saved" can be a
  lie.** For saves the user watches (profile, settings), await the real write
  with a timeout when online; queue only when offline. **Why:** a toast said
  "Profile saved" next to "couldn't be saved" when the rules refused it.
- **Use the phone's local date, never `toISOString().slice(0, 10)`.** **Why:**
  east of UTC that returns yesterday until the UTC day rolls over (before 6 am in
  Bangladesh), so new entries got the wrong date.
- **Build totals and breakdowns from the data, not from today's list of
  categories/options.** **Why:** spending in retired and deleted categories was
  counted in the total but missing from the chart, so "biggest category" was
  wrong.
- **Use one set of realtime listeners for the whole app,** shared through context.
  **Why:** a listener per component multiplies reads and cost.

## UI

- **Check contrast in every theme combination, not just the default** (run
  `scripts/check-contrast.mjs`). **Why:**
  secondary labels failed AA in one theme only.
- **Never hard-code colors in components or charts; use the theme tokens.**
  **Why:** a chart's `#2563eb` and a logo's fixed navy stayed the same in dark
  mode and failed contrast there.
- **Check 360 px width.** **Why:** the most common budget Android width;
  overflow there goes unnoticed on desktop.
- **Draw avatars with real detail, not basic shapes.** Use soft shading, a light
  spot (catchlight) in the eyes, noses, ears, and eyebrows that match the hair.
  Add highlights on hair, glasses and skins, plus small niche details (e.g. a
  pencil behind the ear for a study app). **Why:** a first set made of flat
  circles and dot eyes looked cheap next to the rest of the app and had to be
  redrawn.
- **Pick avatar backgrounds by measured contrast with the figure.** List each
  avatar's outline colors (skin, hair, clothes, fur). Offer only backgrounds whose
  color difference from all of them is ≥ 35 (CIE76 ΔE in Lab). Re-filter whenever
  the user recolors a part. **Why:** backgrounds picked one by one by eye matched
  their figure (white cat on pale mint, corn on pale yellow), so the avatar
  disappeared.
- **Shade illustrations with translucent overlays, not darker hand-picked
  colors.** Use black or white at 6–25 % opacity over flat fills. **Why:** then
  shirts, hair or fur take any user-chosen color and keep their folds and
  highlights, so a color option costs no extra drawing.
- **Check avatars and icons at the sizes the app really uses** (e.g. 32 px in a
  menu, 40 px in lists, 64 px on the profile). **Why:** figures that looked fine
  at 120 px became unreadable at 32 px. Framing people closer (cropped at the
  shoulders, ~15 % zoom) fixed it.
- **Don't put a subtitle under a title when it only restates the title.** Text
  under a page, section or dialog title must carry live data (counts, totals), a
  warning or consequence, a permission explanation, or empty-state guidance.
  **Why:** lines like "Your profile and app preferences" under Settings were
  noise. They pushed content down on phones, and the user had them removed
  everywhere. The same applies to field hints, toggle hints and onboarding
  subtitles ("Shown at the top of the app", "You can type 500+250"): the user had
  to ask a second time. Default to no text; grep for `description`/`hint`/`help`
  props before shipping a screen.
- **Toast libraries (e.g. Sonner) inject unlayered CSS, which beats Tailwind v4's
  layered utilities.** Use `!` on their class names, and give them a top offset of
  the safe-area inset plus a gap. **Why:** "use the theme colour" was silently
  ignored (Undo buttons stayed black) and toasts sat over the status bar.
