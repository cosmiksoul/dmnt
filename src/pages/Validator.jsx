import { useState } from 'react'
import { parseName } from '../lib/parseName.js'
import { parseUrl } from '../lib/parseUrl.js'
import { describeField, FIELD_LABELS } from '../lib/describe.js'
import { UTM_MEDIUM } from '../config/convention.js'

const MODES = ['L1', 'L2', 'L3', 'URL']
const PLACEHOLDER = {
  L1: 'TC_PF_CAS_ACQ_BY',
  L2: 'DSP_MOB_W2W_DIR_Feed',
  L3: 'GatesOfOlympus100500_V1_dmt',
  URL: 'https://start.pm.by/landing?utm_source=…&utm_campaign=…&utm_content=…',
}

const mediumFormats = (medium) =>
  Object.entries(UTM_MEDIUM)
    .filter(([, m]) => m === medium)
    .map(([f]) => f)

function FieldTable({ level, fields }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {Object.entries(fields).map(([k, val]) => (
          <tr key={k} className="border-b border-line last:border-0">
            <td className="w-px whitespace-nowrap py-1.5 pr-4 align-top font-mono text-xs uppercase tracking-wide text-ink-faint">
              {FIELD_LABELS[k] || k}
            </td>
            <td className="py-1.5 pr-4 align-top font-mono text-ink">
              {val || <span className="text-ink-faint">—</span>}
            </td>
            <td className="py-1.5 align-top text-ink-muted">{describeField(level, k, val)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Errors({ items }) {
  if (!items.length) return <p className="flex items-center gap-1.5 text-xs font-medium text-accent"><span aria-hidden>✓</span>Соответствует конвенции</p>
  return (
    <ul className="space-y-1 text-xs text-danger">
      {items.map((e, i) => (
        <li key={i} className="flex gap-1.5"><span aria-hidden>⚠</span><span>{e}</span></li>
      ))}
    </ul>
  )
}

function Block({ title, children }) {
  return (
    <section>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</h3>
      {children}
    </section>
  )
}

export default function Validator() {
  const [mode, setMode] = useState('L1')
  const [input, setInput] = useState('')
  const isUrl = mode === 'URL'

  const name = !isUrl && input ? parseName(input, mode) : null
  const url = isUrl && input ? parseUrl(input) : null

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Валидатор</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Разберите имя уровня (L1/L2/L3) или вставьте трекинг-URL целиком — расшифруем все поля по конвенции.
        </p>
      </header>

      <div className="card space-y-4 p-5">
        <div className="inline-flex rounded-lg border border-line bg-paper p-1">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-4 py-1 font-mono text-sm font-semibold transition-colors ${
                mode === m ? 'bg-surface text-accent shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <input
          className="field-control font-mono"
          placeholder={PLACEHOLDER[mode]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Single-level name breakdown */}
        {name && (
          <div className="space-y-3 border-t border-line pt-4">
            <FieldTable level={mode} fields={name.fields} />
            <Errors items={name.errors} />
          </div>
        )}

        {/* Full URL breakdown */}
        {url && (
          <div className="space-y-5 border-t border-line pt-4">
            {url.base && (
              <p className="text-xs text-ink-muted">
                База / лендинг: <code className="font-mono text-ink">{url.base}</code>
              </p>
            )}

            <Block title="UTM-параметры">
              {url.params.length ? (
                <table className="w-full text-sm">
                  <tbody>
                    {url.params.map(([k, v], i) => (
                      <tr key={i} className="border-b border-line last:border-0">
                        <td className="w-px whitespace-nowrap py-1.5 pr-4 align-top font-mono text-xs text-accent">{k}</td>
                        <td className="py-1.5 align-top font-mono text-ink">{v || <span className="text-ink-faint">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-ink-faint">Параметры не найдены — проверьте, что это трекинг-URL с UTM.</p>
              )}
            </Block>

            <Block title={`L0 · Платформа${url.l0 ? '' : ' — не задан'}`}>
              {url.l0 ? (
                <p className="text-sm">
                  <code className="font-mono text-ink">{url.l0}</code>
                  <span className="text-ink-muted"> — {describeField('L1', 'l0', url.l0) || 'вне словаря'}</span>
                </p>
              ) : (
                <p className="text-xs text-ink-faint">utm_source отсутствует.</p>
              )}
            </Block>

            {url.l1 && (
              <Block title="L1 · Кампания (utm_campaign)">
                <FieldTable level="L1" fields={url.l1.fields} />
                <div className="mt-2"><Errors items={url.l1.errors} /></div>
              </Block>
            )}

            {url.l3 && (
              <Block title="L3 · Креатив (utm_content)">
                <FieldTable level="L3" fields={url.l3.fields} />
                <div className="mt-2"><Errors items={url.l3.errors} /></div>
              </Block>
            )}

            <Block title="L2 · Группа объявлений">
              <p className="text-xs leading-relaxed text-ink-muted">
                L2 (Device / Flow / Placement / Targeting) не передаётся через UTM — он живёт на стороне платформы.
                {url.medium && (
                  <>
                    {' '}Значение <code className="font-mono text-ink">utm_medium={url.medium}</code> соответствует L2-формату:{' '}
                    <span className="font-mono text-accent">{mediumFormats(url.medium).join(', ') || '—'}</span>.
                  </>
                )}
              </p>
            </Block>
          </div>
        )}
      </div>
    </div>
  )
}
