import { isCamelClean } from '../lib/validate.js'

export default function FieldCamelText({ field, value, onChange }) {
  const v = value || ''
  const bad = v !== '' && !isCamelClean(v)
  return (
    <label className="block text-sm">
      <span className="text-slate-600">{field.label}{field.required && ' *'}</span>
      <input
        type="text"
        className={`mt-1 w-full rounded border px-2 py-1.5 ${bad ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
        value={v}
        placeholder="CamelCase, напр. GatesOfOlympus"
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {bad && <span className="mt-1 block text-xs text-red-600">Только латиница/цифры, без «_», пробелов и кириллицы.</span>}
    </label>
  )
}
