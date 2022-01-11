import { generateAnswer } from "@/lib/answer";
import { retrieve } from "@/lib/retrieval";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as { message?: string };
    if (!message?.trim()) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }
    const chunks = retrieve(message.trim(), 3);
    const { answer, citations } = await generateAnswer(message.trim(), chunks);
    return NextResponse.json({ answer, citations });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
