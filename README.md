# Inventory App

Inventory App — учебное fullstack-приложение для учёта оборудования.

Приложение позволяет управлять оборудованием и комнатами: создавать, редактировать, удалять, просматривать, искать и фильтровать данные.  
Backend построен на Node.js + Express, данные хранятся в SQLite, frontend взаимодействует с API через Fetch.

## Возможности

### Оборудование

- создание оборудования
- просмотр списка оборудования
- просмотр оборудования по `id`
- редактирование оборудования
- удаление оборудования
- поиск по названию
- фильтрация по комнате

### Комнаты

- создание комнаты
- просмотр списка комнат
- просмотр комнаты по `id`
- редактирование комнаты
- удаление комнаты

### Дополнительно

- хранение данных в SQLite
- REST API для `rooms` и `equipments`
- валидация входных данных
- обработка ошибок приложения через кастомные ошибки
- автоматические тесты CRUD API
- разделение backend на слои

---

## Стек

### Frontend

- HTML
- CSS
- JavaScript
- Fetch API

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3
- CORS
- Mocha
- Supertest

---

## Архитектура backend

Backend разделён на слои:

- `routes` — маршруты API
- `controllers` — обработка HTTP-запросов и ответов
- `services` — бизнес-логика
- `repositories` — работа с SQL-запросами
- `database` — подключение к БД и инициализация таблиц
- `errors` — кастомные ошибки приложения
- `utils` — общие вспомогательные функции

---

## Структура проекта

```text
inventory-js/
  frontend/
    index.html
    style.css
    script.js

  backend/
    app.js
    server.js
    package.json
    package-lock.json

    database/
      db.js
      inventory.sqlite
      inventory.test.sqlite

    routes/
      equipment.routes.js
      room.routes.js

    controllers/
      equipment.controller.js
      room.controller.js

    services/
      equipment.service.js
      room.service.js

    repositories/
      equipment.repository.js
      room.repository.js

    errors/
      errors.js

    utils/
      validate-id.js

    tests/
      equipment.test.js
      room.test.js

  README.md
  .gitignore
```
