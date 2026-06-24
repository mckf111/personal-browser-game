# AGENTS.md

> 任何 coding agent（Codex / Claude Code / Cursor / Aider / 其他）开工前必须读完此文件。
> 本文件是项目最高宪法源，优先级高于任何工具特定配置。
>
> 目标：让项目在变大、变久、换人、换 agent 时仍然保持良好的软件工程秩序。

---

## 1. 项目定位

一款单键时机的个人风格浏览器小游戏，取悦自己与他人。玩家选一个角色进入：选守序者要在正确时机把变乱的东西归位，选闯入者要在正确时机别打乱想融入。外皮热闹夸张滑稽，内核是两个不搭界生命偶然相遇、互相理解的温馨。电脑和手机浏览器都能玩，还能"添加到主屏幕"。

### 非目标

- 不做在线多人 / 服务端 / 游戏内账号 / 登录 / 支付
- 不做游戏内存档 / 排行榜后端 / 数据库
- 不做原生移动 App 打包 / 不上架 App Store（未来另起 ADR；本期移动端靠浏览器 + PWA）
- 不引入游戏引擎（Phaser 仅在原型证明需要场景/物理/tilemap 且走 ADR 时才换）
- 不引入 TypeScript（除非另写 ADR）
- 不堆砌多个机制（只做"单键时机"一个机制做透）
- 不为"未来扩展"预先抽象 / 过度设计
- 不把网站当游戏做（先"玩起来爽"再"页面完整"）

---

## 2. 项目事实

| 项 | 内容 |
|---|---|
| 项目类型 | Web 浏览器游戏 |
| 主要语言/运行时 | JavaScript (ES2022+) / Node 24 |
| 主要产物 | 可在线玩的 HTML5 游戏（单文件入口 + 静态资源） |
| 安装命令 | `npm install` |
| 运行命令 | `npx vite` |
| 构建命令 | `npx vite build` |
| 最快可信验证 | `npx vite build; if ($?) { npx vitest run }` |
| 完整验证 | `npm run test:e2e`（运行时验证，Playwright） |
| 默认分支 | main |

**重要**：不要默认技术栈。只能根据当前 repo 事实或用户明确回答填写。

---

## 3. 架构边界

### 顶层目录职责

```text
src/          游戏源代码（核心循环、渲染、输入、音频、状态机）
assets/       游戏资产（图片、音频、字体等静态资源）
public/       静态文件（PWA manifest、图标等，直接复制到 dist）
dist/         构建产物（Vite 生成，git 忽略）
docs/         项目文档（状态、架构、ADR、接口、债务）
specs/        功能规格（active/ 进行中，done/ 已归档）
.omo/         规划与审查证据目录
.codegraph/   代码图谱
```

### 模块边界

- `src/` 内部可按功能拆分（input/、render/、audio/、game/ 等），但保持扁平，不预抽象。
- 游戏核心逻辑（时机判定、计分、难度）必须是纯函数，方便 Vitest 单测。
- 渲染层只消费状态，不修改状态。
- 输入层统一为"单键按下"事件，上层不区分键盘/触摸来源。

### 稳定契约

- 游戏状态结构（详见 docs/interfaces.md）
- `judgeTiming(pressTime, windowCenter, windowHalf)` 纯函数签名
- `?testMode=1` 查询参数注入固定状态，暴露 `window.__gameState`
- 详情维护在 docs/interfaces.md。

---

## 4. 红线（绝不能违反）

红线是 agent 行为的硬约束。每条用 `R<编号>` 命名，PR 模板必须引用相关红线。

### 4.1 范围红线

| ID | 禁止项 | 原因 / 替代方案 |
|---|---|---|
| R1 | 不做在线多人/账号/支付/原生App/多机制/存档排行榜后端 | 首款小游戏，范围冻结在单键时机 + 浏览器 + PWA |
| R2 | 不引入游戏引擎（Phaser 等） | 原生 Canvas+JS 足够；若需引擎走 ADR |
| R3 | 不引入 TypeScript | 除非另写 ADR；当前纯 JS |

### 4.2 工程红线

| ID | 规则 |
|---|---|
| R10 | 不允许绕过验证命令来宣称完成 |
| R11 | 新增依赖必须说明原因、替代方案和代价，并写 ADR |
| R12 | 改架构/接口/数据模型必须写 ADR |

### 4.3 事实与内容红线

| ID | 规则 |
|---|---|
| R20 | 不编造玩测数据、引用、外部来源或玩家反馈 |
| R21 | 不 copy 现有已发布游戏的内容/美术/音乐/剧情 |

---

## 5. 变更流程

### 5.1 开工前

1. 读 `AGENTS.md`。
2. 读 `docs/project-state.md`，了解当前状态和交接信息。
3. 读 `README.md`、`docs/architecture.md`、`CHANGELOG.md`。
4. 根据任务读取相关 spec、ADR、接口文档和技术债记录。
5. 开工前向用户复述：当前理解、涉及文件、风险、验证方式，给出 3-6 条计划。

### 5.2 做变更时

- 小改可以直接改，但仍要验证。
- 新功能先写 `specs/active/<slug>.md`。
- 架构、依赖、数据模型、接口契约、部署方式变化必须写 ADR。
- 临时方案必须写入 `docs/debt.md`，说明清理条件。
- 用户可见变化必须更新 `CHANGELOG.md`。

### 5.3 交付前

- 运行 `npx vite build; if ($?) { npx vitest run }`，或说明为什么无法运行。
- 检查红线是否触碰。
- 搜索并确认没有未解释的临时文件、死代码、重复实现。
- 如有未完成事项，写入 `docs/project-state.md` 或 `docs/debt.md`。

---

## 6. Git 与协作

### Commit

- 使用 Conventional Commits：`feat:` / `fix:` / `docs:` / `chore:` / `refactor:` / `test:` / `style:` / `perf:` / `build:` / `ci:` / `revert:`。
- 中文/英文都可以，但格式必须清楚。

### 分支策略

| 改动类型 | 走法 |
|---|---|
| 文档、小修、单点 bugfix | 可直接在当前分支处理 |
| 新功能、重构、跨多个模块、架构变化 | 建分支 -> PR -> 合并 |

默认分支：`main`。

### PR

- 必填 `.github/PULL_REQUEST_TEMPLATE.md`。
- CI 或验证不过不能合并。
- 涉及决策的 PR 必须附 ADR。

---

## 7. 质量门槛

每次交付前至少完成：

- [ ] 最快可信验证通过：`npx vite build; if ($?) { npx vitest run }`
- [ ] 如有测试，测试通过：`npx vitest run`
- [ ] 如有构建，构建通过：`npx vite build`
- [ ] 红线未违反（参考 §4）
- [ ] 用户可见变化已写 `CHANGELOG.md`
- [ ] 重大决策已写 ADR
- [ ] 临时方案已写 `docs/debt.md`
- [ ] `docs/project-state.md` 已更新到下一位 agent 能接手

如果某项无法完成，必须在交付说明里明确写出原因和风险。

---

## 8. 本地运行

```powershell
npm install
npx vite
```

环境变量规则：

- 不提交 secrets、token、私钥、真实 `.env`。
- 如果项目需要环境变量，维护 `.env.example` 或等价说明。
- 需要 secrets 时，请用户通过环境变量或安全 secret store 提供。

---

## 9. 跨 Agent 交接

任何新 agent 接手时，按以下顺序读：

1. `AGENTS.md`
2. `docs/project-state.md`
3. `README.md`
4. `docs/architecture.md`
5. `docs/interfaces.md`
6. `CHANGELOG.md`
7. 任务相关 spec / ADR / debt 记录

工具特定入口只做转发，不复制规则：

- `CLAUDE.md` 指向本文件。
- Cursor rules 应指向本文件。
- Codex 项目说明或 skill 应指向本文件。

如果这些入口与本文件冲突，以本文件为准。

---

## 10. 不确定时的默认行为

| ID | 情境 | 默认动作 |
|---|---|---|
| D1 | 不确定是否要加功能 | 不加，先问用户 |
| D2 | 不确定技术栈/库/API 是否存在或适用 | 查 repo、查官方文档或问用户 |
| D3 | 不确定事实是否准确 | 标注不确定，不编造 |
| D4 | 发现旧代码看起来不理想 | 先理解原因，不顺手重构 |
| D5 | 想新增依赖 | 先说明必要性、替代方案、维护代价 |
| D6 | 想改架构边界 | 先写 ADR 或提出 ADR 草案 |

---

## 11. 文档索引

| 文件 | 作用 |
|---|---|
| `README.md` | 项目入口、运行方式、当前能力 |
| `DESIGN.md` | 视觉设计系统契约——配色 token、字体、尺寸、角色剪影、场景层次、动效规则、截图 QA 门禁 |
| `.vibe-starter-gpt.json` | 宪法版本、安装日期、项目类型 |
| `docs/project-state.md` | 当前状态、交接摘要、下一步 |
| `docs/architecture.md` | 架构、目录职责、模块边界 |
| `docs/interfaces.md` | API、数据结构、模块契约 |
| `docs/debt.md` | 技术债、临时方案、清理条件 |
| `docs/art-direction.md` | 视觉与音频母题叙述（以 `DESIGN.md` 为规范源） |
| `docs/decisions/` | ADR，记录重大决策 |
| `specs/active/single-button-timing.md` | 核心玩法 spec（已冻结） |
| `specs/active/game-quality-rescue.md` | 质量救援计划 spec（T1-T10 已执行，T9 阻塞中） |
| `CHANGELOG.md` | 用户可见变化 |

---

## 12. 完成后的汇报格式

交付时用简洁中文说明：

- 改了什么。
- 改了哪些文件。
- 跑了什么验证，结果如何。
- 哪些风险、债务或待确认事项已记录在哪里。
