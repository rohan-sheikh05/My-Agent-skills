# Phase 8: Release (Android first)

## Signing

- Create **one release keystore** per app (`keytool -genkeypair … -validity 10000`).
  Back it up in two safe places along with its passwords. Losing it means
  the app can never be updated. Enroll in Play App Signing as well.
- Never commit the keystore or `keystore.properties`. Local builds read
  `android/keystore.properties`; CI reads GitHub secrets
  (`ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`,
  `ANDROID_KEY_PASSWORD`).
- CI must **fail** if the keystore secret is missing. Never fall back to a
  throwaway or debug key, because builds signed differently can't install over
  each other.

## Versioning

- Bump `versionCode` (+1) and `versionName` on every release that changes native
  code, plugins, permissions, icons, splash or the manifest. Keep the iOS
  `CURRENT_PROJECT_VERSION` / `MARKETING_VERSION` in step.
- Put the version bump in the same commit as the native change, and name it
  in the commit subject ("…; 1.3 (build 4)").

## CI (GitHub Actions)

- Node version per the Capacitor major (Capacitor 8 needs Node 22), JDK 21,
  `gradle/actions/setup-gradle`, the runner's preinstalled Android SDK, then
  `npm ci`, the web build, `npx cap sync android`, decoding the keystore, and
  `./gradlew assembleRelease bundleRelease`. Upload the APK (for sideloading) and
  the AAB (for Play) as artifacts.
- Keep the Gradle wrapper on the version the Android Gradle Plugin supports.
  Upgrade them together, in their own commit.

## Play Store checklist

- [ ] App ID final, app name, short and full description (written from the
      research: lead with the problem it solves).
- [ ] Icon 512×512, feature graphic 1024×500, phone screenshots (with captions);
      a promo video is optional.
- [ ] Privacy policy URL; data safety form; content rating; target audience.
- [ ] Account deletion in the app plus a web URL (if the app has accounts).
- [ ] Target SDK meets Play's current requirement.
- [ ] Permissions justified (exact alarm, battery optimisation and notification
      permissions each need a real use; Play reviews `USE_EXACT_ALARM` /
      `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`).
- [ ] Internal testing → closed testing (new personal developer accounts need
      a closed test with testers for a set period before production) →
      production.
