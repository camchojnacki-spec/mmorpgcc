/**
 * Game constants — tick rates, combat timing, group sizes, rendering.
 * Source: D4 Game Systems, D3 Synergy Systems
 */

// ── Server tick rates ───────────────────────────────────────────────────────
export const TICK_RATE_TOWN = 10;       // Hz
export const TICK_RATE_INSTANCE = 20;   // Hz (server authoritative)
export const REGEN_TICK_SECONDS = 3;    // Resource/DoT/HoT tick interval

// ── Combat timing ───────────────────────────────────────────────────────────
export const GCD_MS = 1500;
export const RESONANCE_BUFFER_SIZE = 4;
export const FULL_SPECTRUM_DURATION_MS = 6000;
export const FULL_SPECTRUM_COOLDOWN_MS = 30000;

// ── CC diminishing returns ──────────────────────────────────────────────────
export const CC_DR_DURATIONS = [1.0, 0.5, 0.25, 0]; // 4th = immune
export const CC_IMMUNITY_MS = 15000;

// ── Group sizes ─────────────────────────────────────────────────────────────
export const MAX_PARTY_SIZE = 5;
export const MAX_RAID_SIZE = 40;
export const MAX_TOWN_PLAYERS = 100;

// ── Networking ──────────────────────────────────────────────────────────────
export const RECONNECT_GRACE_MS = 30_000;

// ── UI / Inventory ──────────────────────────────────────────────────────────
export const HOTBAR_SLOTS = 12;
export const BASE_INVENTORY_SLOTS = 20;
export const INVENTORY_SLOTS_PER_SOMA = 3; // floor(Soma / 3) bonus slots

// ── Rendering ───────────────────────────────────────────────────────────────
export const CANVAS_SIZE = 1024;
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

/** Only these 5 directions have unique sprite sheets. */
export const DIRECTIONS_GENERATED = ['S', 'SE', 'E', 'NE', 'N'] as const;

/** Mirrored directions map to their generated counterpart. */
export const DIRECTIONS_MIRRORED: Record<string, string> = {
  SW: 'SE',
  W: 'E',
  NW: 'NE',
};

// ── Level cap ───────────────────────────────────────────────────────────────
export const MAX_LEVEL = 30;

// ── Affinity multipliers ────────────────────────────────────────────────────
export const AFFINITY_XP_MULTIPLIERS = {
  native: 0.5,
  aligned: 0.75,
  neutral: 1.0,
  misaligned: 1.5,
  opposed: 2.0,
} as const;

// ── Death penalties by civic status (from D4) ───────────────────────────────
export const DEATH_PENALTIES_BY_STATUS = {
  standard: {
    xpLossPercent: 2,
    currencyLossPercent: 5,
    suspicionGain: 0,
    expressionDegradationChance: 0,
    respawnLocation: 'medical_facility',
  },
  conditional: {
    xpLossPercent: 5,
    currencyLossPercent: 15,
    suspicionGain: 0.5,
    expressionDegradationChance: 0,
    respawnLocation: 'underground_clinic',
  },
  authorized: {
    xpLossPercent: 1,
    currencyLossPercent: 2,
    suspicionGain: 0,
    expressionDegradationChance: 0,
    respawnLocation: 'directorate_medical',
  },
  suspended: {
    xpLossPercent: 8,
    currencyLossPercent: 25,
    suspicionGain: 0,
    expressionDegradationChance: 5,
    respawnLocation: 'resistance_safehouse',
  },
} as const;

// ── Threat multipliers ──────────────────────────────────────────────────────
export const THREAT_DAMAGE_MULTIPLIER = 1.0;
export const THREAT_HEALING_MULTIPLIER = 0.5;
export const THREAT_DEFENSE_MULTIPLIER = 2.0;
export const THREAT_DECAY_PER_TICK = 0.02;

// ── Auto-attack ─────────────────────────────────────────────────────────────
export const AUTO_ATTACK_DAMAGE_COEFF = 0.4;  // weapon damage × this
export const AUTO_ATTACK_SOMA_COEFF = 0.5;

// ── Phlux thresholds ────────────────────────────────────────────────────────
export const PHLUX_ECHO_THRESHOLD = 8;
export const PHLUX_PHANTOM_PAIR_THRESHOLD = 12;
export const PHLUX_MUTATION_THRESHOLD = 15;
export const PHLUX_CASCADE_THRESHOLD = 18;

// ── Sequence (mod) system ───────────────────────────────────────────────────
export const SEQUENCE_AFFINITY_FLOOR = 0.5; // minimum multiplier
