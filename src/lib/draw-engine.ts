import { DrawSimulationResult, DrawType, SimulatedWinner } from '@/types';

export interface UserTicket {
  user_id: string;
  user_name: string;
  user_email: string;
  scores: number[]; // latest 5 Stableford scores
}

const MIN_SCORE = 1;
const MAX_SCORE = 45;
const NUMBERS_TO_DRAW = 5;
const CONTRIBUTION_PER_SUBSCRIBER = 10.0; // $10 per subscriber added to base monthly pool

/**
 * Standard Lottery-style random draw:
 * 5 distinct random numbers between 1 and 45 chosen uniformly
 */
export function generateRandomNumbers(): number[] {
  const pool = Array.from({ length: MAX_SCORE - MIN_SCORE + 1 }, (_, i) => i + MIN_SCORE);
  const drawn: number[] = [];

  for (let i = 0; i < NUMBERS_TO_DRAW; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    drawn.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }

  return drawn.sort((a, b) => a - b);
}

/**
 * Algorithmic draw: Weighted by score frequency across all active subscriber score rosters.
 * Scores that are more frequently achieved have higher probabilities of being drawn.
 */
export function generateAlgorithmicNumbers(tickets: UserTicket[]): {
  drawnNumbers: number[];
  frequencies: Record<number, number>;
} {
  const frequencies: Record<number, number> = {};
  for (let s = MIN_SCORE; s <= MAX_SCORE; s++) {
    frequencies[s] = 1; // baseline smoothing weight of 1
  }

  // Count user scores
  for (const ticket of tickets) {
    for (const score of ticket.scores) {
      if (score >= MIN_SCORE && score <= MAX_SCORE) {
        frequencies[score] = (frequencies[score] || 1) + 3; // boost weight for actual scores
      }
    }
  }

  // Weighted sampling without replacement
  const available = Array.from({ length: MAX_SCORE - MIN_SCORE + 1 }, (_, i) => i + MIN_SCORE);
  const drawn: number[] = [];

  for (let d = 0; d < NUMBERS_TO_DRAW; d++) {
    let totalWeight = available.reduce((acc, num) => acc + (frequencies[num] || 1), 0);
    let rand = Math.random() * totalWeight;

    for (let i = 0; i < available.length; i++) {
      const num = available[i];
      const weight = frequencies[num] || 1;
      if (rand <= weight) {
        drawn.push(num);
        available.splice(i, 1);
        break;
      }
      rand -= weight;
    }
  }

  // Fallback if float precision edge case
  while (drawn.length < NUMBERS_TO_DRAW) {
    const fallback = available.splice(Math.floor(Math.random() * available.length), 1)[0];
    drawn.push(fallback);
  }

  return {
    drawnNumbers: drawn.sort((a, b) => a - b),
    frequencies,
  };
}

/**
 * Simulates a draw based on active subscriber tickets, previous rollover, and selected draw type.
 */
export function simulateDraw(
  tickets: UserTicket[],
  drawType: DrawType,
  rolloverJackpotIn: number = 0,
  predefinedNumbers?: number[]
): DrawSimulationResult {
  let drawnNumbers: number[];
  let numberFrequencies: Record<number, number> | undefined;

  if (predefinedNumbers && predefinedNumbers.length === NUMBERS_TO_DRAW) {
    drawnNumbers = [...predefinedNumbers].sort((a, b) => a - b);
  } else if (drawType === 'algorithmic') {
    const result = generateAlgorithmicNumbers(tickets);
    drawnNumbers = result.drawnNumbers;
    numberFrequencies = result.frequencies;
  } else {
    drawnNumbers = generateRandomNumbers();
  }

  const drawnSet = new Set(drawnNumbers);

  const winnersTier5: SimulatedWinner[] = [];
  const winnersTier4: SimulatedWinner[] = [];
  const winnersTier3: SimulatedWinner[] = [];

  // Evaluate matching numbers for each active subscriber ticket
  for (const ticket of tickets) {
    const matched = ticket.scores.filter(num => drawnSet.has(num));
    const matchCount = matched.length;

    if (matchCount === 5) {
      winnersTier5.push({
        user_id: ticket.user_id,
        user_name: ticket.user_name,
        user_email: ticket.user_email,
        user_scores: ticket.scores,
        match_tier: 5,
        matched_numbers: matched.sort((a, b) => a - b),
        prize_amount: 0, // Calculated below
      });
    } else if (matchCount === 4) {
      winnersTier4.push({
        user_id: ticket.user_id,
        user_name: ticket.user_name,
        user_email: ticket.user_email,
        user_scores: ticket.scores,
        match_tier: 4,
        matched_numbers: matched.sort((a, b) => a - b),
        prize_amount: 0,
      });
    } else if (matchCount === 3) {
      winnersTier3.push({
        user_id: ticket.user_id,
        user_name: ticket.user_name,
        user_email: ticket.user_email,
        user_scores: ticket.scores,
        match_tier: 3,
        matched_numbers: matched.sort((a, b) => a - b),
        prize_amount: 0,
      });
    }
  }

  // § 07 Prize Pool Logic:
  // Base pool from active subscribers
  const totalSubscribers = tickets.length;
  const basePool = Math.max(totalSubscribers * CONTRIBUTION_PER_SUBSCRIBER, 1000.0); // minimum guarantee of $1,000 for realistic demo

  // Distribution shares:
  // 5-match: 40% + Rollover Jackpot In
  // 4-match: 35%
  // 3-match: 25%
  const tier5Pool = Number(((basePool * 0.40) + rolloverJackpotIn).toFixed(2));
  const tier4Pool = Number((basePool * 0.35).toFixed(2));
  const tier3Pool = Number((basePool * 0.25).toFixed(2));
  const totalPrizePool = Number((tier5Pool + tier4Pool + tier3Pool).toFixed(2));

  // Split equally among multiple winners in the same tier
  if (winnersTier5.length > 0) {
    const payoutPerWinner = Number((tier5Pool / winnersTier5.length).toFixed(2));
    winnersTier5.forEach(w => { w.prize_amount = payoutPerWinner; });
  }

  if (winnersTier4.length > 0) {
    const payoutPerWinner = Number((tier4Pool / winnersTier4.length).toFixed(2));
    winnersTier4.forEach(w => { w.prize_amount = payoutPerWinner; });
  }

  if (winnersTier3.length > 0) {
    const payoutPerWinner = Number((tier3Pool / winnersTier3.length).toFixed(2));
    winnersTier3.forEach(w => { w.prize_amount = payoutPerWinner; });
  }

  // § 07 Rollover? 5-match: YES (jackpot carries forward if unclaimed)
  const rolloverJackpotOut = winnersTier5.length === 0 ? tier5Pool : 0.0;

  return {
    draw_type: drawType,
    drawn_numbers: drawnNumbers,
    total_active_subscribers: totalSubscribers,
    base_pool: basePool,
    rollover_jackpot_in: rolloverJackpotIn,
    total_prize_pool: totalPrizePool,
    tier_5_pool: tier5Pool,
    tier_4_pool: tier4Pool,
    tier_3_pool: tier3Pool,
    winners_tier_5: winnersTier5,
    winners_tier_4: winnersTier4,
    winners_tier_3: winnersTier3,
    rollover_jackpot_out: rolloverJackpotOut,
    number_frequencies: numberFrequencies,
  };
}
