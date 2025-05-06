# フォルダ構成

```
src/
├─ app/
│ ├─ page.tsx # トップページ
│ ├─ game/
│ │ └─ page.tsx # ゲーム画面 (URL: /game)
│ └─ api/
│ ├─ questions/
│ │ └─ route.ts # 問題取得 API
│ └─ play/
│ └─ route.ts # スコア送信 API
├─ game/
│ ├─ scenes/
│ │ └─ MainScene.ts # Phaser のシーン定義
│ ├─ index.ts # Phaser GameConfig を定義してエクスポート
│ └─ types.ts # 型定義（例：Challenge など）
├─ components/
│ └─ GameCanvas.tsx # Phaser を表示する React コンポーネント
├─ data/
│ └─ questions.json # 問題データ
├─ styles/
│ └─ globals.css # グローバル CSS
└─ public/
└─ (画像・音などアセット)
```
