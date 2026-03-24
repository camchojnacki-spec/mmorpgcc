/**
 * Input handler — WASD/arrow key movement + click-to-target.
 * Produces movement vectors and target selections for the game scene.
 */

import Phaser from 'phaser';
import { vectorToDirection } from './IsoUtils';

export interface MovementInput {
  dx: number;  // -1, 0, 1
  dy: number;  // -1, 0, 1
  direction: string;
  isMoving: boolean;
}

export class InputHandler {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.wasd = {
      W: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  /** Poll current movement state. Call every frame. */
  getMovement(): MovementInput {
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) dx -= 1;
    if (this.cursors.right.isDown || this.wasd.D.isDown) dx += 1;
    if (this.cursors.up.isDown || this.wasd.W.isDown) dy -= 1;
    if (this.cursors.down.isDown || this.wasd.S.isDown) dy += 1;

    const isMoving = dx !== 0 || dy !== 0;
    const direction = isMoving ? vectorToDirection(dx, dy) : 'S';

    return { dx, dy, direction, isMoving };
  }
}
