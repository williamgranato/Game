
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

// GET /api/players -> lista jogadores
export async function GET() {
  try {
    const players = await prisma.player.findMany({ orderBy: { id: "asc" } });
    return NextResponse.json(players);
  } catch (err) {
    console.error("GET /api/players error:", err);
    return NextResponse.json({ error: "Erro ao buscar jogadores" }, { status: 500 });
  }
}

// POST /api/players -> cria um jogador
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, level = 1, hp = 100, stamina = 100, money = 0 } = body;

    const newPlayer = await prisma.player.create({
      data: { name, level, hp, stamina, money },
    });

    return NextResponse.json(newPlayer, { status: 201 });
  } catch (err) {
    console.error("POST /api/players error:", err);
    return NextResponse.json({ error: "Erro ao criar jogador" }, { status: 500 });
  }
}

// PATCH /api/players -> atualiza campos básicos do jogador
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...fields } = body;

    let targetId = id as number | undefined;
    if (!targetId) {
      const first = await prisma.player.findFirst({ orderBy: { id: "asc" } });
      if (!first) return NextResponse.json({ error: "Nenhum jogador para atualizar." }, { status: 400 });
      targetId = first.id;
    }

    const updated = await prisma.player.update({
      where: { id: targetId! },
      data: fields,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/players error:", err);
    return NextResponse.json({ error: "Erro ao atualizar jogador" }, { status: 500 });
  }
}
