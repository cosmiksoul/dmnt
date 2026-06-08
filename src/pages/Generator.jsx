import { useNavigate } from 'react-router-dom'
import { L0, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../lib/buildNames.js'
import { validate } from '../lib/validate.js'
import { useSessionState } from '../hooks/useSessionState.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'
import ResultsPanel from '../components/ResultsPanel.jsx'
import ResetButton from '../components/ResetButton.jsx'

const L0_FIELD = [{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]

export default function Generator() {
  const navigate = useNavigate()
  const [values, setValues] = useSessionState('generator:values', {})
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))
  const reset = () => setValues({})

  // Carry the convention params (L0–L3) over to the URL builder, where only
  // landing + promocode remain to be picked. We seed the URL builder's session
  // key directly; it reads that key when it mounts.
  const toUrlBuilder = () => {
    try {
      sessionStorage.setItem('url:values', JSON.stringify(values))
    } catch {
      /* storage unavailable — UrlBuilder just opens empty */
    }
    navigate('/url')
  }

  const issues = validate(values)
  const blocked = issues.some((i) => i.severity === 'error')
  const isPublisher = L0.find((x) => x.code === values.l0)?.group === 'Media'
  const extraMissing = values.l0 ? [] : ['Платформа']

  const l1 = buildL1(values)
  const l2 = buildL2(values)
  const l3 = buildL3(values)
  const all = [values.l0 || '', l1, l2, l3].filter(Boolean).join(', ')
  const hasInput = Object.values(values).some((v) => (v ?? '').toString().trim() !== '')

  return (
    <div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Генератор имён</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Выберите параметры — имена L0–L3 соберутся по конвенции автоматически.
          </p>
        </div>
        <ResetButton onClick={reset} />
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
            <NamePreview label="L1" value={l1} disabled={blocked} />
            <NamePreview label="L2" value={l2} disabled={blocked} />
            <NamePreview label="L3" value={l3} disabled={blocked} />
            {isPublisher && <NamePreview label="MEDIA" value={buildMediaCompound(values)} disabled={blocked} wrap />}
            <div className="border-t border-line pt-2">
              <NamePreview label="ВСЁ" value={all} disabled={blocked} wrap />
            </div>
          </ResultsPanel>

          <button
            type="button"
            onClick={toUrlBuilder}
            disabled={!hasInput}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-bright disabled:cursor-not-allowed disabled:bg-ink-faint"
          >
            Перенести в URL-билдер
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>

          <div className="mt-2 flex justify-end">
            <ResetButton onClick={reset}>Начать сначала</ResetButton>
          </div>
        </aside>
      </div>
    </div>
  )
}
