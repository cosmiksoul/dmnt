# Demo Enhancements (Round 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a parameter reference page, a creative-packaging button in the Generator, and a roadmap page to the Betera naming demo.

**Architecture:** Static React (Vite + Tailwind + HashRouter), config-driven. Two new read-only pages wired into the existing nav/router; one new pure lib function (`buildCreativePackage`) with tests, surfaced by a button in the Generator. No backend.

**Tech Stack:** React 18, Vite, Tailwind, react-router-dom (HashRouter), Vitest.

**Spec:** `docs/superpowers/specs/2026-06-08-demo-enhancements-design.md`

**Branch:** `feat/demo-enhancements` (already created and checked out).

**Conventions to respect:**
- Convention data lives only in `src/config/convention.js`; pages read from it.
- Tests only for pure `src/lib/` functions. Pages are build-and-verify (no component tests).
- Existing design tokens/classes: `card`, `lvl-badge`, `field-label`, `field-control`, `code-chip`, colors `accent`/`accent-wash`/`accent-bright`/`ink`/`ink-soft`/`ink-muted`/`ink-faint`/`line`/`paper`/`surface`.
- HashRouter caveat: do NOT use `<a href="#anchor">` for in-page jumps — it corrupts the route hash. Use a button with `scrollIntoView`.

---

### Task 1: `buildCreativePackage` lib function (TDD)

**Files:**
- Modify: `src/lib/buildNames.js`
- Test: `tests/lib/buildNames.test.js`

- [ ] **Step 1: Write the failing tests**

Append to `tests/lib/buildNames.test.js`:

```js
describe('buildCreativePackage', () => {
  it('packs full L1/L2/L3 into canonical (|) and filename (-) forms', () => {
    const v = {
      status: 'CP', objective: 'PF', product: 'CAS', audience: 'RTG', geo: 'BY', campaign: 'UzeSlishali',
      format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed',
      theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126',
    }
    expect(buildCreativePackage(v)).toEqual({
      canonical: 'CP_PF_CAS_RTG_BY_UzeSlishali|DSP_MOB_W2W_DIR_Feed|ChickenRoad100500_V1_dmt_0126',
      filename: 'CP_PF_CAS_RTG_BY_UzeSlishali-DSP_MOB_W2W_DIR_Feed-ChickenRoad100500_V1_dmt_0126',
    })
  })

  it('drops empty levels in both forms', () => {
    const v = { status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' }
    expect(buildCreativePackage(v)).toEqual({ canonical: 'TC_PF_CAS_ACQ_BY', filename: 'TC_PF_CAS_ACQ_BY' })
  })

  it('returns empty strings when nothing is filled', () => {
    expect(buildCreativePackage({})).toEqual({ canonical: '', filename: '' })
  })
})
```

Also add `buildCreativePackage` to the import on line 2:

```js
import { buildL1, buildL2, buildL3, buildMediaCompound, buildCreativePackage } from '../../src/lib/buildNames.js'
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- buildNames`
Expected: FAIL — `buildCreativePackage is not a function` (or not exported).

- [ ] **Step 3: Implement the function**

In `src/lib/buildNames.js`, after the `buildMediaCompound` line, add:

```js
// Pack L1|L2|L3 into a creative name. canonical uses '|' (methodology);
// filename uses '-' (filesystem-safe — '|' is illegal in filenames). Empty
// levels are dropped, so partial input still yields a clean string.
export const buildCreativePackage = (v) => {
  const parts = [buildL1(v), buildL2(v), buildL3(v)].filter(Boolean)
  return { canonical: parts.join('|'), filename: parts.join('-') }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- buildNames`
Expected: PASS (all `buildNames` describe blocks green, including the 3 new cases).

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: PASS — 36 tests (33 prior + 3 new).

- [ ] **Step 6: Commit**

```bash
git add src/lib/buildNames.js tests/lib/buildNames.test.js
git commit -m "feat(lib): add buildCreativePackage (canonical + filename forms)"
```

---

### Task 2: Creative-packaging button in the Generator

**Files:**
- Modify: `src/pages/Generator.jsx`

Replaces the auto-shown `MEDIA` preview (publishers only) with an on-demand "Упаковать креатив" button available for any platform, revealing both the canonical (`|`) and filename (`-`) forms with copy buttons. The media-publisher hint moves into that block.

- [ ] **Step 1: Update imports**

In `src/pages/Generator.jsx`, change the top imports.

Replace line 1:

```js
import { useNavigate } from 'react-router-dom'
```

with:

```js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
```

Replace the `buildNames` import (currently line 3):

```js
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../lib/buildNames.js'
```

with:

```js
import { buildL1, buildL2, buildL3, buildCreativePackage } from '../lib/buildNames.js'
```

- [ ] **Step 2: Add packing state and computed package**

Inside `export default function Generator()`, after `const reset = () => setValues({})` (currently line 17), add:

```js
  const [packed, setPacked] = useState(false)
```

After the `const l3 = buildL3(values)` line (currently line 38), add:

```js
  const pkg = buildCreativePackage(values)
```

- [ ] **Step 3: Remove the auto MEDIA preview from the results panel**

In the `<ResultsPanel>` block, delete this line (currently line 68):

```js
            {isPublisher && <NamePreview label="MEDIA" value={buildMediaCompound(values)} disabled={blocked} wrap />}
```

Leave the rest of the panel (L0/L1/L2/L3 and the "ВСЁ" block) unchanged. Keep the `isPublisher` constant — it is reused in Step 4.

- [ ] **Step 4: Add the packaging button and block**

Directly after the closing `</ResultsPanel>` tag and before the `<button ... onClick={toUrlBuilder}>` block, insert:

```jsx
          <button
            type="button"
            onClick={() => setPacked((p) => !p)}
            disabled={blocked || !pkg.canonical}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/30 bg-accent-wash px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:border-line disabled:bg-transparent disabled:text-ink-faint"
          >
            {packed ? 'Скрыть упаковку' : 'Упаковать креатив'}
          </button>

          {packed && !blocked && pkg.canonical && (
            <div className="mt-3 space-y-2 rounded-lg border border-line bg-paper p-3">
              <NamePreview label="ИМЯ" value={pkg.canonical} wrap />
              <NamePreview label="ФАЙЛ" value={pkg.filename} wrap />
              {isPublisher && (
                <p className="text-xs leading-relaxed text-ink-muted">
                  Для прямых медиа-закупок упаковка обязательна — это имя креатива.
                </p>
              )}
            </div>
          )}
```

- [ ] **Step 5: Build and verify**

Run: `npm run build`
Expected: Build succeeds, no unresolved imports (no remaining reference to `buildMediaCompound`).

Run: `npm test`
Expected: PASS — 36 tests (UI change touches no tests).

Manual check (describe in commit, do not block on it): on the Generator, fill L1–L3, click "Упаковать креатив" → block shows ИМЯ with `|` and ФАЙЛ with `-`, both copyable; button disabled when no valid input.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Generator.jsx
git commit -m "feat(generator): on-demand creative packaging (canonical + filename)"
```

---

### Task 3: Parameter reference page (`/reference`)

**Files:**
- Create: `src/pages/Reference.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Layout.jsx`

Read-only page rendering every convention dictionary, grouped by level, straight from `convention.js`.

- [ ] **Step 1: Create the page**

Create `src/pages/Reference.jsx`:

```jsx
import { L0, OPTIONS, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'

const LEVELS = [
  { code: 'L1', title: 'Кампания', fields: L1_FIELDS },
  { code: 'L2', title: 'Группа объявлений', fields: L2_FIELDS },
  { code: 'L3', title: 'Креатив', fields: L3_FIELDS },
]

const NOTE = {
  camelText: 'Свободное поле — CamelCase, без «_», пробелов и кириллицы.',
  date: 'Дата в формате ММГГ.',
}

function CodeTable({ rows }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(({ code, desc }) => (
          <tr key={code} className="border-b border-line last:border-0">
            <td className="w-px whitespace-nowrap py-1.5 pr-4 align-top font-mono text-xs text-accent">{code}</td>
            <td className="py-1.5 align-top text-ink-soft">{desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Field({ field }) {
  return (
    <div>
      <h3 className="mb-1.5 text-sm font-semibold text-ink-soft">
        {field.label}
        {field.required ? <span className="text-accent"> *</span> : <span className="text-ink-faint"> (опц.)</span>}
      </h3>
      {field.kind === 'enum' ? (
        <CodeTable rows={OPTIONS[field.options]} />
      ) : (
        <p className="text-xs text-ink-muted">{NOTE[field.kind]}</p>
      )}
    </div>
  )
}

export default function Reference() {
  const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Справочник параметров</h1>
        <p className="mt-1 text-sm text-ink-muted">Все коды конвенции с расшифровками, разбитые по уровням.</p>
      </header>

      <nav className="flex flex-wrap gap-2">
        {['L0', 'L1', 'L2', 'L3'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => jump(c)}
            className="rounded-lg border border-line px-3 py-1 font-mono text-xs font-semibold text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            {c}
          </button>
        ))}
      </nav>

      <section id="L0" className="card scroll-mt-24 p-6">
        <header className="mb-4 flex items-center gap-3">
          <span className="lvl-badge">L0</span>
          <h2 className="text-base font-semibold">Платформа / Вендор / Паблишер</h2>
        </header>
        <CodeTable rows={L0.map((x) => ({ code: x.code, desc: x.label }))} />
      </section>

      {LEVELS.map(({ code, title, fields }) => (
        <section key={code} id={code} className="card scroll-mt-24 p-6">
          <header className="mb-4 flex items-center gap-3">
            <span className="lvl-badge">{code}</span>
            <h2 className="text-base font-semibold">{title}</h2>
          </header>
          <div className="space-y-5">
            {fields.map((f) => (
              <Field key={f.key} field={f} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Add the route**

In `src/App.jsx`, add the import near the other page imports:

```js
import Reference from './pages/Reference.jsx'
```

Add the route inside `<Route element={<Layout />}>`, after the `validator` route:

```jsx
          <Route path="reference" element={<Reference />} />
```

- [ ] **Step 3: Add the nav link**

In `src/components/Layout.jsx`, add to the `links` array, after the `validator` entry:

```js
  { to: '/reference', label: 'Справочник' },
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

Run: `npm test`
Expected: PASS — 36 tests (no test changes).

Manual check: nav shows "Справочник"; page lists L0 platforms and L1/L2/L3 fields with code→description tables; L0/L1/L2/L3 jump buttons scroll to sections.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Reference.jsx src/App.jsx src/components/Layout.jsx
git commit -m "feat(reference): parameter reference page grouped by level"
```

---

### Task 4: Roadmap page (`/roadmap`)

**Files:**
- Create: `src/pages/Roadmap.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Layout.jsx`

Read-only vertical timeline of five phases from the spec.

- [ ] **Step 1: Create the page**

Create `src/pages/Roadmap.jsx`:

```jsx
const PHASES = [
  {
    tag: 'Сейчас',
    current: true,
    title: 'Демо',
    body: 'Stateless, config-driven. Генератор, URL-билдер, валидатор, справочник — всё на статике, без бэкенда.',
  },
  {
    tag: 'Этап 1',
    title: 'Бэкенд + реестр',
    body: 'Прикрутить бэкенд и хранилище утверждённых кампаний — единый реестр имён.',
  },
  {
    tag: 'Этап 2',
    title: 'Валидация против реестра',
    body: 'Проверка новых имён на дубли и конфликты с уже существующими в базе кампаниями.',
  },
  {
    tag: 'Этап 3',
    title: 'Утверждение',
    body: 'Workflow внесения сгенерированной кампании в базу: ревью → утверждение → запись в реестр.',
  },
  {
    tag: 'Этап 4',
    title: 'Авто-правила',
    body: 'Генерация правила проверки поступающих данных на основе утверждённой кампании.',
  },
]

export default function Roadmap() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Планы развития</h1>
        <p className="mt-1 text-sm text-ink-muted">Куда растёт инструмент — от демо к полноценному сервису с реестром.</p>
      </header>

      <ol className="relative ml-2 space-y-4 border-l-2 border-line pl-6">
        {PHASES.map((p) => (
          <li key={p.tag} className="relative">
            <span
              className={`absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 ${
                p.current ? 'border-accent bg-accent' : 'border-line bg-surface'
              }`}
              aria-hidden
            />
            <div className="card p-5">
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                    p.current ? 'bg-accent-wash text-accent' : 'bg-paper text-ink-muted'
                  }`}
                >
                  {p.tag}
                </span>
                <h2 className="text-sm font-semibold">{p.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 2: Add the route**

In `src/App.jsx`, add the import:

```js
import Roadmap from './pages/Roadmap.jsx'
```

Add the route inside `<Route element={<Layout />}>`, after the `methodology` route:

```jsx
          <Route path="roadmap" element={<Roadmap />} />
```

- [ ] **Step 3: Add the nav link**

In `src/components/Layout.jsx`, add to the `links` array, after the `methodology` entry:

```js
  { to: '/roadmap', label: 'Планы развития' },
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: Build succeeds.

Run: `npm test`
Expected: PASS — 36 tests.

Manual check: nav shows "Планы развития"; page renders a 5-step timeline with the "Сейчас" node highlighted in accent.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Roadmap.jsx src/App.jsx src/components/Layout.jsx
git commit -m "feat(roadmap): development roadmap page"
```

---

## Final verification

- [ ] Run `npm test` → 36 tests pass.
- [ ] Run `npm run build` → clean.
- [ ] Manual: all six nav items work (Генератор, URL-билдер, Валидатор, Справочник, Методология, Планы развития); creative packaging button reveals both forms; copy works.
- [ ] Hand off via `superpowers:finishing-a-development-branch`.
