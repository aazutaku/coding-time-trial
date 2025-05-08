import * as Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";
import { ResultScene } from "./scenes/ResultScene";
import { StartScene } from "./scenes/StartScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScene, MainScene, ResultScene],
  backgroundColor: "#000000",
  parent: "phaser-container",
};

export default config;
