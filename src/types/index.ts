export type UserRole = 'user' | 'admin';
export type SubscriptionStatus = 'active' | 'inactive' | 'lapsed';
export type SubscriptionPlan = 'monthly' | 'yearly';
export type DrawType = 'random' | 'algorithmic';
export type VerificationStatus = 'pending_proof' | 'under_review' | 'approved' | 'rejected';
export type PayoutStatus = 'pending' | 'paid';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  subscription_plan?: SubscriptionPlan | null;
  subscription_period_end?: string | null;
  selected_charity_id?: string | null;
  charity_contribution_pct: number; // min 10%
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  created_at: string;
}

export interface GolfScore {
  id: string;
  user_id: string;
  score: number; // 1 to 45
  score_date: string; // YYYY-MM-DD
  course_name?: string;
  created_at: string;
}

export interface CharityEvent {
  id: string;
  charity_id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  entry_fee?: number;
}

export interface Charity {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  logo_url: string;
  banner_url: string;
  website_url?: string;
  featured: boolean;
  total_raised: number;
  events?: CharityEvent[];
  created_at: string;
}

export interface Donation {
  id: string;
  user_id?: string | null;
  donor_name?: string;
  donor_email?: string;
  charity_id: string;
  amount: number;
  is_independent: boolean;
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface MonthlyDraw {
  id: string;
  draw_title: string;
  draw_month: string; // e.g. "2026-09"
  draw_date: string;
  draw_type: DrawType;
  drawn_numbers: number[]; // 5 numbers between 1 and 45
  total_active_subscribers: number;
  total_prize_pool: number;
  pool_5_match: number; // 40%
  pool_4_match: number; // 35%
  pool_3_match: number; // 25%
  rollover_jackpot_in: number;
  rollover_jackpot_out: number;
  status: 'simulated' | 'published';
  published_at?: string | null;
  created_at: string;
}

export interface DrawWinner {
  id: string;
  draw_id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  match_tier: 3 | 4 | 5;
  matched_numbers: number[];
  prize_amount: number;
  verification_status: VerificationStatus;
  proof_image_url?: string | null;
  proof_submitted_at?: string | null;
  admin_notes?: string | null;
  payout_status: PayoutStatus;
  paid_at?: string | null;
  created_at: string;
}

export interface SimulatedWinner {
  user_id: string;
  user_name: string;
  user_email: string;
  user_scores: number[];
  match_tier: 3 | 4 | 5;
  matched_numbers: number[];
  prize_amount: number;
}

export interface DrawSimulationResult {
  draw_type: DrawType;
  drawn_numbers: number[];
  total_active_subscribers: number;
  base_pool: number;
  rollover_jackpot_in: number;
  total_prize_pool: number;
  tier_5_pool: number;
  tier_4_pool: number;
  tier_3_pool: number;
  winners_tier_5: SimulatedWinner[];
  winners_tier_4: SimulatedWinner[];
  winners_tier_3: SimulatedWinner[];
  rollover_jackpot_out: number; // carried over if 0 tier 5 winners
  number_frequencies?: Record<number, number>;
}
