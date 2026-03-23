export enum Direction {
  S = "S",
  SE = "SE",
  E = "E",
  NE = "NE",
  N = "N",
  SW = "SW",
  W = "W",
  NW = "NW",
}

export enum AnimationState {
  Idle = "idle",
  Walk = "walk",
  Attack = "attack",
  Cast = "cast",
  Hit = "hit",
  Death = "death",
  Block = "block",
  Channel = "channel",
}

export enum EntityType {
  Player = "player",
  Npc = "npc",
  Enemy = "enemy",
  Boss = "boss",
  Nemesis = "nemesis",
}

export interface SpriteLayers {
  baseBody: string;
  backItem?: string;
  headwear?: string;
  handMain?: string;
  handOff?: string;
  vfx?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface EntityState {
  id: string;
  type: EntityType;
  name: string;
  position: Position;
  direction: Direction;
  animationState: AnimationState;
  spriteLayers: SpriteLayers;
  currentHp: number;
  maxHp: number;
  level: number;
  targetId?: string;
  isAlive: boolean;
}
