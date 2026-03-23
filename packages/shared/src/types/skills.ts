/** Affinity multiplier applied to XP costs based on class/skill alignment. */
export enum SkillAffinityTier {
  Native = 0.5,
  Aligned = 0.75,
  Neutral = 1.0,
  Misaligned = 1.5,
  Opposed = 2.0,
}

export enum SkillTier {
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
}

export interface SkillThreshold {
  level: number;
  unlocksAbility: string;
  title?: string;
}

export interface SkillPrerequisite {
  skillId: string;
  level: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: SkillTier;
  maxLevel: number;
  baseXpCost: number;
  progressionExponent: number;
  prerequisites: SkillPrerequisite[];
  thresholds: SkillThreshold[];
}

export interface ClassSkillAffinity {
  classId: string;
  skillAffinities: Record<string, SkillAffinityTier>;
}

export interface CharacterSkill {
  characterId: string;
  skillId: string;
  currentLevel: number;
  currentXp: number;
  effectiveMultiplier: number;
}
