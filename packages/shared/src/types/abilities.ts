export enum TargetType {
  Single = "single",
  AoeCircle = "aoe_circle",
  AoeCone = "aoe_cone",
  Self = "self",
  Party = "party",
}

export enum AbilitySource {
  SkillThreshold = "skill_threshold",
  PassiveKeystone = "passive_keystone",
  ClassAA = "class_aa",
  GearProc = "gear_proc",
}

export interface DamageFormula {
  base: number;
  scaling: { stat: string; coefficient: number }[];
}

export interface AbilityDefinition {
  id: string;
  name: string;
  description: string;
  skillRequired: string;
  skillLevelRequired: number;
  cooldownMs: number;
  resourceCost: number;
  damageFormula: DamageFormula;
  range: number;
  targetType: TargetType;
  aoeRadius?: number;
  castTimeMs: number;
  animation: string;
  vfx?: string;
  sound?: string;
}
