import { NextResponse } from "next/server";
import questions from "@/data/questions.json";
export async function POST(req: Request) {
  const { id, answer, time } = await req.json();
  const q = questions.find((q) => q.id === id);
  const score = q?.answer === answer ? Math.max(600 - time, 0) : 0;
  return NextResponse.json({ score });
}
