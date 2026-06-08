import { OPTIONS, L0 } from '../config/convention.js'
import FieldSelect from './FieldSelect.jsx'
import FieldCamelText from './FieldCamelText.jsx'

export default function LevelSection({ code, title, fields, values, onChange }) {
  return (
    <section className="card p-5">
      <header className="mb-4 flex items-center gap-3">
        <span className="lvl-badge">{code}</span>
        <h2 className="text-sm font-semibold text-ink-soft">{title}</h2>
      </header>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        {fields.map((f) => {
          if (f.kind === 'enum') {
            const opts =
              f.options === 'l0' ? L0.map((x) => ({ code: x.code, desc: x.label })) : OPTIONS[f.options]
            return <FieldSelect key={f.key} field={{ ...f, opts }} value={values[f.key]} onChange={onChange} />
          }
          if (f.kind === 'date') {
            return (
              <label key={f.key} className="block">
                <span className="field-label">{f.label}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="ММГГ"
                  className="field-control font-mono"
                  value={values[f.key] || ''}
                  onChange={(e) => onChange(f.key, e.target.value.replace(/\D/g, ''))}
                />
              </label>
            )
          }
          return <FieldCamelText key={f.key} field={f} value={values[f.key]} onChange={onChange} />
        })}
      </div>
    </section>
  )
}
