'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ROLES = [
  { value: 'Admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
  { value: 'AnalystL3', label: 'Analyst L3', color: 'bg-purple-100 text-purple-800' },
  { value: 'AnalystL2', label: 'Analyst L2', color: 'bg-blue-100 text-blue-800' },
  { value: 'AnalystL1', label: 'Analyst L1', color: 'bg-green-100 text-green-800' },
];

export function UserManagementClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users);
        } else if (res.status === 403) {
          setError('У вас нет доступа. Нужна роль Admin');
        } else {
          setError('Не удалось загрузить пользователей');
        }
      } catch (err) {
        setError('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdating(userId);
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map((u) => (u.id === userId ? updated : u)));
      } else {
        setError('Не удалось обновить роль');
      }
    } catch (err) {
      setError('Ошибка обновления');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-slate-500">Загрузка...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8">
        <p className="text-center text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-2 mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-600">Администрирование</p>
        <h1 className="text-3xl font-semibold text-slate-900">Управление пользователями</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Управление ролями пользователей и их правами доступа к системе.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Имя</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Роль</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-900">Дата создания</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-900">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleConfig = ROLES.find((r) => r.value === user.role);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-200 hover:bg-zinc-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          roleConfig?.color || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {roleConfig?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updating === user.id}
                        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ROLES.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-6 py-8 text-center">
            <p className="text-slate-500">Нет пользователей</p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Описание ролей</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <strong>Admin:</strong> Полный доступ, управление пользователями и всеми данными
          </p>
          <p>
            <strong>Analyst L3:</strong> Может изменять критичность, создавать комментарии, полный доступ к данным
          </p>
          <p>
            <strong>Analyst L2:</strong> Может менять статусы, создавать комментарии, просмотр данных
          </p>
          <p>
            <strong>Analyst L1:</strong> Может создавать комментарии, только просмотр данных
          </p>
        </div>
      </div>
    </main>
  );
}
