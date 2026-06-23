---
slug: personal-browser-game
status: approved
intent: unclear
pending-action: write .omo/plans/personal-browser-game.md (append todos into the ## Todos region; fill TL;DR last)
user-decision: 机制驱动型 → 单键时机（2026-06-23；所列默认未被否决）
approach: 以 vibe-starter-GPT 宪法骨架治理项目（用户指定为"宪法"），用原生 HTML5 Canvas + 纯 JS 搭脚手架与 itch.io/GitHub Pages 发布链，按"灰盒原型→尽早玩测→冻结范围→打磨味道→发布"流程，做出一款"一个机制、一个情绪、3-10 分钟"的个人风格小游戏。游戏方向（机制驱动 / 氛围情绪 / 玩具沙盒 三范式之一，或用户自定义）作为唯一 owner-decision fork，在 gate 由用户选定后再细化 spec。其余技术/工具/结构默认由我基于研究采纳，在 TL;DR "Decisions I made for you" 块供 veto。
---

# Draft: personal-browser-game

## 路由判断
- intent = UNCLEAR：outcome 模糊（"做什么游戏"未定），用户自述"很粗的构想"。
- 但"做什么游戏"是核心创造性 owner-decision（产品方向、不可逆、用户长期共处、且"个人风格"为用户明确诉求，研究无法代劳）→ 作为 UNCLEAR 允许的那个 single focused question，在 gate 呈现研究得出的 3 个范式方向供用户选/否决/自定。
- gate 开头明示路由调用："我把这当作开放式请求并替你定了技术默认；若你心里已有具体游戏，说一句即可切回提问模式。"

## Components (topology ledger)
<!-- 6 个独立成败组件；每个 todo 将追溯到一个组件 -->
| id | outcome (one line) | status | evidence path |
|---|---|---|---|
| C1 | vibe-starter-GPT 宪法骨架装入项目，占位符填好，交接/留痕制度建立 | active | AGENTS.md, docs/*, specs/*, .vibe-starter-gpt.json |
| C2 | Canvas+JS 脚手架 + 本地开发服务器 + 构建 + 静态产物 + itch.io/GitHub Pages 发布链打通 | active | index.html, src/, assets/, public/, dist/ |
| C3 | 游戏设计稿：一句话核心、机制、情绪、视觉母题、范围冻结（写成 spec） | active (blocked on gate 选方向) | specs/active/<slug>.md |
| C4 | 灰盒可玩原型 + 3-5 人无解说玩测 + 迭代核心循环（移动/输入/碰撞/计分/重开） | active | 原型可运行 + 玩测记录 |
| C5 | 打磨"味道"：配色/字体/音效/动效/UI 统一，个人风格落地 | active | 视觉/音频资产 +成品 |
| C6 | 发布：itch.io + GitHub Pages 上线，他人可玩到 | active | 公开链接 |

## Open assumptions (announced defaults)
<!-- 默认由我基于研究采纳，在 TL;DR 供 veto；可逆性已标注 -->
| assumption | adopted default | rationale | reversible? |
|---|---|---|---|
| 技术栈 | 原生 HTML5 Canvas + 纯 JS（先不上 TS，降工具税） | 用户已有 Web 能力；MDN 明确"从纯 JS 入手最利理解 web 游戏"；最快出可玩原型 | 是（可后续切 TS 或换 Phaser） |
| 游戏引擎 | 不引入引擎；Phaser 列为 fallback（原型证明需要场景/物理/tilemap 时走 ADR 再换） | 避免引擎学习税；研究结论：Kaboom 已停维护、Godot 对首款小游戏偏重、PixiJS 非完整引擎 | 是 |
| 发布渠道 | itch.io（主分享/试玩）+ GitHub Pages（长期公开链接） | 零成本、HTML5 原生支持；研究确认两渠道官方文档路径 | 是 |
| 游戏规模 | 一个机制、一个情绪、3-10 分钟可完成（或无限循环但 30 秒内进入状态） | 零基础+短周期+小而美研究结论（A Short Hike / Baba Is You 范式） | 是（范围可调） |
| 治理框架 | 采用 vibe-starter-GPT 宪法（用户明确指定为"宪法"），按项目特点微调 | 用户指令；保证项目变大/换 agent 不乱 | 是（用户已选） |
| 开发流程 | 灰盒原型→尽早玩测→冻结范围→打磨味道→发布 | 游戏开发最佳实践研究结论 | 是 |
| 周期定位 | Quick-Short（数天到一两周出第一作） | 小而美目标；研究强调"完成比完美重要" | 是 |
| 内容语言 | 游戏文案默认中文（用户用中文交流） | 与用户一致；可改 | 是 |
| 仓库/分支 | 本地 git init + 默认分支 main（当前目录非 git repo） | 宪法要求仓库与分支策略；GitHub 仓库 URL 待用户提供或暂定 | 是 |
| 代码风格/质量门禁 | 用宪法自带的 lefthook + ci.yml 模板，验证命令按实际填 | 宪法自带；不过度设计 | 是 |

## Findings (cited - path:lines)
- 宪法仓库 README/OPENING_PROMPT/START_HERE/AGENTS.md/CLAUDE.md/projects.json + template/docs|specs/.vibe-starter-gpt.json：治理骨架 = AGENTS.md 最高法源 + docs/(state/architecture/interfaces/debt/decisions) + specs/(active→done) + CHANGELOG + 质量门禁；核心纪律：不默认技术栈、占位符未定则保留+列入待确认、越大改动越留痕、换 agent 不断片。
- librarian 研究结论（bg_64caba8b，已验证结构）：
  - 技术栈首选原生 Canvas+JS/TS（MDN Games / Breakout 教程，2025-07~2026-04）；Phaser 为最稳带脚手架次选（docs.phaser.io，2026）；Kaboom 官网已写"不再维护"→风险；Godot 4.6 Web 导出对首款小游戏偏重；p5.js 适合艺术/玩具型。
  - 最小流程：一句话核心→灰盒原型→30秒懂→玩测→冻结范围→打磨味道→发布。
  - 常见坑：范围爆炸/引擎学习税/不做测试/只做功能不做手感/内容多灵魂少/把网站当游戏做。
  - 设计法：一个机制做透+一个情绪+一个视觉母题+一个声音气质+短体验。
  - 低成本验证：三人一句话复述、无解说试玩、5个有效反馈>100空泛、Hook测试、灰盒就测。
  - 发布：itch.io HTML5（ZIP+index.html，相对路径）/ GitHub Pages（分支部署）。
  - 范式样本：A Short Hike（个人艺术项目→IGF 大奖，press kit 强调景观/写作/原声）、Baba Is You（规则即物体，一个机制做透）。

## Decisions (with rationale)
- D1 走 UNCLEAR 路径：outcome 模糊，研究最大化 + 宣布默认 + 自动高精度审查。
- D2 "做什么游戏"= owner-decision fork，不当默认代劳：在 gate 呈现 3 范式方向（机制驱动/氛围情绪/玩具沙盒）供选/否决/自定。
- D3 技术默认 = 原生 Canvas+JS（可逆），引擎不引入（Phaser 作 ADR-触发式 fallback）。
- D4 宪法骨架先装，再搭脚手架，再定 spec，再原型——治理先行符合用户"先看宪法搭框架"的指令顺序。
- D5 自动跑 Metis + 双 Momus 高精度审查（UNCLEAR 要求，非 Trivial）。
- D6 用户 gate 决定：范式=机制驱动型，机制种子=单键时机（全程只按一个键、在精确时刻触发；卖点=节奏感与越来越紧的张力；零基础最友好）。具体变体（轨道穿缝/节拍匹配/跳跃落地等）在执行 T4 spec 时由 worker 出 2-3 草图供用户选，属创作协作而非技术判断遗漏。
- D7 第二轮高精度审查（Metis + native Momus + Codex CLI gpt-5.5 xhigh）发现并修复全部 blocking：新增 T1 仓库体检；原 T8 拆为 T9 publish-ready（agent 可执行）+ T10 实际发布（human-credential gate）；所有 QA 命令改 PowerShell 5.1 兼容（去 &&，用 ; if ($?){}）；T2 占位符扫描排除 GitHub Actions ${{ }} 表达式；base 始终 ./ 不写死仓库名、去掉 /repo/ 分支；Playwright 明确 @playwright/test 依赖 + test:e2e + 固定端口 4173；T6 玩测 raw 证据 schema 硬格式（代号/日期/设备/时长/卡点/爽点/想再来/原话）+ 禁止合成；T5 testMode 只暴露非敏感状态 + 注入 clock/seed + 不依赖真实时间；T2 pin vibe-starter-GPT commit SHA；T3 脚手架只做技术壳不带玩法假设；研究结论内联到 References、去除 bg_ 任务 ID 引用；References 加访问日期/版本号要求；澄清 .omo/evidence 允许写入与"不覆盖 .omo/.codegraph"不冲突。计划重写为 v3（10 todo：T1 体检→T2 宪法+ADR→T3 脚手架→T4 spec→T5 原型→T6 玩测→T7 打磨→T8 发布准备→T9 publish-ready→T10 实际发布）。Codex 第二路因 Windows sandbox helper 缺失改用内联全文纯推理审查。
- D8 第三轮 dual Momus 均 APPROVE：native Momus v3 APPROVE（无 blocking）；Codex CLI v3.1 APPROVE（必须修复项无，采纳其 2 个非阻塞 polish：T9 PowerShell 递归扫描用 Get-ChildItem -Recurse | Select-String、T8 第三层 fallback 补 Python+PyYAML）。计划终版 v3.1 完成，10 todo，decision-complete，可交付。
- D9 用户 scope 变更（2026-06-23 第二轮）：要求移动端浏览器可玩 + PWA，不做原生 App 打包/上架（未来另起 ADR）。评估后决定一次性双端开发（不分两阶段，因单键时机天然适合触摸、分阶段会返工）。更新计划：T3 加触摸输入+响应式 canvas+viewport meta+PWA manifest；T4 加触摸交互描述+横竖屏取向；T5 走双输入统一事件；T6 玩测须含≥1 份手机端；T7 加触摸友好 UI（≥44px/安全区域/横竖屏）；T8 itch.io 勾选 mobile friendly + Playwright mobile viewport 验证。Scope Must have 加移动端，Must NOT 改为"不做原生 App 打包/不上架 App Store"。工作量 Short→Short-Medium。用户还要求试用 Team mode：决定仅 Wave 3 T3/T4 开临时 2 人小队（scaffold-worker + spec-worker），干完即关，其余普通 task。Execution strategy 加 Team mode 试用段。计划版本 v4。
- D10 用户指出计划缺少游戏内容方向讨论（2026-06-23 第三轮）：用户担心计划只定了通用机制/技术栈，没讨论故事/人物/视觉/音乐，可能抄了通用模板或现有游戏。planner 承认判断失误——应主动问创作性内容而非默认。经多轮讨论确定游戏内容方向：调性=热闹夸张滑稽+偶然相遇互相理解的温馨；双角色=守序者（爱整洁拟人小生物）+闯入者（乱七八糟不搭界访客）；玩家体验=入口可选两路径（守序者=归位，闯入者=融入），结局汇合到互相理解；视觉=秩序几何vs有机暖色对比；音乐=精准节拍vs温暖即兴对比（Web Audio合成）；个人印记=整齐书桌/床铺/衣柜作为核心意象+偷偷观察给世界打分作为主角姿态+不搭界相遇作为关键时刻。内容方向由用户个人元素推演，非抄现有游戏。更新计划：Scope 加§游戏内容方向 subsection；T4 从"出3个通用变体让用户选"改为"基于已定内容方向写spec"，加版权红线"不得copy现有游戏内容"；TL;DR/Success criteria 反映具体内容。T4 仍为 owner gate（双角色具体形象/两路径差异化程度/结局呈现须用户确认）。计划版本 v5。

## Scope IN
- 装入并填好 vibe-starter-GPT 宪法骨架（AGENTS.md/docs/specs/CHANGELOG/.vibe-starter-gpt.json/质量门禁模板）
- git 初始化 + 默认分支 main
- Canvas+JS 项目脚手架 + 本地开发服务器 + 构建 + 静态产物
- itch.io + GitHub Pages 发布链路打通（含说明）
- 一款小游戏的 spec（一句话核心/机制/情绪/视觉母题/范围冻结）
- 灰盒可玩原型（核心循环：移动/输入/碰撞/计分/重开）
- 3-5 人无解说玩测 + 迭代记录
- 打磨味道（配色/字体/音效/动效/UI 统一，个人风格）
- 发布上线，他人可玩到

## Scope OUT (Must NOT have)
- 不做 3A、大型团队、原生移动 App 为主
- 不做在线多人 / 服务端 / 账号 / 登录 / 支付
- 不引入游戏引擎（除非原型证明需要场景/物理/tilemap 且走 ADR）
- 不堆砌多个机制（只做一个机制做透）
- 不为"未来扩展"预先过度设计 / 提前抽象
- 不默认任何后端 / 数据库
- 不把网站当游戏做（先"玩起来爽"再"页面完整"）
- 不编造玩法数据 / 玩测反馈（玩测记录必须真实）

## Open questions
- Q1（owner-decision，gate 呈现）：游戏方向 = 机制驱动 / 氛围情绪 / 玩具沙盒 三范式之一，还是用户自定义？
- Q2（gate 顺带确认，可逆）：GitHub 仓库 URL 是否已有？没有则暂用本地 git + 占位。
- Q3（gate 顺带确认，可逆）：游戏内容语言是否中文？（默认中文）

## Approval gate
status: approved (2026-06-23)
user-decision: 范式=机制驱动型，机制种子=单键时机；所列默认未被否决。
next: append todos 到 plan + 填 TL;DR + Metis gap analysis + 双 Momus 高精度审查（UNCLEAR 自动）。
loop-guard: approve 仅授权写计划文件，不授权实现。
