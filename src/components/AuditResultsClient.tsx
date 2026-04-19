'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface AuditResult {
  id: number;
  title: string;
  system: string;
  category: string;
  description: string;
  criticality: string;
  status: string;
  responsible: { name: string } | null;
  foundAt: string;
  dueAt: string | null;
  riskScore: number;
}

interface ApiResponse {
  results: AuditResult[];
  total: number;
  page: number;
  pageSize: number;
}

const getCriticalityColor = (criticality: string) => {
  switch (criticality) {
    case 'Critical':
      return 'bg-red-100 text-red-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800';
    case 'InProgress':
      return 'bg-purple-100 text-purple-800';
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    case 'Closed':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function AuditResultsClient() {
  const searchParams = useSearchParams();
  const userEmail = searchParams.get('userEmail') || 'analyst1@example.com';
  const [results, setResults] = useState<AuditResult[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [criticality, setCriticality] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({
        userEmail,
        page: String(page),
        pageSize: '10',
      });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (criticality) params.set('criticality', criticality);

      const res = await fetch(`/api/audit-results?${params.toString()}`);
      const data = (await res.json()) as ApiResponse;
      if (res.ok) {
        setResults(data.results);
        setTotal(data.total);
      }
      setLoading(false);
    }

    load();
  }, [search, status, criticality, page, userEmail]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Фильтры</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Поиск</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Название, описание..."
              className="mt-1.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Статус</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Все статусы</option>
              <option value="New">New</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Критичность</span>
            <select
              value={criticality}
              onChange={(e) => setCriticality(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Все уровни</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatus('');
                setCriticality('');
                setPage(1);
              }}
              className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Результаты аудита</h2>
              <p className="text-sm text-slate-500 mt-1">Найдено {total} записей</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">Загрузка...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-slate-500">Записей не найдено</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Аудит</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Система</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Критичность</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Статус</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Риск</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">Дата</th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {results.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.category}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{item.system}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCriticalityColor(item.criticality)}`}>
                        {item.criticality}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${Math.min(item.riskScore * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{item.riskScore.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {new Date(item.foundAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/audit-results/${item.id}?userEmail=${userEmail}`}
                        className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-medium text-sky-700 transition hover:bg-sky-100"
                      >
                        Подробнее →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-zinc-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ← Назад
          </button>
          <span className="text-sm text-slate-600">
            Страница <span className="font-semibold">{page}</span>
          </span>
          <button
            type="button"
            disabled={page * 10 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Вперёд →
          </button>
        </div>
      </div>
    </div>
  );
}

