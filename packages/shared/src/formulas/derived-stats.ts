/**
 * Derived stat formulas — converts 8 core attributes into gameplay numbers.
 * Source: D4 Game Systems Part 2
 *
 * Used by both client (UI preview) and server (authoritative calculation).
 * All formulas are deterministic — same inputs always produce same outputs.
 */

import type { AttributeMap } from '../types/attributes.js';

export interface DerivedStats {
  // Resources
  maxHp: number;
  maxStamina: number;
  maxStrand: number;
  hpRegenPerTick: number;
  hpRegenCombatPerTick: number;
  staminaRegenPerTick: number;
  strandRegenPerTick: number;

  // Offense
  meleeDamageBonus: number;
  expressionDamageBonus: number;
  rangedDamageBonus: number;
  critChance: number;        // percent, capped at 40
  critMultiplier: number;    // percent, capped at 250

  // Defense
  armorFromAttributes: number;
  dodgeChance: number;       // percent, capped at 30
  ccResistance: number;      // percent

  // Utility
  movementSpeedMult: number; // 1.0 = base
  inventorySlots: number;
  healingReceivedMult: number;
  gatheringYieldMult: number;
  vendorBuyMult: number;     // < 1.0 = cheaper
  vendorSellMult: number;
  factionRepMult: number;
  lootQualityBonus: number;  // percent
  deathPenaltyVariance: number; // ± percent
}

/**
 * Calculate all derived stats from attributes and level.
 * These are the authoritative formulas from D4.
 */
export function calculateDerivedStats(
  attrs: AttributeMap,
  level: number,
): DerivedStats {
  return {
    // ── Resources ─────────────────────────────────────────────────
    maxHp: 100 + attrs.vigor * 15 + attrs.soma * 5 + level * 10,
    maxStamina: 80 + attrs.vigor * 8 + attrs.soma * 4 + level * 6,
    maxStrand: 50 + attrs.cortex * 12 + attrs.resolve * 3 + level * 5,

    hpRegenPerTick: attrs.vigor * 1.0,       // out of combat
    hpRegenCombatPerTick: attrs.vigor * 0.2,  // in combat
    staminaRegenPerTick: attrs.vigor * 0.8,
    strandRegenPerTick: attrs.cortex * 0.5,

    // ── Offense ───────────────────────────────────────────────────
    meleeDamageBonus: attrs.soma * 2.0,
    expressionDamageBonus: attrs.cortex * 2.5,
    rangedDamageBonus: attrs.soma * 1.0 + attrs.acuity * 1.0,

    critChance: Math.min(40, 5 + attrs.reflex * 0.5 + attrs.phlux * 0.3),
    critMultiplier: Math.min(250, 150 + attrs.phlux * 3),

    // ── Defense ───────────────────────────────────────────────────
    armorFromAttributes: attrs.vigor * 1.5,
    dodgeChance: Math.min(30, attrs.reflex * 0.6 + attrs.acuity * 0.2),
    ccResistance: attrs.resolve * 1.5 + attrs.vigor * 0.5,

    // ── Utility ───────────────────────────────────────────────────
    movementSpeedMult: 1.0 + attrs.reflex * 0.01,
    inventorySlots: 20 + Math.floor(attrs.soma / 3),
    healingReceivedMult: 1.0 + attrs.resolve * 0.02,
    gatheringYieldMult: 1.0 + attrs.acuity * 0.03,
    vendorBuyMult: 1.0 - attrs.presence * 0.01,
    vendorSellMult: 0.3 + attrs.presence * 0.01,
    factionRepMult: 1.0 + attrs.presence * 0.02,
    lootQualityBonus: attrs.phlux * 0.5,
    deathPenaltyVariance: attrs.phlux * 0.5,
  };
}

/**
 * Calculate armor damage reduction (diminishing returns).
 * armorRating includes equipment + attribute bonus.
 */
export function armorDamageReduction(
  armorRating: number,
  attackerLevel: number,
): number {
  return armorRating / (armorRating + 200 + attackerLevel * 10);
}

/**
 * Calculate auto-attack damage.
 */
export function autoAttackDamage(
  weaponDamage: number,
  soma: number,
): number {
  return weaponDamage * 0.4 + soma * 0.5;
}

/**
 * Calculate auto-attack speed (attacks per second).
 */
export function autoAttackSpeed(
  weaponBaseSpeed: number,
  reflex: number,
): number {
  return weaponBaseSpeed * (1 - reflex * 0.005);
}
