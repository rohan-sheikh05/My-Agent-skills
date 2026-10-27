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
12. **Timeline and the first release target:** a sideloaded APK for friends, closed
    testing, or the public Play Store?

## Round 4: taste (can come after research)

13. Apps they love using, and why.
14. Feel: calm, playful, premium, cultural or local, minimal, bold?
15. Anything they definitely don't want.

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
- Success looks like: (3 measurable signs)
- Out of scope for v1:
- Open questions:
```

Read the brief back in 5–8 lines and get it confirmed before researching.
