/**
 * Isometric camera system for Phaser 3.
 * Follows the player character smoothly, supports zoom in/out.
 */

import Phaser from 'phaser';

export interface CameraConfig {
  /** Lerp factor for smooth following (0-1). Lower = smoother. */
  followLerp: number;
  /** Minimum zoom level */
  minZoom: number;
  /** Maximum zoom level */
  maxZoom: number;
  /** Default zoom level */
  defaultZoom: number;
  /** Zoom step per scroll tick */
  zoomStep: number;
}

const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  followLerp: 0.08,
  minZoom: 0.5,
  maxZoom: 2.0,
  defaultZoom: 1.0,
  zoomStep: 0.1,
};

export class IsometricCamera {
  private camera: Phaser.Cameras.Scene2D.Camera;
  private config: CameraConfig;
  private target: Phaser.GameObjects.GameObject | null = null;

  constructor(scene: Phaser.Scene, config?: Partial<CameraConfig>) {
    this.camera = scene.cameras.main;
    this.config = { ...DEFAULT_CAMERA_CONFIG, ...config };
    this.camera.setZoom(this.config.defaultZoom);

    // Zoom with mouse wheel
    scene.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: unknown[], _dx: number, dy: number) => {
      const newZoom = Phaser.Math.Clamp(
        this.camera.zoom + (dy > 0 ? -this.config.zoomStep : this.config.zoomStep),
        this.config.minZoom,
        this.config.maxZoom,
      );
      this.camera.setZoom(newZoom);
    });
  }

  /** Start following a target game object. */
  follow(target: Phaser.GameObjects.GameObject): void {
    this.target = target;
    this.camera.startFollow(
      target,
      true,
      this.config.followLerp,
      this.config.followLerp,
    );
  }

  /** Stop following and free the camera. */
  unfollow(): void {
    this.target = null;
    this.camera.stopFollow();
  }

  /** Set zoom level directly. */
  setZoom(zoom: number): void {
    this.camera.setZoom(
      Phaser.Math.Clamp(zoom, this.config.minZoom, this.config.maxZoom),
    );
  }

  getZoom(): number {
    return this.camera.zoom;
  }

  getTarget(): Phaser.GameObjects.GameObject | null {
    return this.target;
  }
}
