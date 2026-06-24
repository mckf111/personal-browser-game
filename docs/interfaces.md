# Interfaces

> 记录项目中不应被随意改动的契约。包括 API、命令行参数、数据结构、文件格式、事件、数据库 schema 等。

## 稳定契约索引

| 名称 | 类型 | 所有者 | 兼容性要求 | 文档位置 |
|---|---|---|---|---|
| judgeTiming | 纯函数 | game core | 判定语义不变 | 本节下方 |
| GameState | 数据结构 | game core | 字段增删须兼容 | 本节下方 |
| testMode 查询参数 | CLI / URL | QA / 测试 | 语义不变 | 本节下方 |

## 变更规则

- 改动稳定契约前必须说明兼容性影响。
- 破坏性变更必须写 ADR。
- 如果已有外部用户或下游模块，必须给迁移路径。
- 不确定某契约是否稳定时，先问用户或在 ADR 中明确。

## judgeTiming 纯函数

```javascript
/**
 * 判定按键时机
 * @param {number} pressTime - 按下时间戳（ms）
 * @param {number} windowCenter - 时机窗口中心时间（ms）
 * @param {number} windowHalf - 时机窗口半宽（ms）
 * @returns {{result: 'hit'|'miss'|'early'|'late', delta: number}} 
 *   result: 判定结果
 *   delta: 与窗口中心的差值（ms），正=晚，负=早
 */
function judgeTiming(pressTime, windowCenter, windowHalf) {
  const delta = pressTime - windowCenter;
  if (Math.abs(delta) <= windowHalf) {
    return { result: 'hit', delta };
  }
  if (delta < 0) {
    return { result: 'early', delta };
  }
  return { result: 'late', delta };
}
```

## GameState 结构

```javascript
// 运行时游戏状态（testMode 下通过 window.__gameState 暴露）
const gameState = {
  state: 'title',      // 当前游戏状态 'title'|'select'|'playing'|'ending'
  character: null,     // 角色 'order'|'chaos'|null
  score: 0,            // 当前分数
  hits: 0,             // 命中次数
  misses: 0,           // 未命中次数（含超时 miss 和按键 early/late）
  level: 1,            // 当前难度等级（1-15）
  combo: 0,            // 当前连击数
  maxCombo: 0,         // 本局最高连击
  lastResult: null,    // 上次判定结果 'hit'|'early'|'late'|'miss'|null
  objectsDone: 0,      // 已完成物件数（归位/成功融入）
  currentObject: {     // 当前物件（无物件时为 null）
    t: 0,              // 轨道进度 0-1
    startT: 0.05,      // 起始轨道位置
    targetT: 0.5,      // 目标轨道位置
    halfWidth: 0.12,   // 判定窗口半宽（轨道比例）
    speed: 0.003,      // 每帧 t 增量
    active: true,      // 是否在运动中
    settled: false,    // 是否已归位
  } | null,
};
```

> 注意：`currentObject` 中未暴露 `hitT`、`patternId`、`beatIndex`、`restFrames`、`sway*` 等内部实现字段。`lastResult` 在 `t>=1` 自动超时时设为 `'miss'`（不是 `judgeTiming` 的 `'late'`）。

## testMode 测试钩子

- URL 参数：`?testMode=1`
- 行为：暴露 `window.__gameState` 只读快照（getter，不暴露内部/作弊接口）；不改变正常玩法逻辑
- 注意：当前版本 `generateObject()` 仍使用 `Math.random()`，未接入 seeded random（已知债务 TD-1，见 `docs/debt.md`）——因此不同页面加载的物体属性可能不同
- 暴露：`window.__gameState`（字段见上方 GameState 结构）
- 用途：Playwright 运行时断言、状态快照比对（确定性字段如 hits/misses/level/objectsDone 可跨运行比较，随机字段如 targetT 不可）

## 待补契约

- TD-1（seeded random）和 TD-2（late 判定可观测）见 `docs/debt.md`
- 如需新增字段至 `__gameState`，更新本文档 GameState 结构和 `src/main.js` 的 `Object.defineProperty` 两处
