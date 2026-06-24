# Game Quality Rescue Spec

> 质量救援契约。本文件必须在任何产品代码变更前定稿，作为本次救援的验收基准。

## Rescue Goal

把当前 GitHub Pages 上可玩的线上原型，从“能跑但执行质量未达预期”救成一个受控的高质量垂直切片：

- 视觉：房间、角色剪影（蟾蜍/候鸟）、物件像真实小世界，而非抽象几何轨道。
- 叙事：玩家不读文档就能看懂“归位 / 融入”的角色目标。
- 手感：单键时机不加新机制，但有节奏编排、戏剧反馈和小故事闭环。
- 质量门禁：设计系统、确定性测试、截图验收、真人玩测全部可执行、可验证。

线上地址（原型状态，未质量批准）：https://mckf111.github.io/personal-browser-game/

## Gate 0: Concept Preservation

默认救援现有概念“守序者与闯入者 / 归位与融入 / 蟾蜍与候鸟”。

- 如果用户在执行前明确否定上述核心概念，执行者必须停止，并标记 blocked，要求新的概念规格与计划。
- 本 gate 的通过条件：用户未明确否定核心概念，或用户确认继续救援现有概念。

## Must Have

1. **诚实状态声明**：README、project-state、CHANGELOG 必须如实声明当前是“GitHub Pages 线上原型”，不是 quality-approved / itch-ready / finished game / 发布级成品。
2. **可执行设计契约**：根目录 `DESIGN.md` 必须在视觉实现前存在，包含可执行 token：palette、角色色、时机窗口色、字体、Canvas 形状语言、角色剪影规则、房间层次、物件规则、动效节奏、HUD 规则、截图验收规则。
3. **确定性测试模式**：`?testMode=1` 必须可重复；暴露只读状态供 QA，不暴露修改/作弊函数。
4. **时机契约文档化**：`judgeTiming` 语义、`miss` 归属必须在 `docs/interfaces.md` 和测试中明确，且与实现一致。
5. **单键时机深化**：一个房间、两个可读角色、最多六类物件、每个角色最多三个编排节拍；不新增第二机制。
6. **画面升级**：从抽象轨道/方圆块升级到“玩具剧场/故事书式 Canvas”，房间有层次，角色有轮廓特征，命中/失败像事件而不是数字反馈。
7. **截图 QA**：Playwright 截图覆盖 375 / 768 / 1280 宽度的 title、select、playing、ending 四态；状态和文案断言必须能自动执行。
8. **外部真人玩测门禁**：至少 3 份 raw，其中至少 1 份手机端；agent 只能验证 schema 和汇总，不能生成反馈。不足则标记 blocked。
9. **PWA 身份清理**：不再使用 `vite.svg` 作为图标；manifest / favicon / title / description 与游戏一致。
10. **红线条款遵守**：不引入 TypeScript、游戏引擎、后端/数据库/账号/存档/排行榜；不编造玩测数据或外部来源。

## Must Not Have

1. 不新增 TypeScript，不新增 `.ts/.tsx` 源码。
2. 不引入 Phaser / Pixi / Three / Matter 等游戏/渲染/物理引擎；需要则另写 ADR 并等待用户确认。
3. 不新增服务端、数据库、账号、登录、支付、存档、在线排行榜、多人。
4. 不新增第二核心机制；所有体验提升必须服务于“单键时机”。
5. 不用外部图片/音频资产，除非写 ADR + 记录 license / 来源 / 下载日期；默认仍为 Canvas 绘制 + Web Audio 合成。
6. 不用“SEO/分享/meta 全家桶”扩大范围；PWA polish 只清理明显脚手架残留与基础元信息。
7. 不编造玩测数据、玩家反馈、截图证据或外部来源。
8. 不把当前 GitHub Pages 线上原型称为 quality-approved / itch-ready / finished game / 发布级，除非本计划全部质量门通过。
9. 不删除 CHANGELOG 历史或已上线的 GitHub Pages URL。
10. 不为“未来扩展”预先抽象；只救当前垂直切片。

## Agent-Executable Acceptance

以下标准必须由 agent 通过命令验证，不依赖人工判断：

- `specs/active/game-quality-rescue.md` 存在，且包含本节列出的所有章节（Rescue goal, Gate 0, Must have, Must not have, Agent-executable acceptance, External playtest gate, Release/status rules）。
- `npx vite build` 成功（文档变更不得破坏构建）。
- `npx vitest run` 通过（文档变更不得破坏现有测试）。
- 红线条款扫描：
  - `rg "\.ts|\.tsx" src/` 无结果。
  - `rg "phaser|pixi|three|matter" package.json src/ --glob "*.js"` 无结果（大小写不敏感）。
  - `rg "vite\.svg" index.html public src` 无结果（T8 完成后）。
- 误导性用词扫描：
  - `rg "quality-approved|itch-ready|finished game|发布级" README.md docs/project-state.md CHANGELOG.md` 无结果，除非明确用于否定语境。
  - `rg "GitHub Pages|线上原型|prototype|原型" docs/project-state.md README.md` 有结果，证明存在诚实的线上原型声明。

## External Playtest Gate

### 要求

- 至少 3 份有效 raw 反馈文件。
- 其中至少 1 份来自手机端（设备/浏览器字段可证明）。
- 每份必须包含以下 schema 字段：匿名玩家代码、日期、设备/浏览器、游玩角色、时长、卡住的地方、满意时刻、“会再玩吗？”是/否 + 理由、直接引语。

### 验证

- agent 运行 `scripts/validate-playtest-raw.mjs` 验证 schema 和数量。
- agent 不得生成、改写或润色 raw 反馈内容；只能验证格式和计数。
- 如果不满足，写入 `.omo/evidence/task-<N>-game-quality-rescue-blocked.md`，说明缺少的证据和 unblock 条件。

### 迭代规则

- 如果 raw 有效但暴露出 top 1-3 问题，允许一次有界迭代修复，不得借此添加新机制。
- 迭代后重新运行构建 + 测试 + 截图 QA。

## Release / Status Rules

### 状态定义

| 状态 | 含义 | 文档措辞 |
|---|---|---|
| 线上原型 (online prototype) | GitHub Pages 已部署，可玩，但未通过质量门禁 | “GitHub Pages 线上原型，质量救援进行中 / 未质量批准” |
| 质量通过 (quality-approved) | 全部自动门禁 + 外部玩测门禁通过 | “GitHub Pages 质量已批准线上版本” |
| 阻塞 (blocked) | 某门禁失败或证据不足 | “GitHub Pages 线上原型，当前因 [原因] 阻塞，未质量批准” |

### 规则

1. 在 T10 最终认证前，所有文档必须保持“线上原型”状态，不得使用 quality-approved / itch-ready / finished game / 发布级。
2. itch.io 上传仅在质量通过后才考虑；当前不视为 publish-ready。
3. 已上线的 GitHub Pages URL 不得删除或隐藏，必须保留供试玩和验证。
4. 任何状态变更必须同步更新 README.md、docs/project-state.md、CHANGELOG.md。
5. 救援计划全部完成后，最终状态必须写入 `.omo/evidence/task-10-game-quality-rescue.md`，列出每道门禁的结果。
