# Phase 5: Architecture & setup

## Capacitor or Expo?

Capacitor (a WebView) is the default. For heavy apps (gesture-heavy animation,
maps/camera/AR as the core feature, huge feeds, heavy background work, a strongly
native look), recommend Expo/React Native and explain the trade-off. The user
decides. The criteria and the Expo setup are in [expo.md](expo.md). The rest of
this file is the Capacitor path.

## Default stack (change it only when there's a reason)

- **Frontend:** React + Vite (or the user's framework: Next.js static export,
  TanStack Start in SPA mode, Vue, Svelte). TypeScript. Tailwind + shadcn/ui for
  accessible primitives. TanStack Query for server state.
- **Native shell:** Capacitor (current major, see [versions.md](versions.md)).
  **Android first.** Add iOS when the user needs it (it needs a Mac or a cloud Mac
  build, plus an Apple developer account).
- **Backend:** choose by need:
  - Firebase (Auth + Firestore): realtime, an excellent offline cache, a generous
    free tier. **The default** for single-developer apps that are offline-first or
    have live presence, because it removes the most work.
  - Supabase: relational data, SQL, row-level security. Build the offline layer
    yourself ([offline.md](offline.md)).
  - A Node.js API (Express/Fastify/Hono) on Cloudflare Workers, Vercel or Render,
    when there's custom server logic. Keep secrets on the server, never in the
    bundle.
- **Hosting for the web build** (if there's also a website): Cloudflare Pages,
  Vercel or Firebase Hosting.

## Bundled vs remote web content

Capacitor can ship the built web files inside the APK (`webDir`) or load a live
URL (`server.url`).

- **Bundled (the default and recommended way):** works offline from the first
  launch, starts faster, and store reviewers see a real app. Web changes need a
  new app release (or a live-update service, see [engineering.md](engineering.md)).
  Needs a client-rendered build (SPA / static export). SSR routes don't run
  inside the APK.
- **Remote URL:** web changes ship instantly, but you need a precaching service
  worker for offline (`templates/web/`), there's a blank or failed first launch
  with no network, and pure "website wrapper" apps risk Play Store rejection for
  minimum functionality. Capacitor documents `server.url` as meant for live reload.
  If you use it anyway, add real native features, a service worker and an offline
  fallback page, and redirect to the live site **only** when
  `Capacitor.isNativePlatform()` is true, or `localhost` dev servers will bounce
  to production. Old app builds will load the newest site, so feature-detect
  native plugins (`Capacitor.isPluginAvailable`).

Discuss this choice with the user. It decides how releases work.

## Setup order

1. Scaffold the web app. Pick **one** package manager and commit only its lockfile.
   Pin the Node version (`.nvmrc`).
2. `.env.example` documenting every `VITE_*` / server variable. The code reads from
   env; never hardcode secrets.
3. Add Capacitor: choose the **app ID carefully** (`com.<owner>.<app>`; it can never
   change after publishing). Add Android.
4. Native basics:
   - splash: hide it when the app renders, with an auto-hide fallback
   - status bar following the theme
   - **edge-to-edge**: enforced from target API 35. Use `viewport-fit=cover`
     plus CSS `env(safe-area-inset-*)`, and configure Capacitor's SystemBars insets
     handling. Check the current docs ([versions.md](versions.md)).
   - a DayNight NoActionBar theme
   - app icons (adaptive + monochrome) and a white notification icon
   - `templates/android/MainActivity.java` for real offline detection
5. Release signing (`templates/android/signing.gradle`) and CI
   (`templates/ci/build-android.yml`) before the first build you share.
6. Run it **on a real phone** before building features.
7. Then build features in vertical slices.

## Native plugins commonly needed

`@capacitor/splash-screen`, `status-bar`, `haptics`, `local-notifications`,
`push-notifications` (FCM), `share`, `app` (back button, resume events,
version info), `network`, `keyboard`, `browser`, a secure-storage plugin for
tokens, `@capacitor-community/in-app-review`. Use `preferences` only for
non-sensitive settings.

When no plugin exists, write a **small local plugin** (Java or Kotlin, a few
methods, no business logic) rather than dropping the feature. Start from
`templates/android/NativeSettingsPlugin.java`, which already covers
notifications, exact alarms and battery optimisation.

## Project hygiene

- Keep `android/` and `ios/` in git. Before each commit, review diffs under them
  for IDE-made changes (Gradle wrapper, AGP, SDK versions).
- Keep the web build output, keystores and `keystore.properties` out of git.
