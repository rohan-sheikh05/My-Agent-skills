# Standard features (the baseline every app gets where it applies)

Users expect these whatever the niche. Plan them into the MVP instead of
bolting them on later.

## Accounts & profile (multi-user apps)

- **Sign-in:** email + password and Google at minimum. Map auth errors to clear
  messages (wrong password, lockout, weak password, email in use). Password reset.
  Re-authenticate before sensitive changes (password, email, deletion).
- **Profile section** with:
  - **Customizable avatar.** Ship an illustrated set (about 12–24 SVGs, varied
    styles and expressions, e.g. people, animals, objects) that matches the app's
    visual direction, plus an optional photo upload with cropping. Generate a
    friendly default (initials or a random illustrated avatar) so nobody is a
    grey silhouette. Store the avatar ID or URL on the profile and show it
    everywhere the user appears (header, sidebar, shared spaces). Each avatar
    needs an accessible label.
  - Display name, and any niche-specific fields (goal, institution, etc.).
  - Stats or achievements if the app tracks progress.
- **Account deletion inside the app** (and a web link to request it). Google Play
  requires this for any app that creates accounts. Delete or anonymize the user's
  data properly.
- **Sign-out clears all per-user state:** caches, local storage, timers, queued
  work. Key any local cache by user ID.

## Themes (always)

Every app has **light and dark mode** and **multiple themes** in its settings.
This rule has no exceptions.

- **Mode:** Light / Dark / System. System is the default and follows the OS live.
- **Styles:** at least 3 distinct themes (e.g. the brand default, a calm or
  minimal one, a playful or high-energy one). Each has a light and a dark
  variant, so the user gets styles × modes combinations.
- **Settings > Appearance:** theme cards with a live preview of each style and a
  mode control. The change applies instantly, without a reload.
- **Implementation:** all colors come from semantic tokens (CSS variables),
  switched with `data-style` / a `dark` class on `<html>`. Never hardcode colors
  in components. A pre-paint script applies the saved choice before first render
  (no flash). Save the choice locally, and on the profile for signed-in users.
- **Native surfaces follow the theme:** status bar color and icon style, splash
  and loader background, Android system splash (DayNight), the `theme-color` meta.
- **Charts, illustrations, avatars and celebration animations** are drawn with
  theme tokens so they look right in every combination.
- Every combination must pass WCAG AA (see [quality-gates.md](quality-gates.md)).

## Settings

Appearance (theme style + light/dark/system mode, see above), notifications (per type, with
quiet hours if they make sense), language if multilingual, units or formats,
data export, reset data (with confirmation), account, about (version, developer
credit, privacy policy, terms, contact/feedback), and a permissions checklist
when the app relies on notifications or background alerts.

## First run & empty states

- Onboarding that gets to the core action fast. Prefer a "Get set up" checklist
  that ticks itself off over long intro slides.
- Every list has a helpful empty state with a primary action.
- Route loading skeletons, and error states with retry.

## Offline & sync

Assume a bad connection. Cache the data the user has seen, queue writes, show an
Offline / Syncing indicator, and say clearly when a feature needs a connection.
See the offline section of [pitfalls.md](pitfalls.md).

## Notifications

Ask for permission in context (when the user turns on a reminder), not at launch.
Use a branded white silhouette small icon. Make notification text reflect the
real state. Let the user control every notification type.

## Native feel

Haptics on key actions; the status bar and splash follow the theme; the Android
back button behaves sensibly (closes sheets and dialogs first, then goes back,
then exits); keyboard-aware forms; 44 px touch targets; bottom sheets on phones,
dialogs on larger screens; page transitions; reduced-motion support.

## Feedback & growth

In-app review prompt only after real value (e.g. the 5th completed core action, at
most once every 90 days, native only). A feedback or contact link. Share or
invite if the app is social.

## Legal & store

Privacy policy URL (required by the store), terms if accounts or payments exist,
an accurate data safety form, and age rating.

## Multi-user / social features

Security rules written *with* the feature (members-only reads, users can only
change their own data, size caps). One shared set of realtime listeners
provided through context. Presence through heartbeats with an "away" timeout.
Invite codes without ambiguous characters (0/O, 1/I/l). Test with two real
accounts.
