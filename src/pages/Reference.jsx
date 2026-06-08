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

const jump = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const NAV_IDS = ['L0', ...LEVELS.map((l) => l.code)]

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
        {field.required && (
          <>
            <span className="text-accent" aria-hidden="true"> *</span>
            <span className="sr-only"> обязательное</span>
          </>
        )}
      </h3>
      {field.kind === 'enum' ? (
        <CodeTable rows={OPTIONS[field.options]} />
      ) : (
        <p className="text-xs text-ink-muted">{NOTE[field.kind] ?? field.kind}</p>
      )}
    </div>
  )
}

export default function Reference() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-xl font-bold tracking-tight">Справочник параметров</h1>
        <p className="mt-1 text-sm text-ink-muted">Все коды конвенции с расшифровками, разбитые по уровням.</p>
      </header>

      <nav aria-label="Переход к уровню" className="flex flex-wrap gap-2">
        {NAV_IDS.map((c) => (
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
