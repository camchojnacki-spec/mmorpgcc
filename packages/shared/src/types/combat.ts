import type { Position } from "./entities.js";

export interface CombatAction {
  type: "USE_ABILITY";
  abilityId: string;
  targetId: string;
  position: Position;
}

export interface DamageEvent {
  attackerId: string;
  targetId: string;
  abilityId: string;
  damageAmount: number;
  isCrit: boolean;
  timestamp: number;
}

export interface DeathEvent {
  characterId: string;
  xpLostPercent: number;
  durabilityLossPercent: number;
  deathsThisHour: number;
}
