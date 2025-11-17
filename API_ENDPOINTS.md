# API Endpoints для Админ Панели

## Базовый URL

```
http://192.168.0.107:8820/api
```

---

## 🔐 Аутентификация

### 1. Вход в систему (Login)

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**Validation Rules:**

- `username`:
  - Обязательное поле
  - Минимум 3 символа
  - Только латинские буквы, цифры и подчеркивание (`a-zA-Z0-9_`)
- `password`:
  - Обязательное поле
  - Минимум 6 символов

**Success Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Responses:**

`400 Bad Request` - Ошибка валидации

```json
{
  "error": "Validation error",
  "message": "Invalid username or password format"
}
```

`401 Unauthorized` - Неверные учетные данные

```json
{
  "error": "Authentication failed",
  "message": "Invalid username or password"
}
```

`500 Internal Server Error`

```json
{
  "error": "Server error",
  "message": "An error occurred during authentication"
}
```

---

### 2. Проверка токена (Verify Token)

**Endpoint:** `GET /api/auth/verify`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response:** `200 OK`

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

**Error Response:** `401 Unauthorized`

```json
{
  "error": "Invalid token",
  "message": "Token is invalid or expired"
}
```

---

### 3. Выход из системы (Logout)

**Endpoint:** `POST /api/auth/logout`

**Headers:**

```
Authorization: Bearer {token}
```

**Success Response:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

---

## 📝 Примечания для Backend

### Токен (JWT)

- Используйте **JWT (JSON Web Token)** для аутентификации
- Токен должен включать:
  - `user_id` - ID пользователя
  - `username` - имя пользователя
  - `role` - роль (admin, moderator, etc.)
  - `exp` - время истечения (рекомендуется 24 часа)

Пример payload токена:

```json
{
  "user_id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1730419200,
  "exp": 1730505600
}
```

### Безопасность

1. **Хеширование паролей**: Используйте bcrypt или argon2
2. **HTTPS**: В продакшене обязательно использовать HTTPS
3. **Rate Limiting**: Ограничьте количество попыток входа (например, 5 попыток в 15 минут)
4. **CORS**: Настройте правильные CORS политики

### Middleware для защищенных роутов

Все админские эндпоинты должны проверять токен:

```
Authorization: Bearer {token}
```

Если токен невалиден или отсутствует, возвращайте `401 Unauthorized`.

---

## 🔄 Frontend Интеграция

### Хранение токена

Токен хранится в:

1. **Zustand store** (в памяти)
2. **localStorage** (ключ: `auth-storage`)

### Автоматическая отправка токена

Токен автоматически добавляется в заголовки всех axios запросов:

```typescript
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
```

### Защищенные роуты

Frontend автоматически редиректит на `/admin/login` если:

- Токен отсутствует
- Токен истек
- Backend вернул `401 Unauthorized`

---

## 📊 Будущие эндпоинты (TODO)

### Туры

- `GET /api/admin/tours` - список всех туров
- `POST /api/admin/tours` - создание тура
- `PUT /api/admin/tours/:id` - обновление тура
- `DELETE /api/admin/tours/:id` - удаление тура

### Сотрудники

- `GET /api/admin/staff` - список сотрудников
- `POST /api/admin/staff` - создание сотрудника
- `PUT /api/admin/staff/:id` - обновление сотрудника
- `DELETE /api/admin/staff/:id` - удаление сотрудника

### Медиа

- `POST /api/admin/images` - загрузка изображений
- `DELETE /api/admin/images/:id` - удаление изображения
- `PUT /api/admin/video` - обновление YouTube URL

---

## 🧪 Тестирование

### Пример cURL запроса для логина:

```bash
curl -X POST http://192.168.0.107:8820/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'
```

### Пример Postman коллекции:

```json
{
  "info": {
    "name": "Nomadia Admin API"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"123456\"\n}"
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://192.168.0.107:8820"
    }
  ]
}
```

---

## ✅ Checklist для Backend разработчика

- [ ] Создать таблицу `users` в БД
- [ ] Реализовать `POST /api/auth/login`
- [ ] Реализовать `GET /api/auth/verify`
- [ ] Настроить JWT с секретным ключом
- [ ] Добавить хеширование паролей (bcrypt)
- [ ] Создать middleware для проверки токена
- [ ] Настроить CORS
- [ ] Добавить rate limiting
- [ ] Протестировать все эндпоинты
- [ ] Обновить .env с правильными настройками

---

**Контакт Frontend разработчика:** Если нужны изменения в структуре запросов/ответов, дайте знать!
