# Inventory App

Inventory App — учебное fullstack-приложение для учета оборудования.

Проект позволяет добавлять, редактировать, удалять, искать и фильтровать оборудование. Данные хранятся в SQLite, а frontend взаимодействует с backend через REST API.

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

## Возможности

- Добавление оборудования
- Просмотр списка оборудования
- Редактирование оборудования
- Удаление оборудования
- Поиск по названию
- Фильтрация по комнате
- Хранение данных в SQLite
- REST API для работы с оборудованием
- Разделение backend на слои:
  - routes
  - controllers
  - services
  - repositories
  - database

## Структура проекта

```text
inventory-js/
  frontend/
    index.html
    style.css
    script.js

  backend/
    server.js
    db.js
    route.js
    controller.js
    service.js
    repository.js
    package.json
    package-lock.json

  README.md
  .gitignore
