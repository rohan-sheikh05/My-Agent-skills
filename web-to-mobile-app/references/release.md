# Phase 8: Release

Store rules and tool versions change. Check [versions.md](versions.md) and the
official pages before each release.

## Signing (Android)

- Create **one upload keystore** per app (`keytool -genkeypair -v -keystore
  release.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000`).
- **Enroll in Play App Signing** (the default for new apps). Google keeps the real
  app signing key, and your keystore is only the *upload* key. If the upload key
  is lost or leaked, the account owner can ask Google to reset it. Without Play App
  Signing (sideloaded APKs, other stores), losing the key really does mean
  existing installs can never be updated. **Either way, back up the keystore and
  its passwords in two safe places.**
- Never commit the keystore or `keystore.properties`. Local builds read
  `android/keystore.properties`; CI reads GitHub secrets. Templates:
  `templates/android/signing.gradle` and `templates/ci/build-android.yml`.
- CI must **fail** if the keystore secret is missing. Never fall back to a
  throwaway or debug key, because builds signed differently can't install over
  each other.

## Versioning

- Bump `versionCode` (+1) and `versionName` on every release that changes native
  code, plugins, permissions, icons, splash or the manifest. Keep the iOS
  `CURRENT_PROJECT_VERSION` / `MARKETING_VERSION` in step.
- Put the version bump in the same commit as the native change, and name it in the
  commit subject ("…; 1.3 (build 4)").
- Raise the force-update minimum version ([engineering.md](engineering.md)) only
  when old builds really can't work any more.

## CI (GitHub Actions)

`templates/ci/build-android.yml`: Node and JDK per [versions.md](versions.md),
`gradle/actions/setup-gradle`, the runner's preinstalled Android SDK, `npm ci`,
typecheck/lint/test, the web build, `npx cap sync android`, decoding the keystore,
and `./gradlew assembleRelease bundleRelease`. It uploads the APK (for
sideloading) and the AAB (for Play). Keep the Gradle wrapper on the version the
Android Gradle Plugin supports, and upgrade them together in their own commit.

## Play Store checklist

- [ ] App ID final, app name, short and full description (written from the
      research: lead with the problem it solves).
- [ ] Icon 512×512, feature graphic 1024×500, phone screenshots (with captions);
      a promo video is optional.
- [ ] Privacy policy URL; data safety form (including crash reporting and
      analytics); content rating; target audience.
- [ ] Account deletion in the app plus a web URL (if the app has accounts).
- [ ] Target API level meets Play's current requirement ([versions.md](versions.md)).
- [ ] Permissions justified. Exact alarms, battery optimisation, notifications
      and background location each need a real use; Play reviews
      `USE_EXACT_ALARM` / `SCHEDULE_EXACT_ALARM` and
      `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`.
- [ ] In-app products set up in Play Console if the app sells digital goods.
- [ ] Testing tracks: internal → closed → production. A new **personal**
      developer account must run a closed test with at least 12 testers for 14
      days before it can apply for production. Plan for this time.

## iOS (when needed)

Android comes first. Add iOS when the user asks for it.

- Needs an Apple Developer account and a Mac (or a cloud Mac build such as EAS,
  Codemagic, or GitHub's macOS runners).
- `npx cap add ios`; set the bundle ID, signing team, icons and splash in Xcode;
  add usage-description strings for every permission (camera, photos,
  notifications…), or App Review rejects the build.
- Sign in with Apple is required if the app offers other social sign-ins (with
  some exceptions), and there's a privacy "nutrition label" and an account
  deletion requirement.
- Test on a real iPhone: safe areas, the keyboard, push notifications (APNs key in
  Firebase), and background limits, which are stricter than on Android.
- Distribute with TestFlight first, then App Review.
