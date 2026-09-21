'use client';

import { Charity, DrawSimulationResult, DrawType, DrawWinner, GolfScore, MonthlyDraw, PayoutStatus, SubscriptionPlan, SubscriptionStatus, UserProfile, VerificationStatus } from '@/types';
import { simulateDraw, UserTicket } from './draw-engine';
import { INITIAL_CHARITIES, INITIAL_DRAWS, INITIAL_SCORES, INITIAL_USERS, INITIAL_WINNERS } from './mock-data';

const STORAGE_KEY = 'digital_heroes_app_state_v1';

interface AppState {
  currentUser: UserProfile;
  users: UserProfile[];
  charities: Charity[];
  scores: GolfScore[];
  draws: MonthlyDraw[];
  winners: DrawWinner[];
}

function getDefaultState(): AppState {
  return {
    currentUser: INITIAL_USERS[1], // Default to Sarah Jenkins (Subscriber)
    users: INITIAL_USERS,
    charities: INITIAL_CHARITIES,
    scores: INITIAL_SCORES,
    draws: INITIAL_DRAWS,
    winners: INITIAL_WINNERS,
  };
}

class StoreService {
  private state: AppState = getDefaultState();
  private listeners: Set<() => void> = new Set();
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  private load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = {
          ...getDefaultState(),
          ...parsed,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved state from localStorage, using default:', e);
      this.state = getDefaultState();
    }
    this.isInitialized = true;
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to persist state:', e);
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AppState {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.load();
    }
    return this.state;
  }

  public resetState() {
    this.state = getDefaultState();
    this.persist();
  }

  // --- USER & AUTH ACTIONS ---
  public switchUser(userId: string) {
    const user = this.state.users.find((u) => u.id === userId);
    if (user) {
      this.state.currentUser = user;
      this.persist();
    }
  }

  public updateProfile(userId: string, updates: Partial<UserProfile>) {
    this.state.users = this.state.users.map((u) =>
      u.id === userId ? { ...u, ...updates } : u
    );
    if (this.state.currentUser.id === userId) {
      this.state.currentUser = { ...this.state.currentUser, ...updates };
    }
    this.persist();
  }

  public updateSubscription(
    userId: string,
    status: SubscriptionStatus,
    plan?: SubscriptionPlan | null
  ) {
    const periodEnd =
      status === 'active'
        ? plan === 'yearly'
          ? new Date(Date.now() + 365 * 86400000).toISOString()
          : new Date(Date.now() + 30 * 86400000).toISOString()
        : null;

    this.updateProfile(userId, {
      subscription_status: status,
      subscription_plan: plan,
      subscription_period_end: periodEnd,
    });
  }

  // --- SCORE MANAGEMENT (§ 05) ---
  // - Only one score entry per date (no duplicate dates)
  // - Stableford score range: 1–45
  // - Retain at most 5 scores, automatically replacing oldest
  // - Reverse chronological order
  public getUserScores(userId: string): GolfScore[] {
    return this.state.scores
      .filter((s) => s.user_id === userId)
      .sort((a, b) => new Date(b.score_date).getTime() - new Date(a.score_date).getTime())
      .slice(0, 5);
  }

  public addScore(userId: string, scoreVal: number, scoreDate: string, courseName?: string): { success: boolean; message?: string } {
    if (scoreVal < 1 || scoreVal > 45) {
      return { success: false, message: 'Stableford score must be between 1 and 45.' };
    }

    const existingScores = this.state.scores.filter((s) => s.user_id === userId);
    const duplicate = existingScores.find((s) => s.score_date === scoreDate);
    if (duplicate) {
      return { success: false, message: 'A score entry already exists for this date. Please edit or delete the existing entry.' };
    }

    const newScore: GolfScore = {
      id: 'score_' + Math.random().toString(36).substring(2, 9),
      user_id: userId,
      score: Math.floor(scoreVal),
      score_date: scoreDate,
      course_name: courseName || 'Golf Course',
      created_at: new Date().toISOString(),
    };

    // Combine and keep only latest 5 scores
    const allUserScores = [...existingScores, newScore].sort(
      (a, b) => new Date(b.score_date).getTime() - new Date(a.score_date).getTime()
    );

    const keptScores = allUserScores.slice(0, 5);
    const otherUsersScores = this.state.scores.filter((s) => s.user_id !== userId);

    this.state.scores = [...otherUsersScores, ...keptScores];
    this.persist();

    return { success: true };
  }

  public editScore(scoreId: string, scoreVal: number, scoreDate: string, courseName?: string): { success: boolean; message?: string } {
    if (scoreVal < 1 || scoreVal > 45) {
      return { success: false, message: 'Stableford score must be between 1 and 45.' };
    }

    const target = this.state.scores.find((s) => s.id === scoreId);
    if (!target) return { success: false, message: 'Score not found.' };

    const duplicate = this.state.scores.find(
      (s) => s.user_id === target.user_id && s.score_date === scoreDate && s.id !== scoreId
    );
    if (duplicate) {
      return { success: false, message: 'Another score entry already exists for this date.' };
    }

    this.state.scores = this.state.scores.map((s) =>
      s.id === scoreId ? { ...s, score: scoreVal, score_date: scoreDate, course_name: courseName || s.course_name } : s
    );
    this.persist();
    return { success: true };
  }

  public deleteScore(scoreId: string) {
    this.state.scores = this.state.scores.filter((s) => s.id !== scoreId);
    this.persist();
  }

  // --- CHARITY & DONATIONS (§ 08) ---
  public updateCharitySelection(userId: string, charityId: string, contributionPct: number) {
    const pct = Math.max(10, Math.min(100, contributionPct));
    this.updateProfile(userId, {
      selected_charity_id: charityId,
      charity_contribution_pct: pct,
    });
  }

  public addIndependentDonation(charityId: string, amount: number, donorName?: string) {
    this.state.charities = this.state.charities.map((c) =>
      c.id === charityId ? { ...c, total_raised: c.total_raised + amount } : c
    );
    this.persist();
  }

  public addCharity(charity: Omit<Charity, 'id' | 'created_at' | 'total_raised'>) {
    const newCharity: Charity = {
      ...charity,
      id: 'c_' + Math.random().toString(36).substring(2, 9),
      total_raised: 0,
      created_at: new Date().toISOString(),
    };
    this.state.charities = [newCharity, ...this.state.charities];
    this.persist();
  }

  public updateCharity(charityId: string, updates: Partial<Charity>) {
    this.state.charities = this.state.charities.map((c) =>
      c.id === charityId ? { ...c, ...updates } : c
    );
    this.persist();
  }

  public deleteCharity(charityId: string) {
    this.state.charities = this.state.charities.filter((c) => c.id !== charityId);
    this.persist();
  }

  // --- DRAW ENGINE & SIMULATION (§ 06 & § 07) ---
  public getActiveTickets(): UserTicket[] {
    const activeSubscribers = this.state.users.filter(
      (u) => u.subscription_status === 'active'
    );

    return activeSubscribers.map((u) => {
      const scores = this.getUserScores(u.id).map((s) => s.score);
      return {
        user_id: u.id,
        user_name: u.full_name,
        user_email: u.email,
        scores,
      };
    });
  }

  public getLatestRollover(): number {
    const sortedDraws = [...this.state.draws].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (sortedDraws.length > 0) {
      return sortedDraws[0].rollover_jackpot_out || 0;
    }
    return 1360.0; // Seed fallback
  }

  public runDrawSimulation(drawType: DrawType, predefinedNumbers?: number[]): DrawSimulationResult {
    const tickets = this.getActiveTickets();
    const rolloverIn = this.getLatestRollover();
    return simulateDraw(tickets, drawType, rolloverIn, predefinedNumbers);
  }

  public publishDraw(title: string, month: string, simulation: DrawSimulationResult): MonthlyDraw {
    const drawId = 'draw_' + Math.random().toString(36).substring(2, 9);
    const newDraw: MonthlyDraw = {
      id: drawId,
      draw_title: title,
      draw_month: month,
      draw_date: new Date().toISOString(),
      draw_type: simulation.draw_type,
      drawn_numbers: simulation.drawn_numbers,
      total_active_subscribers: simulation.total_active_subscribers,
      total_prize_pool: simulation.total_prize_pool,
      pool_5_match: simulation.tier_5_pool,
      pool_4_match: simulation.tier_4_pool,
      pool_3_match: simulation.tier_3_pool,
      rollover_jackpot_in: simulation.rollover_jackpot_in,
      rollover_jackpot_out: simulation.rollover_jackpot_out,
      status: 'published',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Convert simulated winners to draw_winners records
    const newWinners: DrawWinner[] = [];

    const addTierWinners = (simWinners: typeof simulation.winners_tier_5, tier: 3 | 4 | 5) => {
      for (const sw of simWinners) {
        newWinners.push({
          id: 'w_' + Math.random().toString(36).substring(2, 9),
          draw_id: drawId,
          user_id: sw.user_id,
          user_name: sw.user_name,
          user_email: sw.user_email,
          match_tier: tier,
          matched_numbers: sw.matched_numbers,
          prize_amount: sw.prize_amount,
          verification_status: 'pending_proof',
          proof_image_url: null,
          proof_submitted_at: null,
          admin_notes: null,
          payout_status: 'pending',
          created_at: new Date().toISOString(),
        });
      }
    };

    addTierWinners(simulation.winners_tier_5, 5);
    addTierWinners(simulation.winners_tier_4, 4);
    addTierWinners(simulation.winners_tier_3, 3);

    this.state.draws = [newDraw, ...this.state.draws];
    this.state.winners = [...newWinners, ...this.state.winners];
    this.persist();

    return newDraw;
  }

  // --- WINNER VERIFICATION & PAYOUTS (§ 09) ---
  public submitWinnerProof(winnerId: string, proofImageUrl: string) {
    this.state.winners = this.state.winners.map((w) =>
      w.id === winnerId
        ? {
            ...w,
            proof_image_url: proofImageUrl,
            proof_submitted_at: new Date().toISOString(),
            verification_status: 'under_review',
          }
        : w
    );
    this.persist();
  }

  public updateWinnerStatus(
    winnerId: string,
    status: VerificationStatus,
    adminNotes?: string
  ) {
    this.state.winners = this.state.winners.map((w) =>
      w.id === winnerId
        ? {
            ...w,
            verification_status: status,
            admin_notes: adminNotes !== undefined ? adminNotes : w.admin_notes,
          }
        : w
    );
    this.persist();
  }

  public markPayoutCompleted(winnerId: string) {
    this.state.winners = this.state.winners.map((w) =>
      w.id === winnerId
        ? {
            ...w,
            payout_status: 'paid',
            paid_at: new Date().toISOString(),
          }
        : w
    );
    this.persist();
  }
}

export const store = new StoreService();
