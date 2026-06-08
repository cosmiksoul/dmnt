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
