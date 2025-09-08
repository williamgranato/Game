
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

// GET /api/state?playerId=1&slot=0 -> retorna state JSON (ou {})
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const playerIdStr = searchParams.get("playerId");
    const slotStr = searchParams.get("slot") ?? "0";
    const playerId = Number(playerIdStr);
    const slot = Number(slotStr) || 0;
    if (!playerIdStr || Number.isNaN(playerId)) {
      return NextResponse.json({ error: "Informe playerId" }, { status: 400 });
    }
    const gs = await prisma.gameState.findUnique({
      where: { playerId_slot: { playerId, slot } },
    });
    return NextResponse.json(gs?.state ?? {});
  } catch (err) {
    console.error("GET /api/state error:", err);
    return NextResponse.json({ error: "Erro ao buscar estado" }, { status: 500 });
  }
}

// POST /api/state -> upsert do state JSON
// body: { playerId: number, slot?: number, state: any }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const playerId = Number(body?.playerId);
    const slot = Number(body?.slot ?? 0);
    const state = body?.state ?? {};
    if (!playerId || Number.isNaN(playerId)) {
      return NextResponse.json({ error: "playerId inválido" }, { status: 400 });
    }

    const up = await prisma.gameState.upsert({
      where: { playerId_slot: { playerId, slot } },
      update: { state },
      create: { playerId, slot, state },
    });
    return NextResponse.json({ ok: true, id: up.id });
  } catch (err) {
    console.error("POST /api/state error:", err);
    return NextResponse.json({ error: "Erro ao salvar estado" }, { status: 500 });
  }
}
