const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.comment.deleteMany();
  await prisma.auditHistory.deleteMany();
  await prisma.auditResult.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'Admin',
    },
  });

  const analystL1 = await prisma.user.create({
    data: {
      email: 'analyst1@example.com',
      name: 'Analyst L1',
      role: 'AnalystL1',
    },
  });

  const analystL2 = await prisma.user.create({
    data: {
      email: 'analyst2@example.com',
      name: 'Analyst L2',
      role: 'AnalystL2',
    },
  });

  const analystL3 = await prisma.user.create({
    data: {
      email: 'analyst3@example.com',
      name: 'Analyst L3',
      role: 'AnalystL3',
    },
  });

  const resultA = await prisma.auditResult.create({
    data: {
      title: 'SQL Injection check in payments module',
      system: 'Payments',
      category: 'Input Validation',
      description: 'Detected unescaped SQL parameter in transaction POST endpoint.',
      criticality: 'High',
      status: 'InProgress',
      responsibleId: analystL1.id,
      foundAt: new Date('2026-03-10T08:30:00Z'),
      dueAt: new Date('2026-03-20T23:59:59Z'),
      riskScore: 8.4,
      comments: {
        create: [
          {
            text: 'Need to confirm whether this endpoint is exposed externally.',
            authorId: analystL1.id,
          },
        ],
      },
      history: {
        create: [
          {
            action: 'Created result',
            details: 'Initial audit result created by L1.',
            performedById: analystL1.id,
          },
        ],
      },
    },
  });

  const resultB = await prisma.auditResult.create({
    data: {
      title: 'Weak encryption in report export',
      system: 'Reporting',
      category: 'Cryptography',
      description: 'Exported reports are encrypted with legacy AES-128-CBC and static IV.',
      criticality: 'Medium',
      status: 'New',
      responsibleId: analystL2.id,
      foundAt: new Date('2026-02-28T12:10:00Z'),
      dueAt: new Date('2026-03-15T17:00:00Z'),
      riskScore: 5.8,
      comments: {
        create: [
          {
            text: 'Requires L3 confirmation before raising to criticality.',
            authorId: analystL2.id,
          },
        ],
      },
      history: {
        create: [
          {
            action: 'Logged issue',
            details: 'L2 identified weak crypto usage.',
            performedById: analystL2.id,
          },
        ],
      },
    },
  });

  const resultC = await prisma.auditResult.create({
    data: {
      title: 'Missing MFA enforcement',
      system: 'Authentication',
      category: 'Access Control',
      description: 'Multi-factor authentication is not enforced for privileged logins.',
      criticality: 'Critical',
      status: 'Resolved',
      responsibleId: analystL3.id,
      foundAt: new Date('2026-01-15T10:00:00Z'),
      dueAt: new Date('2026-02-01T10:00:00Z'),
      riskScore: 9.7,
      comments: {
        create: [
          {
            text: 'Fix implemented, waiting for final verification.',
            authorId: analystL3.id,
          },
        ],
      },
      history: {
        create: [
          {
            action: 'Escalated to L3',
            details: 'Expert review required because of high impact.',
            performedById: analystL3.id,
          },
        ],
      },
    },
  });

  console.log('Seed completed:', {
    admin: admin.email,
    analystL1: analystL1.email,
    analystL2: analystL2.email,
    analystL3: analystL3.email,
    results: [resultA.title, resultB.title, resultC.title],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
