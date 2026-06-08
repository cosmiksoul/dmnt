import { useState } from 'react'
import { L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { LANDINGS, promocodeFor } from '../data/landings.sample.js'
import { buildUrl } from '../lib/buildUrl.js'
import { validate } from '../lib/validate.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'
import ResultsPanel from '../components/ResultsPanel.jsx'

const L0_FIELD = [{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]

export default function UrlBuilder() {
  const [values, setValues] = useState({})
  const [landing, setLanding] = useState('')
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))

  const promocode = promocodeFor(landing)
  const issues = validate(values)
  const blocked = issues.some((i) => i.severity === 'error') || !values.l0 || !landing
  const url = blocked ? '' : buildUrl(values, landing, promocode)
  const extraMissing = [...(values.l0 ? [] : ['Платформа']), ...(landing ? [] : ['Лендинг'])]

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">URL-билдер</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Для прямых медиа/PR-размещений без Keitaro. Заполните поля конвенции и выберите лендинг — соберём трекинг-URL.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <LevelSection code="L0" title="Платформа / Вендор / Паблишер" fields={L0_FIELD} values={values} onChange={onChange} />
          <LevelSection code="L1" title="Кампания" fields={L1_FIELDS} values={values} onChange={onChange} />
          <LevelSection code="L2" title="Группа объявлений" fields={L2_FIELDS} values={values} onChange={onChange} />
          <LevelSection code="L3" title="Креатив" fields={L3_FIELDS} values={values} onChange={onChange} />

          <section className="card p-5">
            <header className="mb-4 flex items-center gap-3">
              <span className="lvl-badge">URL</span>
              <h2 className="text-sm font-semibold text-ink-soft">Лендинг и промокод</h2>
            </header>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">
                  Лендинг<span className="text-accent"> *</span>
                </span>
                <select className="field-control" value={landing} onChange={(e) => setLanding(e.target.value)}>
                  <option value="">— выберите —</option>
                  {LANDINGS.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Промокод (авто)</span>
                <input readOnly className="field-control bg-paper font-mono text-ink-muted" value={promocode || '—'} />
              </label>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <ResultsPanel title="Трекинг-URL" issues={issues} extraMissing={extraMissing}>
            <NamePreview label="URL" value={url} disabled={blocked} />
          </ResultsPanel>
        </aside>
      </div>
    </div>
  )
}
