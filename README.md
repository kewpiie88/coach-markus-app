# Coach Markus – Web App (Next.js + Supabase + Stripe)

test: Deployed with Vercel

A polished, low-cost web app for tiered online coaching with:
- Email login (magic link)
- Tiers (Beginner/Intermediate/Advanced/PRO)
- Stripe Checkout (Apple Pay works out-of-the-box)
- Check-ins with points + streaks
- Weekly Leaderboard (auto-computed view)
- Video Library per tier (YouTube Unlisted embeds)
- Simple Admin page for adding exercises/videos

## 0) Prereqs

- Node.js 18+ and npm
- Stripe account
- Supabase project

## 1) Setup Supabase

1. Create a new project at https://app.supabase.com
2. Go to SQL Editor and run the SQL in `supabase/schema.sql`
3. In Authentication → Providers:
   - Email sign-in: **Enable** "Magic Link/Email"
4. Settings → URL: Add your site URL (for local dev use http://localhost:3000)
5. Get keys from Settings → API:
   - Project URL
   - anon public key
   - service_role key (server only)

## 2) Configure env

Copy `.env.example` to `.env.local` and fill in values:

```
cp .env.example .env.local
```

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`: from Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: from Supabase (server only)
- `STRIPE_SECRET_KEY`: from Stripe
- `NEXT_PUBLIC_SITE_URL`: http://localhost:3000 for local dev
- `NEXT_PUBLIC_PRICE_*`: Create Prices for each tier in Stripe and paste IDs

## 3) Install and run

```
npm install
npm run dev
```

Visit http://localhost:3000

## 4) Stripe setup

- Products: Beginner, Intermediate, Advanced, PRO
- Create *recurring monthly* prices. Copy price IDs into `.env.local`
- **Webhook**: In Stripe CLI or Dashboard, set endpoint to:
  `http://localhost:3000/api/stripe/webhook`
- Listen for `checkout.session.completed`

## 5) Deploy

- Push to a GitHub repo
- Deploy to Vercel (import repo)
- Add all environment variables to Vercel → Project Settings → Env Vars
- In Supabase, set **Site URL** to your deployed domain
- Update Stripe webhook to your production URL

## 6) Admin Tips

- After you sign in the first time, in Supabase SQL run:
```
update public.profiles set role = 'admin' where id = '<your-auth-user-uuid>';
```
- Then visit `/admin` to seed exercises/videos easily.

---

## Folder Map

- `app/` – Next.js app routes
- `lib/supabase/` – server/client helpers
- `components/` – small UI components
- `supabase/schema.sql` – tables, RLS policies, views

You got this. 🩷
