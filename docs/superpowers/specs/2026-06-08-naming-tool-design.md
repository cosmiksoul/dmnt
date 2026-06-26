# Naming Tool — дизайн веб-сервиса (демо)

> Дата: 2026-06-08. Статус: согласован, готов к плану реализации.
> Источник схемы: **`Digital Marketing Naming Tool.xlsx` (v3)** — рабочий артефакт.
> Источник методологии/текстов: `Digital_marketing_naming_convention_v3_ru.docx` (v1.1).

## 1. Контекст и цель

Компания ведёт платное привлечение на 8+ рекламных платформах с разнобоем в именовании
кампаний. Принята единая 4-уровневая конвенция (L0–L3). Сейчас она реализована как
Excel-книга (Конструктор + Справочник + Правила + Маппинг UTM). Цель — превратить её
в **пуленепробиваемый веб-сервис**: медиабаер заходит на веб-морду, выбирает параметры
из форм, получает корректные по конвенции имена L0/L1/L2/L3 и (для Media/PR) готовый
трекинг-URL. Ошибиться по конвенции должно быть **физически невозможно**.

Текущая задача — **демка для показа**. Stateless (ничего не хранит), но архитектура
обязана позволять нарастить реестр/персистентность позже без переписывания ядра.

### Важно: расхождение версий в исходниках

Excel (v3) и Word (v1.1) описывают **разные** схемы. Excel новее и является источником
правды. Ключевые отличия (строим по Excel):

| Уровень | Word v1.1 | **Excel v3 (берём это)** |
|---|---|---|
| L1 | `Status_Objective_Product_Audience_Geo_[Date]_[Campaign]` | `Status_Objective_Product_Audience_Geo_[Campaign]` — дата убрана из L1 |
| L2 | `Device_OS_Flow_TargetingDetail` | `Format_[Device]_Flow_Placement_TargetingDetail` — Format в L2, OS убран, добавлен обязательный Placement |
| L3 | `Format_CreativeTheme_Variant_Source_[Date]` | `CreativeTheme_Variant_Source_[Date]` — Format убран из L3 |

Дата запуска в v3 живёт как метаданные реестра, а не в L1.

## 2. Архитектура (config-driven)

Зеркало соседних проектов `LTV_calculation` / `stat_plan`:

- **Стек:** React + Vite + Tailwind + react-router-dom (HashRouter) + Vitest.
- **Деплой:** GitHub Pages через GitHub Actions из `main`. Чистая статика, без бэкенда/БД.
- **Единый источник правды:** `src/config/convention.js` — декларативное описание всей
  конвенции. Форма, валидатор, генератор и парсер читают из него. Смена схемы (v4) =
  правка конфига, не кода. Реестр позже добавляется слоем над конфигом.

Структура каталогов:

```
src/config/convention.js      ← вся конвенция: уровни, поля, словари, UTM-маппинг, правила
src/lib/
  buildNames.js               ← buildL0/L1/L2/L3, buildMediaCompound
  buildUrl.js                 ← сборка трекинг-URL
  validate.js                 ← бизнес-правила сверх дропдаунов
  parseName.js                ← обратный разбор имени на поля
  utm.js                      ← маппинг L2 Format → utm_medium
src/components/
  FieldSelect.jsx             ← дропдаун enum-поля (код + описание)
  FieldCamelText.jsx          ← свободное поле с live-санацией CamelCase
  LevelSection.jsx            ← секция формы для одного уровня
  NamePreview.jsx             ← live-превью имени + копи-кнопка
src/pages/
  Generator.jsx               ← /  главная
  UrlBuilder.jsx              ← /url
  Validator.jsx               ← /validator
  Methodology.jsx             ← /methodology
tests/lib/
  buildNames.test.js, buildUrl.test.js, validate.test.js, parseName.test.js, utm.test.js
```

## 3. Конфиг конвенции — содержимое

### Шаблоны

- `L1 = {Status}_{Objective}_{Product}_{Audience}_{Geo}[_{Campaign}]`
- `L2 = {Format}[_{Device}]_{Flow}_{Placement}_{TargetingDetail}`
- `L3 = {CreativeTheme}_{Variant}_{Source}[_{Date}]`
- `MediaCompound = {L1}|{L2}|{L3}` (для прямых медиа-закупок: L0 = паблишер / Placement = DIR)

### Поля и словари (дословно из листа «Справочник»)

**L0 — Платформа / Вендор / Паблишер** (enum, метаданные, не часть имени):
yandex (Яндекс Директ), google (Google Ads), tiktok (TikTok Ads), meta (Meta/Facebook),
etarg (Сетки PF — Etarg), kadam (Сетки PF — Kadam), mybid (Сетки PF — MyBid),
propeller (Сетки PF — Propeller), adw (Сетки BA — ADW), fsm (Сетки BA — FSM),
kufar (Медиа — Kufar), myfin (Медиа — Myfin), sport5 (Медиа — Sport5),
onliner (Медиа — Onliner), championat (Медиа — Championat), avby (Медиа — av.by).

**L1:**
- Status (enum, required): NS (Nonstop), TC (Tactical), CP (Campaign — централизованная инициатива), TS (Test)
- Objective (enum, required): BA (Brand Awareness), PF (Performance)
- Product (enum, required): SPO (Спорт), CAS (Казино), GEN (Общий/кросс-продукт)
- Audience (enum, required): ACQ (Аквизиция), RTG (Ретаргетинг), RET (Удержание), WIN (Возврат), LAL (Lookalike)
- Geo (enum, required): BY, KZ, UZ
- Campaign (camelText, optional, `visibleWhen: всегда доступно, обязательно при Status=CP`): имя инициативы CamelCase (UzeSlishali, NewYear2026)

**L2:**
- Format (enum, required): SRC (Поиск), DSP (Дисплей), VID (Видео), YTS (YouTube Shorts), PSH (Push), POP (Popunder), PRE (Преролл), NAT (Нативная), FSC (Fullscreen), INT (Interscroller), MIX (Смешанные — Meta Advantage+), TGO (Текстово-графическое — Yandex/РСЯ)
- Device (enum, optional): MOB, DSK, ∅ (пусто = все устройства)
- Flow (enum, required): W2W (Веб→Веб), W2A (Веб→Приложение), A2A (Приложение→Приложение)
- Placement (enum, required): FEED, STR (Stories/Reels), SRCH, NTW (Display network/РСЯ), DIR (прямой паблишер), AUTO (Advantage+/PMax)
- TargetingDetail (camelText, required): описание таргетинга CamelCase

**L3:**
- CreativeTheme (camelText, required): игра/концепция, CamelCase (GatesOfOlympus100500)
- Variant (enum, required): V1…V10
- Source (enum, required): studio, dmt, agency, ugc
- Date (optionalDate, optional): ММГГ

### Маппинг UTM (лист «Маппинг UTM»)

- `utm_source` = L0
- `utm_campaign` = L1 (идентично)
- `utm_content` = L3
- `utm_medium` = функция от L2 Format:
  SRC→search; DSP/FSC/INT/TGO→display; VID/YTS→video; PSH→push; POP→pop; PRE→preroll; NAT→native
- `utm_term` = ключевое слово (подставляется платформой; в генераторе не задаём)

## 4. Ядро-функции (`src/lib/`, чистые)

- `buildL1(v)`, `buildL2(v)`, `buildL3(v)` — собирают строки уровней из значений по шаблону,
  пропуская опциональные пустые поля. `buildMediaCompound(v)` = `L1|L2|L3`.
- `buildUrl(v, landing, promocode)` — трекинг-URL:
  `https://start.pm.by/<landing>?utm_source=…&utm_campaign=…&utm_medium=…&utm_content=…&t_group=…&conv=1`
- `validate(v)` — правила, не закрытые дропдауном:
  - свободные поля: запрет `_`, пробелов, кириллицы; только CamelCase/цифры
  - нет гибрида «BA-PF» (структурно невозможен, но проверяем)
  - Campaign обязателен при Status=CP
  - лимиты длины: L1 ≤ ~30, L2 ≤ 60, L3 20–35 (предупреждение, не блок)
  - возвращает список нарушений `[{field, rule, message}]`
- `parseName(str, level)` — обратный разбор (псевдокод из §5 Word): `split('_')`, маппинг
  позиций на поля, валидация значений по словарю; для media-compound — `split('|')` +
  устойчивость к приписке трафик-менеджера паблишера.
- `utmMedium(format)` — отдельная таблица маппинга.

**Тесты:** «золотые» пары вход→выход берём из листа «Примеры» (5 готовых кейсов: аквизиция
казино, брендозащита, инициатива UzeSlishali, Meta Advantage+, прямая медиа-закупка).

## 5. UI — 4 роута (HashRouter)

| Роут | Ярлык | Назначение |
|---|---|---|
| `/` | Генератор | guided-форма L0→L1→L2→L3; под ней live-превью строк с копи-кнопками; media-compound если паблишер |
| `/url` | URL-билдер | те же поля + дропдаун лендинга + авто-промокод (заглушка) → готовый URL |
| `/validator` | Валидатор | вставил имя → разбор на поля + список нарушений |
| `/methodology` | Методология | ключевые разделы Word (зачем/правила/маппинг UTM) — не black box |

Пути — ASCII; ярлыки в навигации — русские.

## 6. «Bullet-proof» — через дизайн ввода

- Закрытые поля — только дропдауны: некорректное значение ввести нельзя.
- Свободные поля — live-санация: `_`/пробел/кириллица подсвечиваются, генерация блокируется.
- Условная видимость и обязательность — из конфига (Campaign, опц. Device, опц. дата L3).
- Пока имя невалидно — копи-кнопка неактивна.
- Превью имени обновляется на каждый ввод (мгновенная обратная связь).

## 7. Вне скоупа v1 (YAGNI)

- Реестр/персистентность и кросс-юзерный детект дублей (наращиваем слоем над конфигом позже).
- Реальные данные лендингов (~555) и промокодов (~13) — в книге их нет; ждём выгрузку,
  пока набор-заглушка.
- Интеграции Keitaro / AppsFlyer / Alanbase, legacy-маппинг старых имён, мультиязычность.

## 8. Definition of Done (демо)

- Все 4 роута работают, деплой на GitHub Pages зелёный.
- 5 «золотых» примеров из листа Примеры проходят в тестах buildNames.
- Невозможно сгенерировать имя с `_`/пробелом/кириллицей в свободном поле.
- Валидатор корректно разбирает и флагует примеры из листа Примеры.
- Конфиг конвенции — единственное место правки при смене значений словарей.
