'use client';

import { useState } from 'react';

interface SLACalculatorResult {
  foundDate: string;
  deadline: string;
  daysRemaining: number;
  isOverdue: boolean;
  slaStatus: string;
}

export function SLACalculator() {
  const [foundDate, setFoundDate] = useState(new Date().toISOString().split('T')[0]);
  const [criticality, setCriticality] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [result, setResult] = useState<SLACalculatorResult | null>(null);

  const handleCalculate = () => {
    // SLA norms in days
    const slaByGrade = {
      Low: 90,
      Medium: 45,
      High: 15,
      Critical: 3,
    };

    const days = slaByGrade[criticality];
    const found = new Date(foundDate);
    const deadline = new Date(found);
    deadline.setDate(deadline.getDate() + days);

    const today = new Date();
    const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;
    const slaStatus = isOverdue ? 'Нарушена' : daysRemaining <= 3 ? 'Критично' : 'OK';

    setResult({
      foundDate,
      deadline: deadline.toLocaleDateString('ru-RU'),
      daysRemaining: Math.abs(daysRemaining),
      isOverdue,
      slaStatus,
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Калькулятор SLA</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Дата обнаружения
          </label>
          <input
            type="date"
            value={foundDate}
            onChange={(e) => setFoundDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Уровень критичности
          </label>
          <select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value as any)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option>Low (90 дней)</option>
            <option>Medium (45 дней)</option>
            <option>High (15 дней)</option>
            <option>Critical (3 дня)</option>
          </select>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full rounded-lg bg-sky-600 px-4 py-2 text-white font-medium transition hover:bg-sky-700"
        >
          Рассчитать
        </button>
      </div>

      {result && (
        <div className="border-t border-zinc-200 pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Обнаружено:</span>
              <span className="text-sm font-medium text-slate-900">
                {new Date(result.foundDate).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Крайний срок:</span>
              <span className="text-sm font-medium text-slate-900">{result.deadline}</span>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 mt-4">
              <p className="text-xs font-medium text-slate-500 uppercase mb-2">Статус SLA</p>
              <p
                className={`text-2xl font-bold ${
                  result.slaStatus === 'OK'
                    ? 'text-green-600'
                    : result.slaStatus === 'Критично'
                      ? 'text-orange-600'
                      : 'text-red-600'
                }`}
              >
                {result.slaStatus}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                {result.isOverdue
                  ? `Нарушена на ${result.daysRemaining} дней`
                  : `Осталось ${result.daysRemaining} дней`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
