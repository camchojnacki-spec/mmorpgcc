/**
 * Skill & ability system — 26 skills, 78 abilities, 5-tier affinity.
 * Source: D2 Character Systems v2
 */

// ── Affinity tiers ──────────────────────────────────────────────────────────

export const AFFINITY_TIERS = [
  'native',
  'aligned',
  'neutral',
  'misaligned',
  'opposed',
] as const;

export type AffinityTier = (typeof AFFINITY_TIERS)[number];

export const AFFINITY_MULTIPLIERS: Record<AffinityTier, number> = {
  native: 0.5,
  aligned: 0.75,
  neutral: 1.0,
  misaligned: 1.5,
  opposed: 2.0,
};

// ── Skill categories ────────────────────────────────────────────────────────

export const SKILL_CATEGORIES = [
  'combat',
  'expression',
  'crafting',
  'utility',
  'advanced',
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

// ── Skill tiers (unlock gating) ─────────────────────────────────────────────

export type SkillTier = 1 | 2 | 3;

export interface SkillPrerequisite {
  skillId: string;
  level: number;
}

// ── Expression categories (Resonance system) ────────────────────────────────

export const EXPRESSION_CATEGORIES = [
  'strike',   // Direct damage
  'sustain',  // Healing / regen / restore
  'shield',   // Prevent / mitigate / absorb
  'disrupt',  // CC / debuff / remove
  'augment',  // Buff self or allies
] as const;

export type ExpressionCategory = (typeof EXPRESSION_CATEGORIES)[number];

// ── Ability types (combat loop) ─────────────────────────────────────────────

export const ABILITY_TYPES = [
  'instant',
  'cast',
  'channel',
  'reactive',
  'toggle',
  'passive',
] as const;

export type AbilityType = (typeof ABILITY_TYPES)[number];

// ── Target types ────────────────────────────────────────────────────────────

export const TARGET_TYPES = [
  'single',
  'aoe_circle',
  'aoe_cone',
  'self',
  'party',
] as const;

export type TargetType = (typeof TARGET_TYPES)[number];

// ── Ability definition ──────────────────────────────────────────────────────

export interface AbilityCost {
  stamina?: number;
  strand?: number;
}

export interface AbilityDamageScaling {
  attribute: string;
  coefficient: number;
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  skillId: string;
  thresholdLevel: 5 | 15 | 30;
  titleReward?: string;

  abilityType: AbilityType;
  expressionCategory: ExpressionCategory;
  secondaryCategory?: ExpressionCategory;
  targetType: TargetType;

  cost: AbilityCost;
  cooldown: number;       // seconds
  castTime?: number;      // for 'cast' type
  channelDuration?: number; // for 'channel' type
  isOffGCD: boolean;

  baseDamage?: number;
  baseHealing?: number;
  damageScaling?: AbilityDamageScaling[];
  duration?: number;      // buff/debuff/dot/hot seconds
  range?: number;
  aoeRadius?: number;

  reactiveTrigger?: string;

  animation: string;
  vfx?: string;
  sound?: string;
}

// ── Skill definition ────────────────────────────────────────────────────────

export interface SkillThreshold {
  level: number;         // 5, 15, or 30
  unlocksAbility: string; // ability ID
  title?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  tier: SkillTier;
  prerequisites: SkillPrerequisite[];
  affinityByClass: Record<string, AffinityTier>; // classId → tier
  thresholds: SkillThreshold[];
  maxLevel: number;
  baseXpCost: number;
  progressionExponent: number;
}

// ── Character skill state ───────────────────────────────────────────────────

export interface CharacterSkill {
  skillId: string;
  currentLevel: number;
  currentXp: number;
  /** Effective XP multiplier after gear/Sequence adjustments */
  effectiveMultiplier: number;
  unlockedAbilities: string[];
}
