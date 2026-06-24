# Architecture

> 记录项目结构、模块边界和核心数据流。项目变大后，agent 先看这里再动结构。

## 架构概览

核心思路：原生 HTML5 Canvas + 纯 JavaScript（ES2022+），Vite 做构建工具。游戏核心逻辑（时机判定、计分、难度）为纯函数，便于单测。渲染层只读状态，输入层统一为"单键按下"事件。

当前实现阶段，所有代码集中在 `src/main.js` 中（~970 行），未做模块拆分。视觉设计系统见 `DESIGN.md`，所有 Canvas 绘制的颜色、尺寸、字体必须追踪到 DESIGN.md 的具名 token，禁止内联裸色值。

## 顶层目录职责

```text
src/          游戏源代码（核心循环、渲染、输入、音频、状态机）—— 当前全部在 main.js
assets/       游戏资产（图片、音频、字体等静态资源）—— 当前无外部资产
public/       静态文件（PWA manifest、图标等，直接复制到 dist）
dist/         构建产物（Vite 生成，git 忽略）
docs/         项目文档（状态、架构、ADR、接口、债务）
specs/        功能规格（active/ 进行中，done/ 已归档）
.omo/         规划与审查证据（计划、证据、玩测原始数据）
e2e/          端到端测试（Playwright + 截图 QA）
scripts/      工具脚本（玩测原始数据验证等）
```

## 核心流程

标题 → 角色选择 → 单键时机游戏循环（开场白 → 按键判定 → 命中/失败反馈 → 帧级休止 → 下一物件）→ 结局/重开。

## 模块边界

当前所有模块代码均在 `src/main.js` 中，逻辑边界如下：

| 逻辑区域 | 职责 | 状态 |
|---|---|---|
| 游戏循环（gameLoop） | 帧更新、物体运动、超时判定、粒子/浮动文字生命周期 | `src/main.js` |
| 关卡生成（generateObject） | 物体属性生成（物品种类、颜色、位置、速度、窗口、摇摆参数） | `src/main.js` |
| 输入处理（onPress / handleSelectClick） | 键盘/触摸 → 单键按下事件统一入口 | `src/main.js` |
| 渲染（render / renderTitle / renderSelect / renderGame / renderEnding） | Canvas 绘制，只读状态，不修改状态 | `src/main.js` |
| 音效（initAudio / playHitSound / playFailSound / playBeat） | Web Audio API 合成音效 | `src/main.js` |
| 时机判定（judgeTiming） | 纯函数，无副作用 | `src/game/timing.js` |

## 架构约束

- 游戏核心逻辑必须是纯函数，方便 Vitest 单测。
- 渲染层只消费状态，不修改状态。
- 输入层统一为"单键按下"事件，上层不区分键盘/触摸来源。

## 变更规则

任何影响以下内容的改动必须写 ADR：

- 顶层目录职责
- 模块依赖方向
- 核心数据结构
- 外部接口或协议
- 持久化格式
- 运行、构建、发布方式
