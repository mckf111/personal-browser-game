# Technical Debt

> 记录临时方案、已知坏味道、绕路和未来需要清理的事项。不要让“临时”悄悄变成架构。

## 当前债务

| ID | 描述 | 引入原因 | 风险 | 清理条件 | 负责人 / 日期 |
|---|---|---|---|---|---|---|
| TD-1 | testMode 的 generateObject() 未使用 seeded random，仍调用 Math.random() | T3 声称实现但未在 generateObject 替换随机源 | testMode 确定性不可靠，e2e 测试偶发失败 | 给 generateObject 接入 seeded random helper，在 testMode 下替换所有 Math.random() 调用 | 2026-06-24 |
| TD-2 | judgeTiming 无法产生 late 判定——物体从 startT 运动到 targetT，currentT 在 t<1 时始终 < targetT | T6 编排节拍改动将 targetT 放在轨道中段 | e2e 无法测试 late 反馈；实际游玩中只有 early/miss | 调整物体运动模型，让物体滑过 targetT 后再超时（如 targetT=0.65, 物体在 t=0.8 时到达 targetT，t=1 时 currentT > targetT） | 2026-06-24 |
| TD-3 | T9 外部玩测门禁阻塞：0 份有效 raw 证据 | 未邀请外部测试者 | 项目无法通过质量认证 | 邀请 ≥3 位外部测试者（含 ≥1 移动端），收集 raw 反馈 | 2026-06-24 |

## 规则

- 临时方案必须当天写入本文件。
- 如果债务影响架构、接口或数据模型，还要写 ADR。
- 修复债务时保留历史记录，标记为 resolved，不要直接删除上下文。

## 已解决

| ID | 原描述 | 解决方式 | 日期 |
|---|---|---|---|
| _暂无_ | | | |
