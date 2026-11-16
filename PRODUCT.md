# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

SwarpPay is an internship test project, not a shipping product. There is no real audience. Work is reviewed by the people assessing the internship, who will compare the build against the Figma design.

## Product Purpose

The project is a fiat and crypto wallet ("Send and receive money in fiat or crypto. Fast. Secure. Borderless."). Its scope is the onboarding flow and a Home screen. Success means a faithful, working build of the Figma screens with a sound, secure backend behind them.

## Positioning

Undecided. Do not invent a differentiator, market, or claim.

## Operating Context

- Onboarding flow: `/signup` → `/verify-email` → `/citizenship` → `/creating-wallet` → `/passcode` → `/confirm-passcode` → Home (`/`). There is also a `/login` screen.
- Home includes setup progress, remaining steps (identity, top-up, swap), the wallet summary, quick actions, an empty transactions state, and token performance. All of it runs on mock data from `frontend/src/lib/data.ts`.
- The backend (Express, TypeORM, Postgres) is described in `backend/plan.md`.

## Capabilities and Constraints

- Only the onboarding flow is implemented. The Wallet, Transactions, Rewards and Settings nav items have no screens yet.
- Email OTP is a frontend mock. The backend never verifies email ownership.
- The wallet is a placeholder Solana-looking address with no private key.
- Sessions use a JWT in an httpOnly cookie. The 6-digit passcode is hashed on the server.
- Localized in English and Russian (`frontend/src/i18n/dictionaries/`). Layouts must hold up with Russian string lengths.

## Brand Commitments

- Name: SwarpPay (the copy also writes "Swarp Pay").
- **Figma is the visual source of truth.** Tokens in `frontend/src/app/globals.css` follow the Figma style names. Design work matches the Figma file and does not invent a new look.

## Evidence on Hand

There is none. No customers, testimonials, metrics, pricing, or press exist, and none may be fabricated.

## Product Principles

1. Fidelity to Figma comes before reinterpretation.
2. Security-sensitive steps (password, passcode, session) stay honest about what they do and do not protect.
3. Unbuilt features stay visibly unbuilt rather than faked.
