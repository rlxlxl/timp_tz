'use client';

import { useState } from 'react';

interface RiskCalculatorResult {
  baseRisk: number;
  probabilityFactor: number;
  impactFactor: number;
  complianceFactor: number;
  finalRisk: number;
  level: string;
}

export function RiskCalculator() {
  const [criticality, setCriticality] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [probability, setProbability] = useState(5);
  const [impact, setImpact] = useState(5);
  const [compensating, setCompensating] = useState(1);
  const [result, setResult] = useState<RiskCalculatorResult | null>(null);

  const handleCalculate = () => {
    // Base risk from criticality
    const criticityBase = { Low: 1, Medium: 3, High: 7, Critical: 10 }[criticality];

    // Normalize inputs to 0-1 scale
    const probFactor = probability / 10;
    const impactFactor = impact / 10;
    const compFactor = Math.max(0.2, 1 - compensating / 10);

    // Calculate risk
    const baseRisk = criticityBase;
    const finalRisk = Math.min(10, baseRisk * probFactor * impactFactor * compFactor);

    const level =
      finalRisk >= 8.5
        ? 'Critical'
        : finalRisk >= 7
          ? 'High'
          : finalRisk >= 5
            ? 'Medium'
            : 'Low';

    setResult({
      baseRisk: criticityBase,
      probabilityFactor: probFactor,
      impactFactor: impactFactor,
      complianceFactor: compFactor,
      finalRisk: Math.round(finalRisk * 10) / 10,
      level,
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-red-600';
      case 'High':
        return 'text-orange-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-6">Калькулятор рисков</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Критичность
          </label>
          <select
            value={criticality}
            onChange={(e) => setCriticality(e.target.value as any)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Вероятность: {probability}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={probability}
            onChange={(e) => setProbability(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Влияние: {impact}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Компенсирующие меры: {compensating}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={compensating}
            onChange={(e) => setCompensating(Number(e.target.value))}
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
          <div className="grid gap-4 sm:grid-cols-2 mb-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">Финальный риск</p>
              <p className={`text-2xl font-bold ${getRiskColor(result.level)}`}>
                {result.finalRisk}
              </p>
              <p className={`text-sm font-medium ${getRiskColor(result.level)}`}>
                {result.level}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500 uppercase mb-1">Базовый риск</p>
              <p className="text-2xl font-bold text-slate-900">{result.baseRisk}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              Фактор вероятности: <span className="font-medium text-slate-900">{(result.probabilityFactor * 100).toFixed(0)}%</span>
            </p>
            <p className="text-slate-600">
              Фактор влияния: <span className="font-medium text-slate-900">{(result.impactFactor * 100).toFixed(0)}%</span>
            </p>
            <p className="text-slate-600">
              Фактор компенсации: <span className="font-medium text-slate-900">{(result.complianceFactor * 100).toFixed(0)}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
