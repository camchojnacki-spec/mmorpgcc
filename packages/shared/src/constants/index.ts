import { SkillAffinityTier } from "../types/skills.js";

// ── Tick rates ──────────────────────────────────────────────────────────────
export const TICK_RATE_TOWN = 10;
export const TICK_RATE_INSTANCE = 20;

// ── Group sizes ─────────────────────────────────────────────────────────────
export const MAX_PARTY_SIZE = 5;
export const MAX_RAID_SIZE = 40;
export const MAX_TOWN_PLAYERS = 100;

// ── Networking ──────────────────────────────────────────────────────────────
export const RECONNECT_GRACE_MS = 30_000;

// ── UI / Inventory ──────────────────────────────────────────────────────────
export const HOTBAR_SLOTS = 12;
export const BASE_INVENTORY_CAPACITY = 20;

// ── Rendering ───────────────────────────────────────────────────────────────
export const CANVAS_SIZE = 1024;

/**
 * Only these five facing directions have unique sprite sheets.
 * SW, W, NW are rendered by mirroring their counterparts.
 */
export const DIRECTIONS_GENERATED = ["S", "SE", "E", "NE", "N"] as const;

/** Maps each mirrored direction to the generated sheet it flips. */
export const DIRECTIONS_MIRRORED = {
  SW: "SE",
  W: "E",
  NW: "NE",
} as const;

// ── Death penalties ─────────────────────────────────────────────────────────
export interface DeathPenaltyTier {
  maxDeaths: number;
  xpLossPercent: number;
  durabilityLossPercent: number;
}

export const DEATH_PENALTY_TIERS: readonly DeathPenaltyTier[] = [
  { maxDeaths: 2, xpLossPercent: 25, durabilityLossPercent: 10 },
  { maxDeaths: 5, xpLossPercent: 50, durabilityLossPercent: 15 },
  { maxDeaths: Infinity, xpLossPercent: 75, durabilityLossPercent: 20 },
] as const;

// ── Mod system ──────────────────────────────────────────────────────────────
export const MOD_MULTIPLIER_FLOOR = 0.5;

// ── Skill affinity tiers ────────────────────────────────────────────────────
export const AFFINITY_TIERS = {
  Native: SkillAffinityTier.Native,
  Aligned: SkillAffinityTier.Aligned,
  Neutral: SkillAffinityTier.Neutral,
  Misaligned: SkillAffinityTier.Misaligned,
  Opposed: SkillAffinityTier.Opposed,
} as const;
