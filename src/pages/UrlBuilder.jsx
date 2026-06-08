import { useNavigate } from 'react-router-dom'
import { L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'
import { LANDINGS, promocodeFor } from '../data/landings.sample.js'
import { buildUrl } from '../lib/buildUrl.js'
import { validate } from '../lib/validate.js'
import { useSessionState } from '../hooks/useSessionState.js'
import LevelSection from '../components/LevelSection.jsx'
import NamePreview from '../components/NamePreview.jsx'
import ResultsPanel from '../components/ResultsPanel.jsx'
import ResetButton from '../components/ResetButton.jsx'

const L0_FIELD = [{ key: 'l0', label: 'Платформа', kind: 'enum', options: 'l0', required: true }]

export default function UrlBuilder() {
  const navigate = useNavigate()
  const [values, setValues] = useSessionState('url:values', {})
  const [landing, setLanding] = useSessionState('url:landing', '')
  const onChange = (key, val) => setValues((v) => ({ ...v, [key]: val }))
  const reset = () => {
    setValues({})
    setLanding('')
  }

  const promocode = promocodeFor(landing)
  const issues = validate(values)
  const blocked = issues.some((i) => i.severity === 'error') || !values.l0 || !landing
  const url = blocked ? '' : buildUrl(values, landing, promocode)

  // Hand the assembled URL off to the Validator (URL mode), mirroring the
  // Generator -> URL-builder transfer. The Validator reads this key on mount.
  const toValidator = () => {
    try {
      sessionStorage.setItem('validator:url', url)
    } catch {
      /* storage unavailable — Validator just opens empty */
    }
    navigate('/validator')
  }
  const extraMissing = [...(values.l0 ? [] : ['Платформа']), ...(landing ? [] : ['Лендинг'])]

  return (
    <div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">URL-билдер</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Для прямых медиа/PR-размещений без Keitaro. Заполните поля конвенции и выберите лендинг — соберём трекинг-URL.
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
            <NamePreview label="URL" value={url} disabled={blocked} wrap />
          </ResultsPanel>

          <button
            type="button"
            onClick={toValidator}
            disabled={blocked}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-bright disabled:cursor-not-allowed disabled:bg-ink-faint"
          >
            Проверить в валидаторе
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
