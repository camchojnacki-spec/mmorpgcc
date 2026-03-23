export enum ItemCategory {
  Weapon = "weapon",
  Armor = "armor",
  Backpack = "backpack",
  Consumable = "consumable",
  Mod = "mod",
  Material = "material",
  Quest = "quest",
  Misc = "misc",
}

export enum SpriteLayerType {
  HandMain = "hand_main",
  HandOff = "hand_off",
  Headwear = "headwear",
  BackItem = "back_item",
}

export enum ItemBinding {
  None = "none",
  BindOnEquip = "bind_on_equip",
  BindOnPickup = "bind_on_pickup",
}

export enum RarityTier {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Epic = "epic",
  Legendary = "legendary",
}

export interface AttributeBonuses {
  [attributeKey: string]: number;
}

export interface ItemBaseStats {
  damage?: number;
  armor?: number;
  attributeBonuses?: AttributeBonuses;
}

export interface RarityWeight {
  rarity: RarityTier;
  weight: number;
}

export interface ItemDefinition {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  layerType?: SpriteLayerType;
  assetVariant?: string;
  stackable: boolean;
  maxStack: number;
  baseStats: ItemBaseStats;
  modSlotCount: number;
  modSlotTypes: string[];
  rarityWeights: RarityWeight[];
  binding: ItemBinding;
  sellValue: number;
  repairCostPerPoint: number;
  durabilityMax: number;
}

export interface ModSlot {
  slotType: string;
  modItemId: string | null;
}

export interface RandomAffix {
  stat: string;
  value: number;
}

export interface ItemInstance {
  id: string;
  definitionId: string;
  characterId: string;
  rarity: RarityTier;
  raritySource?: string;
  levelRequirement: number;
  durabilityCurrent: number;
  durabilityMax: number;
  modSlots: ModSlot[];
  randomAffixes: RandomAffix[];
  isBound: boolean;
  createdAt: number;
  source: string;
}
