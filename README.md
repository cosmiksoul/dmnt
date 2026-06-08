# Betera Naming Tool

Веб-инструмент для генерации имён рекламных кампаний по единой конвенции Betera (L0–L3),
сборки трекинг-URL для Media/PR и валидации существующих имён.

## Стек
React + Vite + Tailwind + react-router-dom (HashRouter) + Vitest. Статика, GitHub Pages.

## Разработка
- `npm install`
- `npm run dev` — локальный сервер
- `npm run test` — unit-тесты ядра
- `npm run build` — продакшн-сборка

## Архитектура
Вся конвенция — в `src/config/convention.js` (единственный источник правды). Чистые функции
в `src/lib/` (генерация/валидация/парсинг/URL) покрыты тестами на примерах из исходного Excel.
UI — 4 роута: Генератор (`/`), URL-билдер (`/url`), Валидатор (`/validator`), Методология (`/methodology`).

Демо stateless. Реестр созданных имён и детект дублей — отдельный слой, добавляется позже.
Источник схемы: `Digital Marketing Naming Tool.xlsx` (v3).
