/**
 * 6-layer sprite compositor.
 * Composites character visuals from base body + equipment layers.
 * Each layer is a separate Phaser.Image stacked via depth sorting.
 *
 * Layers (back to front):
 *   0. Back item (cloaks, backpacks)
 *   1. Base body (includes skin tone, body type)
 *   2. Armor (chest piece)
 *   3. Headwear (helmets, hoods)
 *   4. Main hand weapon
 *   5. Off hand (shield, secondary)
 *   6. VFX overlay (resonance glow, status effects)
 */

import Phaser from 'phaser';
import type { SpriteLayers, Direction, AnimationState } from '@mmorpg/shared';
import { DIRECTIONS_MIRRORED } from '@mmorpg/shared';

export interface CompositorConfig {
  /** X position in world */
  x: number;
  /** Y position in world */
  y: number;
  /** Initial direction */
  direction: Direction;
  /** Initial layer keys */
  layers: SpriteLayers;
}

/** The ordered layer slots for depth sorting. */
const LAYER_ORDER = [
  'backItem',
  'baseBody',
  'armor',
  'headwear',
  'handMain',
  'handOff',
  'vfx',
] as const;

/**
 * A composited character made of multiple layered sprites.
 * All layers move together as a group.
 */
export class CompositedSprite {
  private container: Phaser.GameObjects.Container;
  private layerSprites: Map<string, Phaser.GameObjects.Image> = new Map();
  private currentDirection: Direction;
  private currentAnimation: AnimationState = 'idle';

  constructor(
    private scene: Phaser.Scene,
    config: CompositorConfig,
  ) {
    this.container = scene.add.container(config.x, config.y);
    this.currentDirection = config.direction;
    this.buildLayers(config.layers);
  }

  /** Build or rebuild all layers from a SpriteLayers definition. */
  private buildLayers(layers: SpriteLayers): void {
    // Clear existing
    this.layerSprites.forEach((sprite) => sprite.destroy());
    this.layerSprites.clear();
    this.container.removeAll();

    const layerData: Record<string, string | undefined> = {
      backItem: layers.backItem,
      baseBody: layers.baseBody,
      armor: layers.armor,
      headwear: layers.headwear,
      handMain: layers.handMain,
      handOff: layers.handOff,
      vfx: layers.vfx,
    };

    let depth = 0;
    for (const slot of LAYER_ORDER) {
      const assetKey = layerData[slot];
      if (assetKey) {
        const frameKey = this.getFrameKey(assetKey);
        // Use a colored rectangle as placeholder if texture doesn't exist
        let sprite: Phaser.GameObjects.Image;
        if (this.scene.textures.exists(frameKey)) {
          sprite = this.scene.add.image(0, 0, frameKey);
        } else {
          // Placeholder: create a simple colored rectangle
          sprite = this.scene.add.image(0, 0, '__DEFAULT');
          sprite.setDisplaySize(32, 48);
          sprite.setTint(this.getPlaceholderColor(slot));
        }
        sprite.setDepth(depth);
        this.layerSprites.set(slot, sprite);
        this.container.add(sprite);
      }
      depth++;
    }
  }

  /** Get texture frame key based on direction and animation state. */
  private getFrameKey(baseAsset: string): string {
    const dir = this.getResolvedDirection();
    return `${baseAsset}_${dir}_${this.currentAnimation}`;
  }

  /** Resolve mirrored directions to their generated counterpart. */
  private getResolvedDirection(): string {
    const mirrored = DIRECTIONS_MIRRORED[this.currentDirection];
    return mirrored ?? this.currentDirection;
  }

  /** Check if current direction needs horizontal flipping. */
  private isMirrored(): boolean {
    return this.currentDirection in DIRECTIONS_MIRRORED;
  }

  /** Update sprite direction and flip if mirrored. */
  setDirection(dir: Direction): void {
    if (dir === this.currentDirection) return;
    this.currentDirection = dir;

    const shouldFlip = this.isMirrored();
    this.container.setScale(shouldFlip ? -1 : 1, 1);
  }

  /** Update animation state. */
  setAnimation(anim: AnimationState): void {
    if (anim === this.currentAnimation) return;
    this.currentAnimation = anim;
    // When real spritesheets are loaded, this will update frames
  }

  /** Update a single layer's asset (e.g., equipment change). */
  updateLayer(slot: string, assetKey: string | undefined): void {
    const existing = this.layerSprites.get(slot);
    if (existing) {
      existing.destroy();
      this.layerSprites.delete(slot);
    }

    if (assetKey) {
      const sprite = this.scene.add.image(0, 0, '__DEFAULT');
      sprite.setDisplaySize(32, 48);
      sprite.setTint(this.getPlaceholderColor(slot));
      sprite.setDepth(LAYER_ORDER.indexOf(slot as typeof LAYER_ORDER[number]));
      this.layerSprites.set(slot, sprite);
      this.container.add(sprite);
    }
  }

  /** Set screen position. */
  setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  /** Get the underlying container (for camera follow). */
  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  /** Destroy all layers and container. */
  destroy(): void {
    this.layerSprites.forEach((s) => s.destroy());
    this.layerSprites.clear();
    this.container.destroy();
  }

  /** Placeholder colors for each layer during development. */
  private getPlaceholderColor(slot: string): number {
    const colors: Record<string, number> = {
      backItem: 0x4a4a4a,
      baseBody: 0xd4a574,  // Skin tone
      armor: 0x5555aa,     // Blue armor
      headwear: 0x888888,
      handMain: 0xaa5555,  // Red weapon
      handOff: 0x55aa55,   // Green shield
      vfx: 0xffff00,
    };
    return colors[slot] ?? 0xffffff;
  }
}
