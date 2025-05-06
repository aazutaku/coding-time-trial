import * as Phaser from "phaser";

export class ResultScene extends Phaser.Scene {
  private finalScore: number = 0;

  constructor() {
    super("ResultScene");
  }

  init(data: { score: number }) {
    this.finalScore = data.score;
  }

  create() {
    this.flashExplosion(() => {
      this.showScore();
    });
  }

  private flashExplosion(onComplete: () => void) {
    const flash = this.add.rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0xff0000,
      1
    );
    flash.setOrigin(0);
    flash.setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: 1 },
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete,
    });
  }

  private showScore() {
    const bg = this.add.rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.85
    );
    bg.setOrigin(0, 0);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 40,
        "Mission Failed",
        {
          fontSize: "48px",
          color: "#ff5555",
          fontFamily: "monospace",
        }
      )
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        `Your Score: ${this.finalScore}`,
        {
          fontSize: "32px",
          color: "#ffffff",
          fontFamily: "monospace",
        }
      )
      .setOrigin(0.5);
  }
}
