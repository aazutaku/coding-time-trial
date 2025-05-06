import * as Phaser from "phaser";

export class MainScene extends Phaser.Scene {
  private totalTime = 30;
  private bombs: Phaser.GameObjects.Image[] = [];
  private score = 0;

  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image("bomb", "/img/time-bomb.png");
    this.load.image("burning", "/img/time-burning.png");
  }

  create() {
    const numBombs = 6;
    const spacing = 70;
    const startX = (this.scale.width - spacing * (numBombs - 1)) / 2;
    const y = 50;

    // 爆弾を並べる
    for (let i = 0; i < numBombs; i++) {
      const bomb = this.add.image(startX + spacing * i, y, "bomb");
      bomb.setDisplaySize(48, 48);
      this.bombs.push(bomb);
    }

    // タイマーイベント（totalTime / numBombsごとに爆弾が1つ爆発）
    const interval = this.totalTime / numBombs;

    this.time.addEvent({
      delay: interval * 1000,
      callback: () => {
        const next = this.bombs.shift();
        if (next) {
          const isLast = this.bombs.length === 0;
          this.explodeWithBurning(next, isLast);
        }
      },
      callbackScope: this,
      repeat: numBombs - 1,
    });
  }

  private explodeWithBurning(
    bomb: Phaser.GameObjects.Image,
    isLast: boolean = false
  ) {
    bomb.setTexture("burning");
    this.tweens.add({
      targets: bomb,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.tweens.add({
          targets: bomb,
          alpha: 0,
          scale: 0,
          duration: 300,
          onComplete: () => {
            bomb.destroy();
            if (isLast) {
              this.scene.start("ResultScene", { score: this.score });
            }
          },
        });
      },
    });
  }
}
