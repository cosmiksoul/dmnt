import { describe, it, expect } from 'vitest'
import { buildL1, buildL2, buildL3, buildMediaCompound } from '../../src/lib/buildNames.js'

describe('buildL1', () => {
  it('builds base L1 without campaign', () => {
    expect(buildL1({ status: 'TC', objective: 'PF', product: 'CAS', audience: 'ACQ', geo: 'BY' }))
      .toBe('TC_PF_CAS_ACQ_BY')
  })
  it('appends campaign for CP initiatives', () => {
    expect(buildL1({ status: 'CP', objective: 'PF', product: 'CAS', audience: 'RTG', geo: 'BY', campaign: 'UzeSlishali' }))
      .toBe('CP_PF_CAS_RTG_BY_UzeSlishali')
  })
})

describe('buildL2', () => {
  it('drops optional device when empty', () => {
    expect(buildL2({ format: 'SRC', flow: 'W2W', placement: 'SRCH', targeting: 'SlotQueries' }))
      .toBe('SRC_W2W_SRCH_SlotQueries')
    expect(buildL2({ format: 'VID', flow: 'W2A', placement: 'FEED', targeting: 'BroadInterest' }))
      .toBe('VID_W2A_FEED_BroadInterest')
  })
  it('includes device when present', () => {
    expect(buildL2({ format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed' }))
      .toBe('DSP_MOB_W2W_DIR_Feed')
  })
  it('builds Meta Advantage+ ad set (placement AUTO, no device)', () => {
    expect(buildL2({ format: 'VID', flow: 'W2A', placement: 'AUTO', targeting: 'LAL1pctFTD' }))
      .toBe('VID_W2A_AUTO_LAL1pctFTD')
  })
})

describe('buildL3', () => {
  it('builds without date', () => {
    expect(buildL3({ theme: 'GatesOfOlympus100500', variant: 'V1', source: 'dmt' }))
      .toBe('GatesOfOlympus100500_V1_dmt')
  })
  it('appends optional date', () => {
    expect(buildL3({ theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126' }))
      .toBe('ChickenRoad100500_V1_dmt_0126')
  })
})

describe('buildMediaCompound', () => {
  it('joins L1|L2|L3 for direct media buys', () => {
    const v = {
      status: 'CP', objective: 'PF', product: 'CAS', audience: 'RTG', geo: 'BY', campaign: 'UzeSlishali',
      format: 'DSP', device: 'MOB', flow: 'W2W', placement: 'DIR', targeting: 'Feed',
      theme: 'ChickenRoad100500', variant: 'V1', source: 'dmt', date: '0126',
    }
    expect(buildMediaCompound(v))
      .toBe('CP_PF_CAS_RTG_BY_UzeSlishali|DSP_MOB_W2W_DIR_Feed|ChickenRoad100500_V1_dmt_0126')
  })
})
