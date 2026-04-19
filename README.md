# Система управления аудитами

Веб-приложение для управления результатами аудитов безопасности и compliance.

## Технологии

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite через Prisma ORM
- **Charts**: Recharts

## Функциональность

### Аутентификация
- Регистрация пользователей
- Вход в систему
- Управление сессиями через cookies
- RBAC (Role-Based Access Control)

### Роли пользователей
| Роль | Описание |
|------|----------|
| Admin | Полный доступ |
| AnalystL3 | Изменение критичности и статуса |
| AnalystL2 | Изменение статуса |
| AnalystL1 | Только просмотр |

### Аудиты
- Создание и просмотр результатов аудитов
- Фильтрация по статусу, критичности, системе, ответственному
- Поиск по названию, описанию, системе, категории
- Пагинация
- История изменений
- Комментарии

### Калькуляторы
- **Compliance Calculator** - расчёт соответствия
- **Risk Calculator** - расчёт рисков
- **SLA Calculator** - расчёт SLA

### Статистика
- Распределение по критичности
- Распределение по статусу
- Распределение по системам
- Тimeline по месяцам

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Генерация Prisma клиента
npm run db:generate

# Применение миграций
npm run db:push

# Заполнение БД тестовыми данными
npm run seed

# Запуск dev сервера
npm run dev
```

## Переменные окружения

Создайте файл `.env`:
```env
AUTH_SECRET=your_secret_key
DATABASE_URL="file:./dev.db"
```

## Структура проекта

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # Аутентификация
│   │   ├── audit-results/  # Управление аудитами
│   │   ├── audit-stats/    # Статистика
│   │   └── users/          # Управление пользователями
│   ├── login/            # Страница входа
│   ├── register/         # Страница регистрации
│   ├── dashboard/       # Дашборд
│   ├── audit-results/    # Страницы аудитов
│   ├── calculators/      # Калькуляторы
│   └── users/            # Управление пользователями
├── components/           # React компоненты
├── lib/                  # Утилиты (auth, rbac, prisma)
└── generated/prisma/     # Сгенерированный Prisma клиент
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev сервера |
| `npm run build` | Production сборка |
| `npm run start` | Запуск production сервера |
| `npm run lint` | Проверка линтером |
| `npm run db:push` | Применение миграций |
| `npm run db:generate` | Генерация Prisma клиента |
| `npm run seed` | Заполнение БД данными |
