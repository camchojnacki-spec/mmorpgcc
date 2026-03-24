/**
 * Combat system types — GCD, Resonance buffer, damage events, death.
 * Source: D3 Synergy Systems, D4 Game Systems
 */

import type { ExpressionCategory } from './skills.js';
import type { Position } from './entities.js';

// ── Combat actions ──────────────────────────────────────────────────────────

export interface CombatAction {
  type: 'USE_ABILITY' | 'AUTO_ATTACK' | 'CANCEL_CAST';
  abilityId?: string;
  targetId: string;
  position: Position;
  timestamp: number;
}

// ── Resonance system (from D3) ──────────────────────────────────────────────

export type ResonanceBuffer = (ExpressionCategory | null)[];

/** Named Dual Resonance states (2 of same category) */
export type DualResonanceId =
  | 'strike_tempo'
  | 'sustain_flow'
  | 'shield_wall'
  | 'disrupt_chain'
  | 'augment_stack';

/** Named Paired Resonance states (2 specific different categories) */
export type PairedResonanceId =
  | 'counterflow'     // Strike + Sustain
  | 'fortification'   // Shield + Sustain
  | 'pressure'        // Strike + Disrupt
  | 'overwatch'       // Shield + Augment
  | 'exploitation'    // Disrupt + Strike
  | 'stabilization'   // Sustain + Disrupt
  | 'catalyst_loop'   // Strike + Augment
  | 'iron_harmony'    // Shield + Disrupt
  | 'vital_surge'     // Sustain + Augment
  | 'signal_lock';    // Disrupt + Augment

/** Named Triad Resonance states (3 specific categories) */
export type TriadResonanceId =
  | 'vanguard'   // Strike + Shield + Augment
  | 'warden'     // Shield + Sustain + Disrupt
  | 'predator'   // Strike + Disrupt + Augment
  | 'lifeline'   // Sustain + Shield + Augment
  | 'siege'      // Strike + Strike + Disrupt
  | 'flux';      // Any 3 different + Phlux > 10

export type ResonanceStateId =
  | DualResonanceId
  | PairedResonanceId
  | TriadResonanceId
  | 'full_spectrum';

export interface ActiveResonanceState {
  id: ResonanceStateId;
  remainingMs: number;
  bonuses: Record<string, number>;
}

export interface ResonanceState {
  buffer: ResonanceBuffer;
  activeStates: ActiveResonanceState[];
  fullSpectrumCooldownMs: number;
}

// ── Phlux procs (from D3 Part 3) ───────────────────────────────────────────

export type PhluxProcType =
  | 'resonance_echo'      // Phlux 8+
  | 'phantom_pair'        // Phlux 12+
  | 'expression_mutation'  // Phlux 15+
  | 'cascade_event';      // Phlux 18+

export interface PhluxProc {
  type: PhluxProcType;
  timestamp: number;
  details: string;
}

// ── Interaction chains (from D3 Part 2) ─────────────────────────────────────

export interface InteractionChain {
  id: string;
  name: string;
  triggerSkills: [string, string]; // Two skill IDs
  triggerAbility: string;
  followUpAbility: string;
  windowMs: number;
  effect: string;
  biologicalLogic: string;
}

export interface DiscoveredInteraction {
  chainId: string;
  discoveredAt: number;
}

// ── Damage & healing events ─────────────────────────────────────────────────

export interface DamageEvent {
  attackerId: string;
  targetId: string;
  abilityId: string;
  damageAmount: number;
  damageType: 'physical' | 'expression' | 'environmental';
  isCrit: boolean;
  isAutoAttack: boolean;
  resonanceBonus?: number;
  timestamp: number;
}

export interface HealEvent {
  healerId: string;
  targetId: string;
  abilityId: string;
  healAmount: number;
  isCrit: boolean;
  timestamp: number;
}

// ── Threat system ───────────────────────────────────────────────────────────

export interface ThreatEntry {
  entityId: string;
  threat: number;
}

// ── GCD state ───────────────────────────────────────────────────────────────

export interface GCDState {
  isActive: boolean;
  remainingMs: number;
  durationMs: number; // 1500 by default
}

// ── Crowd control ───────────────────────────────────────────────────────────

export const CC_CATEGORIES = [
  'stun',
  'silence',
  'root',
  'slow',
  'disorient',
] as const;

export type CCCategory = (typeof CC_CATEGORIES)[number];

export interface CCEffect {
  category: CCCategory;
  sourceId: string;
  remainingMs: number;
  diminishingCount: number; // 0-3, immunity at 4
}

// ── Death & respawn (from D4) ───────────────────────────────────────────────

export interface DeathPenalty {
  xpLossPercent: number;
  currencyLossPercent: number;
  suspicionGain: number;
  expressionDegradationChance: number;
  respawnLocation: string;
}

export interface DeathEvent {
  characterId: string;
  civicStatus: string;
  phluxValue: number;
  appliedPenalty: DeathPenalty;
  phluxVariance: number; // ±adjustment from Phlux
  timestamp: number;
}

// ── Combat resources ────────────────────────────────────────────────────────

export interface CombatResources {
  currentHp: number;
  maxHp: number;
  currentStamina: number;
  maxStamina: number;
  currentStrand: number;
  maxStrand: number;
}
