# Standard features (the baseline every app gets where it applies)

Users expect these whatever the niche. Plan them into the MVP instead of
bolting them on later. Two of them are standing rules from the skill's author
(themes, illustrated avatars); keep them unless the user of this skill says
otherwise.

## Accounts & profile (multi-user apps)

- **Sign-in:** email + password and Google at minimum. Map auth errors to clear
  messages (wrong password, lockout, weak password, email in use). Password reset.
  Re-authenticate before sensitive changes (password, email, deletion).
- **Profile section** with:
  - **Customizable avatar.** *Why:* identity makes shared spaces feel personal
    and gives the app character.
    - **An illustrated set** (about 12–24 SVGs: varied subjects such as people,
      animals and objects, with different expressions) drawn in the app's visual
      direction and colored with theme tokens. This is the preferred option.
      If time is short, start with 6–9 and add more later. A procedural generator
      (e.g. DiceBear) is an acceptable fallback; check the license of the specific
      style, since they vary.
      Draw them with real detail (shading, catchlights, ears and noses, hair
      highlights, niche props), never flat basic shapes. Show the set to the user
      in a preview (before/after, live color controls) before it goes into the app.
    - **Color options on top of the faces:** a background color for every avatar
      and a clothing color for people, so one face gives many looks. Only offer
      backgrounds that contrast with the figure (see `pitfalls.md` › UI). Store
      the choice in the avatar value (e.g. `person-glasses~butter~navy`), so older
      app versions can still read the id and fall back to the defaults.
    - **An optional photo upload** with cropping. Resize on the device (e.g.
      512 px), **strip EXIF** (it can contain the location), cap the size in the
      storage rules (not only in the UI), allow image types only, and only let
      the owner write to their own path. If photos are visible to other users, add
      a report/remove path.
    - **A friendly default** (initials or a random illustrated avatar), so nobody
      is a grey silhouette.
    - Store the avatar ID or URL on the profile and show it everywhere the user
      appears (header, sidebar, shared spaces). Each avatar has an accessible label.
  - Display name, and any niche-specific fields (goal, institution, etc.).
  - Stats or achievements if the app tracks progress.
- **Account deletion inside the app** (and a web link to request it). Google Play
  requires this for apps that let users create accounts. Delete or anonymize the
  user's data properly, including uploaded files.
- **Sign-out clears all per-user state:** caches, local storage, timers, queued
  work. Key any local cache by user ID.

## Themes (always)

**This is the single source of truth for the theme rule.** Every app has **light
and dark mode** and **multiple themes** in Settings, with no exceptions. *Why:*
phones are used in very different light, people have strong taste, and with
tokens the extra themes are cheap.

- **Mode:** Light / Dark / System. System is the default and follows the OS live.
- **Styles:** at least 3 distinct themes (e.g. the brand default, a calm or
  minimal one, a playful or high-energy one), each with a light and a dark variant.
  Extra styles are **token sets only** (palette, radius, maybe fonts). Layouts and
  components stay shared.
- **Settings > Appearance:** theme cards with a live preview of each style and a
  mode control. The change applies instantly, without a reload.
- **Implementation:** start from `templates/web/theme-tokens.css`. All colors come
  from semantic tokens (CSS variables), switched with `data-style` and a `dark`
  class on `<html>`. Never hardcode colors in components. A pre-paint script
  applies the saved choice before first render (no flash). Save the choice
  locally, and on the profile for signed-in users.
- **Native surfaces follow the theme:** status bar color and icon style, splash
  and loader background, Android system splash (DayNight), the `theme-color` meta.
- **Charts, illustrations, avatars and celebration animations** are drawn with
  theme tokens so they look right in every combination.
- **Contrast:** `scripts/check-contrast.mjs` must pass for every style × mode
  (see [quality-gates.md](quality-gates.md)).

## Settings

Appearance (style + mode, see above), notifications (per type, with quiet hours
if they make sense), language if multilingual, units or formats, data export,
reset data (with confirmation), account, about (version, developer credit,
privacy policy, terms, contact/feedback), and a permissions checklist when the
app relies on notifications or background alerts
(`templates/android/NativeSettingsPlugin.java`).

## Language & locale

- **Externalize every UI string from day one** (i18next, Lingui, or a typed
  dictionary), even for a single-language app. Retrofitting is painful.
- Fonts that cover every script in use (e.g. Hind Siliguri or Noto Sans Bengali
  for Bangla), self-hosted and subset.
- Format numbers, dates and plurals with `Intl` for the locale (Bangla numerals,
  Bengali month names and so on, if the user wants them). Never build dates by
  concatenating strings.
- Leave room for longer text (German, Bangla conjuncts), and check line height
  for scripts with marks above and below.

## First run & empty states

- Onboarding that gets to the core action fast. Prefer a "Get set up" checklist
  that ticks itself off over long intro slides.
- Every list has a helpful empty state with a primary action.
- Route loading skeletons, and error states with retry.

## Offline & sync

Follow [offline.md](offline.md): local data, an outbox, idempotent writes, sync
on reconnect, a conflict policy and an Offline / Syncing indicator.

## Notifications

Ask for permission in context (when the user turns on a reminder), not at launch.
Use a branded white silhouette small icon. Make notification text reflect the
real state. Let the user control every notification type. Time-critical alerts
need the exact-alarm and battery checks (see [pitfalls.md](pitfalls.md)).

## Native feel

Haptics on key actions; the status bar and splash follow the theme; the Android
back button behaves sensibly (closes sheets and dialogs first, then goes back,
then exits; check predictive back, see [versions.md](versions.md));
keyboard-aware forms; 44 px touch targets; bottom sheets on phones, dialogs on
larger screens; page transitions; reduced-motion support.

## Payments (if the app makes money)

- **Digital goods and features used inside the app** (premium unlock,
  subscriptions, coins) must use **Google Play Billing** on Play (App Store IAP on
  iOS). Use a wrapper such as RevenueCat or a maintained Capacitor billing plugin,
  and verify purchases on a server.
- **Physical goods and real-world services** (deliveries, tuition fees, tickets)
  may use other payment methods, including local ones (e.g. bKash, Nagad, SSLCommerz
  in Bangladesh) through their web checkout or SDK.
- Restore purchases, show prices from the store (not hardcoded), and handle
  cancelled or pending payments. Check the current Play payments policy before
  release; it varies by country.

## Feedback & growth

In-app review prompt only after real value (e.g. the 5th completed core action, at
most once every 90 days, native only). A feedback or contact link. Share or
invite if the app is social.

## Legal & store

Privacy policy URL (required by the store), terms if accounts or payments exist,
an accurate data safety form, and age rating.

## Operations

Crash reporting, a force-update check and backend compatibility rules: see
[engineering.md](engineering.md).

## Multi-user / social features

Security rules written *with* the feature (members-only reads, users can only
change their own data, size caps). One shared set of realtime listeners
provided through context. Presence through heartbeats with an "away" timeout.
Invite codes without ambiguous characters (0/O, 1/I/l). Test with two real
accounts.
