import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.32em] text-sky-600">Внутренний сервис аудита</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Панель управления результатами аудитов безопасности
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          Здесь вы сможете просматривать записи аудита, фильтровать и сортировать данные, проверять статус восстановления и управлять пользователями.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard"
            className="rounded-2xl border border-sky-200 bg-sky-600 px-6 py-4 text-center text-white transition hover:bg-sky-700"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/audit-results"
            className="rounded-2xl border border-slate-200 bg-slate-950 px-6 py-4 text-center text-white transition hover:bg-slate-800"
          >
            📋 Результаты аудита
          </Link>
          <Link
            href="/calculators"
            className="rounded-2xl border border-purple-200 bg-purple-600 px-6 py-4 text-center text-white transition hover:bg-purple-700"
          >
            🔢 Калькуляторы
          </Link>
          <Link
            href="/users"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center text-slate-900 transition hover:bg-zinc-50"
          >
            👥 Пользователи
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-sky-200 bg-white px-6 py-4 text-center text-slate-900 transition hover:bg-sky-50"
          >
            🔐 Вход
          </Link>
        </div>
      </div>
    </main>
  );
}
