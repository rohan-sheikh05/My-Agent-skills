# Expo / React Native route (for heavy apps)

Capacitor runs the app in a WebView, which is fine for most apps (forms, lists,
dashboards, content, trackers). Some apps hit WebView limits. For those,
recommend **Expo (React Native)**. It's still React and JavaScript/TypeScript,
but it renders real native views.

## When to recommend Expo instead of Capacitor

Recommend Expo when **two or more** of these are true, or one is central to the app:

- Gesture-driven animation everywhere (swipe decks, drag-and-drop canvases,
  physics-based interactions) that must run at 60–120 fps on budget phones.
- Maps with many markers, camera/AR/ML on the camera feed, video editing, or
  audio processing as the core feature.
- Very long or complex lists and feeds (social feeds, chat with thousands of
  messages, media grids).
- Heavy background work: location tracking, background sync, Bluetooth, health data.
- A strongly platform-native look and feel is required.
- Widgets, App Clips or deep OS integration are part of the MVP.

Stay with **Capacitor** when the app is mostly forms, lists, content and charts,
when an existing web app or website should be reused, or when one codebase must
also ship as a website.

**Always explain the trade-off and let the user choose**, then record the choice in
`03-direction.md`. Expo means no shared website from the same code (unless you use
Expo web, which is limited), and a different styling and testing setup.

## What stays the same

Phases 1–4 (discovery, research, direction, skill plan), the standard features
(including **themes: light/dark + at least 3 styles**, avatars, account deletion,
sign-out clearing data), the offline pattern in [offline.md](offline.md), the
quality gates, the engineering baseline, release signing principles and the
learning loop.

## What changes

| Area | Expo approach |
|---|---|
| Project setup | `npx create-expo-app@latest` (TypeScript); Expo Router for file-based navigation (tabs + stacks) |
| Styling & themes | One `theme/tokens.ts`: semantic tokens per style × mode, provided through context. NativeWind (Tailwind) or a typed StyleSheet. Follow the system color scheme with `useColorScheme()`. Check contrast with `scripts/check-contrast.mjs` by exporting tokens to CSS variables, or check the token pairs with the same pair list |
| Native look | Safe areas (`react-native-safe-area-context`), `expo-status-bar`, `expo-splash-screen`, `expo-haptics`, `expo-system-ui` |
| Animation | `react-native-reanimated` + `react-native-gesture-handler`; respect `AccessibilityInfo.isReduceMotionEnabled` |
| Lists | `FlashList` for long lists |
| Notifications | `expo-notifications` (local + push). The same Android exact-alarm and battery pitfalls apply |
| Offline storage | `expo-sqlite` or MMKV for local data + the outbox pattern; Firestore's RN SDK cache or `@react-native-firebase` |
| Secure storage | `expo-secure-store` for tokens |
| Builds & signing | EAS Build (`eas build -p android`) with EAS-managed credentials, or your own keystore; the same "back up the key, use Play App Signing" rules |
| Updates | EAS Update for JS-only OTA fixes, with a runtime-version policy so updates only reach compatible native builds |
| Native code | Config plugins and Expo Modules instead of editing `android/` by hand; use a development build (not Expo Go) once you add native modules |
| Testing | Jest + React Native Testing Library; Maestro for E2E flows |

## Expo pitfalls

Add these through the learning loop as they are found. Starting points to verify:

- Expo Go can't run custom native modules, so switch to a development build early.
- Bump the runtime version for any native change, or EAS Update can push JS that
  crashes on old binaries. *(verify against the current EAS docs)*
- Keep `app.json` / `app.config.ts` the source of truth for icons, splash,
  permissions and version. Edits made by hand under `android/` get overwritten by
  prebuild.
