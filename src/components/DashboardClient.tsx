'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Stats {
  total: number;
  avgRiskScore: string;
  byCriticality: Record<string, number>;
  byStatus: Record<string, number>;
  bySystem: Array<{ name: string; value: number }>;
  timeline: Array<{ month: string; count: number }>;
}

const CRITICALITY_COLORS: Record<string, string> = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

const STATUS_COLORS: Record<string, string> = {
  New: '#3b82f6',
  InProgress: '#a855f7',
  Resolved: '#10b981',
  Closed: '#6b7280',
};

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/audit-stats');
        if (res.ok) {
          setStats(await res.json());
        } else {
          setError('Не удалось загрузить статистику');
        }
      } catch (err) {
        setError('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-slate-500">Загрузка...</p>
      </main>
    );
  }

  if (error || !stats) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-red-600">{error}</p>
      </main>
    );
  }

  const criticalityData = Object.entries(stats.byCriticality).map(([name, value]) => ({
    name,
    value,
    color: CRITICALITY_COLORS[name],
  }));

  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({
    name,
    value,
    color: STATUS_COLORS[name],
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Аналитика</p>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Обзор результатов аудита безопасности с ключевыми метриками и статистикой.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Всего аудитов</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Средний риск-скор</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.avgRiskScore}</p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Критичных</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.byCriticality.Critical}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Criticality Distribution */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">По критичности</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={criticalityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {criticalityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">По статусам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* By System */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-6">Аудиты по системам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.bySystem}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" name="Количество" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-6">Временная шкала находок</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                name="Количество находок"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
