-- ==============================================================================
-- DIGITAL HEROES - SUPABASE POSTGRESQL SCHEMA
-- Product Requirements Document (Level 1) Implementation
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth or Standalone Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
    subscription_status TEXT NOT NULL CHECK (subscription_status IN ('active', 'inactive', 'lapsed')) DEFAULT 'inactive',
    subscription_plan TEXT CHECK (subscription_plan IN ('monthly', 'yearly', NULL)),
    subscription_period_end TIMESTAMPTZ,
    selected_charity_id UUID,
    charity_contribution_pct INTEGER NOT NULL DEFAULT 10 CHECK (charity_contribution_pct >= 10 AND charity_contribution_pct <= 100),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CHARITIES TABLE (§ 08 Charity System)
CREATE TABLE IF NOT EXISTS public.charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. 'Youth Development', 'Veterans', 'Healthcare'
    logo_url TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    website_url TEXT,
    featured BOOLEAN NOT NULL DEFAULT false,
    total_raised NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key reference to profiles after charities is created
ALTER TABLE public.profiles 
    DROP CONSTRAINT IF EXISTS fk_profiles_selected_charity,
    ADD CONSTRAINT fk_profiles_selected_charity FOREIGN KEY (selected_charity_id) REFERENCES public.charities(id) ON DELETE SET NULL;

-- 3. CHARITY EVENTS TABLE (§ 08.2 Profiles with upcoming events like golf days)
CREATE TABLE IF NOT EXISTS public.charity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    entry_fee NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. GOLF SCORES TABLE (§ 05 Score Management System)
-- Enforces:
-- 1. Stableford format range 1-45
-- 2. Only ONE score entry permitted per date (UNIQUE per user_id, score_date)
CREATE TABLE IF NOT EXISTS public.scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    course_name TEXT DEFAULT 'Standard Course',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_score_date UNIQUE (user_id, score_date)
);

-- Rolling 5-Scores Trigger Function:
-- Only the latest 5 scores are retained at any time.
-- A new score replaces the oldest stored score automatically.
CREATE OR REPLACE FUNCTION public.prune_user_scores_to_latest_5()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.scores
    WHERE id IN (
        SELECT id FROM public.scores
        WHERE user_id = NEW.user_id
        ORDER BY score_date DESC, created_at DESC
        OFFSET 5
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prune_scores ON public.scores;
CREATE TRIGGER trigger_prune_scores
AFTER INSERT OR UPDATE ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.prune_user_scores_to_latest_5();

-- 5. DONATIONS TABLE (§ 08.1 Independent donation option, not tied to gameplay)
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT,
    donor_email TEXT,
    charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    is_independent BOOLEAN NOT NULL DEFAULT true,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to increment charity total_raised upon successful donation
CREATE OR REPLACE FUNCTION public.update_charity_raised_total()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' THEN
        UPDATE public.charities
        SET total_raised = total_raised + NEW.amount
        WHERE id = NEW.charity_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_charity_raised ON public.donations;
CREATE TRIGGER trigger_update_charity_raised
AFTER INSERT ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_charity_raised_total();

-- 6. DRAWS TABLE (§ 06 & § 07 Draw and Prize Pool System)
CREATE TABLE IF NOT EXISTS public.draws (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_title TEXT NOT NULL,
    draw_month TEXT NOT NULL, -- e.g. "2026-03"
    draw_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    draw_type TEXT NOT NULL CHECK (draw_type IN ('random', 'algorithmic')),
    drawn_numbers INTEGER[] NOT NULL, -- Array of 5 unique numbers (1-45)
    total_active_subscribers INTEGER NOT NULL DEFAULT 0,
    total_prize_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    pool_5_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 40%
    pool_4_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 35%
    pool_3_match NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- 25%
    rollover_jackpot_in NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    rollover_jackpot_out NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('simulated', 'published')) DEFAULT 'simulated',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DRAW WINNERS TABLE (§ 09 Winner Verification System)
CREATE TABLE IF NOT EXISTS public.draw_winners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    match_tier INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
    matched_numbers INTEGER[] NOT NULL,
    prize_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('pending_proof', 'under_review', 'approved', 'rejected')) DEFAULT 'pending_proof',
    proof_image_url TEXT,
    proof_submitted_at TIMESTAMPTZ,
    admin_notes TEXT,
    payout_status TEXT NOT NULL CHECK (payout_status IN ('pending', 'paid')) DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. INDEXES FOR PERFORMANCE & FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON public.scores(user_id, score_date DESC);
CREATE INDEX IF NOT EXISTS idx_draw_winners_user ON public.draw_winners(user_id);
CREATE INDEX IF NOT EXISTS idx_draw_winners_draw ON public.draw_winners(draw_id);
CREATE INDEX IF NOT EXISTS idx_charities_slug ON public.charities(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles(subscription_status);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_winners ENABLE ROW LEVEL SECURITY;

-- Charities & Events: Publicly readable
CREATE POLICY "Public can view charities" ON public.charities FOR SELECT USING (true);
CREATE POLICY "Public can view charity events" ON public.charity_events FOR SELECT USING (true);

-- Draws: Public can view published draws
CREATE POLICY "Public can view published draws" ON public.draws FOR SELECT USING (status = 'published');

-- Scores: Users can view & modify their own scores
CREATE POLICY "Users can view own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON public.scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Profiles: Users can view & edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Draw Winners: Users can view their own winnings
CREATE POLICY "Users can view own winnings" ON public.draw_winners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own winnings proof" ON public.draw_winners FOR UPDATE USING (auth.uid() = user_id);
