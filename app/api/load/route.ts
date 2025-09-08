import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id") ?? undefined;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const row = await prisma.save.findUnique({ where: { id } });
    if (!row) return NextResponse.json({ data: null });
    return NextResponse.json({ data: row.data, updatedAt: row.updatedAt });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
