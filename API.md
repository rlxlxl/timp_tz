# API Documentation

## Аутентификация

### POST /api/auth/register
Регистрация нового пользователя.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "AnalystL1"
  }
}
```

**Errors:**
- 400: Missing fields
- 409: User already exists

---

### POST /api/auth/login
Вход в систему.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "AnalystL1"
  }
}
```

**Cookies:** Устанавливается `session` cookie (7 дней).

**Errors:**
- 400: Missing fields
- 401: Invalid credentials

---

### POST /api/auth/logout
Выход из системы.

**Response (200):**
```json
{
  "success": true
}
```

**Cookies:** Удаляется `session` cookie.

---

### GET /api/auth/me
Получение текущего пользователя.

**Headers:** Требуется `session` cookie.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "string",
    "email": "string",
    "role": "AnalystL1"
  }
}
```

**Errors:**
- 401: Unauthorized

---

## Аудиты

### GET /api/audit-results
Получение списка аудитов.

**Headers:** Требуется аутентификация (любая роль).

**Query Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| status | string | Фильтр по статусу |
| criticality | string | Фильтр по критичности |
| system | string | Фильтр по системе |
| responsible | string | Фильтр по ответственному |
| search | string | Поиск по title, description, system, category |
| page | number | Номер страницы (по умолчанию 1) |
| pageSize | number | Размер страницы (по умолчанию 10, макс 50) |

**Response (200):**
```json
{
  "results": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden

---

### GET /api/audit-results/[id]
Получение конкретного аудита.

**Headers:** Требуется аутентификация (любая роль).

**URL Parameters:**
| Параметр | Тип | Описание |
|----------|-----|----------|
| id | number | ID аудита |

**Response (200):**
```json
{
  "id": 1,
  "title": "string",
  "system": "string",
  "category": "string",
  "description": "string",
  "criticality": "High",
  "status": "New",
  "riskScore": 7.5,
  "responsible": { ... },
  "comments": [...],
  "history": [...],
  "foundAt": "2024-01-01T00:00:00.000Z",
  "dueAt": "2024-01-15T00:00:00.000Z"
}
```

**Errors:**
- 400: Invalid ID
- 401: Unauthorized
- 403: Forbidden
- 404: Not found

---

### PATCH /api/audit-results/[id]/status
Изменение статуса аудита.

**Headers:** Требуется аутентификация (роль AnalystL2+).

**Request Body:**
```json
{
  "status": "InProgress" | "Resolved" | "Closed"
}
```

**Valid Statuses:** `New`, `InProgress`, `Resolved`, `Closed`

**Response (200):** Обновлённый аудит.

**Errors:**
- 400: Invalid status
- 401: Unauthorized
- 403: Forbidden
- 404: Audit not found

---

### PATCH /api/audit-results/[id]/criticality
Изменение критичности и риск-скора.

**Headers:** Требуется аутентификация (роль AnalystL3+).

**Request Body:**
```json
{
  "criticality": "Low" | "Medium" | "High" | "Critical",
  "riskScore": 0-10
}
```

**Valid Criticalities:** `Low`, `Medium`, `High`, `Critical`

**Response (200):** Обновлённый аудит.

**Errors:**
- 400: Invalid criticality
- 401: Unauthorized
- 403: Forbidden
- 404: Audit not found

---

### POST /api/audit-results/[id]/comments
Добавление комментария.

**Headers:** Требуется аутентификация (любая роль).

**Request Body:**
```json
{
  "text": "string"
}
```

**Response (201):**
```json
{
  "id": 1,
  "text": "string",
  "author": { "name": "string" },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 400: Text is required
- 401: Unauthorized

---

## Статистика

### GET /api/audit-stats
Получение статистики по аудитам.

**Headers:** Требуется аутентификация (любая роль).

**Response (200):**
```json
{
  "total": 100,
  "avgRiskScore": "7.2",
  "byCriticality": {
    "Critical": 10,
    "High": 25,
    "Medium": 40,
    "Low": 25
  },
  "byStatus": {
    "New": 20,
    "InProgress": 15,
    "Resolved": 45,
    "Closed": 20
  },
  "bySystem": [
    { "name": "SAP", "value": 30 },
    { "name": "1C", "value": 25 }
  ],
  "timeline": [
    { "month": "Jan 2024", "count": 15 },
    { "month": "Feb 2024", "count": 20 }
  ]
}
```

---

## Управление пользователями

### GET /api/users
Получение списка пользователей.

**Headers:** Требуется аутентификация (роль Admin).

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "string",
      "email": "string",
      "role": "Admin",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- 401: Unauthorized
- 403: Forbidden

---

### PUT /api/users
Изменение роли пользователя.

**Headers:** Требуется аутентификация (роль Admin).

**Request Body:**
```json
{
  "userId": 1,
  "role": "Admin" | "AnalystL1" | "AnalystL2" | "AnalystL3"
}
```

**Response (200):** Обновлённый пользователь.

**Errors:**
- 400: Missing fields / Invalid role
- 401: Unauthorized
- 403: Forbidden