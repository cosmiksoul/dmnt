import { useState } from 'react'
import { L0, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../lib/buildNames.js'
import { validate } from '../lib/validate.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'
import ResultsPanel from '../components/ResultsPanel.jsx'

const L0_FIELD = [{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]

export default function Generator() {
  const [values, setValues] = useState({})
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))

  const issues = validate(values)
  const blocked = issues.some((i) => i.severity === 'error')
  const isPublisher = L0.find((x) => x.code === values.l0)?.group === 'Media'
  const extraMissing = values.l0 ? [] : ['Платформа']

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Генератор имён</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Выберите параметры — имена L0–L3 соберутся по конвенции автоматически.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <LevelSection code="L0" title="Платформа / Вендор / Паблишер" fields={L0_FIELD} values={values} onChange={onChange} />
          <LevelSection code="L1" title="Кампания" fields={L1_FIELDS} values={values} onChange={onChange} />
          <LevelSection code="L2" title="Группа объявлений" fields={L2_FIELDS} values={values} onChange={onChange} />
          <LevelSection code="L3" title="Креатив" fields={L3_FIELDS} values={values} onChange={onChange} />
        </div>

        <aside className="lg:sticky lg:top-24">
          <ResultsPanel title="Результат" issues={issues} extraMissing={extraMissing}>
            <NamePreview label="L0" value={values.l0 || ''} />
            <NamePreview label="L1" value={buildL1(values)} disabled={blocked} />
            <NamePreview label="L2" value={buildL2(values)} disabled={blocked} />
            <NamePreview label="L3" value={buildL3(values)} disabled={blocked} />
            {isPublisher && <NamePreview label="MEDIA" value={buildMediaCompound(values)} disabled={blocked} />}
          </ResultsPanel>
        </aside>
      </div>
    </div>
  )
}
