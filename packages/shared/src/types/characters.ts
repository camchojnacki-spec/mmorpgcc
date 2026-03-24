/**
 * Character, class, race, background definitions.
 * Source: D2 Character Systems v2, D4 Game Systems
 */

import type { AttributeKey, AttributeMap } from './attributes.js';
import type { CharacterSkill } from './skills.js';
import type { Direction } from './entities.js';

// ── Classes ─────────────────────────────────────────────────────────────────

export const CLASS_IDS = ['sentinel', 'catalyst', 'conduit'] as const;
export type ClassId = (typeof CLASS_IDS)[number];

export interface ClassDefinition {
  id: ClassId;
  name: string;
  primerSequence: string; // somatic, cortical, sympathetic
  description: string;
  roleTendency: string;
  startingAttributeBonuses: Partial<AttributeMap>;
  startingEquipment: string[]; // item IDs
  passiveTreeEntry: string;
}

// ── Races ───────────────────────────────────────────────────────────────────

export const RACE_IDS = ['baseline', 'threaded'] as const;
export type RaceId = (typeof RACE_IDS)[number];

export interface RacialPassive {
  id: string;
  name: string;
  description: string;
}

export interface RaceDefinition {
  id: RaceId;
  name: string;
  description: string;
  attributeModifiers: Partial<Record<AttributeKey, number>>;
  passives: RacialPassive[];
  bodyTypes: string[];
  appearanceNotes: string;
}

// ── Backgrounds ─────────────────────────────────────────────────────────────

export const BACKGROUND_IDS = [
  'sublevel_resident',
  'lapsed_clerk',
  'street_medic',
  'salvage_runner',
  'disgraced_academic',
] as const;
export type BackgroundId = (typeof BACKGROUND_IDS)[number];

export interface BackgroundDefinition {
  id: BackgroundId;
  name: string;
  description: string;
  mechanicalBonus: {
    attributeBonus?: Partial<Record<AttributeKey, number>>;
    xpBonuses?: Record<string, number>; // skillId → percent
  };
  startingKnowledge: string;
  questChainId: string;
}

// ── Civic status ────────────────────────────────────────────────────────────

export const CIVIC_STATUSES = [
  'standard',
  'conditional',
  'authorized',
  'suspended',
] as const;
export type CivicStatus = (typeof CIVIC_STATUSES)[number];

// ── Appearance ──────────────────────────────────────────────────────────────

export interface CharacterAppearance {
  bodyType: string;
  skinTone: number;
  hairStyle: string;
  hairColor: number;
  facialFeatures: number;
  markings?: string;
}

// ── Full character state ────────────────────────────────────────────────────

export interface CharacterState {
  id: string;
  accountId: string;
  name: string;

  classId: ClassId;
  raceId: RaceId;
  backgroundId: BackgroundId;
  appearance: CharacterAppearance;

  level: number;
  currentXp: number;
  xpToNextLevel: number;

  attributes: AttributeMap;
  freeAttributePoints: number;

  skills: Record<string, CharacterSkill>;

  civicStatus: CivicStatus;

  // Faction standing
  directorateStanding: number;
  unboundStanding: number;
  directorateSuspicion: number;

  // Equipment: slot → item instance ID
  equipment: Record<string, string | null>;

  // Currencies
  currencies: Record<string, number>;

  // Location
  currentZone: string;
  positionX: number;
  positionY: number;
  direction: Direction;
  isOnline: boolean;

  createdAt: number;
  lastLogin: number;
}
