# Lobby website

A full web client for the backend: marketing landing page, auth, the LFG
board, automatic matchmaking, real-time chat, and a profile page with real
Stripe checkout wired to the backend's `/subscriptions/checkout` endpoint.

## Run it

```bash
npm install
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm run dev
```

Needs the backend running (see the `gamer-match-app` project) — auth, the
board, matchmaking, chat, and checkout all call it directly from the browser.

## What's here

- `/` — marketing landing page (hero, how-it-works, pricing)
- `/login`, `/signup` — auth, stores the JWT in `localStorage`
- `/app/board` — browse and post to the LFG board
- `/app/board/new` — create a post
- `/app/for-you` — automatic matchmaking suggestions
- `/app/matches` — your active matches
- `/app/matches/[id]` — real-time chat via Socket.io, same events the mobile app uses
- `/app/profile` — your games, subscription tier, and **live Stripe Checkout buttons** for Plus/Pro

Everything under `/app/*` is guarded by `app/app/layout.tsx`, which redirects
to `/login` if there's no valid session.

## Design system

**Color** — dark-and-moody direction: near-black surfaces, one violet brand
color, one warm amber accent reserved for highlights. Tokens live in
`app/globals.css` as CSS variables and are **kept in sync by hand** with
`src/theme/palette.ts` in the iOS app — same hex values, same names,
translated to each platform's convention. If you change one, change the other.

**Type** — three faces, each with one job:
- **Bricolage Grotesque** (display) — headlines only, used with restraint
- **IBM Plex Sans** (body) — everything you read
- **IBM Plex Mono** (utility) — skill-bracket readouts, stat labels, the eyebrow above the headline.

**Signature element** — the `SkillBracket` component in the hero isn't a
generic gradient graphic. It's a literal small version of what the app does:
two players' accepted skill ranges shown as overlapping bars, with the
overlap — the actual match — called out and pulsing.

**Theme switching** — light/dark/auto, same three-way model as the iOS app,
persisted to `localStorage`, applied before first paint via a blocking
inline script so there's no flash of the wrong color on load.

## Known gaps to close before launch

- The pricing cards on the landing page send existing-tier clicks to `/app/profile`, which redirects to `/login` if you're signed out — but after login it lands you on `/app/board`, not back on the pricing intent. Minor UX polish, not a blocker.
- No password reset flow yet.
- No account settings page (edit bio/region/avatar) — the mobile app also stubs this the same way.

