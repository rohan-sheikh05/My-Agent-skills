# Phase 5: Architecture & setup

## Default stack (change it only when there's a reason)

- **Frontend:** React + Vite (or the user's framework: Next.js, TanStack Start,
  Vue, Svelte). TypeScript. Tailwind + shadcn/ui for accessible primitives.
  TanStack Query for server state.
- **Native shell:** Capacitor (current major). Add Android first; add iOS when
  needed (it needs a Mac for builds).
- **Backend:** choose by need:
  - Firebase (Auth + Firestore): realtime, an excellent offline cache, a generous
    free tier. The default for apps that are offline-first or have live presence.
  - Supabase: relational data, SQL, row-level security.
  - A Node.js API (Express/Fastify/Hono) on Cloudflare Workers, Vercel or Render,
    when there's custom server logic. Keep secrets on the server, never in the
    bundle.
- **Hosting for the web build:** Cloudflare Pages, Vercel or Firebase Hosting.

## Bundled vs remote web content

Capacitor can ship the built web files inside the APK (`webDir`) or load a live
URL (`server.url`).

- **Bundled (the default and recommended way):** works offline from the first
  launch, starts faster, and store reviewers see a real app. Web changes need a
  new app release (or a live-update service).
- **Remote URL:** web changes ship instantly, but you need a service worker for
  offline, there's a blank or failed first launch with no network, and pure
  "website wrapper" apps risk Play Store rejection for minimum functionality.
  Capacitor documents `server.url` as meant for live reload. If you use it anyway,
  add real native features, a precaching service worker and an offline fallback
  page, and redirect to the live site **only** when
  `Capacitor.isNativePlatform()` is true, or `localhost` dev servers will bounce
  to production.

Discuss this choice with the user. It decides how releases work.

## Setup order

1. Scaffold the web app. Pick **one** package manager and commit only its lockfile.
2. `.env.example` documenting every `VITE_*` / server variable. The code reads from
   env; never hardcode secrets.
3. Add Capacitor: choose the **app ID carefully** (`com.<owner>.<app>`; it can never
   change after publishing). Add Android.
4. Native basics: splash (hide when the app renders, with an auto-hide fallback),
   status bar following the theme, `viewport-fit=cover` + safe-area insets, a
   DayNight NoActionBar theme, app icons (adaptive + monochrome).
5. Run it **on a real phone** before building features.
6. CI: a GitHub Actions workflow that builds a signed release APK and AAB (see
   [release.md](release.md)).
7. Then build features in vertical slices.

## Native plugins commonly needed

`@capacitor/splash-screen`, `status-bar`, `haptics`, `local-notifications`,
`push-notifications` (FCM), `preferences`, `share`, `app` (back button, resume
events), `network`, `keyboard`, `@capacitor-community/in-app-review`. When no
plugin exists (battery-optimisation settings, exact-alarm checks), write a small
local Capacitor plugin in Kotlin rather than giving up on the feature.

## Project hygiene

- Keep `android/` and `ios/` in git. Before each commit, review diffs under them
  for IDE-made changes (Gradle wrapper, AGP, SDK versions).
- Keep the web build output, keystores and `keystore.properties` out of git.
