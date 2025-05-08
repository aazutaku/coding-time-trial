import * as Phaser from "phaser";
import questions from "@/data/questions.json"; // src/data/questions.json に保存されている前提

export class MainScene extends Phaser.Scene {
  private score = 0;
  private readonly maxScore = 100;

  private background!: Phaser.GameObjects.Image;

  private avatar!: Phaser.GameObjects.Image;
  private pathYTop!: number;
  private pathWidth!: number;
  private thresholds = [0.25, 0.5, 0.75];

  private totalTime = 30;
  private bombs: Phaser.GameObjects.Image[] = [];

  private userInput: string = "";
  private inputText!: Phaser.GameObjects.Text;

  private currentQuestionText!: Phaser.GameObjects.Text;
  private currentTemplateText!: Phaser.GameObjects.Text;

  private currentChallenge: {
    question: string;
    template: string;
    answer: string;
    score: number;
  } | null = null;
  private challenges = [...questions];

  constructor() {
    super("MainScene");
  }

  preload() {
    // 時間経過の爆弾
    this.load.image("bomb", "/img/time-bomb.png");
    this.load.image("burning", "/img/time-burning.png");
    // 背景画像（レベル分）
    this.load.image("bg-ses", "/img/bg/bg-ses.png");
    this.load.image("bg-employee", "/img/bg/bg-employee.png");
    this.load.image("bg-lead", "/img/bg/bg-lead.png");
    this.load.image("bg-cto", "/img/bg/bg-cto.png");
    // パネル
    this.load.image("panelQ", "/img/button_rectangle_depth.png");
    this.load.image("panelScrews", "/img/panel_rectangle_screws.png");
    this.load.image("bombPanel", "/img/bar_square_gloss_large.png");
    // キャリアロード
    this.load.image("grassTop", "/img/road/terrain_grass_block_top.png");
    this.load.image("grassCenter", "/img/road/terrain_grass_block_center.png");
    this.load.image("flag", "/img/road/flag_red_a.png");
    this.load.image("goal", "/img/road/door_closed_top.png");
    // キャラクター
    this.load.image("char1", "/img/char/char1.png");
    this.load.image("char2", "/img/char/char2.png");
    this.load.image("char3", "/img/char/char3.png");
    this.load.image("char4", "/img/char/char4.png");
  }

  create() {
    // 一番手前に“背景”を置きたいので、最初に描画して depth を下げる
    this.background = this.add.image(0, 0, "bg-ses").setOrigin(0).setDepth(-10);

    const M = 20; // マージン
    const SW = this.scale.width; // 画面幅
    const SH = this.scale.height; // 画面高さ

    // パネルサイズ
    const PANEL = {
      width: SW - M * 2,
      height: 200,
    };

    // スクリューパネル（テンプレート用）
    const SCREWS = {
      width: PANEL.width - M * 2,
      height: 70,
      offsetY: 30,
    };

    // 9-slice の slice サイズ
    const SLICE = {
      main: 50,
      screws: 30,
    };

    // コンテナ配置座標（中心）
    const CX = SW / 2;
    const CY = PANEL.height / 2 + 150;

    // ── Container の生成 ─────────────────────────────
    const qc = this.add.container(CX, CY).setDepth(0);

    // ① メインパネル (背景)
    const mainPanel = this.add
      .nineslice(
        0,
        0,
        "panelQ",
        undefined,
        PANEL.width,
        PANEL.height,
        SLICE.main,
        SLICE.main,
        SLICE.main,
        SLICE.main
      )
      .setOrigin(0.5);
    qc.add(mainPanel);

    // ② テンプレート専用パネル (ネジ付き)
    const screwsPanel = this.add
      .nineslice(
        0,
        SCREWS.offsetY,
        "panelScrews",
        undefined,
        SCREWS.width,
        SCREWS.height,
        SLICE.screws,
        SLICE.screws,
        SLICE.screws,
        SLICE.screws
      )
      .setOrigin(0.5);
    qc.add(screwsPanel);

    // ③ 問題文テキスト
    const qTextY = -PANEL.height / 2 + 50;
    this.currentQuestionText = this.add
      .text(0, qTextY, this.currentChallenge?.question || "", {
        fontSize: "20px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        fontFamily: "monospace",
        align: "center",
        wordWrap: { width: PANEL.width - M * 2 },
      })
      .setOrigin(0.5);
    qc.add(this.currentQuestionText);

    // ④ テンプレートテキスト
    this.currentTemplateText = this.add
      .text(0, SCREWS.offsetY, this.currentChallenge?.template || "", {
        fontSize: "24px",
        color: "#00ff00",
        stroke: "#000000",
        strokeThickness: 1,
        fontFamily: "monospace",
        align: "center",
        wordWrap: { width: SCREWS.width - M * 2 },
      })
      .setOrigin(0.5);
    qc.add(this.currentTemplateText);

    // 登場アニメ
    qc.setScale(0);
    this.tweens.add({
      targets: qc,
      scale: 1,
      duration: 1000,
      ease: "Back.Out",
    });

    // ❷ 入力欄用パネル
    const panelInput = this.add.graphics();
    // インセットシャドウ
    panelInput.fillStyle(0x000000, 0.5);
    panelInput.fillRoundedRect(22, 232, this.scale.width - 44, 56, 12);
    // メイン背景
    panelInput.fillStyle(0x111133, 0.9);
    panelInput.fillRoundedRect(20, 230, this.scale.width - 40, 60, 12);
    // 枠線
    panelInput.lineStyle(2, 0x99ff88, 1);
    panelInput.strokeRoundedRect(20, 230, this.scale.width - 40, 60, 12);

    // ❸ 入力テキスト
    this.inputText = this.add
      .text(this.scale.width / 2, 260, "> _", {
        fontSize: "24px",
        color: "#ffff00",
        fontFamily: "monospace",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // ❺ Container にまとめる
    const inputContainer = this.add.container(0, 200, [
      panelInput,
      this.inputText,
    ]);
    inputContainer.setDepth(10);

    // ❸ タイマー／爆弾用パネル
    const timerW = 180;
    const timerH = 40;
    const timerX = this.scale.width - 20 - timerW / 2;
    const timerY = 20 + timerH / 2;
    this.add
      .image(timerX, timerY, "bombPanel")
      .setDisplaySize(timerW, timerH)
      .setOrigin(0.5)
      .setDepth(5);

    // 爆弾を並べる
    const numBombs = 6;
    const bombCount = numBombs;
    const bombSize = 24;
    const bombSpacing = bombSize + 4;
    // timerX, timerY は先に定義済み
    const bombsStartX = timerX - ((bombCount - 1) * bombSpacing) / 2;
    const bombsY = timerY;
    this.bombs = [];
    for (let i = 0; i < bombCount; i++) {
      const bomb = this.add
        .image(bombsStartX + bombSpacing * i, bombsY, "bomb")
        .setDisplaySize(bombSize, bombSize)
        .setDepth(5);
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

    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        this.userInput = this.userInput.slice(0, -1);
      } else if (event.key === "Enter") {
        this.checkAnswer();
      } else if (event.key.length === 1) {
        this.userInput += event.key;
      }
      this.inputText.setText("> " + this.userInput + "_");
    });

    this.setNewChallenge();

    // ── ① 道（グラス）を画面下にタイル表示 ──────────────────
    const grassH = 32,
      topH = 16;
    this.pathYTop = SH - grassH - topH;
    this.pathWidth = SW;

    this.add
      .tileSprite(SW / 2, this.pathYTop + topH / 2, SW, topH, "grassTop")
      .setOrigin(0.5);
    this.add
      .tileSprite(
        SW / 2,
        this.pathYTop + topH + grassH / 2,
        SW,
        grassH,
        "grassCenter"
      )
      .setOrigin(0.5);

    for (const p of this.thresholds) {
      this.add
        .image(SW * p, this.pathYTop, "flag")
        .setOrigin(0.5, 1)
        .setDisplaySize(32, 32);
    }

    this.avatar = this.add
      .image(0, this.pathYTop, "char1")
      .setOrigin(0.5, 1)
      .setDisplaySize(48, 48);
  }

  private updateBackground(rankKey: string) {
    // フェードアウト＋フェードインで差し替え
    this.tweens.add({
      targets: this.background,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.background.setTexture(rankKey);
        this.tweens.add({ targets: this.background, alpha: 1, duration: 300 });
      },
    });
  }

  /**
   * score
   */
  private updateCareerProgress() {
    const progress = Phaser.Math.Clamp(this.score / this.maxScore, 0, 1);
    const targetX = progress * this.pathWidth;

    // ① Tween avatar along the path
    this.tweens.add({
      targets: this.avatar,
      x: targetX,
      ease: "Power2",
      duration: 400,
    });

    // ② Determine which avatar key to use
    let newKey = "char1";
    if (progress >= this.thresholds[2]) newKey = "char4";
    else if (progress >= this.thresholds[1]) newKey = "char3";
    else if (progress >= this.thresholds[0]) newKey = "char2";

    // ③ If it’s changed, cross-fade + pop
    if (this.avatar.texture.key !== newKey) {
      this.avatar.setTexture(newKey);
      this.avatar.setDisplaySize(48, 48);

      // 点滅エフェクト（透明⇄不透明を3回）
      this.tweens.add({
        targets: this.avatar,
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          // 最終的に確実に不透明に戻す
          this.avatar.setAlpha(1);
        },
      });
    }
  }

  /**
   * スコアに応じて背景キーを返す
   */
  private getRankFromScore(score: number): string {
    if (score < 20) {
      return "bg-ses"; // SES
    } else if (score < 40) {
      return "bg-employee"; // 正社員エンジニア
    } else if (score < 60) {
      return "bg-lead"; // テックリード
    } else {
      return "bg-cto"; // スタートアップCTO 以降
    }
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

  private setNewChallenge() {
    this.currentChallenge = this.challenges.shift() || null;
    if (this.currentChallenge) {
      this.currentQuestionText.setText(this.currentChallenge.question);
      this.currentTemplateText.setText(this.currentChallenge.template);
    } else {
      this.currentQuestionText.setText("全ての問題をクリアしました！");
      this.currentTemplateText.setText("");
    }
  }

  private checkAnswer() {
    if (!this.currentChallenge) return;

    const correct =
      this.currentChallenge.answer.trim() === this.userInput.trim();

    if (correct) {
      this.score += this.currentChallenge.score || 0;
      this.updateCareerProgress();

      // ランクアップしたら演出を入れる
      const newRank = this.getRankFromScore(this.score); // 例: "bg-employee" などを返す
      this.updateBackground(newRank);

      // 次の問題があれば進める
      if (this.challenges.length > 0) {
        this.setNewChallenge();
      } else {
        // すべて終わったら爆弾も消してゲーム終了（演出）
        this.time.delayedCall(300, () => {
          this.scene.start("ResultScene", { score: this.score });
        });
      }
    } else {
      // 間違えたら入力欄を赤く点滅
      this.tweens.add({
        targets: this.inputText,
        alpha: 0,
        duration: 100,
        yoyo: true,
        repeat: 2,
      });
    }

    this.userInput = "";
    this.inputText.setText("> ");
  }
}
