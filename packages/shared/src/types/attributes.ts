/**
 * Core attribute system — 8 biological parameters of a Threaded individual.
 * Source: D2 Character Systems v2
 */

export const ATTRIBUTE_KEYS = [
  'soma',     // Raw physical force
  'reflex',   // Neural response speed
  'vigor',    // Biological durability
  'cortex',   // Mental throughput
  'resolve',  // Cognitive stability
  'acuity',   // Sensory fidelity
  'presence', // Biosocial influence
  'phlux',    // Phenotypic deviation tolerance
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];

export interface AttributeEffect {
  stat: string;
  perPoint: number;
  description: string;
}

export interface AttributeDefinition {
  id: AttributeKey;
  name: string;
  description: string;
  affects: string[];
  effects: AttributeEffect[];
}

/** Maps every attribute key to its current numeric value. */
export type AttributeMap = Record<AttributeKey, number>;

/** Attribute allocation rules at character creation (from D4). */
export interface AttributeAllocationRules {
  basePerAttribute: number;
  classBonusTotal: number;
  freePoints: number;
  minPerAttribute: number;
  maxPerAttributeAtCreation: number;
}

export const DEFAULT_ALLOCATION_RULES: AttributeAllocationRules = {
  basePerAttribute: 5,
  classBonusTotal: 8,
  freePoints: 10,
  minPerAttribute: 3,
  maxPerAttributeAtCreation: 18,
};

/** Derived stat formula — base + attribute scaling. */
export interface DerivedStatScaling {
  attribute: AttributeKey;
  perPoint: number;
}

export interface DerivedStatFormula {
  base: number;
  scaling: DerivedStatScaling[];
  levelScaling?: number;
  cap?: number;
}
