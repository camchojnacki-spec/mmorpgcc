/** Core attribute keys — generic so designers can rename freely via data. */
export type AttributeKey =
  | "attr_1"
  | "attr_2"
  | "attr_3"
  | "attr_4"
  | "attr_5"
  | "attr_6"
  | "attr_7"
  | "attr_8";

export interface AttributeEffect {
  stat: string;
  perPoint: number;
  description: string;
}

export interface AttributeDefinition {
  id: AttributeKey;
  name: string;
  description: string;
  effects: AttributeEffect[];
}

/** Maps every attribute key to its current value for a character. */
export type CharacterAttributes = Record<AttributeKey, number>;

export interface DerivedStatScaling {
  attribute: AttributeKey;
  perPoint: number;
}

export interface DerivedStatFormula {
  base: number;
  scaling: DerivedStatScaling[];
  /** If true, backpack-slot items can contribute bonus to this stat. */
  backpackBonus?: boolean;
}
