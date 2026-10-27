# Versions and store requirements (dated, so check them)

**Last checked: 2026-10-27.** These values go stale. At the start of a project and
again before every release, look up the current values (official docs first) and
update this file with the new date. Don't trust it blindly.

| Item | Value when checked | Where to verify |
|---|---|---|
| Capacitor | 8.x | capacitorjs.com/docs/updating, its release notes |
| Node for the Capacitor 8 CLI / CI | 22 | Capacitor "Environment setup" docs |
| JDK for Android builds | 21 | Capacitor Android docs, the AGP release notes |
| Android Gradle Plugin ↔ Gradle | AGP 8.13 needs Gradle 8.x; Gradle 9.6+ breaks it | developer.android.com/build/releases/gradle-plugin (compatibility table) |
| Play target API, new apps and updates | API 36 (Android 16) from 2026-08-31; extension possible to 2026-11-01 | developer.android.com/google/play/requirements/target-sdk |
| Play target API, existing apps stay visible | API 35+ | same page |
| New *personal* Play developer accounts | closed test with ≥ 12 testers opted in for 14 continuous days before production access (organization accounts exempt) | Play Console Help, "App testing requirements for new personal developer accounts" |
| Edge-to-edge | enforced when targeting API 35+; the opt-out is gone at API 36 | Android 15/16 behavior changes; Capacitor SystemBars docs |
| Predictive back | on by default for apps targeting API 36 | Android 16 behavior changes; check that the Capacitor App plugin `backButton` still behaves |
| Expo SDK | look up the current one | docs.expo.dev/versions |

## Rules

- When a value here is older than about 3 months, re-check before relying on it.
- Write any changed value back here with the date, and add a pitfall if the
  change broke something.
- Pin the exact tool versions in the project (`.nvmrc`, Gradle wrapper, AGP
  version), and upgrade them deliberately, in their own commit.
