"use client";

import Link from "next/link";
import { useState } from "react";
import { Video, X } from "lucide-react";

export default function Home() {
  const [selectedLang, setSelectedLang] = useState<"typescript" | null>(null);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-4 z-10">
      <h1 className="text-5xl font-extrabold mb-6">Coding Time Attack</h1>

      {/* 言語選択案内 */}
      <p className="text-lg text-gray-300 mb-2 z-10">言語を選択してください</p>

      {/* 言語選択 */}
      <div className="flex gap-4 mb-6 z-10">
        <button
          onClick={() => setSelectedLang("typescript")}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            selectedLang === "typescript"
              ? "bg-cyan-500 text-black scale-105"
              : "bg-cyan-700 text-white hover:bg-cyan-600"
          }`}
        >
          TypeScript
        </button>

        {/* Pythonは非活性 */}
        <button
          disabled
          className="px-6 py-3 rounded-lg bg-gray-600 text-gray-300 cursor-not-allowed opacity-60"
        >
          Python (Coming Soon)
        </button>
      </div>

      {/* Startボタンは言語選択後に表示 */}
      <Link
        href={selectedLang ? `/game?lang=${selectedLang}` : "#"}
        className={`px-8 py-4 rounded-full text-lg font-semibold z-10 mb-6 transition transform ${
          selectedLang
            ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:scale-105"
            : "bg-gray-600 text-gray-300 cursor-not-allowed opacity-50"
        }`}
        onClick={(e) => {
          if (!selectedLang) {
            e.preventDefault(); // 選択されていないときは遷移を防ぐ
          }
        }}
      >
        Start Game
      </Link>

      {/* 宣伝セクション */}
      <div className="w-full max-w-lg px-6 py-4 mt-8 bg-gray-800/80 rounded-2xl z-10 shadow-lg text-center">
        <p className="text-sm text-gray-300 mb-4">
          🎥 YouTubeのチャンネル登録と🐦Xのフォローよろしくお願いします！
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="https://www.youtube.com/your-channel"
            target="_blank"
            rel="noopener noreferrer"
            className="w-60 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition"
          >
            <Video className="w-5 h-5" />
            YouTube
          </a>
          <a
            href="https://twitter.com/your_profile"
            target="_blank"
            rel="noopener noreferrer"
            className="w-60 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition"
          >
            <X className="w-5 h-5" />
            （旧Twitter）
          </a>
        </div>
      </div>

      {/* 背景エフェクト */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-70"></div>
        <div className="absolute top-0 left-0 right-0 h-[20vh] bg-gradient-to-b from-green-900/20 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB...')] bg-repeat"></div>
        </div>
      </div>
    </main>
  );
}
