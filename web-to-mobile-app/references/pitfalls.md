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
- **Ship security rules with the feature, and degrade gracefully until they're
  deployed.** **Why:** without that, a missing rule deployment broke the whole app
  instead of one feature.
- **Use one set of realtime listeners for the whole app,** shared through context.
  **Why:** a listener per component multiplies reads and cost.

## UI

- **Check contrast in every theme combination, not just the default** (run
  `scripts/check-contrast.mjs`). **Why:**
  secondary labels failed AA in one theme only.
- **Check 360 px width.** **Why:** the most common budget Android width;
  overflow there goes unnoticed on desktop.
