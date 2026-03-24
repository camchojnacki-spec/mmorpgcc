/**
 * Town scene — the main hub where players gather.
 * Isometric camera, composited sprites, WASD movement, server sync.
 */

import Phaser from 'phaser';
import type { Direction, AnimationState } from '@mmorpg/shared';
import { TILE_WIDTH, TILE_HEIGHT } from '@mmorpg/shared';
import { IsometricCamera } from '../systems/IsometricCamera';
import { CompositedSprite } from '../systems/SpriteCompositor';
import { InputHandler } from '../systems/InputHandler';
import { NetworkManager } from '../systems/NetworkManager';
import { worldToScreen } from '../systems/IsoUtils';

const MOVE_SPEED = 2; // world units per second

export class TownScene extends Phaser.Scene {
  private isoCamera!: IsometricCamera;
  private inputHandler!: InputHandler;
  private networkManager!: NetworkManager;
  private localPlayer!: CompositedSprite;
  private remotePlayers: Map<string, CompositedSprite> = new Map();

  // Local player world position
  private playerWorldX = 10;
  private playerWorldY = 10;

  // Debug overlay
  private debugText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'TownScene' });
  }

  create(): void {
    // ── Draw a placeholder isometric grid ──────────────────────────────
    this.drawIsoGrid(20, 20);

    // ── Input ──────────────────────────────────────────────────────────
    this.inputHandler = new InputHandler(this);

    // ── Camera ─────────────────────────────────────────────────────────
    this.isoCamera = new IsometricCamera(this, {
      followLerp: 0.08,
      defaultZoom: 1.0,
      minZoom: 0.3,
      maxZoom: 3.0,
    });

    // ── Local player sprite ────────────────────────────────────────────
    const screenPos = worldToScreen(this.playerWorldX, this.playerWorldY);
    this.localPlayer = new CompositedSprite(this, {
      x: screenPos.sx,
      y: screenPos.sy,
      direction: 'S',
      layers: {
        baseBody: 'placeholder_body',
      },
    });

    this.isoCamera.follow(this.localPlayer.getContainer());

    // ── Network ────────────────────────────────────────────────────────
    this.networkManager = new NetworkManager();
    this.connectToServer();

    // ── Debug text ─────────────────────────────────────────────────────
    this.debugText = this.add
      .text(10, 10, '', {
        fontSize: '14px',
        color: '#00ff00',
        backgroundColor: '#000000aa',
        padding: { x: 6, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(1000);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    const input = this.inputHandler.getMovement();

    if (input.isMoving) {
      // Normalize diagonal movement
      const mag = Math.sqrt(input.dx * input.dx + input.dy * input.dy);
      const nx = (input.dx / mag) * MOVE_SPEED * dt;
      const ny = (input.dy / mag) * MOVE_SPEED * dt;

      this.playerWorldX += nx;
      this.playerWorldY += ny;

      this.localPlayer.setDirection(input.direction as Direction);
      this.localPlayer.setAnimation('walk');

      // Send to server (throttled to tick rate)
      this.networkManager.sendMovement(
        this.playerWorldX,
        this.playerWorldY,
        input.direction,
      );
    } else {
      this.localPlayer.setAnimation('idle');
    }

    // Update screen position from world position
    const screenPos = worldToScreen(this.playerWorldX, this.playerWorldY);
    this.localPlayer.setPosition(screenPos.sx, screenPos.sy);

    // Depth sort: entities further "south" render on top
    this.localPlayer.getContainer().setDepth(screenPos.sy);

    // Debug overlay
    this.debugText.setText([
      `World: (${this.playerWorldX.toFixed(1)}, ${this.playerWorldY.toFixed(1)})`,
      `Screen: (${screenPos.sx.toFixed(0)}, ${screenPos.sy.toFixed(0)})`,
      `Dir: ${input.direction}`,
      `Zoom: ${this.isoCamera.getZoom().toFixed(2)}`,
      `Players: ${this.remotePlayers.size + 1}`,
    ].join('\n'));
  }

  /** Connect to Colyseus server and set up state listeners. */
  private async connectToServer(): Promise<void> {
    try {
      const room = await this.networkManager.joinTown();

      // Listen for other players joining
      room.onMessage('playerJoin', (data: { id: string; x: number; y: number; direction: string }) => {
        this.addRemotePlayer(data.id, data.x, data.y, data.direction as Direction);
      });

      // Listen for other players moving
      room.onMessage('playerMove', (data: { id: string; x: number; y: number; direction: string }) => {
        this.updateRemotePlayer(data.id, data.x, data.y, data.direction as Direction);
      });

      // Listen for other players leaving
      room.onMessage('playerLeave', (data: { id: string }) => {
        this.removeRemotePlayer(data.id);
      });

      console.log('Connected to town server');
    } catch (err) {
      console.warn('Server not available — running in offline mode');
    }
  }

  /** Add a remote player sprite. */
  private addRemotePlayer(id: string, wx: number, wy: number, dir: Direction): void {
    const screenPos = worldToScreen(wx, wy);
    const sprite = new CompositedSprite(this, {
      x: screenPos.sx,
      y: screenPos.sy,
      direction: dir,
      layers: { baseBody: 'placeholder_body' },
    });
    this.remotePlayers.set(id, sprite);
  }

  /** Update a remote player's position. */
  private updateRemotePlayer(id: string, wx: number, wy: number, dir: Direction): void {
    const sprite = this.remotePlayers.get(id);
    if (!sprite) return;

    const screenPos = worldToScreen(wx, wy);
    sprite.setPosition(screenPos.sx, screenPos.sy);
    sprite.setDirection(dir);
    sprite.setAnimation('walk');
    sprite.getContainer().setDepth(screenPos.sy);
  }

  /** Remove a remote player. */
  private removeRemotePlayer(id: string): void {
    const sprite = this.remotePlayers.get(id);
    if (sprite) {
      sprite.destroy();
      this.remotePlayers.delete(id);
    }
  }

  /** Draw a placeholder isometric tile grid for visual reference. */
  private drawIsoGrid(cols: number, rows: number): void {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x333355, 0.4);

    for (let r = 0; r <= rows; r++) {
      const start = worldToScreen(0, r);
      const end = worldToScreen(cols, r);
      graphics.lineBetween(start.sx, start.sy, end.sx, end.sy);
    }
    for (let c = 0; c <= cols; c++) {
      const start = worldToScreen(c, 0);
      const end = worldToScreen(c, rows);
      graphics.lineBetween(start.sx, start.sy, end.sx, end.sy);
    }

    graphics.setDepth(-1);
  }
}
