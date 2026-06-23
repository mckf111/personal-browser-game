# Project State

> 给下一位 agent 的交接摘要。任何 agent 接手项目时，读完 `AGENTS.md` 后必须读这里。

## 当前状态

- 项目：守序者与闯入者
- 阶段：spec（游戏设计规格阶段）
- 当前目标：完成 T4 游戏设计 spec，等待用户确认 owner gate
- 最近一次更新：2026-06-23
- 当前维护者 / 决策人：用户

## 已完成

- T1 仓库体检：git 未 init（已 init main）、node v24.14.0 / npm 11.9.0、网络可达
- T2 宪法骨架：已装入 vibe-starter-GPT（pin SHA: 12ae3d5090481ca83d8ede1cab2d0d7c71028ecd）
- ADR-0001 已写：技术栈 = 原生 Canvas+JS+Vite+Vitest+Playwright
- T3 脚手架：Vite vanilla + Canvas 游戏循环 + 双输入 + 响应式 + PWA manifest + 占位测试
  - 验证：`npx vite build` ✅ + `npx vitest run` ✅ + `npx playwright test` ✅

## 正在进行

- T4：游戏设计 spec + 变体冻结（owner gate：需用户选双角色形象/路径差异/结局方式）

## 下一步建议

1. 完成 T4 spec（向用户呈现变体草图并确认 owner gate）
2. T5 灰盒可玩原型（依赖 T3+T4）
3. T6 玩测 + 迭代

## 待确认（owner gate）

- T4 owner gate：双角色具体形象设定需用户选（2-3 草图）
- T4 owner gate：两路径差异化程度若导致工作量翻倍需用户确认是否收敛
- T4 owner gate：结局呈现方式需用户确认

## 验证状态

- 最快可信验证：`npx vite build; if ($?) { npx vitest run }` ✅
- 最近验证结果：T3 全部通过（build + vitest + playwright）
- 暂未建立的质量门槛：judgeTiming 纯函数单测（T5）、真实游戏循环运行时验证（T5）

## 交接注意

- .omo/ 目录含规划与审查证据，不要删除
- .codegraph/ 是代码图谱目录，已加入 .gitignore
- 宪法骨架只补缺失不覆盖现有；现有 .omo/ 与 .codegraph/ 已保留
