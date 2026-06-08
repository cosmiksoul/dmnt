import { useState } from 'react'
import { parseName } from '../lib/parseName.js'

const LEVELS = ['L1', 'L2', 'L3']

export default function Validator() {
  const [level, setLevel] = useState('L1')
  const [input, setInput] = useState('')
  const { fields, errors } = input ? parseName(input, level) : { fields: {}, errors: [] }
  const entries = Object.entries(fields)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Вставьте существующее имя — разберём на поля и проверим по конвенции.</p>
      <div className="flex gap-2">
        {LEVELS.map((l) => (
          <button key={l} onClick={() => setLevel(l)}
            className={`rounded border px-3 py-1 text-sm ${level === l ? 'bg-blue-600 text-white' : 'bg-white'}`}>
            {l}
          </button>
        ))}
      </div>
      <input className="w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm"
        placeholder={level === 'L1' ? 'TC_PF_CAS_ACQ_BY' : level === 'L2' ? 'DSP_MOB_W2W_DIR_Feed' : 'GatesOfOlympus100500_V1_dmt'}
        value={input} onChange={(e) => setInput(e.target.value)} />

      {input && (
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Разбор</h2>
          <table className="w-full text-sm">
            <tbody>
              {entries.map(([k, val]) => (
                <tr key={k} className="border-b last:border-0">
                  <td className="py-1 pr-4 text-slate-500">{k}</td>
                  <td className="py-1 font-mono">{val || <span className="text-slate-300">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors.length > 0 ? (
            <ul className="mt-3 space-y-1 text-xs text-red-600">{errors.map((e, i) => <li key={i}>• {e}</li>)}</ul>
          ) : (
            <p className="mt-3 text-xs text-green-600">✓ Соответствует конвенции.</p>
          )}
        </section>
      )}
    </div>
  )
}
