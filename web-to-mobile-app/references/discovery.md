# Phase 1: Discovery

The goal is to understand the app well enough that every later decision can be
traced back to the user and the problem. Ask the questions in rounds of at most 4.
Offer options when you can guess likely answers, so the user can just tap one.

## Round 1: what and why (always)

1. **What is the app?** One sentence, in the user's own words.
2. **What problem does it solve?** What do people do today instead, and what's
   painful about that?
3. **Who is it for?** Age range, occupation or life stage, tech comfort, country
   and language(s), device (budget Android? iPhone?), connectivity (often offline,
   or on slow data?).
4. **What's the goal?** A personal project, portfolio piece, startup, a client's
   or organization's tool, or a class project? Is making money a goal?

## Round 2: shape of the product

5. **The one thing a user must be able to do** in the first minute (the core action).
6. **How often will people use it**, and in what situation (on a commute, at a desk,
   in a class, during work)? This decides session length and notification design.
7. **Single user or multi-user?** Accounts? Sharing, groups, chat, leaderboards?
8. **Platforms:** Android only, or iOS too? Is a web version needed as well?

## Round 3: constraints

9. **Existing assets:** a name, logo, colors, an existing website, an existing
   backend or database?
10. **Budget for services:** must it run on free tiers only (Firebase Spark,
    Supabase free, Cloudflare free)?
11. **Data sensitivity:** health, money, children, location? (This affects backend
    choice, privacy policy and the store's data safety form.)
12. **Timeline and distribution:** a sideloaded APK for friends, closed testing,
    the public Play Store, other stores (Galaxy Store, Huawei AppGallery, F-Droid),
    or an internal organization app? Note that a new personal Play account needs a
    closed test before production (see versions.md).
13. **Payments:** free, ads, one-time unlock, subscription? Which payment methods do
    the users actually have (cards, local wallets like bKash/Nagad, carrier
    billing)? Digital goods sold inside the app must use Play Billing / App Store
    IAP.

## Round 4: taste (can come after research)

14. Apps they love using, and why.
15. Feel: calm, playful, premium, cultural or local, minimal, bold?
16. Anything they definitely don't want.

## Brief template: `docs/app-brief/01-brief.md`

```markdown
# <App name>: brief
- One-liner:
- Problem today:
- Primary users: (persona: who, context, device, connectivity, language)
- Secondary users:
- Goal of the project: (and the monetization stance)
- Core action (first minute):
- Usage pattern: (how often, where, how long)
- Single or multi-user: (accounts, social features)
- Platforms:
- Constraints: (budget, data sensitivity, existing assets, deadline)
- Distribution & payments: (stores, release target, money model, payment methods)
- Languages: (UI languages, scripts, number/date formats)
- Success looks like: (3 measurable signs)
- Out of scope for v1:
- Open questions:
```

Read the brief back in 5–8 lines and get it confirmed before researching.
