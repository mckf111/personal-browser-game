/**
 * 判定按键时机
 * @param {number} pressTime - 按下时间戳（ms）
 * @param {number} windowCenter - 时机窗口中心时间（ms）
 * @param {number} windowHalf - 时机窗口半宽（ms）
 * @returns {{result: 'hit'|'miss'|'early'|'late', delta: number}}
 *   result: 判定结果
 *   delta: 与窗口中心的差值（ms），正=晚，负=早
 */
export function judgeTiming(pressTime, windowCenter, windowHalf) {
  const delta = pressTime - windowCenter;
  if (Math.abs(delta) <= windowHalf) {
    return { result: 'hit', delta };
  }
  if (delta < 0) {
    return { result: 'early', delta };
  }
  return { result: 'late', delta };
}
