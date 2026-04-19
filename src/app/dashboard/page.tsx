import { DashboardClient } from '@/components/DashboardClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 text-center text-slate-500">Загрузка...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
