import { describe, it, expect } from 'vitest'
import { parseName } from '../../src/lib/parseName.js'

describe('parseName L1', () => {
  it('parses base L1', () => {
    const { fields, errors } = parseName('TC_PF_CAS_ACQ_BY', 'L1')
    expect(fields).toMatchObject({ status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' })
    expect(errors).toEqual([])
  })
  it('parses CP with campaign', () => {
    const { fields } = parseName('CP_PF_CAS_RTG_BY_UzeSlishali', 'L1')
    expect(fields.campaign).toBe('UzeSlishali')
  })
  it('flags an invalid status token', () => {
    const { errors } = parseName('XX_PF_CAS_ACQ_BY', 'L1')
    expect(errors.length).toBeGreaterThan(0)
  })
})

describe('parseName L2', () => {
  it('parses L2 without device', () => {
    const { fields } = parseName('SRC_W2W_SRCH_SlotQueries', 'L2')
    expect(fields).toMatchObject({ format: 'SRC', device: '', flow: 'W2W', placement: 'SRCH', targeting: 'SlotQueries' })
  })
  it('parses L2 with device', () => {
    const { fields } = parseName('DSP_MOB_W2W_DIR_Feed', 'L2')
    expect(fields).toMatchObject({ format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed' })
  })
})

describe('parseName L3', () => {
  it('parses L3 with optional date', () => {
    const { fields } = parseName('ChickenRoad100500_V1_dmt_0126', 'L3')
    expect(fields).toMatchObject({ theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126' })
  })
  it('parses L3 without date', () => {
    const { fields } = parseName('GatesOfOlympus100500_V1_dmt', 'L3')
    expect(fields).toMatchObject({ theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt', date: '' })
  })
})
