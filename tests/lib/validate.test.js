import { describe, it, expect } from 'vitest'
import { validate, isCamelClean } from '../../src/lib/validate.js'

const valid = {
  status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY',
  format: 'VID', flow: 'W2A', placement: 'FEED', targeting: 'BroadInterest',
  theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt',
}

describe('isCamelClean', () => {
  it('accepts CamelCase with digits', () => {
    expect(isCamelClean('GatesOfOlympus100500')).toBe(true)
    expect(isCamelClean('LAL1pctFTD')).toBe(true)
  })
  it('rejects underscore, space, cyrillic, leading digit', () => {
    expect(isCamelClean('Gates_Of')).toBe(false)
    expect(isCamelClean('Gates Of')).toBe(false)
    expect(isCamelClean('Курица')).toBe(false)
    expect(isCamelClean('100500')).toBe(false)
  })
})

describe('validate', () => {
  it('returns no errors for a valid record', () => {
    expect(validate(valid).filter((i) => i.severity === 'error')).toEqual([])
  })
  it('errors on underscore in a free field', () => {
    const issues = validate({ ...valid, targeting: 'Broad_Interest' })
    expect(issues.some((i) => i.field === 'targeting' && i.severity === 'error')).toBe(true)
  })
  it('errors on cyrillic in a free field', () => {
    const issues = validate({ ...valid, theme: 'Курица' })
    expect(issues.some((i) => i.field === 'theme' && i.severity === 'error')).toBe(true)
  })
  it('requires campaign when status is CP', () => {
    const issues = validate({ ...valid, status: 'CP', campaign: '' })
    expect(issues.some((i) => i.field === 'campaign' && i.severity === 'error')).toBe(true)
  })
  it('errors on a missing required enum', () => {
    const issues = validate({ ...valid, placement: '' })
    expect(issues.some((i) => i.field === 'placement' && i.severity === 'error')).toBe(true)
  })
})
