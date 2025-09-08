import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { missionId, rank } = body || {};
  if (!missionId || !rank) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const playerId = 'local-player';

  // Checar se já existe missão ativa
  const existing = await prisma.missionProgress.findFirst({
    where: { playerId, completed: false },
  });
  if (existing) {
    return NextResponse.json({ error: 'Já existe missão em andamento' }, { status: 400 });
  }

  // Duração baseada no rank
  const durations: Record<string, number> = { F:10,E:20,D:30,C:40,B:50,A:60,S:70,SS:80 };
  const durationSec = durations[rank] || 10;
  const endsAt = new Date(Date.now() + durationSec * 1000);

  const progress = await prisma.missionProgress.create({
    data: { playerId, missionId, rank, endsAt },
  });

  return NextResponse.json({ ok: true, progress });
}
