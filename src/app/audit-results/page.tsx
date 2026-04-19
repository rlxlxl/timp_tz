import { AuditResultsClient } from '@/components/AuditResultsClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function AuditResultsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Аудит безопасности</p>
        <h1 className="text-3xl font-semibold text-slate-900">Результаты аудитов</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Здесь можно увидеть список открытых записей по результатам аудита, фильтровать их и переходить к деталям.
        </p>
      </div>

      <Suspense fallback={<div className="text-slate-500">Загрузка...</div>}>
        <AuditResultsClient />
      </Suspense>
    </main>
  );
}

