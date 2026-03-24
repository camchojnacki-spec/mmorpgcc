import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Show loading bar
    const { width, height } = this.scale;
    const bar = this.add.graphics();
    const box = this.add.graphics();

    box.fillStyle(0x222244, 0.8);
    box.fillRect(width / 2 - 160, height / 2 - 15, 320, 30);

    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0x4488ff, 1);
      bar.fillRect(width / 2 - 155, height / 2 - 10, 310 * value, 20);
    });

    this.load.on('complete', () => {
      bar.destroy();
      box.destroy();
    });

    // Future: load asset manifest, spritesheets, tilemaps
    // For now, nothing to preload — we use placeholder graphics
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, 'Engine Initialized', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 48, 'Press ENTER to continue', {
        fontSize: '18px',
        color: '#888888',
      })
      .setOrigin(0.5);

    // Transition to TownScene on Enter
    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('TownScene');
    });

    // Also auto-transition after 2 seconds in dev mode
    this.time.delayedCall(2000, () => {
      if (this.scene.isActive('BootScene')) {
        this.scene.start('TownScene');
      }
    });
  }
}
