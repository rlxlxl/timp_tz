import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canUpdateStatus } from '@/lib/rbac';

const validStatuses = ['New', 'InProgress', 'Resolved', 'Closed'];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canUpdateStatus(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { status } = await req.json();

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const audit = await prisma.auditResult.findUnique({
      where: { id: Number(id) },
      select: { status: true },
    });

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 });
    }

    if (audit.status === status) {
      return NextResponse.json({ error: 'Status is already set' }, { status: 400 });
    }

    const updated = await prisma.auditResult.update({
      where: { id: Number(id) },
      data: { status },
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
    await prisma.auditHistory.create({
      data: {
        action: 'Статус изменён',
        details: `${audit.status} → ${status}`,
        performedById: user.id,
        auditResultId: Number(id),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
