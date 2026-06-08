import { UTM_MEDIUM } from '../config/convention.js'

export function utmMedium(format) {
  return UTM_MEDIUM[format] || ''
}
