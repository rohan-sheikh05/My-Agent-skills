# Phase 2: Niche research

The purpose isn't to copy competitors. It's to learn what users in this niche
already expect (the baseline), what they love (what to do well), what they hate
(an opportunity) and what nobody does yet (where this app can stand out).

## What to research

1. **The top apps in the category.** Find 5–10 leading apps and 2–3 small
   newcomers that are growing fast. Sources: Play Store / App Store category
   rankings and search results, "best <category> apps <year>" roundups, Product
   Hunt, Reddit threads ("what app do you use for …").
2. **Reviews, especially 1–3 stars.** What users complain about (bugs, ads,
   paywalls, missing features, confusing UI, sync, notifications) and what 5-star
   reviews praise. Recent reviews matter more than old ones.
3. **Communities.** Reddit, forums and Facebook groups where the target users talk.
   What workarounds do they use? What do they say they wish existed?
4. **Patterns.** Onboarding (how fast it reaches the core action, whether it asks
   for an account up front), the core loop and its rewards, retention mechanics
   (streaks, reminders, social), navigation, and widgets or notifications.
5. **Monetization in the niche:** free with ads, freemium, subscription, one-time
   purchase. What price points users accept, and what they resent.
6. **Local and cultural context** if the audience is regional: language, script
   and fonts, cultural visual references, payment methods, typical devices, data cost.
7. **Platform and policy limits** that affect the category: health or finance
   rules, children's apps, background-execution limits, notification permissions.

## How to research

- Run several searches in parallel. Use the cheap/standard search mode first and
  deeper modes only when results are thin or out of date.
- For a big niche, split the work across subagents (competitors, reviews and
  communities, patterns and monetization). Give each a narrow scope and ask for
  sources.
- Check the claims that drive major decisions against a second source.
  Third-party star or download counts are approximate.
- **Verify policy and payment facts on the primary page**: the store's policy
  page for restricted permissions (SMS, call log, accessibility, background
  location), the store's list of payment methods per country, and the
  competitor's own listing for its features. These decide what can be built and
  how it earns money. For example, Google Play in some countries accepts cards
  only, while the audience pays with mobile wallets, so in-app purchases
  barely work there.
- **Label weak evidence.** Local forums and Facebook groups are often
  unreachable to tools. When a finding rests on news, a competitor's blog or a
  roundup instead, say so next to it.
- **End with what is still unverified** and what the user must supply (for
  example, real sample messages for a parsing feature), instead of building on
  a guessed format.
- Don't spend more than about 15–20 minutes of tool time unless the user asks for
  a deep dive.

## Output: `docs/app-brief/02-research.md`

```markdown
# <App> niche research (<date>)

## Landscape
| App | Positioning | Strengths users praise | Top complaints | Model |

## What users expect (baseline features)
## What users love (do these well)
## What users hate (avoid / opportunity)
## Gaps nobody fills well
## Patterns worth adopting (onboarding, core loop, retention, navigation)
## Monetization notes
## Local / cultural notes
## Implications for our app (5–10 bullets, ranked)
## Sources
```

The "Implications" section is the point of the whole document. Each item should
be something concrete to build, avoid or emphasize.
