'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface AuditDetail {
  id: number;
  title: string;
  system: string;
  category: string;
  description: string;
  criticality: string;
  status: string;
  responsible: { id: number; name: string; role: string } | null;
  foundAt: string;
  dueAt: string | null;
  riskScore: number;
  comments: { id: number; text: string; author: { name: string }; createdAt: string }[];
  history: { id: number; action: string; details: string | null; performedBy: { name: string }; createdAt: string }[];
}

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'High':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Low':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'InProgress':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Closed':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

function AuditDetailContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = pathname.split('/').pop() || '';
  const userEmail = searchParams.get('userEmail') || 'analyst1@example.com';
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/audit-results/${id}?userEmail=${userEmail}`);
      if (res.ok) {
        setAudit(await res.json());
      } else {
        setError('Не удалось загрузить данные');
      }
      setLoading(false);
    }
    load();
  }, [id, userEmail]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-slate-500">Загрузка...</p>
      </main>
    );
  }

  if (error || !audit) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href={`/audit-results?userEmail=${userEmail}`}
        className="inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700 mb-6"
      >
        ← Вернуться к списку
      </Link>

      <div className="grid gap-6">
        {/* Основная информация */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{audit.title}</h1>
              <p className="text-slate-600">ID: {audit.id} · Категория: {audit.category}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold ${getCriticalityColor(audit.criticality)}`}>
                {audit.criticality}
              </span>
              <span className={`inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold ${getStatusColor(audit.status)}`}>
                {audit.status}
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Описание</h3>
            <p className="text-slate-600 leading-relaxed">{audit.description}</p>
          </div>
        </div>

        {/* Метрики */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase">Система</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{audit.system}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase">Риск-скор</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{audit.riskScore.toFixed(1)}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase">Обнаружено</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">{new Date(audit.foundAt).toLocaleDateString('ru-RU')}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase">Срок</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">
              {audit.dueAt ? new Date(audit.dueAt).toLocaleDateString('ru-RU') : '—'}
            </p>
          </div>
        </div>

        {/* Ответственный */}
        {audit.responsible && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Ответственный</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 font-semibold">
                {audit.responsible.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900">{audit.responsible.name}</p>
                <p className="text-sm text-slate-500">{audit.responsible.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Комментарии */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Комментарии ({audit.comments.length})</h3>
          {audit.comments.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет комментариев</p>
          ) : (
            <div className="space-y-4">
              {audit.comments.map((comment) => (
                <div key={comment.id} className="border-l-2 border-sky-200 bg-sky-50 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-slate-900">{comment.author.name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <p className="text-slate-700">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* История */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">История изменений ({audit.history.length})</h3>
          {audit.history.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет истории</p>
          ) : (
            <div className="space-y-3">
              {audit.history.map((entry) => (
                <div key={entry.id} className="flex gap-3 pb-3 border-b border-zinc-200 last:border-0">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-slate-600">✓</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{entry.action}</p>
                    {entry.details && <p className="text-sm text-slate-600 mt-1">{entry.details}</p>}
                    <p className="text-xs text-slate-500 mt-2">
                      {entry.performedBy.name} · {new Date(entry.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AuditDetailPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-5xl px-4 py-8"><p className="text-center text-slate-500">Загрузка...</p></main>}>
      <AuditDetailContent />
    </Suspense>
  );
}

