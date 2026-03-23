import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload(): void {
    console.log("BootScene: preloading...");
    // No assets yet — placeholder for future asset loading
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "Engine Initialized", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 48, "Waiting for content...", {
        fontSize: "18px",
        color: "#888888",
      })
      .setOrigin(0.5);

    console.log("BootScene: created");

    // TODO: Load asset manifest, transition to TownScene
  }
}
