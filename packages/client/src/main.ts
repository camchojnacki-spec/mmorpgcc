import Phaser from 'phaser';
import { BootScene, CharacterCreateScene, TownScene } from './scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  parent: 'game-container',
  backgroundColor: '#0a0a1a',
  scene: [BootScene, CharacterCreateScene, TownScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // No physics engine — combat is server-authoritative, movement is simple
  render: {
    pixelArt: true,
    antialias: false,
  },
};

const game = new Phaser.Game(config);

console.log('Game client initialized');

export default game;
