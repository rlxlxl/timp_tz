import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        authorId: user.id,
        auditResultId: Number(id),
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    // Also create history entry for the comment
    await prisma.auditHistory.create({
      data: {
        action: 'Комментарий добавлен',
        details: text.trim().substring(0, 100),
        performedById: user.id,
        auditResultId: Number(id),
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
