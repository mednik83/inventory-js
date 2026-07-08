# Inventory App

Inventory App — учебное fullstack-приложение для учёта оборудования.

Приложение позволяет управлять оборудованием и комнатами: создавать, редактировать, удалять и просматривать данные, а также генерировать QR-коды для оборудования.

Backend построен на Node.js + Express, данные хранятся в SQLite. Frontend — одностраничное приложение на чистом JavaScript (без фреймворков и сборщиков), взаимодействующее с API через Fetch.

---

## Возможности

### Оборудование
- создание, редактирование и удаление оборудования
- просмотр списка оборудования
- просмотр оборудования по `id` и `uuid`
- списание оборудования (soft delete со сменой статуса)
- жёсткое удаление
- генерация QR-кода по `uuid`

### Комнаты
- создание, редактирование и удаление комнат
- просмотр списка комнат
- просмотр комнаты по `id`

### Дополнительно
- хранение данных в SQLite
- REST API для `rooms` и `equipments`
- валидация входных данных
- обработка ошибок приложения через кастомные ошибки
- автоматические тесты CRUD API
- разделение backend и frontend на слои

---

## Стек

### Frontend
- HTML, CSS, JavaScript (ES-модули)
- Fetch API
- без фреймворков и сборщиков — только нативный браузер

### Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- CORS
- Mocha, Supertest — тестирование
- qrcode, uuid

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

## Архитектура frontend

Frontend написан на чистом JavaScript и организован по слоям с однонаправленным потоком данных — без фреймворков, но по принципам, близким к ним.

- `api.js` — слой запросов к backend: обёртка над Fetch, единая обработка HTTP-ошибок, методы для `equipments` и `rooms`
- `state.js` — хранилище состояния приложения: приватные поля, иммутабельные геттеры, паттерн «наблюдатель» (подписка и оповещение об изменениях)
- `render.js` — отрисовка интерфейса из состояния: чистый слой отображения без побочных эффектов и запросов
- `ui.js` — действия (actions): связывают `api` и `state`, обрабатывают ошибки и решают, куда их поместить
- `main.js` — точка входа: инициализация, подписка отрисовки на состояние, хеш-роутинг

Ключевые принципы:

- **Однонаправленный поток данных:** событие → действие → API → обновление состояния → оповещение → перерисовка. Отрисовка никогда не пишет в состояние и не обращается к сети напрямую.
- **Реактивность через наблюдателя:** отрисовка подписывается на состояние один раз при старте; любое изменение состояния автоматически вызывает перерисовку.
- **Разграничение ошибок:** ошибки загрузки данных и ошибки форм хранятся раздельно и отображаются в разных местах интерфейса.
- **Обработка состояний UI:** загрузка, ошибка, пустой список и данные обрабатываются явно.
- **Хеш-роутинг:** переключение между разделами `equipments` и `rooms` через `location.hash`, без перезагрузки страницы.

---

## Структура проекта

```text
inventory-js/
  frontend/
    index.html
    css/
      style.css
    js/
      api.js         — слой запросов к API
      state.js       — состояние приложения + наблюдатель
      render.js      — отрисовка UI из состояния
      ui.js          — действия (actions)
      main.js        — точка входа, роутинг
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
      qr-code.service.js
    repositories/
      equipment.repository.js
      room.repository.js
    errors/
      errors.js
    utils/
      error-handler.js
      validate-id.js
      validate-status.js
      validate-uuid.js
    tests/
      equipment.test.js
      equipment.uuid.test.js
      room.test.js
  README.md
  .gitignore
```

---

## Запуск

### Backend

```bash
cd backend
npm install
npm run start        # запускает сервер (по умолчанию http://localhost:8010)
npm test         # прогон тестов CRUD API
```

### Frontend

Frontend использует ES-модули, поэтому его нужно открывать через локальный HTTP-сервер, а не через `file://` (иначе модули и запросы к API работать не будут).

```bash
cd frontend
# любой статический сервер, например:
python -m http.server 5500
# затем открыть http://localhost:5500 в браузере
```

Backend должен быть запущен на `http://localhost:8010` — адрес API задаётся в `js/api.js` (`BASE_URL`).
