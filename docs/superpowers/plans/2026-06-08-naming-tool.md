# Naming Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stateless, config-driven web tool that lets a media buyer pick values from dropdowns and get convention-correct campaign names (L0–L3) plus a tracking URL, with validation that makes convention errors impossible.

**Architecture:** Single `src/config/convention.js` is the source of truth (fields, dictionaries, UTM mapping, limits). Pure functions in `src/lib/` (TDD, unit-tested against golden examples from the Excel "Примеры" sheet) build/validate/parse names and URLs. React UI (4 routes via HashRouter) reads the config and lib; UI is build-and-verify, no unit tests (matches stat_plan convention). Static, deploys to GitHub Pages.

**Tech Stack:** React 18, Vite, Tailwind CSS, react-router-dom (HashRouter), Vitest.

Spec: `docs/superpowers/specs/2026-06-08-naming-tool-design.md`. Source of schema: `Digital Marketing Naming Tool.xlsx` (v3).

---

### Task 1: Scaffold the project

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `vitest.setup.js`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "naming-tool",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 2: Create config files**

`vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  test: { environment: 'node', setupFiles: ['./vitest.setup.js'] },
})
```

`tailwind.config.js`:
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

`postcss.config.js`:
```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } }
```

`vitest.setup.js`:
```js
// no global setup needed yet
```

- [ ] **Step 3: Create entry files**

`index.html`:
```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naming Tool</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`src/main.jsx`:
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.jsx` (placeholder shell, replaced in Task 8):
```jsx
export default function App() {
  return <div className="p-8 text-lg">Naming Tool</div>
}
```

- [ ] **Step 4: Install and verify**

Run: `npm install`
Then run: `npm run build`
Expected: build succeeds, `dist/` produced.
Then run: `npm run test`
Expected: "No test files found" (exit 0 or vitest no-tests message) — acceptable, no tests yet.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind + router + vitest"
```

---

### Task 2: Convention config (source of truth)

**Files:**
- Create: `src/config/convention.js`

No tests in this task — it is plain data, exercised by lib tests in later tasks.

- [ ] **Step 1: Write `src/config/convention.js`**

```js
// Single source of truth for the naming convention (Excel v3).
// Changing dictionary values here is the ONLY edit needed when the convention evolves.

// L0 — platform/vendor/publisher (metadata, NOT part of any name).
// group → MIL Group; tGroup → URL t_group param (used by URL builder for Media/PR).
export const L0 = [
  { code: 'yandex', label: 'Яндекс Директ', group: 'Yandex Direct', tGroup: '' },
  { code: 'google', label: 'Google Ads', group: 'Google Ads', tGroup: '' },
  { code: 'tiktok', label: 'TikTok Ads', group: 'TikTok Ads', tGroup: '' },
  { code: 'meta', label: 'Meta / Facebook', group: 'Meta', tGroup: '' },
  { code: 'etarg', label: 'Сетки PF — Etarg', group: 'Setki', tGroup: 'setki' },
  { code: 'kadam', label: 'Сетки PF — Kadam', group: 'Setki', tGroup: 'setki' },
  { code: 'mybid', label: 'Сетки PF — MyBid', group: 'Setki', tGroup: 'setki' },
  { code: 'propeller', label: 'Сетки PF — Propeller', group: 'Setki', tGroup: 'setki' },
  { code: 'adw', label: 'Сетки BA — ADW', group: 'Setki', tGroup: 'setki' },
  { code: 'fsm', label: 'Сетки BA — FSM', group: 'Setki', tGroup: 'setki' },
  { code: 'kufar', label: 'Медиа — Kufar', group: 'Media', tGroup: 'media' },
  { code: 'myfin', label: 'Медиа — Myfin', group: 'Media', tGroup: 'media' },
  { code: 'sport5', label: 'Медиа — Sport5', group: 'Media', tGroup: 'media' },
  { code: 'onliner', label: 'Медиа — Onliner', group: 'Media', tGroup: 'media' },
  { code: 'championat', label: 'Медиа — Championat', group: 'Media', tGroup: 'media' },
  { code: 'avby', label: 'Медиа — av.by', group: 'Media', tGroup: 'media' },
]

// Enum option dictionaries (code + Russian description, verbatim from "Справочник").
export const OPTIONS = {
  status: [
    { code: 'NS', desc: 'Nonstop (постоянная)' },
    { code: 'TC', desc: 'Tactical (тактическая)' },
    { code: 'CP', desc: 'Campaign (централизованная инициатива)' },
    { code: 'TS', desc: 'Test (тестовая)' },
  ],
  objective: [
    { code: 'BA', desc: 'Brand Awareness (охват/показы, без CTA на рег)' },
    { code: 'PF', desc: 'Performance (конверсия: рег/FTD/CPA)' },
  ],
  product: [
    { code: 'SPO', desc: 'Спорт' },
    { code: 'CAS', desc: 'Казино' },
    { code: 'GEN', desc: 'Общий / кросс-продукт' },
  ],
  audience: [
    { code: 'ACQ', desc: 'Аквизиция (холодная, не регистрировались)' },
    { code: 'RTG', desc: 'Ретаргетинг (тёплая, не конвертировались)' },
    { code: 'RET', desc: 'Удержание (зарегистрированные / активные)' },
    { code: 'WIN', desc: 'Возврат (ушедшие игроки)' },
    { code: 'LAL', desc: 'Lookalike (моделированная)' },
  ],
  geo: [
    { code: 'BY', desc: 'Беларусь' },
    { code: 'KZ', desc: 'Казахстан' },
    { code: 'UZ', desc: 'Узбекистан' },
  ],
  format: [
    { code: 'SRC', desc: 'Поиск (Search)' },
    { code: 'DSP', desc: 'Дисплей (Display)' },
    { code: 'VID', desc: 'Видео' },
    { code: 'YTS', desc: 'YouTube Shorts' },
    { code: 'PSH', desc: 'Push-уведомления' },
    { code: 'POP', desc: 'Popunder' },
    { code: 'PRE', desc: 'Преролл' },
    { code: 'NAT', desc: 'Нативная реклама' },
    { code: 'FSC', desc: 'Fullscreen' },
    { code: 'INT', desc: 'Interscroller' },
    { code: 'MIX', desc: 'Смешанные форматы (Meta Advantage+)' },
    { code: 'TGO', desc: 'Текстово-графическое (Yandex Direct / РСЯ)' },
  ],
  device: [
    { code: 'MOB', desc: 'Мобильное' },
    { code: 'DSK', desc: 'Десктоп' },
  ],
  flow: [
    { code: 'W2W', desc: 'Веб → Веб' },
    { code: 'W2A', desc: 'Веб → Приложение' },
    { code: 'A2A', desc: 'Приложение → Приложение' },
  ],
  placement: [
    { code: 'FEED', desc: 'Feed / основная лента' },
    { code: 'STR', desc: 'Stories / Reels / короткие вертикальные' },
    { code: 'SRCH', desc: 'Search / поисковая выдача' },
    { code: 'NTW', desc: 'Display network / РСЯ, GDN' },
    { code: 'DIR', desc: 'Direct media buy / прямой паблишер' },
    { code: 'AUTO', desc: 'Platform-managed / Advantage+, PMax' },
  ],
  variant: Array.from({ length: 10 }, (_, i) => ({ code: `V${i + 1}`, desc: `Вариант ${i + 1}` })),
  source: [
    { code: 'studio', desc: 'Креативная студия' },
    { code: 'dmt', desc: 'Команда диджитал-маркетинга' },
    { code: 'agency', desc: 'Внешнее агентство' },
    { code: 'ugc', desc: 'Пользовательский контент' },
  ],
}

// Ordered field definitions per level. kind: 'enum' | 'camelText' | 'date'.
export const L1_FIELDS = [
  { key: 'status', label: 'Статус', kind: 'enum', options: 'status', required: true },
  { key: 'objective', label: 'Цель', kind: 'enum', options: 'objective', required: true },
  { key: 'product', label: 'Продукт', kind: 'enum', options: 'product', required: true },
  { key: 'audience', label: 'Аудитория', kind: 'enum', options: 'audience', required: true },
  { key: 'geo', label: 'Гео', kind: 'enum', options: 'geo', required: true },
  { key: 'campaign', label: 'Campaign (опц., обяз. при CP)', kind: 'camelText', required: false },
]

export const L2_FIELDS = [
  { key: 'format', label: 'Формат', kind: 'enum', options: 'format', required: true },
  { key: 'device', label: 'Устройство (опц.)', kind: 'enum', options: 'device', required: false },
  { key: 'flow', label: 'Поток', kind: 'enum', options: 'flow', required: true },
  { key: 'placement', label: 'Плейсмент', kind: 'enum', options: 'placement', required: true },
  { key: 'targeting', label: 'Таргетинг', kind: 'camelText', required: true },
]

export const L3_FIELDS = [
  { key: 'theme', label: 'Тема креатива', kind: 'camelText', required: true },
  { key: 'variant', label: 'Вариант', kind: 'enum', options: 'variant', required: true },
  { key: 'source', label: 'Источник', kind: 'enum', options: 'source', required: true },
  { key: 'date', label: 'Дата L3 (ММГГ, опц.)', kind: 'date', required: false },
]

// utm_medium derived from L2 Format. MIX has no documented mapping → display (fallback).
export const UTM_MEDIUM = {
  SRC: 'search',
  DSP: 'display', FSC: 'display', INT: 'display', TGO: 'display', MIX: 'display',
  VID: 'video', YTS: 'video',
  PSH: 'push', POP: 'pop', PRE: 'preroll', NAT: 'native',
}

// Soft length limits (warnings, not blocking). L3 is a [min, max] range.
export const LIMITS = { L1: 30, L2: 60, L3: [20, 35] }

export const optionCodes = (name) => OPTIONS[name].map((o) => o.code)
```

- [ ] **Step 2: Sanity-check it imports**

Run: `node -e "import('./src/config/convention.js').then(m=>console.log(m.L0.length, m.optionCodes('format').join(',')))"`
Expected: `16 SRC,DSP,VID,YTS,PSH,POP,PRE,NAT,FSC,INT,MIX,TGO`

- [ ] **Step 3: Commit**

```bash
git add src/config/convention.js
git commit -m "feat: convention config (Excel v3 schema, dictionaries, UTM mapping)"
```

---

### Task 3: UTM medium mapping lib

**Files:**
- Create: `src/lib/utm.js`
- Test: `tests/lib/utm.test.js`

- [ ] **Step 1: Write the failing test**

`tests/lib/utm.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { utmMedium } from '../../src/lib/utm.js'

describe('utmMedium', () => {
  it('maps documented L2 formats', () => {
    expect(utmMedium('SRC')).toBe('search')
    expect(utmMedium('DSP')).toBe('display')
    expect(utmMedium('FSC')).toBe('display')
    expect(utmMedium('TGO')).toBe('display')
    expect(utmMedium('VID')).toBe('video')
    expect(utmMedium('YTS')).toBe('video')
    expect(utmMedium('PSH')).toBe('push')
    expect(utmMedium('POP')).toBe('pop')
    expect(utmMedium('PRE')).toBe('preroll')
    expect(utmMedium('NAT')).toBe('native')
  })
  it('returns empty string for unknown format', () => {
    expect(utmMedium('ZZZ')).toBe('')
    expect(utmMedium('')).toBe('')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/utm.test.js`
Expected: FAIL — cannot resolve `../../src/lib/utm.js`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/utm.js`:
```js
import { UTM_MEDIUM } from '../config/convention.js'

export function utmMedium(format) {
  return UTM_MEDIUM[format] || ''
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/utm.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utm.js tests/lib/utm.test.js
git commit -m "feat: utm_medium mapping from L2 format"
```

---

### Task 4: Name builders (golden examples)

**Files:**
- Create: `src/lib/buildNames.js`
- Test: `tests/lib/buildNames.test.js`

- [ ] **Step 1: Write the failing test**

Golden values taken verbatim from the Excel "Примеры" sheet.

`tests/lib/buildNames.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../../src/lib/buildNames.js'

describe('buildL1', () => {
  it('builds base L1 without campaign', () => {
    expect(buildL1({ status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' }))
      .toBe('TC_PF_CAS_ACQ_BY')
  })
  it('appends campaign for CP initiatives', () => {
    expect(buildL1({ status: 'CP', objective: 'PF', product: 'CAS', audience: 'RTG', geo: 'BY', campaign: 'UzeSlishali' }))
      .toBe('CP_PF_CAS_RTG_BY_UzeSlishali')
  })
})

describe('buildL2', () => {
  it('drops optional device when empty', () => {
    expect(buildL2({ format: 'SRC', flow: 'W2W', placement: 'SRCH', targeting: 'SlotQueries' }))
      .toBe('SRC_W2W_SRCH_SlotQueries')
    expect(buildL2({ format: 'VID', flow: 'W2A', placement: 'FEED', targeting: 'BroadInterest' }))
      .toBe('VID_W2A_FEED_BroadInterest')
  })
  it('includes device when present', () => {
    expect(buildL2({ format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed' }))
      .toBe('DSP_MOB_W2W_DIR_Feed')
  })
})

describe('buildL3', () => {
  it('builds without date', () => {
    expect(buildL3({ theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt' }))
      .toBe('GatesOfOlympus100500_V1_dmt')
  })
  it('appends optional date', () => {
    expect(buildL3({ theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126' }))
      .toBe('ChickenRoad100500_V1_dmt_0126')
  })
})

describe('buildMediaCompound', () => {
  it('joins L1|L2|L3 for direct media buys', () => {
    const v = {
      status: 'CP', objective: 'PF', product: 'CAS', audience: 'RTG', geo: 'BY', campaign: 'UzeSlishali',
      format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed',
      theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126',
    }
    expect(buildMediaCompound(v))
      .toBe('CP_PF_CAS_RTG_BY_UzeSlishali|DSP_MOB_W2W_DIR_Feed|ChickenRoad100500_V1_dmt_0126')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/buildNames.test.js`
Expected: FAIL — cannot resolve `buildNames.js`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/buildNames.js`:
```js
import { L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'

// Generic: take field values in declared order, drop empties, join with "_".
function buildLevel(fields, values) {
  return fields
    .map((f) => (values[f.key] ?? '').toString().trim())
    .filter((s) => s.length > 0)
    .join('_')
}

export const buildL1 = (v) => buildLevel(L1_FIELDS, v)
export const buildL2 = (v) => buildLevel(L2_FIELDS, v)
export const buildL3 = (v) => buildLevel(L3_FIELDS, v)

export const buildMediaCompound = (v) => [buildL1(v), buildL2(v), buildL3(v)].join('|')
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/buildNames.test.js`
Expected: PASS (all describe blocks green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/buildNames.js tests/lib/buildNames.test.js
git commit -m "feat: L1/L2/L3 + media-compound name builders"
```

---

### Task 5: Validation lib

**Files:**
- Create: `src/lib/validate.js`
- Test: `tests/lib/validate.test.js`

`validate(values)` returns an array of issues `{ field, severity, message }` where `severity` is
`'error'` (blocks generation) or `'warning'` (informational). Empty array = fully valid.

- [ ] **Step 1: Write the failing test**

`tests/lib/validate.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { validate, isCamelClean } from '../../src/lib/validate.js'

const valid = {
  status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY',
  format: 'VID', flow: 'W2A', placement: 'FEED', targeting: 'BroadInterest',
  theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt',
}

describe('isCamelClean', () => {
  it('accepts CamelCase with digits', () => {
    expect(isCamelClean('GatesOfOlympus100500')).toBe(true)
    expect(isCamelClean('LAL1pctFTD')).toBe(true)
  })
  it('rejects underscore, space, cyrillic, leading digit', () => {
    expect(isCamelClean('Gates_Of')).toBe(false)
    expect(isCamelClean('Gates Of')).toBe(false)
    expect(isCamelClean('Курица')).toBe(false)
    expect(isCamelClean('100500')).toBe(false)
  })
})

describe('validate', () => {
  it('returns no errors for a valid record', () => {
    expect(validate(valid).filter((i) => i.severity === 'error')).toEqual([])
  })
  it('errors on underscore in a free field', () => {
    const issues = validate({ ...valid, targeting: 'Broad_Interest' })
    expect(issues.some((i) => i.field === 'targeting' && i.severity === 'error')).toBe(true)
  })
  it('errors on cyrillic in a free field', () => {
    const issues = validate({ ...valid, theme: 'Курица' })
    expect(issues.some((i) => i.field === 'theme' && i.severity === 'error')).toBe(true)
  })
  it('requires campaign when status is CP', () => {
    const issues = validate({ ...valid, status: 'CP', campaign: '' })
    expect(issues.some((i) => i.field === 'campaign' && i.severity === 'error')).toBe(true)
  })
  it('errors on a missing required enum', () => {
    const issues = validate({ ...valid, placement: '' })
    expect(issues.some((i) => i.field === 'placement' && i.severity === 'error')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/validate.test.js`
Expected: FAIL — cannot resolve `validate.js`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/validate.js`:
```js
import { L1_FIELDS, L2_FIELDS, L3_FIELDS, LIMITS } from '../config/convention.js'
import { buildL1, buildL2, buildL3 } from './buildNames.js'

const ALL_FIELDS = [...L1_FIELDS, ...L2_FIELDS, ...L3_FIELDS]

// CamelCase / free-field rule: letters & digits only, must start with a letter.
// Rejects "_", spaces, cyrillic, leading digit.
export function isCamelClean(s) {
  return /^[A-Za-z][A-Za-z0-9]*$/.test(s)
}

export function validate(values) {
  const issues = []

  for (const f of ALL_FIELDS) {
    const raw = (values[f.key] ?? '').toString().trim()

    if (f.required && raw === '') {
      issues.push({ field: f.key, severity: 'error', message: `Поле «${f.label}» обязательно.` })
      continue
    }
    if (f.kind === 'camelText' && raw !== '' && !isCamelClean(raw)) {
      issues.push({
        field: f.key, severity: 'error',
        message: `«${f.label}»: только CamelCase без «_», пробелов и кириллицы (напр. GatesOfOlympus).`,
      })
    }
  }

  // Campaign required for centralized initiatives (Status = CP).
  if (values.status === 'CP' && (values.campaign ?? '').toString().trim() === '') {
    issues.push({ field: 'campaign', severity: 'error', message: 'При статусе CP имя Campaign обязательно.' })
  }

  // Soft length limits → warnings only.
  const l1 = buildL1(values)
  const l2 = buildL2(values)
  const l3 = buildL3(values)
  if (l1.length > LIMITS.L1)
    issues.push({ field: 'l1', severity: 'warning', message: `L1 длиннее ${LIMITS.L1} символов (${l1.length}).` })
  if (l2.length > LIMITS.L2)
    issues.push({ field: 'l2', severity: 'warning', message: `L2 длиннее ${LIMITS.L2} символов (${l2.length}).` })
  if (l3.length > 0 && (l3.length < LIMITS.L3[0] || l3.length > LIMITS.L3[1]))
    issues.push({ field: 'l3', severity: 'warning', message: `L3 обычно ${LIMITS.L3[0]}–${LIMITS.L3[1]} символов (${l3.length}).` })

  return issues
}

export const hasErrors = (values) => validate(values).some((i) => i.severity === 'error')
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/validate.test.js`
Expected: PASS (all tests). Note: the valid record's L3 is 27 chars → within range, no warning.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validate.js tests/lib/validate.test.js
git commit -m "feat: convention validation (free-field rules, CP-campaign, length warnings)"
```

---

### Task 6: Name parser (reverse)

**Files:**
- Create: `src/lib/parseName.js`
- Test: `tests/lib/parseName.test.js`

`parseName(str, level)` returns `{ fields, errors }`. `level` is `'L1' | 'L2' | 'L3'`.
`fields` maps field keys to extracted values; `errors` is an array of strings for tokens that
fail dictionary validation.

- [ ] **Step 1: Write the failing test**

`tests/lib/parseName.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { parseName } from '../../src/lib/parseName.js'

describe('parseName L1', () => {
  it('parses base L1', () => {
    const { fields, errors } = parseName('TC_PF_CAS_ACQ_BY', 'L1')
    expect(fields).toMatchObject({ status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' })
    expect(errors).toEqual([])
  })
  it('parses CP with campaign', () => {
    const { fields } = parseName('CP_PF_CAS_RTG_BY_UzeSlishali', 'L1')
    expect(fields.campaign).toBe('UzeSlishali')
  })
  it('flags an invalid status token', () => {
    const { errors } = parseName('XX_PF_CAS_ACQ_BY', 'L1')
    expect(errors.length).toBeGreaterThan(0)
  })
})

describe('parseName L2', () => {
  it('parses L2 without device', () => {
    const { fields } = parseName('SRC_W2W_SRCH_SlotQueries', 'L2')
    expect(fields).toMatchObject({ format: 'SRC', device: '', flow: 'W2W', placement: 'SRCH', targeting: 'SlotQueries' })
  })
  it('parses L2 with device', () => {
    const { fields } = parseName('DSP_MOB_W2W_DIR_Feed', 'L2')
    expect(fields).toMatchObject({ format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed' })
  })
})

describe('parseName L3', () => {
  it('parses L3 with optional date', () => {
    const { fields } = parseName('ChickenRoad100500_V1_dmt_0126', 'L3')
    expect(fields).toMatchObject({ theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126' })
  })
  it('parses L3 without date', () => {
    const { fields } = parseName('GatesOfOlympus100500_V1_dmt', 'L3')
    expect(fields).toMatchObject({ theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt', date: '' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/lib/parseName.test.js`
Expected: FAIL — cannot resolve `parseName.js`.

- [ ] **Step 3: Write minimal implementation**

`src/lib/parseName.js`:
```js
import { optionCodes } from '../config/convention.js'

const inDict = (name, val) => optionCodes(name).includes(val)
const isDate = (s) => /^\d{4}$/.test(s)

function parseL1(parts) {
  const fields = { status: '', objective: '', product: '', audience: '', geo: '', campaign: '' }
  const errors = []
  const [status, objective, product, audience, geo, campaign] = parts
  fields.status = status || ''
  fields.objective = objective || ''
  fields.product = product || ''
  fields.audience = audience || ''
  fields.geo = geo || ''
  fields.campaign = campaign || ''
  if (!inDict('status', status)) errors.push(`Статус «${status}» вне словаря.`)
  if (!inDict('objective', objective)) errors.push(`Цель «${objective}» вне словаря.`)
  if (!inDict('product', product)) errors.push(`Продукт «${product}» вне словаря.`)
  if (!inDict('audience', audience)) errors.push(`Аудитория «${audience}» вне словаря.`)
  if (!inDict('geo', geo)) errors.push(`Гео «${geo}» вне словаря.`)
  return { fields, errors }
}

function parseL2(parts) {
  const fields = { format: '', device: '', flow: '', placement: '', targeting: '' }
  const errors = []
  let i = 0
  fields.format = parts[i] || ''
  if (!inDict('format', fields.format)) errors.push(`Формат «${fields.format}» вне словаря.`)
  i += 1
  if (inDict('device', parts[i])) { fields.device = parts[i]; i += 1 }
  fields.flow = parts[i] || ''
  if (!inDict('flow', fields.flow)) errors.push(`Поток «${fields.flow}» вне словаря.`)
  i += 1
  fields.placement = parts[i] || ''
  if (!inDict('placement', fields.placement)) errors.push(`Плейсмент «${fields.placement}» вне словаря.`)
  i += 1
  fields.targeting = parts.slice(i).join('_')
  if (!fields.targeting) errors.push('Отсутствует TargetingDetail.')
  return { fields, errors }
}

function parseL3(parts) {
  const fields = { theme: '', variant: '', source: '', date: '' }
  const errors = []
  fields.theme = parts[0] || ''
  fields.variant = parts[1] || ''
  fields.source = parts[2] || ''
  if (parts[3] && isDate(parts[3])) fields.date = parts[3]
  if (!/^V\d+$/.test(fields.variant)) errors.push(`Вариант «${fields.variant}» должен быть V1…V10.`)
  if (!inDict('source', fields.source)) errors.push(`Источник «${fields.source}» вне словаря.`)
  return { fields, errors }
}

export function parseName(str, level) {
  const parts = (str || '').trim().split('_')
  if (level === 'L1') return parseL1(parts)
  if (level === 'L2') return parseL2(parts)
  if (level === 'L3') return parseL3(parts)
  return { fields: {}, errors: [`Неизвестный уровень: ${level}`] }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/lib/parseName.test.js`
Expected: PASS (all describe blocks green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/parseName.js tests/lib/parseName.test.js
git commit -m "feat: reverse name parser for L1/L2/L3"
```

---

### Task 7: URL builder + landings stub data

**Files:**
- Create: `src/data/landings.sample.js`, `src/lib/buildUrl.js`
- Test: `tests/lib/buildUrl.test.js`

- [ ] **Step 1: Write stub data**

`src/data/landings.sample.js`:
```js
// DEMO stub. Real registry (~555 landings / ~13 promocodes) plugs in here later, same shape.
export const LANDINGS = [
  { slug: 'chicken_road_nb', label: 'Chicken Road (рег)', promocode: 'CHICK100500' },
  { slug: 'gates_of_olympus', label: 'Gates of Olympus (рег)', promocode: 'OLYMP100500' },
  { slug: 'general_registration', label: 'Общая регистрация', promocode: 'WELCOME500' },
  { slug: 'sport_welcome', label: 'Спорт welcome', promocode: 'SPORT100' },
  { slug: 'casino_bonus_100_500', label: 'Казино бонус 100+500', promocode: 'CAS100500' },
  { slug: 'demo_pass', label: 'Demo Pass', promocode: '' },
]

export const promocodeFor = (slug) => (LANDINGS.find((l) => l.slug === slug)?.promocode ?? '')
```

- [ ] **Step 2: Write the failing test**

`tests/lib/buildUrl.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { buildUrl } from '../../src/lib/buildUrl.js'

const v = {
  l0: 'kufar',
  status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY',
  format: 'DSP', flow: 'W2W', placement: 'DIR', targeting: 'MainPage',
  theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt',
}

describe('buildUrl', () => {
  it('assembles a tracking URL from convention values', () => {
    const url = buildUrl(v, 'gates_of_olympus', 'OLYMP100500')
    expect(url).toContain('https://start.pm.by/gates_of_olympus?')
    expect(url).toContain('utm_source=kufar')
    expect(url).toContain('utm_campaign=TC_PF_CAS_ACQ_BY')
    expect(url).toContain('utm_medium=display')
    expect(url).toContain('utm_content=GatesOfOlympus100500_V1_dmt')
    expect(url).toContain('t_group=media')
    expect(url).toContain('conv=1')
    expect(url).toContain('promocode=OLYMP100500')
  })
  it('omits promocode when empty', () => {
    const url = buildUrl(v, 'demo_pass', '')
    expect(url).not.toContain('promocode=')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/lib/buildUrl.test.js`
Expected: FAIL — cannot resolve `buildUrl.js`.

- [ ] **Step 4: Write minimal implementation**

`src/lib/buildUrl.js`:
```js
import { L0 } from '../config/convention.js'
import { buildL1, buildL3 } from './buildNames.js'
import { utmMedium } from './utm.js'

const tGroupFor = (l0) => L0.find((x) => x.code === l0)?.tGroup ?? ''

export function buildUrl(values, landingSlug, promocode) {
  const params = new URLSearchParams()
  if (promocode) params.set('promocode', promocode)
  params.set('utm_source', values.l0 || '')
  params.set('utm_campaign', buildL1(values))
  params.set('utm_medium', utmMedium(values.format))
  params.set('utm_content', buildL3(values))
  const tg = tGroupFor(values.l0)
  if (tg) params.set('t_group', tg)
  params.set('conv', '1')
  // URLSearchParams percent-encodes "_"? No — "_" is unreserved, left intact.
  return `https://start.pm.by/${landingSlug}?${params.toString()}`
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/lib/buildUrl.test.js`
Expected: PASS (2 tests). `_` stays literal in query values (unreserved char).

- [ ] **Step 6: Run the full suite**

Run: `npm run test`
Expected: all lib test files PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data/landings.sample.js src/lib/buildUrl.js tests/lib/buildUrl.test.js
git commit -m "feat: tracking URL builder + landings stub data"
```

---

### Task 8: App shell, routing, navigation

**Files:**
- Modify: `src/App.jsx`
- Create: `src/components/Layout.jsx`

UI tasks are build-and-verify (no unit tests), per project convention.

- [ ] **Step 1: Write `src/components/Layout.jsx`**

```jsx
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Генератор', end: true },
  { to: '/url', label: 'URL-билдер' },
  { to: '/validator', label: 'Валидатор' },
  { to: '/methodology', label: 'Методология' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-6">
          <span className="font-semibold">Naming Tool</span>
          <nav className="flex gap-4 text-sm">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-800'
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Replace `src/App.jsx` with routing**

```jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Generator from './pages/Generator.jsx'
import UrlBuilder from './pages/UrlBuilder.jsx'
import Validator from './pages/Validator.jsx'
import Methodology from './pages/Methodology.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Generator />} />
          <Route path="url" element={<UrlBuilder />} />
          <Route path="validator" element={<Validator />} />
          <Route path="methodology" element={<Methodology />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
```

- [ ] **Step 3: Create temporary page stubs so the app compiles**

Create `src/pages/Generator.jsx`, `src/pages/UrlBuilder.jsx`, `src/pages/Validator.jsx`,
`src/pages/Methodology.jsx`, each with:
```jsx
export default function Page() {
  return <div>скоро</div>
}
```
(Name the function per file: `Generator`, `UrlBuilder`, `Validator`, `Methodology`.)

- [ ] **Step 4: Verify it builds and runs**

Run: `npm run build`
Expected: build succeeds.
Run: `npm run dev` and open the printed URL.
Expected: header with 4 nav links; clicking each switches the body; no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/components/Layout.jsx src/pages/
git commit -m "feat: app shell, HashRouter routing, navigation"
```

---

### Task 9: Form field components

**Files:**
- Create: `src/components/FieldSelect.jsx`, `src/components/FieldCamelText.jsx`, `src/components/LevelSection.jsx`, `src/components/NamePreview.jsx`

- [ ] **Step 1: Write `src/components/FieldSelect.jsx`**

```jsx
export default function FieldSelect({ field, value, onChange }) {
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{field.label}{field.required && ' *'}</span>
      <select
        className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5"
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      >
        <option value="">{field.required ? '— выберите —' : '— не задано —'}</option>
        {field.opts.map((o) => (
          <option key={o.code} value={o.code}>{o.code} — {o.desc}</option>
        ))}
      </select>
    </label>
  )
}
```

- [ ] **Step 2: Write `src/components/FieldCamelText.jsx`**

```jsx
import { isCamelClean } from '../lib/validate.js'

export default function FieldCamelText({ field, value, onChange }) {
  const v = value || ''
  const bad = v !== '' && !isCamelClean(v)
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{field.label}{field.required && ' *'}</span>
      <input
        type="text"
        className={`mt-1 w-full rounded border px-2 py-1.5 ${bad ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
        value={v}
        placeholder="CamelCase, напр. GatesOfOlympus"
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {bad && <span className="mt-1 block text-xs text-red-600">Только латиница/цифры, без «_», пробелов и кириллицы.</span>}
    </label>
  )
}
```

- [ ] **Step 3: Write `src/components/LevelSection.jsx`**

```jsx
import { OPTIONS } from '../config/convention.js'
import FieldSelect from './FieldSelect.jsx'
import FieldCamelText from './FieldCamelText.jsx'

export default function LevelSection({ title, fields, values, onChange }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => {
          if (f.kind === 'enum') {
            return <FieldSelect key={f.key} field={{ ...f, opts: OPTIONS[f.options] }} value={values[f.key]} onChange={onChange} />
          }
          if (f.kind === 'date') {
            return (
              <label key={f.key} className="block text-sm">
                <span className="text-slate-600">{f.label}</span>
                <input
                  type="text" inputMode="numeric" maxLength={4} placeholder="ММГГ"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value.replace(/\D/g, ''))}
                />
              </label>
            )
          }
          return <FieldCamelText key={f.key} field={f} value={values[f.key]} onChange={onChange} />
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `src/components/NamePreview.jsx`**

```jsx
import { useState } from 'react'

export default function NamePreview({ label, value, disabled }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (disabled || !value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs font-medium text-slate-500">{label}</span>
      <code className={`flex-1 truncate rounded bg-slate-100 px-2 py-1 text-sm ${disabled ? 'text-slate-400' : 'text-slate-900'}`}>
        {value || '—'}
      </code>
      <button
        type="button"
        onClick={copy}
        disabled={disabled || !value}
        className="rounded border px-2 py-1 text-xs disabled:opacity-40"
      >
        {copied ? '✓' : 'Копировать'}
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Verify it builds**

Run: `npm run build`
Expected: build succeeds (components compile even if not yet used).

- [ ] **Step 6: Commit**

```bash
git add src/components/FieldSelect.jsx src/components/FieldCamelText.jsx src/components/LevelSection.jsx src/components/NamePreview.jsx
git commit -m "feat: form field + name preview components"
```

---

### Task 10: Generator page

**Files:**
- Modify: `src/pages/Generator.jsx`

- [ ] **Step 1: Write `src/pages/Generator.jsx`**

```jsx
import { useState } from 'react'
import { L0, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../lib/buildNames.js'
import { validate } from '../lib/validate.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'

export default function Generator() {
  const [values, setValues] = useState({})
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))

  const issues = validate(values)
  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warning')
  const blocked = errors.length > 0
  const isPublisher = (L0.find((x) => x.code === values.l0)?.group) === 'Media'

  return (
    <div className="space-y-4">
      <LevelSection title="L0 — Платформа / Вендор / Паблишер"
        fields={[{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]}
        values={values} onChange={onChange} l0Override />
      <LevelSection title="L1 — Кампания" fields={L1_FIELDS} values={values} onChange={onChange} />
      <LevelSection title="L2 — Группа объявлений" fields={L2_FIELDS} values={values} onChange={onChange} />
      <LevelSection title="L3 — Креатив" fields={L3_FIELDS} values={values} onChange={onChange} />

      <section className="sticky bottom-0 rounded-lg border bg-white p-4 shadow space-y-2">
        <h2 className="text-sm font-semibold text-slate-700">Результат</h2>
        <NamePreview label="L0" value={values.l0 || ''} />
        <NamePreview label="L1" value={buildL1(values)} disabled={blocked} />
        <NamePreview label="L2" value={buildL2(values)} disabled={blocked} />
        <NamePreview label="L3" value={buildL3(values)} disabled={blocked} />
        {isPublisher && <NamePreview label="Media (L1|L2|L3)" value={buildMediaCompound(values)} disabled={blocked} />}
        {errors.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-red-600">
            {errors.map((e, i) => <li key={i}>• {e.message}</li>)}
          </ul>
        )}
        {warnings.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-amber-600">
            {warnings.map((w, i) => <li key={i}>• {w.message}</li>)}
          </ul>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Make `LevelSection` handle the L0 field**

The L0 dropdown uses the `L0` array (code+label), not `OPTIONS`. Update `src/components/LevelSection.jsx`:
add an `l0Override` prop and, when set, map L0 entries to the `{code, desc}` shape FieldSelect expects.

Modify the top of `LevelSection` body:
```jsx
import { OPTIONS, L0 } from '../config/convention.js'
```
and inside the `.map`, replace the `f.kind === 'enum'` branch with:
```jsx
if (f.kind === 'enum') {
  const opts = f.options === 'l0' ? L0.map((x) => ({ code: x.code, desc: x.label })) : OPTIONS[f.options]
  return <FieldSelect key={f.key} field={{ ...f, opts }} value={values[f.key]} onChange={onChange} />
}
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`
Checks:
- Pick L0=meta, L1 = TC/PF/CAS/ACQ/BY → preview shows `L1: TC_PF_CAS_ACQ_BY`.
- Type `Broad_Interest` in Targeting → field turns red, copy buttons for L1/L2/L3 disabled, error listed.
- Fix to `BroadInterest`, fill required L2/L3 → copy buttons enable.
- Set L0=kufar → "Media (L1|L2|L3)" line appears.
- Set Status=CP with empty Campaign → error "При статусе CP имя Campaign обязательно".

- [ ] **Step 4: Commit**

```bash
git add src/pages/Generator.jsx src/components/LevelSection.jsx
git commit -m "feat: generator page with live preview, validation gating, media-compound"
```

---

### Task 11: URL builder page

**Files:**
- Modify: `src/pages/UrlBuilder.jsx`

- [ ] **Step 1: Write `src/pages/UrlBuilder.jsx`**

```jsx
import { useState } from 'react'
import { L0, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { LANDINGS, promocodeFor } from '../data/landings.sample.js'
import { buildUrl } from '../lib/buildUrl.js'
import { validate } from '../lib/validate.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'

export default function UrlBuilder() {
  const [values, setValues] = useState({})
  const [landing, setLanding] = useState('')
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))

  const promocode = promocodeFor(landing)
  const blocked = validate(values).some((i) => i.severity === 'error') || !landing
  const url = blocked ? '' : buildUrl(values, landing, promocode)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Для прямых медиа/PR-размещений без Keitaro. Заполните поля конвенции и выберите лендинг.
      </p>
      <LevelSection title="L0 — Платформа / Вендор / Паблишер"
        fields={[{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]}
        values={values} onChange={onChange} l0Override />
      <LevelSection title="L1 — Кампания" fields={L1_FIELDS} values={values} onChange={onChange} />
      <LevelSection title="L2 — Группа объявлений" fields={L2_FIELDS} values={values} onChange={onChange} />
      <LevelSection title="L3 — Креатив" fields={L3_FIELDS} values={values} onChange={onChange} />

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Лендинг + промокод</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="text-slate-600">Лендинг *</span>
            <select className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1.5"
              value={landing} onChange={(e) => setLanding(e.target.value)}>
              <option value="">— выберите —</option>
              {LANDINGS.map((l) => <option key={l.slug} value={l.slug}>{l.label}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Промокод (авто)</span>
            <input readOnly className="mt-1 w-full rounded border border-slate-200 bg-slate-50 px-2 py-1.5"
              value={promocode || '—'} />
          </label>
        </div>
      </section>

      <section className="sticky bottom-0 rounded-lg border bg-white p-4 shadow">
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Трекинг-URL</h2>
        <NamePreview label="URL" value={url} disabled={blocked} />
        {blocked && <p className="mt-2 text-xs text-slate-400">Заполните обязательные поля и выберите лендинг.</p>}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` → open `#/url`.
Checks:
- Fill L0=kufar + valid L1/L2/L3, pick landing "Gates of Olympus" → URL line shows full URL
  containing `utm_source=kufar`, `utm_campaign=…`, `utm_medium=display`, `t_group=media`, `conv=1`, `promocode=OLYMP100500`.
- Pick landing "Demo Pass" (no promocode) → URL has no `promocode=`.
- Clear a required field → URL line disables.

- [ ] **Step 3: Commit**

```bash
git add src/pages/UrlBuilder.jsx
git commit -m "feat: URL builder page (Media/PR tracking links)"
```

---

### Task 12: Validator page

**Files:**
- Modify: `src/pages/Validator.jsx`

- [ ] **Step 1: Write `src/pages/Validator.jsx`**

```jsx
import { useState } from 'react'
import { parseName } from '../lib/parseName.js'

const LEVELS = ['L1', 'L2', 'L3']

export default function Validator() {
  const [level, setLevel] = useState('L1')
  const [input, setInput] = useState('')
  const { fields, errors } = input ? parseName(input, level) : { fields: {}, errors: [] }
  const entries = Object.entries(fields)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Вставьте существующее имя — разберём на поля и проверим по конвенции.</p>
      <div className="flex gap-2">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`rounded border px-3 py-1 text-sm ${level === l ? 'bg-blue-600 text-white' : 'bg-white'}`}>
            {l}
          </button>
        ))}
      </div>
      <input className="w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
        placeholder={level === 'L1' ? 'TC_PF_CAS_ACQ_BY' : level === 'L2' ? 'DSP_MOB_W2W_DIR_Feed' : 'GatesOfOlympus100500_V1_dmt'}
        value={input} onChange={(e) => setInput(e.target.value)} />

      {input && (
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Разбор</h2>
          <table className="w-full text-sm">
            <tbody>
              {entries.map(([k, val]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="py-1 pr-4 text-slate-500">{k}</td>
                  <td className="py-1 font-mono">{val || <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-red-600">{errors.map((e, i) => <li key={i}>• {e}</li>)}</ul>
          ) : (
            <p className="mt-3 text-xs text-green-600">✓ Соответствует конвенции.</p>
          )}
        </section>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` → open `#/validator`.
Checks:
- L1 + `TC_PF_CAS_ACQ_BY` → table fills, "✓ Соответствует конвенции".
- L1 + `XX_PF_CAS_ACQ_BY` → error "Статус «XX» вне словаря".
- L2 + `DSP_MOB_W2W_DIR_Feed` → device=MOB parsed correctly.
- L3 + `GatesOfOlympus100500_V1_dmt` → ✓.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Validator.jsx
git commit -m "feat: validator/parser page"
```

---

### Task 13: Methodology page

**Files:**
- Modify: `src/pages/Methodology.jsx`

- [ ] **Step 1: Write `src/pages/Methodology.jsx`**

```jsx
export default function Methodology() {
  return (
    <article className="prose-sm max-w-none space-y-6 text-sm leading-relaxed">
      <section>
        <h1 className="text-lg font-semibold">Зачем единая конвенция</h1>
        <p>Компания ведёт платное привлечение на 8+ рекламных платформах с разным именованием.
          Имена кампаний не совпадают с UTM, а те — с полями Mktg Info Lite. Кросс-платформенный
          анализ делается вручную. Конвенция даёт машиночитаемые, единые на всех платформах имена.</p>
      </section>
      <section>
        <h2 className="font-semibold">Четыре уровня</h2>
        <ul className="list-disc pl-5">
          <li><b>L0</b> — платформа/вендор/паблишер. Метаданные, не часть имени. → <code>utm_source</code>.</li>
          <li><b>L1</b> — кампания: <code>Status_Objective_Product_Audience_Geo[_Campaign]</code>. Одинаков на всех платформах.</li>
          <li><b>L2</b> — группа: <code>Format[_Device]_Flow_Placement_TargetingDetail</code>. Placement обязателен.</li>
          <li><b>L3</b> — креатив: <code>CreativeTheme_Variant_Source[_Date]</code>.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-semibold">Ключевые правила</h2>
        <ul className="list-disc pl-5">
          <li>Разделитель — всегда <code>_</code>. Свободные поля — CamelCase, без <code>_</code>, пробелов и кириллицы.</li>
          <li>Цель бинарна: BA или PF. Никаких «BA-PF».</li>
          <li>Ретаргетинг — это Аудитория (RTG), а не Цель.</li>
          <li>Нет продукта APP: установки — SPO/CAS с Flow = W2A/A2A.</li>
          <li>Платформа не пишется в имени — она в L0.</li>
          <li>Для прямых медиа-закупок L1|L2|L3 пакуются в имя креатива через <code>|</code>.</li>
        </ul>
      </section>
      <section>
        <h2 className="font-semibold">Маппинг UTM</h2>
        <table className="w-full text-left">
          <thead><tr className="border-b"><th className="py-1">Параметр</th><th>Источник</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="py-1"><code>utm_source</code></td><td>L0</td></tr>
            <tr className="border-b"><td className="py-1"><code>utm_campaign</code></td><td>L1 (идентично)</td></tr>
            <tr className="border-b"><td className="py-1"><code>utm_medium</code></td><td>из L2 Format (SRC→search, DSP→display, VID→video, PSH→push…)</td></tr>
            <tr><td className="py-1"><code>utm_content</code></td><td>L3</td></tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` → open `#/methodology`. Expected: readable content, no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Methodology.jsx
git commit -m "feat: methodology page"
```

---

### Task 14: GitHub Pages deploy + project docs

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`, `CLAUDE.md`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `README.md`**

```markdown
# Naming Tool

Веб-инструмент для генерации имён рекламных кампаний по единой конвенции (L0–L3),
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
```

- [ ] **Step 3: Write `CLAUDE.md`**

```markdown
# Claude Code — контекст проекта

## Что это
Веб-инструмент генерации имён рекламных кампаний по конвенции L0–L3 + URL-билдер + валидатор.
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
```

- [ ] **Step 4: Final verification**

Run: `npm run test`
Expected: all lib tests PASS.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml README.md CLAUDE.md
git commit -m "chore: GitHub Pages deploy workflow + project docs"
```

---

## Notes for the implementer

- **Source of truth is the Excel, not the Word doc.** If anything conflicts, follow `src/config/convention.js` and the spec.
- **Never hardcode convention values in components** — always read from `convention.js`. This is what keeps the tool future-proof.
- **`_` in query strings:** `URLSearchParams.toString()` leaves `_` literal (it is an unreserved character); do not manually encode it.
- **Enabling GitHub Pages:** after the first push to `main`, set repo Settings → Pages → Source = "GitHub Actions". The workflow handles the rest.
- **Registry is out of scope** but the config-driven design means it bolts on as a new layer (e.g. a `useRegistry` hook + storage adapter) without touching `src/lib/`.
