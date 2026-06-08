# Claude Code — контекст проекта

## Что это
Веб-инструмент генерации имён рекламных кампаний Betera по конвенции L0–L3 + URL-билдер + валидатор.
Демо, выкатывается на GitHub Pages. Stateless.

## Источник правды схемы
`Digital Marketing Naming Tool.xlsx` (v3) — НЕ docx (он v1.1, устарел: см. spec).
Схема, словари, маппинг UTM — всё в `src/config/convention.js`.

## Жёсткие ограничения
- Только GitHub Pages (статика). Без бэкенда/БД.
- Конвенцию менять ТОЛЬКО через `src/config/convention.js`, не хардкодить в компонентах.
- Свободные поля (Targeting, Theme, Campaign) — CamelCase, без `_`/пробелов/кириллицы.

## Стек
React 18 + Vite + Tailwind + react-router-dom (HashRouter) + Vitest.

## Структура
- `src/config/convention.js` — конвенция (источник правды)
- `src/lib/` — buildNames, validate, parseName, buildUrl, utm (чистые, с тестами)
- `src/components/` — FieldSelect, FieldCamelText, LevelSection, NamePreview, Layout
- `src/pages/` — Generator, UrlBuilder, Validator, Methodology
- `tests/lib/` — unit-тесты ядра (UI-тестов не пишем, ловит ручное QA)

## Definition of Done
См. spec `docs/superpowers/specs/2026-06-08-naming-tool-design.md` §8.
