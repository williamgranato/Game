import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, data } = body as { id: string; data: any };

    if (!id || typeof data === "undefined") {
      return NextResponse.json({ error: "Missing id or data" }, { status: 400 });
    }

    await prisma.save.upsert({
      where: { id },
      update: { data },
      create: { id, data },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
