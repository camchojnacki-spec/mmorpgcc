/**
 * Entity types — players, NPCs, enemies, bosses, nemeses.
 * Shared between client rendering and server state.
 */

import type { CombatResources } from './combat.js';

// ── Directions (8-way isometric) ────────────────────────────────────────────

export const DIRECTIONS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'] as const;
export type Direction = (typeof DIRECTIONS)[number];

// ── Animation states ────────────────────────────────────────────────────────

export const ANIMATION_STATES = [
  'idle',
  'walk',
  'attack',
  'cast',
  'channel',
  'hit',
  'death',
  'block',
] as const;
export type AnimationState = (typeof ANIMATION_STATES)[number];

// ── Entity types ────────────────────────────────────────────────────────────

export const ENTITY_TYPES = [
  'player',
  'npc',
  'enemy',
  'elite',
  'champion',
  'boss',
  'nemesis',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

// ── 6-layer sprite compositing ──────────────────────────────────────────────

export interface SpriteLayers {
  baseBody: string;
  armor?: string;
  headwear?: string;
  handMain?: string;
  handOff?: string;
  backItem?: string;
  vfx?: string;
}

// ── Spatial position ────────────────────────────────────────────────────────

export interface Position {
  x: number;
  y: number;
}

// ── Entity state (networked) ────────────────────────────────────────────────

export interface EntityState {
  id: string;
  type: EntityType;
  name: string;
  position: Position;
  direction: Direction;
  animationState: AnimationState;
  spriteLayers: SpriteLayers;
  resources: CombatResources;
  level: number;
  targetId?: string;
  isAlive: boolean;
}

// ── Nemesis memory (from Shadow of Mordor-style system) ─────────────────────

export interface NemesisMemory {
  nemesisId: string;
  /** Players this nemesis remembers, and their history */
  playerHistory: Record<string, {
    encounters: number;
    defeats: number;      // nemesis defeated by this player
    victories: number;    // nemesis killed this player
    lastEncounter: number;
  }>;
  /** Adapted stats — nemesis adjusts to counter known players */
  statModifiers: Record<string, number>;
  /** Enhanced skill ID — one skill is stronger than base */
  enhancedSkill?: string;
  evolutionTier: number;
}
