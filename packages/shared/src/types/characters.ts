import type { CharacterAttributes } from "./attributes.js";
import type { Direction } from "./entities.js";

export interface CharacterState {
  id: string;
  accountId: string;
  name: string;
  race: string;
  className: string;
  background: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  reputationLevel: number;
  reputationXp: number;
  bodyType: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  attributes: CharacterAttributes;
  unspentAttributePoints: number;
  /** Slot name -> item instance id, null if empty. */
  equipment: Record<string, string | null>;
  currentZone: string;
  positionX: number;
  positionY: number;
  direction: Direction;
  isOnline: boolean;
  currencies: Record<string, number>;
}
