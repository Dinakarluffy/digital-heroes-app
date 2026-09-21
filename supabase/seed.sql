-- ==============================================================================
-- DIGITAL HEROES - INITIAL SEED DATA
-- Populate Charities, Users, Scores, Draws, and Winner records
-- ==============================================================================

-- 1. SEED CHARITIES (§ 08)
INSERT INTO public.charities (id, name, slug, tagline, description, category, logo_url, banner_url, website_url, featured, total_raised)
VALUES
(
    'c1111111-1111-1111-1111-111111111111',
    'Fairway to Future',
    'fairway-to-future',
    'Empowering underprivileged youth through mentorship, golf, and STEM education.',
    'Fairway to Future provides after-school golf academies and educational scholarships to underprivileged children in inner-city communities. We believe the core values of golf—integrity, discipline, and respect—transform young lives on and off the course.',
    'Youth Development',
    'https://images.unsplash.com/photo-1593111774642-a116f199857d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&h=400&fit=crop',
    'https://fairwaytofuture.org',
    true,
    14250.00
),
(
    'c2222222-2222-2222-2222-222222222222',
    'Veterans on the Green',
    'veterans-on-the-green',
    'Therapeutic outdoor golf programs aiding rehabilitation for combat veterans.',
    'Veterans on the Green works with VA rehabilitation centers across the country, using the peaceful nature of golf courses for mental health healing, camaraderie, and adaptive sports therapy for wounded veterans.',
    'Veterans & Military',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1200&h=400&fit=crop',
    'https://veteransgreen.org',
    true,
    28900.00
),
(
    'c3333333-3333-3333-3333-333333333333',
    'Green Links Conservation',
    'green-links-conservation',
    'Promoting biodiversity and ecological stewardship on golf landscapes.',
    'Working with golf courses worldwide to transition turf management towards native pollinator sanctuaries, water reduction, and wildlife corridors that protect endangered local flora and fauna.',
    'Environmental Protection',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1498855926480-d98e83099315?w=1200&h=400&fit=crop',
    'https://greenlinks.eco',
    false,
    9150.00
),
(
    'c4444444-4444-4444-4444-444444444444',
    'Fore Health Foundation',
    'fore-health-foundation',
    'Funding cardiovascular research and preventative health screenings through sport.',
    'Dedicated to saving lives by integrating mobile health clinics and cardio-screening stations during recreational athletic events and community golf tournaments.',
    'Healthcare & Research',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=400&fit=crop',
    'https://forehealth.org',
    true,
    18400.00
)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED CHARITY EVENTS (§ 08.2)
INSERT INTO public.charity_events (id, charity_id, title, date, location, description, entry_fee)
VALUES
(
    'e1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'Annual Junior Invitational & Charity Scramble',
    '2026-10-15',
    'Oakmont Pines Championship Course',
    '18-hole scramble partnering junior academy scholars with amateur subscribers. Proceeds directly sponsor academic equipment.',
    75.00
),
(
    'e2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'Honor Shot Veterans Classic',
    '2026-11-11',
    'Bay Harbor Golf Resort',
    'A national celebration and tournament dedicated to honoring servicemen and servicewomen with adaptive golf clinics.',
    100.00
)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED TEST PROFILES (§ 03 & § 15)
-- Admin User: admin@digitalheroes.com
INSERT INTO public.profiles (id, email, full_name, role, subscription_status, subscription_plan, subscription_period_end, selected_charity_id, charity_contribution_pct)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'admin@digitalheroes.com',
    'Alex Vance (Platform Admin)',
    'admin',
    'active',
    'yearly',
    '2027-03-01T00:00:00Z',
    'c1111111-1111-1111-1111-111111111111',
    20
),
-- Regular Subscriber: sarah@example.com
(
    'b0000000-0000-0000-0000-000000000002',
    'sarah@example.com',
    'Sarah Jenkins',
    'user',
    'active',
    'monthly',
    '2026-10-20T00:00:00Z',
    'c2222222-2222-2222-2222-222222222222',
    15
),
-- Additional active subscribers for realistic prize pools
(
    'b0000000-0000-0000-0000-000000000003',
    'marcus@example.com',
    'Marcus Reed',
    'user',
    'active',
    'yearly',
    '2027-01-15T00:00:00Z',
    'c1111111-1111-1111-1111-111111111111',
    10
),
(
    'b0000000-0000-0000-0000-000000000004',
    'elena@example.com',
    'Elena Rostova',
    'user',
    'active',
    'monthly',
    '2026-10-18T00:00:00Z',
    'c4444444-4444-4444-4444-444444444444',
    25
),
(
    'b0000000-0000-0000-0000-000000000005',
    'david@example.com',
    'David Kim',
    'user',
    'active',
    'monthly',
    '2026-10-10T00:00:00Z',
    'c3333333-3333-3333-3333-333333333333',
    10
)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED SCORES FOR SARAH (§ 05: 5 rolling scores, 1-45, unique date)
INSERT INTO public.scores (user_id, score, score_date, course_name)
VALUES
('b0000000-0000-0000-0000-000000000002', 36, '2026-09-18', 'St. Andrews Old Course'),
('b0000000-0000-0000-0000-000000000002', 40, '2026-09-12', 'Pine Valley Golf Club'),
('b0000000-0000-0000-0000-000000000002', 32, '2026-09-05', 'Cypress Point Club'),
('b0000000-0000-0000-0000-000000000002', 28, '2026-08-28', 'Shinnecock Hills'),
('b0000000-0000-0000-0000-000000000002', 38, '2026-08-20', 'Augusta National')
ON CONFLICT (user_id, score_date) DO NOTHING;

-- SEED SCORES FOR OTHER USERS (Ticket numbers)
INSERT INTO public.scores (user_id, score, score_date, course_name) VALUES
('b0000000-0000-0000-0000-000000000003', 36, '2026-09-15', 'Torrey Pines'),
('b0000000-0000-0000-0000-000000000003', 40, '2026-09-10', 'Pebble Beach'),
('b0000000-0000-0000-0000-000000000003', 25, '2026-09-03', 'Bethpage Black'),
('b0000000-0000-0000-0000-000000000003', 19, '2026-08-27', 'Whistling Straits'),
('b0000000-0000-0000-0000-000000000003', 33, '2026-08-19', 'Kiawah Island'),

('b0000000-0000-0000-0000-000000000004', 36, '2026-09-14', 'Merion Golf Club'),
('b0000000-0000-0000-0000-000000000004', 32, '2026-09-08', 'Oakmont Country Club'),
('b0000000-0000-0000-0000-000000000004', 40, '2026-08-30', 'Winged Foot'),
('b0000000-0000-0000-0000-000000000004', 22, '2026-08-21', 'Muirfield Village'),
('b0000000-0000-0000-0000-000000000004', 15, '2026-08-14', 'Baltusrol')
ON CONFLICT (user_id, score_date) DO NOTHING;

-- 5. SEED PAST DRAW (§ 06 & § 07: August 2026 Draw with Rollover Jackpot)
INSERT INTO public.draws (
    id, draw_title, draw_month, draw_date, draw_type, drawn_numbers, 
    total_active_subscribers, total_prize_pool, pool_5_match, pool_4_match, pool_3_match, 
    rollover_jackpot_in, rollover_jackpot_out, status, published_at
)
VALUES
(
    'd1111111-1111-1111-1111-111111111111',
    'August 2026 Champions Draw',
    '2026-08',
    '2026-08-31T20:00:00Z',
    'random',
    ARRAY[36, 40, 32, 14, 27],
    340,
    3400.00,
    1360.00, -- 40% (unclaimed, rolls over!)
    1190.00, -- 35%
    850.00,  -- 25%
    0.00,
    1360.00, -- Rolls over to September
    'published',
    '2026-08-31T20:00:00Z'
)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED WINNER RECORDS (§ 09: Sarah matched 3 numbers: 36, 40, 32)
INSERT INTO public.draw_winners (
    id, draw_id, user_id, match_tier, matched_numbers, prize_amount, 
    verification_status, proof_image_url, payout_status
)
VALUES
(
    'w1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'b0000000-0000-0000-0000-000000000002',
    3,
    ARRAY[36, 40, 32],
    425.00,
    'pending_proof',
    NULL,
    'pending'
),
(
    'w2222222-2222-2222-2222-222222222222',
    'd1111111-1111-1111-1111-111111111111',
    'b0000000-0000-0000-0000-000000000004',
    3,
    ARRAY[36, 40, 32],
    425.00,
    'approved',
    'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&fit=crop',
    'paid'
)
ON CONFLICT (id) DO NOTHING;
