import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all audit results
    const audits = await prisma.auditResult.findMany({
      select: {
        id: true,
        criticality: true,
        status: true,
        system: true,
        foundAt: true,
        riskScore: true,
      },
      orderBy: { foundAt: 'desc' },
    });

    // Distribution by criticality
    const byCriticality = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };
    audits.forEach((a) => {
      byCriticality[a.criticality as keyof typeof byCriticality]++;
    });

    // Distribution by status
    const byStatus = {
      New: 0,
      InProgress: 0,
      Resolved: 0,
      Closed: 0,
    };
    audits.forEach((a) => {
      byStatus[a.status as keyof typeof byStatus]++;
    });

    // Count by system
    const bySystem: Record<string, number> = {};
    audits.forEach((a) => {
      bySystem[a.system] = (bySystem[a.system] || 0) + 1;
    });

    // Timeline - audits by month
    const timeline: Record<string, number> = {};
    audits.forEach((a) => {
      const month = new Date(a.foundAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'short',
      });
      timeline[month] = (timeline[month] || 0) + 1;
    });

    // Statistics
    const stats = {
      total: audits.length,
      avgRiskScore: audits.length > 0 ? (audits.reduce((sum, a) => sum + a.riskScore, 0) / audits.length).toFixed(1) : '0',
      byCriticality,
      byStatus,
      bySystem: Object.entries(bySystem)
        .map(([name, count]) => ({ name, value: count }))
        .sort((a, b) => b.value - a.value),
      timeline: Object.entries(timeline)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
