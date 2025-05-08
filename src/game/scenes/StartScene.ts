import * as Phaser from "phaser";

export class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    // 結果画面で使うパネル画像をロード
    this.load.image("panelQ", "/img/button_rectangle_depth.png");
  }

  create() {
    const { width, height } = this.scale;
    const panelW = width * 0.8;
    const panelH = 150;
    const cx = width / 2;
    const cy = height / 2;

    // スタートシーン用コンテナ
    const startContainer = this.add.container(0, 0);

    // 中央パネル
    const panel = this.add
      .nineslice(cx, cy, "panelQ", undefined, panelW, panelH, 50, 50, 50, 50)
      .setOrigin(0.5)
      .setDepth(0);

    // 説明文テキスト
    const text = [
      "Welcome to Coding Time Attack!",
      "Press [Enter] to start the countdown",
    ].join("\n");

    const introText = this.add
      .text(cx, cy - 10, text, {
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        fontFamily: "monospace",
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(1);

    // コンテナに追加
    startContainer.add([panel, introText]);

    // Enter キーでパネルと説明を消し、カウントダウン開始
    this.input.keyboard!.on("keydown-ENTER", () => {
      startContainer.destroy();
      this.startCountdown();
    });
  }

  private startCountdown() {
    const { width, height } = this.scale;
    const cx = width / 2;
    const cy = height / 2;
    const numbers = ["3", "2", "1"];

    let idx = 0;
    const showNumber = () => {
      if (idx >= numbers.length) {
        this.scene.start("MainScene");
        return;
      }
      const n = this.add
        .text(cx, cy, numbers[idx], {
          fontSize: "64px",
          color: "#ff3333",
          stroke: "#000000",
          strokeThickness: 4,
          fontFamily: "monospace",
        })
        .setOrigin(0.5)
        .setDepth(2);

      this.tweens.add({
        targets: n,
        scale: { from: 1, to: 1.5 },
        alpha: { from: 1, to: 0 },
        ease: "Power1",
        duration: 800,
        onComplete: () => {
          n.destroy();
          idx++;
          showNumber();
        },
      });
    };

    showNumber();
  }
}
