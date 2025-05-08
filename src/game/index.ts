import * as Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";
import { ResultScene } from "./scenes/ResultScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainScene, ResultScene],
  backgroundColor: "#000000",
  parent: "phaser-container",
};

export default config;
