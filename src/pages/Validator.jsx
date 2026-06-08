import { useState } from 'react'
import { parseName } from '../lib/parseName.js'

const LEVELS = ['L1', 'L2', 'L3']
const PLACEHOLDER = {
  L1: 'TC_PF_CAS_ACQ_BY',
  L2: 'DSP_MOB_W2W_DIR_Feed',
  L3: 'GatesOfOlympus100500_V1_dmt',
}

export default function Validator() {
  const [level, setLevel] = useState('L1')
  const [input, setInput] = useState('')
  const { fields, errors } = input ? parseName(input, level) : { fields: {}, errors: [] }
  const entries = Object.entries(fields)

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <h1 className="text-xl font-bold tracking-tight">Валидатор</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Вставьте существующее имя — разберём на поля и проверим по конвенции.
        </p>
      </header>

      <div className="card space-y-4 p-5">
        <div className="inline-flex rounded-lg border border-line bg-paper p-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`rounded-md px-4 py-1 font-mono text-sm font-semibold transition-colors ${
                level === l ? 'bg-surface text-accent shadow-sm' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <input
          className="field-control font-mono"
          placeholder={PLACEHOLDER[level]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {input && (
          <div className="space-y-3 border-t border-line pt-4">
            <table className="w-full text-sm">
              <tbody>
                {entries.map(([k, val]) => (
                  <tr key={k} className="border-b border-line last:border-0">
                    <td className="py-1.5 pr-4 font-mono text-xs uppercase tracking-wide text-ink-faint">{k}</td>
                    <td className="py-1.5 font-mono text-ink">{val || <span className="text-ink-faint">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {errors.length > 0 ? (
              <ul className="space-y-1 text-xs text-danger">
                {errors.map((e, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span aria-hidden>⚠</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
                <span aria-hidden>✓</span>Соответствует конвенции
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
