import { isCamelClean } from '../lib/validate.js'

export default function FieldCamelText({ field, value, onChange }) {
  const v = value || ''
  const bad = v !== '' && !isCamelClean(v)
  return (
    <label className="block">
      <span className="field-label">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </span>
      <input
        type="text"
        className={`field-control font-mono ${
          bad ? 'border-danger bg-danger-wash focus:border-danger focus:ring-danger/10' : ''
        }`}
        value={v}
        placeholder="CamelCase · GatesOfOlympus"
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      {bad && (
        <span className="mt-1 block text-xs text-danger">
          Без «_», пробелов и кириллицы — только латиница и цифры.
        </span>
      )}
    </label>
  )
}
