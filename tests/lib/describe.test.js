import { describe, it, expect } from 'vitest'
import { describeField, FIELD_LABELS } from '../../src/lib/describe.js'

describe('describeField', () => {
  it('describes enum codes by level', () => {
    expect(describeField('L1', 'status', 'TC')).toBe('Tactical (тактическая)')
    expect(describeField('L1', 'objective', 'BA')).toBe('Brand Awareness (охват/показы, без CTA на рег)')
    expect(describeField('L2', 'placement', 'DIR')).toBe('Direct media buy / прямой паблишер')
    expect(describeField('L3', 'source', 'dmt')).toBe('Команда диджитал-маркетинга')
  })
  it('resolves L0 codes to platform labels', () => {
    expect(describeField('L1', 'l0', 'kufar')).toBe('Медиа — Kufar')
  })
  it('returns empty for free-text fields, empty values, and unknown codes', () => {
    expect(describeField('L3', 'theme', 'GatesOfOlympus')).toBe('')
    expect(describeField('L1', 'status', '')).toBe('')
    expect(describeField('L1', 'status', 'ZZ')).toBe('')
  })
})

describe('FIELD_LABELS', () => {
  it('maps parsed keys to Russian labels', () => {
    expect(FIELD_LABELS.status).toBe('Статус')
    expect(FIELD_LABELS.l0).toBe('Платформа')
    expect(FIELD_LABELS.placement).toBe('Плейсмент')
  })
})
