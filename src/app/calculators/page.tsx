import { RiskCalculator } from '@/components/calculators/RiskCalculator';
import { SLACalculator } from '@/components/calculators/SLACalculator';
import { ComplianceCalculator } from '@/components/calculators/ComplianceCalculator';

export default function CalculatorsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Инструменты</p>
        <h1 className="text-3xl font-semibold text-slate-900">Калькуляторы</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Набор калькуляторов для оценки рисков, проверки SLA и расчета соответствия требованиям.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RiskCalculator />
        <SLACalculator />
        <ComplianceCalculator />
      </div>
    </main>
  );
}
