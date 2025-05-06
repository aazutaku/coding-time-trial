"use client";
import { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import config from "../game";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const game = new Phaser.Game({ ...config, parent: containerRef.current });
    return () => game.destroy(true);
  }, []);

  return (
    <div
      ref={containerRef}
      id="phaser-container"
      style={{ width: 800, height: 600 }}
    />
  );
}
