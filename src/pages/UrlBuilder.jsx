import { useState } from 'react'
import { L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
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
  const blocked = validate(values).some((i) => i.severity === 'error') || !values.l0 || !landing
  const url = blocked ? '' : buildUrl(values, landing, promocode)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Для прямых медиа/PR-размещений без Keitaro. Заполните поля конвенции и выберите лендинг.
      </p>
      <LevelSection title="L0 — Платформа / Вендор / Паблишер"
        fields={[{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]}
        values={values} onChange={onChange} />
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
