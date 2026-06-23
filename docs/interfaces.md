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
// 运行时游戏状态（非敏感，testMode 下可暴露）
const gameState = {
  score: 0,           // 当前分数
  hits: 0,            // 命中次数
  misses: 0,          // 未命中次数
  level: 1,           // 当前难度等级
  isPlaying: false,   // 是否在游戏中
  lastResult: null,   // 上次判定结果 'hit'|'miss'|'early'|'late'|null
};
```

## testMode 测试钩子

- URL 参数：`?testMode=1`
- 行为：注入固定 clock/seed、固定速度/窗口参数，不改变正常玩法逻辑
- 暴露：`window.__gameState`（仅非敏感状态，不暴露内部实现或作弊入口）
- 用途：Playwright 运行时断言，不依赖真实时间

## 待补契约

- 音效触发事件格式（T7 打磨阶段确定）
- 角色选择界面状态结构（T4 spec 后确定）
