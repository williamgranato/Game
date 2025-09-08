import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { MONSTERS } from '../../../../data/monsters';

function randomPick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }
function rollChance(p: number){ return Math.random() < p; }

export async function POST(req: Request) {
  const body = await req.json();
  const { missionId } = body || {};
  if (!missionId) return NextResponse.json({ error: 'Missing missionId' }, { status: 400 });

  const playerId = 'local-player';
  const progress = await prisma.missionProgress.findFirst({
    where: { playerId, missionId, completed: false },
  });
  if (!progress) return NextResponse.json({ error: 'Missão não encontrada/ativa' }, { status: 404 });

  const now = new Date();
  if (now < progress.endsAt) {
    return NextResponse.json({ error: 'Missão ainda em progresso', progress }, { status: 400 });
  }

  const rank = progress.rank as string;

  // Recompensas simples baseadas no rank
  const baseSilver: Record<string, number> = { F:6,E:10,D:16,C:25,B:40,A:60,S:90,SS:140 };
  const baseExp: Record<string, number> = { F:30,E:60,D:90,C:140,B:220,A:320,S:520,SS:900 };
  const repGain = (rank==='S' ? 3 : rank==='SS' ? 4 : 1);

  await prisma.missionProgress.update({
    where: { id: progress.id },
    data: { completed: true },
  });

  const player = await prisma.player.upsert({
    where: { id: playerId },
    update: {
      silver: { increment: baseSilver[rank] || 0 },
      exp: { increment: baseExp[rank] || 0 },
      reputation: { increment: repGain },
    },
    create: { id: playerId, name: 'Aventureiro' },
  });

  return NextResponse.json({ ok: true, rewards: { silver: baseSilver[rank], exp: baseExp[rank], reputation: repGain }, player });
}
