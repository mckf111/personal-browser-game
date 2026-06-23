import { describe, it, expect } from 'vitest'

/**
 * judgeTiming: 判定按键时机
 * @param {number} pressTime - 按下时间戳（ms）
 * @param {number} windowCenter - 时机窗口中心时间（ms）
 * @param {number} windowHalf - 时机窗口半宽（ms）
 * @returns {{result: 'hit'|'miss'|'early'|'late', delta: number}}
 */

// 先引入被测函数——此时文件还不存在，RED 阶段会失败
import { judgeTiming } from './timing.js'

describe('judgeTiming', () => {
  const windowCenter = 1000
  const windowHalf = 50

  it('returns hit when press is within window', () => {
    const r = judgeTiming(1000, windowCenter, windowHalf)
    expect(r.result).toBe('hit')
    expect(r.delta).toBe(0)
  })

  it('returns hit at window boundary (exact center + half)', () => {
    const r = judgeTiming(1050, windowCenter, windowHalf)
    expect(r.result).toBe('hit')
    expect(r.delta).toBe(50)
  })

  it('returns hit at window boundary (exact center - half)', () => {
    const r = judgeTiming(950, windowCenter, windowHalf)
    expect(r.result).toBe('hit')
    expect(r.delta).toBe(-50)
  })

  it('returns early when press is before window', () => {
    const r = judgeTiming(900, windowCenter, windowHalf)
    expect(r.result).toBe('early')
    expect(r.delta).toBe(-100)
  })

  it('returns late when press is after window', () => {
    const r = judgeTiming(1100, windowCenter, windowHalf)
    expect(r.result).toBe('late')
    expect(r.delta).toBe(100)
  })

  it('returns early when press is just before boundary', () => {
    const r = judgeTiming(949, windowCenter, windowHalf)
    expect(r.result).toBe('early')
    expect(r.delta).toBe(-51)
  })

  it('returns late when press is just after boundary', () => {
    const r = judgeTiming(1051, windowCenter, windowHalf)
    expect(r.result).toBe('late')
    expect(r.delta).toBe(51)
  })

  it('handles zero window half as exact match only', () => {
    const r = judgeTiming(1000, windowCenter, 0)
    expect(r.result).toBe('hit')
    expect(r.delta).toBe(0)

    const r2 = judgeTiming(1001, windowCenter, 0)
    expect(r2.result).toBe('late')
  })

  it('handles negative delta for early, positive for late', () => {
    const early = judgeTiming(500, windowCenter, windowHalf)
    expect(early.delta).toBeLessThan(0)

    const late = judgeTiming(1500, windowCenter, windowHalf)
    expect(late.delta).toBeGreaterThan(0)
  })
})
