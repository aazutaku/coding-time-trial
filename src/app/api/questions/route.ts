import { NextResponse } from "next/server";
import questions from "@/data/questions.json";

export async function GET() {
  // ランダムで一問返す
  const q = questions[Math.floor(Math.random() * questions.length)];
  const { id, template } = q;
  return NextResponse.json({ id, template });
}
