# Digital Heroes — Golf Performance & Charity Draw Platform (Level 1)

A subscription-driven web application combining golf performance tracking (Stableford format), charity fundraising, and a monthly draw-based reward engine. Built to feel emotionally engaging, sleek, and modern, deliberately avoiding traditional golf website clichés (*"Feel, not fairway"*).

Designed and developed strictly according to the **Digital Heroes PRD (Level 1 Edition 2026)**.

---

## 🌟 Key Features & Requirements Coverage Matrix

| PRD Section | Module | Implementation Details |
|---|---|---|
| **§ 03 User Roles** | 3 Distinct Access Boundaries | **Public Visitor**, **Registered Subscriber**, and **Administrator** with instant 1-click evaluator switcher. |
| **§ 04 Subscription & Payment** | Full Lifecycle System | Monthly (\$19) & Yearly (\$180, 20% discount), renewal, cancellation, lapsed states, and real-time validation. |
| **§ 05 Score Management** | Rolling 5-Score Roster | 1–45 Stableford points, unique date check (rejects duplicates), reverse-chronological display, and auto-replacement of oldest score. |
| **§ 06 Draw & Reward** | Dual Draw Engine | Standard **Random Lottery** and Score-Frequency **Algorithmic** weighted sampling. Admin simulation before publish. |
| **§ 07 Prize Pool Logic** | Auto-calculated Tiers | 40% Tier 1 (5 matches with **Jackpot Rollover**), 35% Tier 2 (4 matches), 25% Tier 3 (3 matches). Split equally among tier winners. |
| **§ 08 Charity System** | Giving & Discovery | Min. 10% contribution from subscription, slider up to 100%, independent direct donations, directory search/filter, and upcoming golf day events. |
| **§ 09 Winner Verification** | Integrity Audit Flow | Winners upload scorecard screenshots (Garmin/Golfshot/Club app), admin audit queue (Approve/Reject with notes), and payout state transitions (`Pending` → `Paid`). |
| **§ 10 User Dashboard** | All 5 Mandated Modules | Active subscription status & renewal, score entry & rolling list, selected charity & giving rate, participation summary, and winnings overview. |
| **§ 11 Admin Dashboard** | 5 Operational Surfaces | Surface 01: User Management & Score Overrides<br/>Surface 02: Draw Engine & Simulation<br/>Surface 03: Charity Listings & Outings CRUD<br/>Surface 04: Winner Verification & Payout Queue<br/>Surface 05: Reports & Analytics |
| **§ 12 UI/UX Aesthetics** | *"Feel, not fairway"* | Elevated dark obsidian palette (`#080c14`), amber/emerald radiance, glassmorphism, responsive across desktop/tablet/mobile. |

---

## 🔑 Pre-Configured Test Credentials (For Evaluators)

A quick role switcher is embedded right in the top navigation bar. You can also sign in manually:

* **Administrator Account (Surface 01 - 05 Access)**:
  - **Email**: `admin@digitalheroes.com`
  - **Name**: Alex Vance (Platform Admin)
  - **Role**: `admin`
* **Active Subscriber Account (5-Score Roster & Pending Win)**:
  - **Email**: `sarah@example.com`
  - **Name**: Sarah Jenkins
  - **Role**: `user` (Subscription: `active`, Monthly Plan, 5 Stableford scores, 3-number match winner in August Draw)
* **Non-Subscriber Account (Restricted Access Testing)**:
  - **Email**: `lucas@example.com`
  - **Name**: Lucas Campbell
  - **Role**: `user` (Subscription: `inactive`)

---

## 🚀 Deployment Instructions (§ 15.1 Deployment Constraints)

The PRD requires deploying to a **new Vercel account** and a **new Supabase project**. Follow these simple steps:

### 1. Database Setup (New Supabase Project)
1. Sign up / log in to [Supabase](https://supabase.com) on a new account.
2. Create a new project (e.g., `digital-heroes-prod`).
3. In your Supabase project dashboard, navigate to the **SQL Editor**.
4. Copy the entire contents of [`supabase/schema.sql`](file:///d:/Digital%20Heroes%20Assignment/supabase/schema.sql) and click **Run**.
5. Copy the entire contents of [`supabase/seed.sql`](file:///d:/Digital%20Heroes%20Assignment/supabase/seed.sql) and click **Run**.
6. Navigate to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public key`

### 2. Vercel Live Deployment
1. Push this repository to GitHub on your account.
2. Sign up / log in to [Vercel](https://vercel.com) on your new account.
3. Import the GitHub repository.
4. Add the environment variables (from `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL` = (Your Supabase project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Your Supabase anon key)
   - `NEXT_PUBLIC_APP_URL` = (Your Vercel deployment URL)
5. Click **Deploy**. Your live, publicly accessible URL is now ready!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build check
npm run build
```

The app will be available at `http://localhost:3000`.
