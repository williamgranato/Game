import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  const playerId = 'local-player';
  const progress = await prisma.missionProgress.findFirst({
    where: { playerId, completed: false },
  });
  if (!progress) return NextResponse.json({ active: null });
  return NextResponse.json({ active: progress });
}
