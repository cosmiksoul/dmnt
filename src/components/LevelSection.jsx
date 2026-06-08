import { OPTIONS, L0 } from '../config/convention.js'
import FieldSelect from './FieldSelect.jsx'
import FieldCamelText from './FieldCamelText.jsx'

export default function LevelSection({ title, fields, values, onChange }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => {
          if (f.kind === 'enum') {
            const opts = f.options === 'l0' ? L0.map((x) => ({ code: x.code, desc: x.label })) : OPTIONS[f.options]
            return <FieldSelect key={f.key} field={{ ...f, opts }} value={values[f.key]} onChange={onChange} />
          }
          if (f.kind === 'date') {
            return (
              <label key={f.key} className="block text-sm">
                <span className="text-slate-600">{f.label}</span>
                <input
                  type="text" inputMode="numeric" maxLength={4} placeholder="ММГГ"
                  className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
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
