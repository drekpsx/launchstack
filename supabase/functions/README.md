# Stripe edge functions

These three functions are written and ready, but inactive until Stripe is connected. Wiring them up:

1. Create a Stripe account and a recurring Price for the Pro plan.
2. Set these as Supabase Edge Function secrets (`supabase secrets set …` or the dashboard):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET` (from the webhook endpoint you create in Stripe, pointed at `stripe-webhook`)
   - `STRIPE_PRICE_ID_PRO`
   - `APP_URL` (e.g. `https://yourapp.com`)
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (usually already set by Supabase)
3. Deploy: `supabase functions deploy create-checkout-session create-portal-session stripe-webhook`
4. In Stripe, add a webhook endpoint pointing at the deployed `stripe-webhook` URL, subscribed to
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
5. From the frontend, call `supabase.functions.invoke("create-checkout-session")` (e.g. from the
   "Upgrade to Pro" button) and redirect the browser to the returned `url`.

Until these secrets exist, `create-checkout-session` and `create-portal-session` respond `501` and the
frontend's "Upgrade to Pro" buttons simply link to `/pricing` / show a "coming soon" state.
