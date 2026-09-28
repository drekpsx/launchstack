# Launchstack — AI E-commerce OS

A personalization system for e-commerce entrepreneurs: answer a guided business questionnaire, and get a
workspace of personalized AI prompts and step-by-step workflows to use with your own ChatGPT, Claude, or any
other AI tool.

**Launchstack never calls an AI API.** Everything — module selection, template relevance, workflow steps and the
final prompt text — comes from a deterministic rules engine and admin-editable templates stored in Postgres. You
copy the personalized prompt and run it yourself in the AI tool of your choice.

## How it works

```
Sign up → Business questionnaire → Business Profile → Personalization engine
  → Recommended modules & workflows → Template engine (variable substitution)
  → Personalized prompt → Copy → Paste into ChatGPT / Claude
```

## Stack

- **Frontend**: Vite, React, TypeScript, React Router, TanStack Query, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Postgres + Auth + Row Level Security + Edge Functions)
- **Billing**: Stripe, wired through Supabase Edge Functions (see `supabase/functions/README.md`) — inactive
  until Stripe keys are configured

## Project structure

- `src/config/` — questionnaire options, plan/pricing config, app-wide constants (edit these instead of hunting
  through components for hardcoded values)
- `src/lib/templateEngine.ts` — turns a Business Profile into `{{variable}}` values and renders prompt content
- `src/lib/personalizationEngine.ts` — deterministic rules for recommended modules + relevance scoring
- `src/hooks/` — Supabase-backed React Query hooks (auth, profile, content, favorites/history)
- `src/pages/` — marketing site, onboarding wizard, user dashboard, admin console
- `supabase/migrations/` — full schema + seed content (12 modules, 44+ templates, 5 workflows)
- `supabase/functions/` — Stripe checkout/portal/webhook edge functions (see that folder's README)

## Local development

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your Supabase project's URL/anon key (the existing `.env` already
points at a connected project). Apply the SQL files in `supabase/migrations/` to your Supabase project (via the
Supabase CLI, `supabase db push`, or by running them in the SQL editor) to get the full schema and seed content.

To get admin access, sign up normally, then insert a row into `user_roles` for your user with `role = 'admin'`
and visit `/admin/login`.

## Free / Pro

Plan features and limits are centralized in `src/config/plans.ts` — no prices are hardcoded elsewhere. Every
`prompt_templates` row has a `premium` flag; free users see the prompt but it's locked until they upgrade.

## Testing

```sh
npm run test
```
