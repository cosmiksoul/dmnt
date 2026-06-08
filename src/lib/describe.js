import { OPTIONS, L0, L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'

const FIELDS_BY_LEVEL = { L1: L1_FIELDS, L2: L2_FIELDS, L3: L3_FIELDS }

// Human description for a parsed field value, or '' if none (free text / unknown code).
export function describeField(level, key, value) {
  if (!value) return ''
  if (key === 'l0') return L0.find((x) => x.code === value)?.label ?? ''
  const f = (FIELDS_BY_LEVEL[level] || []).find((x) => x.key === key)
  if (!f || f.kind !== 'enum') return ''
  return OPTIONS[f.options]?.find((o) => o.code === value)?.desc ?? ''
}

// Russian field label by parsed key (e.g. status → "Статус").
export const FIELD_LABELS = (() => {
  const m = { l0: 'Платформа' }
  for (const f of [...L1_FIELDS, ...L2_FIELDS, ...L3_FIELDS]) m[f.key] = f.label
  return m
})()
