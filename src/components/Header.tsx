'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const roleColorMap: Record<string, string> = {
  Admin: 'bg-red-100 text-red-800',
  AnalystL3: 'bg-purple-100 text-purple-800',
  AnalystL2: 'bg-blue-100 text-blue-800',
  AnalystL1: 'bg-green-100 text-green-800',
};

export function Header() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { credentials: 'include' })
      .then(async (res) => {
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Audit Service</p>
              <p className="text-xs text-slate-500">Security Results</p>
            </div>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Dashboard
            </Link>
            <Link href="/audit-results" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Аудиты
            </Link>
            <Link href="/calculators" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Калькуляторы
            </Link>
            {currentUser ? (
              <Link href="/users" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Пользователи
              </Link>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-slate-500">Загрузка...</span>
            ) : currentUser ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-zinc-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-900">
                  {currentUser.name}
                </div>
                <span className={`rounded-2xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                  roleColorMap[currentUser.role] ?? 'bg-gray-100 text-gray-800'
                }`}>
                  {currentUser.role}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/login" className="rounded-2xl border border-sky-200 bg-white px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50">
                  Войти
                </Link>
                <Link href="/register" className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-zinc-50">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
