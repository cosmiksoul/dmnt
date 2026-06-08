import { L1_FIELDS, L2_FIELDS, L3_FIELDS } from '../config/convention.js'

// Generic: take field values in declared order, drop empties, join with "_".
function buildLevel(fields, values) {
  return fields
    .map((f) => (values[f.key] ?? '').toString().trim())
    .filter((s) => s.length > 0)
    .join('_')
}

export const buildL1 = (v) => buildLevel(L1_FIELDS, v)
export const buildL2 = (v) => buildLevel(L2_FIELDS, v)
export const buildL3 = (v) => buildLevel(L3_FIELDS, v)

export const buildMediaCompound = (v) => [buildL1(v), buildL2(v), buildL3(v)].join('|')
