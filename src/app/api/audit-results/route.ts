import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canViewAudit } from '@/lib/rbac';

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!canViewAudit(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const criticality = url.searchParams.get('criticality');
  const system = url.searchParams.get('system');
  const responsible = url.searchParams.get('responsible');
  const search = url.searchParams.get('search');
  const page = Math.max(Number(url.searchParams.get('page') ?? '1'), 1);
  const pageSize = Math.min(Math.max(Number(url.searchParams.get('pageSize') ?? '10'), 1), 50);

  const where: any = {};
  if (status) where.status = status;
  if (criticality) where.criticality = criticality;
  if (system) where.system = { contains: system, mode: 'insensitive' };
  if (responsible) where.responsible = { name: { contains: responsible, mode: 'insensitive' } };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { system: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [results, total] = await Promise.all([
    prisma.auditResult.findMany({
      where,
      include: { responsible: true },
      orderBy: { foundAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditResult.count({ where }),
  ]);

  return NextResponse.json({ results, total, page, pageSize });
}
