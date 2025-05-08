"use client";

import dynamic from "next/dynamic";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
});

export default function GamePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950">
      <GameCanvas />
    </div>
  );
}
