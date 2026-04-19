'use client';

import { useState } from 'react';

interface ComplianceCalculatorResult {
  completed: number;
  uncompleted: number;
  total: number;
  percentage: number;
  level: string;
}

export function ComplianceCalculator() {
  const [completed, setCompleted] = useState(8);
  const [uncompleted, setUncompleted] = useState(2);
  const [result, setResult] = useState<ComplianceCalculatorResult | null>(null);

  const handleCalculate = () => {
    const total = completed + uncompleted;
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    const level =
      percentage >= 90
        ? 'Отличная'
        : percentage >= 75
          ? 'Хорошая'
          : percentage >= 50
            ? 'Удовлетворительная'
            : 'Неудовлетворительная';

    setResult({
      completed,
      uncompleted,
      total,
      percentage: Math.round(percentage * 10) / 10,
      level,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Отличная':
        return 'text-green-600';
      case 'Хорошая':
        return 'text-blue-600';
      case 'Удовлетворительная':
        return 'text-yellow-600';
      case 'Неудовлетворительная':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Калькулятор соответствия</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Выполненные требования: {completed}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={completed}
            onChange={(e) => setCompleted(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Невыполненные требования: {uncompleted}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={uncompleted}
            onChange={(e) => setUncompleted(Number(e.target.value))}
            className="w-full"
          />
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
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                <p className="text-xs font-medium text-green-700 uppercase mb-1">Выполнено</p>
                <p className="text-2xl font-bold text-green-700">{result.completed}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <p className="text-xs font-medium text-red-700 uppercase mb-1">Не выполнено</p>
                <p className="text-2xl font-bold text-red-700">{result.uncompleted}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Процент выполнения</span>
                <span className="text-sm font-bold text-slate-900">{result.percentage}%</span>
              </div>
              <div className="w-full rounded-full bg-slate-200 h-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${getProgressColor(result.percentage)}`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">Уровень соответствия</p>
              <p className={`text-2xl font-bold ${getLevelColor(result.level)}`}>
                {result.level}
              </p>
            </div>

            <div className="text-sm text-slate-600">
              Всего требований: <span className="font-medium text-slate-900">{result.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
