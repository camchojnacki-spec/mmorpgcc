/**
 * Item system — equipment, consumables, Sequences (mod slots), crafting.
 * Source: Architecture Spec v4, D2 Character Systems
 */

// ── Item categories ─────────────────────────────────────────────────────────

export const ITEM_CATEGORIES = [
  'weapon',
  'armor',
  'backpack',
  'consumable',
  'sequence',    // Kowloon cluster fragments (mod items)
  'material',
  'schematic',
  'quest',
  'misc',
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

// ── Equipment slots ─────────────────────────────────────────────────────────

export const EQUIPMENT_SLOTS = [
  'head',
  'chest',
  'legs',
  'feet',
  'hands',
  'back',
  'main_hand',
  'off_hand',
  'accessory_1',
  'accessory_2',
] as const;
export type EquipmentSlot = (typeof EQUIPMENT_SLOTS)[number];

// ── Sprite layer mapping for visible equipment ──────────────────────────────

export const SPRITE_LAYER_MAP: Partial<Record<EquipmentSlot, string>> = {
  head: 'headwear',
  chest: 'armor',
  back: 'backItem',
  main_hand: 'handMain',
  off_hand: 'handOff',
};

// ── Rarity tiers (5-tier system) ────────────────────────────────────────────

export const RARITY_TIERS = [
  'common',
  'uncommon',
  'rare',
  'epic',
  'legendary',
] as const;
export type RarityTier = (typeof RARITY_TIERS)[number];

// ── Item binding ────────────────────────────────────────────────────────────

export const ITEM_BINDINGS = [
  'none',
  'bind_on_equip',
  'bind_on_pickup',
] as const;
export type ItemBinding = (typeof ITEM_BINDINGS)[number];

// ── Sequence (mod) system ───────────────────────────────────────────────────

export interface SequenceDefinition {
  id: string;
  name: string;
  description: string;
  rarity: RarityTier;
  /** Which skill's affinity this Sequence reduces */
  affinityReductionSkill?: string;
  /** How many tiers down it shifts (e.g., Misaligned → Neutral) */
  affinityReductionSteps?: number;
  /** Stat bonuses */
  statBonuses?: Record<string, number>;
  /** Slot compatibility */
  compatibleSlots: EquipmentSlot[];
}

// ── Item stats ──────────────────────────────────────────────────────────────

export interface ItemBaseStats {
  damage?: number;
  armor?: number;
  attributeBonuses?: Partial<Record<string, number>>;
  weaponSpeed?: number; // attacks per second base
}

export interface RarityWeight {
  rarity: RarityTier;
  weight: number;
}

// ── Item definition (data-driven from YAML) ─────────────────────────────────

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  equipSlot?: EquipmentSlot;
  spriteLayer?: string;
  assetVariant?: string;
  stackable: boolean;
  maxStack: number;
  baseStats: ItemBaseStats;
  sequenceSlotCount: number;
  sequenceSlotTypes: string[];
  rarityWeights: RarityWeight[];
  binding: ItemBinding;
  sellValue: number;
  repairCostPerPoint: number;
  durabilityMax: number;
  levelRequirement?: number;
  classRequirement?: string;
}

// ── Item instance (runtime, in a player's inventory) ────────────────────────

export interface SequenceSlot {
  slotType: string;
  sequenceId: string | null;
}

export interface RandomAffix {
  stat: string;
  value: number;
}

export interface ItemInstance {
  id: string;
  definitionId: string;
  ownerId: string;
  rarity: RarityTier;
  raritySource?: 'dropped' | 'crafted';
  levelRequirement: number;
  durabilityCurrent: number;
  durabilityMax: number;
  sequenceSlots: SequenceSlot[];
  randomAffixes: RandomAffix[];
  isBound: boolean;
  createdAt: number;
  source: string;
}
