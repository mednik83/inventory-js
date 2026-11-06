# Inventory App

Учёт оборудования с QR-маркировкой: у каждой единицы есть карточка с историей операций, а камера телефона открывает её по QR-коду прямо в браузере, без установки приложения.

---

## Быстрый старт

Нужен только Docker.

```bash
git clone https://github.com/mednik83/inventory-js.git
cd inventory-js
docker compose up --build
```

Приложение: **http://localhost:8080**. Backend API напрямую: http://localhost:8010.

Поднимаются три контейнера: `db` (PostgreSQL), `backend` и `frontend`. При старте backend сам применяет миграции и загружает демо-данные (3 комнаты и 3 единицы оборудования). Если в базе уже есть данные, демо-данные не загружаются повторно.

База хранится в named volume Docker `db-data` и переживает `docker compose down` / `up`. `docker compose down -v` удаляет volume вместе со всеми данными.

---

## Возможности

### Оборудование

- создание, редактирование, удаление
- карточка оборудования по адресу `/equipments/:uuid`: данные, QR-код, история операций
- перемещение между комнатами
- списание: необратимо в обе стороны, списанное нельзя редактировать и перемещать
- полное удаление вместе с историей (с подтверждением)
- фильтры списка: статус, комнаты, лимит
- каждая мутация пишется в историю операций

### Сканирование

- страница `/scan`: USB-сканер или ручной ввод uuid
- сканирование камерой: встроенный `BarcodeDetector`, где он есть (Chrome на Android), иначе `@zxing/browser` (Firefox, Safari)
- в QR-коде хранится только uuid, все данные берутся из базы

### Комнаты

- создание, редактирование, удаление
- удалить комнату, в которой есть оборудование, нельзя

---

## Стек

**Frontend:** React 19, react-router 7, Vite 8, `@zxing/browser`
**Backend:** Node 24, TypeScript 5.9, Express 5, Zod 4, qrcode, uuid
**База данных:** PostgreSQL 17, Prisma 7 (Prisma Client через `@prisma/adapter-pg`, Prisma Migrate)
**Тесты и качество:** Mocha, Supertest, ESLint 10 (typescript-eslint)
**Запуск:** Docker Compose, nginx

---

## Архитектура

```
браузер ──► nginx (frontend) ──/api/──► backend (Express) ──► PostgreSQL (volume)
             └─ статика React
```

В Docker nginx раздаёт собранный фронт и проксирует `/api/*` на backend по имени сервиса. Все остальные пути отдают `index.html`, поэтому прямые ссылки на страницы React работают.

### Backend

Слои, без перескоков: `routes → controllers → services → repositories`.

- `routes` — маршруты API
- `controllers` — HTTP: вызвать сервис, отдать ответ, ошибку передать в `next()`
- `services` — бизнес-правила и транзакции; вход из HTTP приходит как `unknown` и сужается Zod-схемами (`schemas/zod.ts`)
- `repositories` — доступ к базе через Prisma Client; каждый метод принимает необязательный клиент транзакции `tx`
- `errors` — `AppError` и наследники (400 / 404 / 409); `ZodError` превращается в 400; наружу уходит только `{ "message" }`, без стека и текста ошибок базы
- `middlewares/error-handler.ts` — единая обработка ошибок, включая битый JSON

### Frontend

- `api/client.js` — единственное место с `fetch`; ошибка несёт HTTP-статус (`err.status`)
- `App.jsx` — состояние списков и маршруты
- `pages/` — страницы; страница с параметром в адресе (карточка) загружает свои данные сама и открывается по прямой ссылке
- `components/` — карточки, формы, списки, `CameraScanner`

---

## Инженерные решения

- **В QR только uuid.** Не URL (наклейка не ломается при смене домена) и не данные (они устаревают, а наклейка нет).
- **uuid — публичный идентификатор, id — внутренний.** uuid не принимается из тела запроса.
- **Каждая мутация пишет запись в `operations`.** История — единственный источник «что и когда случилось»; отдельной таблицы перемещений нет.
- **Мутация и запись в историю — одна транзакция.** Если запись в `operations` не удалась, изменение оборудования тоже откатывается: история не расходится с данными.
- **Схема базы меняется только миграциями.** `prisma/schema.prisma` — источник правды, миграции лежат в `prisma/migrations` и применяются при старте контейнера (`prisma migrate deploy`).
- **Списание необратимо.** Поставить или снять `written_off` через редактирование нельзя (400), повторное списание → 409.
- **Ошибки отличаются по статусу, а не по тексту.** Фронт проверяет `err.status === 404`, а не строку сообщения.
- **Один обработчик для всех способов ввода.** USB-сканер, ручной ввод и камера отдают строку в одну функцию.

---

## Разработка без Docker

Требуется **Node.js 24** (зафиксирован в `backend/.nvmrc` / `backend/.node-version`) и PostgreSQL. Проще всего поднять только базу из `docker-compose.yml`, она слушает `localhost:5432`:

```bash
docker compose up -d db
```

### Backend

```bash
cd backend
fnm use                   # или nvm use
npm install
npm run db:generate       # сгенерировать Prisma Client в src/generated (Prisma 7 не делает это при install)
cp .env.example .env      # DATABASE_URL; npm start читает --env-file=.env
npx prisma migrate deploy # применить миграции
npm run db:seed           # по желанию: демо-данные
npm start                 # http://localhost:8010
```

После изменения `prisma/schema.prisma`: `npx prisma migrate dev --name <имя>` создаёт и применяет новую миграцию.

### Тесты

Тесты используют отдельную базу `inventory_test` в том же Postgres и свой env-файл. Перед каждым тестом таблицы очищаются (`TRUNCATE ... RESTART IDENTITY`). Базу нужно один раз создать и применить к ней миграции:

```bash
docker compose exec db createdb -U user inventory_test
cp .env.test.example .env.test
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_test" npx prisma migrate deploy
npm test
```

`docker compose down -v` удаляет и тестовую базу, после него эти шаги нужно повторить. Миграции к тестовой базе нужно применять и после каждой новой миграции.

`.env` и `.env.test` в `.gitignore`, в репозитории только `*.example`.

### Frontend

```bash
cd frontend-react
npm install
npm run dev               # https://localhost:5173
```

Dev-сервер работает по HTTPS с самоподписанным сертификатом (`@vitejs/plugin-basic-ssl`): при первом открытии браузер покажет предупреждение, его нужно один раз принять («Дополнительно → Перейти на сайт»).

Запросы к API идут на `/api/...` того же адреса, а Vite проксирует их на backend `http://localhost:8010` (`server.proxy` в `vite.config.js`). Переменная `VITE_API_URL` переопределяет адрес API, по умолчанию `/api`.

### Сканирование с телефона

Камера в браузере доступна только в secure context: на `localhost` или по HTTPS. Поэтому для телефона используется dev-сервер: он работает по HTTPS и слушает локальную сеть (`server.host: true`). Сборка в Docker отдаёт HTTP, и камера в ней работает только на `localhost`.

1. Телефон и компьютер подключены к одной Wi-Fi сети.
2. Запустить backend и `npm run dev` во `frontend-react`.
3. Открыть на телефоне адрес из строки `Network:` с IP вашей домашней сети, например `https://192.168.x.x:5173/scan`. Адреса вида `172.x.x.x` обычно принадлежат Docker или WSL и с телефона недоступны.
4. Один раз принять предупреждение о сертификате и разрешить доступ к камере.
5. Навести камеру на QR-код со страницы карточки оборудования: откроется эта карточка.

Если страница не открывается с телефона, проверьте, что файрвол компьютера пропускает входящие подключения на порт 5173.

---

## API

Тело ошибки всегда `{ "message": string }`.
400 — ошибка валидации, 404 — не найдено, 409 — конфликт состояния.

| Метод               | Путь                                     | Ответ                                                                            |
| ------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| GET                 | `/equipments?status=&room_id=1,2&limit=` | 200 `[]`                                                                         |
| GET                 | `/equipments/:id`                        | 200 / 400 / 404                                                                  |
| GET                 | `/equipments/uuid/:uuid`                 | 200 / 400 / 404 — публичный lookup для сканера                                   |
| GET                 | `/equipments/uuid/:uuid/qr`              | 200 `image/svg+xml`, внутри QR — только uuid                                     |
| POST                | `/equipments`                            | 201; `written_off` на входе → 400                                                |
| PUT                 | `/equipments/:id`                        | 200; списанное не редактируется → 400                                            |
| POST                | `/equipments/:id/move`                   | 200, body `{ room_id }`; списанное → 400, та же комната → 400, комнаты нет → 404 |
| POST                | `/equipments/:id/write-off`              | 200; повторное списание → 409                                                    |
| DELETE              | `/equipments/:id`                        | 204 — полное удаление вместе с историей                                          |
| GET/POST/PUT/DELETE | `/rooms`, `/rooms/:id`                   | удаление занятой комнаты → 409                                                   |
| GET                 | `/operations?equipment_id=`              | 200 `[]`; без параметра → 400                                                    |
| —                   | битый JSON в теле любого запроса         | 400 `{ "message": "Malformed JSON" }`                                            |

---

## Legacy: frontend-vanilla

Первая версия фронта на чистом JavaScript (ES-модули, паттерн «наблюдатель», хеш-роутинг). Не развивается, оставлена как история проекта. Открывать через локальный HTTP-сервер, а не через `file://`:

```bash
cd frontend-vanilla
python -m http.server 5500   # затем http://localhost:5500
```
