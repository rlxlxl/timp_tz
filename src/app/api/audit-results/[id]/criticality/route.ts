import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canChangeCriticality } from '@/lib/rbac';

const validCriticalities = ['Low', 'Medium', 'High', 'Critical'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canChangeCriticality(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { criticality, riskScore } = await req.json();

    if (!criticality || !validCriticalities.includes(criticality)) {
      return NextResponse.json({ error: 'Invalid criticality' }, { status: 400 });
    }

    const audit = await prisma.auditResult.findUnique({
      where: { id: Number(id) },
      select: { criticality: true, riskScore: true },
    });

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    const updateData: any = { criticality };
    if (riskScore !== undefined && riskScore >= 0 && riskScore <= 10) {
      updateData.riskScore = riskScore;
    }

    const updated = await prisma.auditResult.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        responsible: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'desc' },
        },
        history: {
          include: { performedBy: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Create history entry
    const changes = [];
    if (criticality !== audit.criticality) {
      changes.push(`критичность: ${audit.criticality} → ${criticality}`);
    }
    if (riskScore !== undefined && riskScore !== audit.riskScore) {
      changes.push(`риск: ${audit.riskScore} → ${riskScore}`);
    }

    await prisma.auditHistory.create({
      data: {
        action: 'Параметры изменены',
        details: changes.join(', '),
        performedById: user.id,
        auditResultId: Number(id),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Criticality update error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
