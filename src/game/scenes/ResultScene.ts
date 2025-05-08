import * as Phaser from "phaser";

export class ResultScene extends Phaser.Scene {
  private finalScore: number = 0;

  constructor() {
    super("ResultScene");
  }

  preload() {
    // ランクごとの背景画像を読み込み
    this.load.image("bg-ses", "/img/bg/bg-ses.png");
    this.load.image("bg-employee", "/img/bg/bg-employee.png");
    this.load.image("bg-lead", "/img/bg/bg-lead.png");
    this.load.image("bg-cto", "/img/bg/bg-cto.png");
    // 結果画面で使うパネル画像をロード
    this.load.image("panelQ", "/img/button_rectangle_depth.png");
  }

  init(data: { score: number }) {
    this.finalScore = data.score;
  }

  create() {
    // 画面中央あたり、タイトル中心座標
    const CX = this.scale.width / 2;
    const CY = this.scale.height / 2 - 20;

    // フラッシュ演出 → 完了後に結果表示
    this.flashExplosion(() => {
      // 1) ランクタイトルを先に作っておく
      const ratio = Phaser.Math.Clamp(this.finalScore / 100, 0, 1);
      const rankText = this.getRankText(ratio);
      const bgKey = this.getBackgroundKey(rankText);

      this.add
        .image(0, 0, bgKey)
        .setOrigin(0, 0)
        .setDisplaySize(this.scale.width, this.scale.height)
        .setDepth(-1);

      const titleText = this.add
        .text(0, 0, rankText, {
          fontSize: "36px",
          color: "#00ff00",
          stroke: "#000000",
          strokeThickness: 4,
          fontFamily: "monospace",
        })
        .setOrigin(0.5);

      // 2) テキストの裏にパネルを敷く
      const padX = 20,
        padY = 10;
      const panelBG = this.add
        .image(0, 0, "panelQ")
        .setDisplaySize(titleText.width + padX * 2, titleText.height + padY * 2)
        .setOrigin(0.5);

      // 3) まとめてContainer化、初期位置は画面外上部
      const container = this.add.container(
        CX,
        -(titleText.height + padY * 2), // 画面外の上側
        [panelBG, titleText]
      );

      // 4) 数秒後に落下＋バウンド
      this.time.delayedCall(1000, () => {
        this.tweens.add({
          targets: container,
          y: CY - (titleText.height + padY * 2) / 2, // 最終Y位置
          ease: "Bounce.Out",
          duration: 800,
        });
      });

      // 3) スコア表示
      this.add
        .text(CX, CY + 50, `Your Score: ${this.finalScore}`, {
          fontSize: "28px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 3,
          fontFamily: "monospace",
        })
        .setOrigin(0.5)
        .setDepth(1);

      // 4) ボタン配置
      const btnY = CY + 100;
      const btnW = 120;
      const btnO = {
        fontSize: "24px",
        fontFamily: "monospace",
        backgroundColor: "#111111",
        padding: { x: 12, y: 6 },
      };

      this.add
        .text(CX - btnW, btnY, "🔙 Top", { ...btnO, color: "#00ffff" })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => (window.location.href = "/"));

      const tweetText = encodeURIComponent(
        `💣 Score: ${this.finalScore} – ${rankText}`
      );
      const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(
        "https://yourgame.example.com"
      )}`;
      this.add
        .text(CX + btnW, btnY, "📢 Share on X", { ...btnO, color: "#1DA1F2" })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => window.open(tweetUrl, "_blank"));
    });
  }

  private getRankText(ratio: number): string {
    if (ratio >= 0.75) return "スタートアップCTO";
    if (ratio >= 0.5) return "テックリード";
    if (ratio >= 0.25) return "正社員エンジニア";
    else return "SES";
  }

  private getBackgroundKey(rankText: string): string {
    if (rankText === "スタートアップCTO") return "bg-cto";
    if (rankText === "テックリード") return "bg-lead";
    if (rankText === "正社員エンジニア") return "bg-employee";
    return "bg-ses";
  }

  private flashExplosion(onComplete: () => void) {
    const flash = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0xff0000, 1)
      .setOrigin(0, 0)
      .setAlpha(0);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0, to: 1 },
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete,
    });
  }
}
