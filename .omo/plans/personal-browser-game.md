# personal-browser-game - Work Plan

## TL;DR (For humans)

**你会得到什么：** 一款属于你自己的浏览器小游戏——一个爱整洁的拟人小生物（守序者）和一个乱七八糟的不搭界访客（闯入者）的故事。玩家选一个角色进入：选守序者要在正确时机把变乱的东西归位，选闯入者要在正确时机别打乱想融入。外皮热闹夸张滑稽，内核是两个不搭界生命偶然相遇、互相理解的温馨。电脑和手机浏览器都能玩，还能"添加到主屏幕"。视觉是"秩序几何 vs 有机暖色"的对比，音乐是"精准节拍 vs 温暖即兴"的对比——画面和声音本身就在讲"秩序 vs 混乱"的故事。项目自带一套"宪法"治理骨架，让它越做越大也不乱、换 agent 也不断片。

**为什么这么做：** 你有 Web 能力却从没做过游戏，所以最该做的是"尽快出一个能玩的小东西"而不是先学引擎——原生 Canvas + JS + Vite 最快。游戏内容是从你的个人元素推演出来的（你爱整洁、你偷偷观察给世界打分、你觉得不搭界的相遇荒诞又真实），不是通用模板也不是抄的——这让游戏有你的印记。单键时机天然适合手机触摸（点屏幕=单键），也天然契合"在正确时刻把东西归位"的故事内核。移动端适配从脚手架就做进去，一次性双端，不分两阶段避免返工。

**它不会做什么：** 不做在线多人/账号/支付、不做原生 App 打包/不上架 App Store（未来另起）、不堆多个机制、不做游戏内存档/排行榜后端、不为未来过度设计、不把网站当游戏做。

**工作量：** Short-Medium（数天到一两周出第一作；移动端适配是增量但不涉及换架构）
**风险：** Low — 主要风险是"范围悄悄变大"和"只做功能不做手感"，计划已用"冻结范围"和"专门打磨 wave"对冲；三处人工 gate（选变体/真人玩测/平台账号）已诚实标注，不会假装自动完成。

**我替你定的决定（任意一条你现在还可以否决）：**
- 路由：我把这当开放式请求处理，替你定了技术/流程默认，只把"做什么游戏"留给你——你已选"机制驱动型·单键时机"。
- 技术栈：原生 HTML5 Canvas + 纯 JS，Vite 做 dev/build/preview、Vitest 做核心逻辑单测、Playwright 做运行时验证（均为工具，非游戏引擎；决策记于 ADR-0001，早于任何 npm install）。
- 不引入游戏引擎；万一需要场景/物理/tilemap，走 ADR 再换 Phaser。
- 规模：一个机制 + 一个情绪 + 短体验（3-10 分钟或 30 秒进入）；电脑+手机浏览器双端可玩 + PWA（可添加到主屏幕）；本期不做原生 App 打包/上架。
- 流程：仓库体检 → 宪法骨架(含技术 ADR) → 脚手架(含移动端适配) → spec → 灰盒原型 → 玩测(含手机端) → 打磨 → 发布。执行时 T3/T4 试用 Team mode 并行，其余普通 task 顺序执行。
- 发布：itch.io（试玩）+ GitHub Pages（长期链接），始终用相对 base `./`；先交付 publish-ready 包，凭证齐备才实际上线。
- 治理：装入你的 vibe-starter-GPT 宪法（pin 到获取时的 commit SHA），只补缺失不覆盖现有；lefthook/CLAUDE 为 optional。
- 文案语言默认中文；本地 git init + 默认分支 main；GitHub 仓库 URL 待你提供（未提供则发布_blocked，不伪称上线）。

**你的下一步：** 计划已更新（移动端适配 + PWA + Team mode 试用）。你看完这份终版若认可，说 `$start-work`，执行者就按计划开工——Wave 3 时会开一个临时 2 人小队（scaffold-worker + spec-worker）让你体验 Team mode，干完即关。游戏的具体变体（轨道穿缝/节拍匹配/跳跃落地）会在第 4 步由 spec-worker 画 2-3 个草图给你挑。

---

> TL;DR (machine): Short-Medium effort, Low risk — 仓库体检 + 宪法骨架(含 ADR-0001) + Canvas/Vite 脚手架(含移动端+PWA) + 单键时机小游戏（spec→灰盒原型→玩测(含手机端)→打磨→publish-ready→发布）；三处人工 gate；T3/T4 试用 Team mode。

## Scope
### 游戏内容方向（T4 spec 输入，用户与 planner 共同确定 2026-06-23）
> 此方向由用户个人元素推演而来，非抄自任何已发布游戏。执行者不得 copy 现有游戏的内容/美术/音乐；T4 spec 须基于本方向，不得自行替换为通用模板。
- 调性：热闹夸张滑稽的外皮 + 偶然相遇互相理解的温馨内核
- 双角色：守序者（爱整洁的拟人小生物，如强迫症蟾蜍）+ 闯入者（乱七八糟的不搭界访客，如邋遢候鸟/乱糟外星人）
- 玩家体验：入口可选——游戏开始时选一个角色进入。选守序者=体验"归位"路径（在正确时机把变乱的东西归位，抵御闯入者带来的混乱）；选闯入者=体验"融入"路径（在正确时机别打乱/伪装归位，想融入整齐世界）。两条路径最终汇合到"互相理解"的温馨结局
- 单键时机与故事的结合：按对=归位/融入成功（"啪"一下就位的满足感），按错=滑稽失败（东西又飞了/又碰乱了，但热闹不惩罚）
- 视觉风格：秩序几何 vs 有机暖色对比——守序者世界=几何对称/冷色系/精确网格，闯入者到来=有机曲线/暖色入侵/打破网格，两者碰撞就是画面本身；配色≤4色，风格化简笔，不追求精细
- 音乐气质：精准节拍 vs 温暖即兴对比——守序者世界=整齐节拍/简约重复旋律（像节拍器），闯入者=不规则节奏/即兴感/温暖不和谐音；用 Web Audio 合成，不引外部资产
- 个人印记元素（化进主角细节和小时刻，不贴标签）：整齐的书桌/床铺/衣柜作为核心意象（要被归位的对象）、偷偷观察给世界打分作为主角姿态、不搭界的相遇作为关键剧情时刻
- 两路径差异化程度（T4 spec 须明确）：核心单键时机判定逻辑共享；两路径的差异在叙事角度/视觉色温/音乐气质/输入语义（守序者=归位，闯入者=融入），不在重新做一套玩法。若 spec 阶段发现两路径差异过大导致工作量翻倍，须向用户确认是否收敛为单路径+另一角色作配角

### Must have
- 仓库体检：git 状态、已有文件、Node/npm、网络可用性（已有 git repo 则禁止重新 init）
- 装入 vibe-starter-GPT 宪法骨架（pin commit SHA、只补缺失不覆盖），并前置写 ADR-0001（技术栈：原生 Canvas+JS+Vite+Vitest+Playwright，不引引擎）
- 本地 git 初始化（若体检显示尚未 init），默认分支 main；.gitignore 含 .codegraph/、node_modules/、dist/
- Vite vanilla JS 脚手架 + 单键时机技术壳（canvas + 游戏循环 + 键盘+触摸双输入 + 响应式画布 + viewport meta + PWA manifest，不含具体玩法）
- 移动端浏览器可玩：触摸输入、响应式 canvas（resize + devicePixelRatio）、安全区域适配、PWA（可添加到主屏幕）
- 验证命令定下来并回填进宪法（vite build / vitest run / Playwright test:e2e，均 PowerShell 兼容）
- docs/how-to-test.md（怎么测）：本机测（npx vite → localhost:5173）+ 局域网手机测（npx vite --host → 手机同 Wi-Fi 打开局域网地址）；T3 写这两部分，T8 补在线给别人测部分
- 游戏设计 spec：机制=单键时机，变体冻结（含触摸交互与横竖屏取向），写 specs/active/single-button-timing.md
- 灰盒可玩原型：单键时机判定 + 成功/失败 + 计分 + 重开 + 难度递增（含 ?testMode 确定性测试钩子，只暴露非敏感状态）；键盘+触摸双输入路径
- 3-5 人无解说玩测 + 真实原始反馈证据（按 raw schema，含手机端试玩）+ 迭代记录
- 打磨味道：视觉母题（配色/字体/画面）+ 音效（默认 Web Audio 合成）/动效/UI 统一（触摸友好：目标≥44px、安全区域、横竖屏），个人风格落地
- 发布链路：相对 base `./`（始终）+ GitHub Pages 部署 workflow + itch.io 打包说明（勾选 mobile friendly），build 产物可部署，手机浏览器可访问
- publish-ready 包（dist.zip + 发布说明，agent 可执行）；凭证齐备时实际发布到 GitHub Pages + itch.io，公开链接可玩；凭证缺失则交付 publish-ready 包并标 blocked

### Must NOT have (guardrails, anti-slop, scope boundaries)
- 不做在线多人 / 服务端 / 游戏内账号 / 登录 / 支付
- 不做游戏内存档 / 排行榜后端 / 数据库
- 不做原生移动 App 打包 / 不上架 App Store（未来另起 ADR；本期移动端靠浏览器 + PWA）
- 不引入游戏引擎（Phaser 仅在原型证明需要场景/物理/tilemap 且走 ADR 时才换）
- 不引入 TypeScript（除非另写 ADR）
- 不堆砌多个机制（只做"单键时机"一个机制做透）
- 不为"未来扩展"预先抽象 / 过度设计
- 不把网站当游戏做（先"玩起来爽"再"页面完整"）
- 不编造玩测反馈（R3 红线；真人反馈须有按 schema 的原始证据，禁止合成）
- 装宪法时不覆盖已有的 .omo/ 与 .codegraph/ 内容；.omo/evidence/ 是规划与审查证据目录，允许写入
- T3 脚手架不实现具体玩法/节奏/难度/UI 文案（等 T4 冻结后由 T5 做）；但触摸输入管线、响应式画布、viewport、PWA manifest 属于技术壳，T3 就做
- testMode 不得成为生产后门或作弊入口

## Verification strategy
> agent 可执行验证 + 三处人工 gate 诚实标注。零"伪自动完成"。命令均 PowerShell 5.1 兼容（不用 `&&`，用 `; if ($?) {}`）。
- Test decision: tests-after + 运行时验证。核心时机判定用 Vitest 单测（纯函数）；运行时用 Playwright（`@playwright/test`，`test:e2e` 脚本，固定 preview 端口 4173）断言 canvas / 无 console error / 核心循环可运行（T5 起用 `?testMode=1` + 可读 `window.__gameState` 保证确定性）；玩测为真实人工输入。
- Framework: Vitest（核心逻辑）+ @playwright/test（运行时，亦可用 /playwright skill）+ `npx vite build`（构建门禁）。
- 最快可信验证（PowerShell）: `npx vite build; if ($?) { npx vitest run }`
- 三处人工 gate（agent 只验证结构与运行结果，人工输入由用户提供，未提供则 blocked，不伪称完成）：
  - T4 用户选变体（owner gate）：agent 验收只检查"spec 含明确用户选择记录"；无记录则 blocked，不进 T5。
  - T6 真人玩测（human-input gate）：agent 只生成试玩链接+反馈表模板+记录模板；原始反馈证据须由用户按 raw schema 存入 .omo/evidence/task-6-playtest-raw/；agent 验收只检查文档结构+人数条目+迭代 diff，真实性由用户声明（R3）。
  - T10 实际发布（human-credential gate）：agent 验证 publish-ready 包；实际上线需用户提供 GitHub 仓库 + gh auth + itch.io 账号；凭证缺失则保持 publish-ready + blocked 报告，不写 release commit、不宣称已发布。
- 预检：T1 起 `node --version; npm --version`；运行时验证前确认 Playwright 浏览器可启动（`npx playwright --version`，失败则记录阻塞，不伪称运行时验证通过）；T10 `gh auth status`。
- Evidence: .omo/evidence/task-<N>-personal-browser-game.<ext>（构建日志/测试输出/Playwright 截图/玩测记录 md）。
- References 时效：执行时记录每个外链的访问日期与版本号（如 Vite x.x、Phaser x.x）；优先官方源，第三方文章仅辅助。

## Execution strategy
### Parallel execution waves
> 本项目本质串行（体检→治理→脚手架→spec→原型→玩测→打磨→发布），不强凑并行；T2 必须先于 T3 以避免 AGENTS.md 回填竞态；T3 与 T4 可并行（T3 只做技术壳，不带入玩法假设）。

### Team mode 试用（仅 Wave 3 的 T3/T4）
> 用户首次安装 Team mode，想在唯一有并行价值的一波试用。其余步骤用普通 task 顺序执行，不开 team。
- Wave 3 时执行者创建一个临时 2 人小队：scaffold-worker（做 T3）+ spec-worker（做 T4，含向用户呈现变体草图）。
- 两个 worker 并行干完各自任务后，执行者（lead）立即走 Closure Sequence：shutdown + approve 每个成员 → team_delete。不在后续串行步骤留 team 空转。
- 若 Team mode 不可用或出错，fallback 为普通 task 顺序执行 T3 再 T4（不阻塞项目）。
- Team mode 的 task/消息/关闭细节由执行者按 team-mode skill 规范操作；计划不重复 skill 文档。

### 自跑底纪律（loop engineering / 目标模式）
> 这个项目的目标：尽量减少人类参与，执行者自己跑代码、自己验证、卡住自己想办法、只在真正需要人类时才停下来。下面是执行者的自主行为边界。
- **自跑机制**：用户说 `$start-work` 后，执行者用 OpenCode 的自跑机制（ralph-loop / ulw-loop / sisyphus work session 等）按计划连续执行：一个 todo 做完 → 自跑验证 → 通过则进下一个 → 不通过则自己诊断修复再验证。
- **自主决策范围（不用问用户）**：技术实现细节（怎么写代码、怎么修 bug、怎么调样式）、验证失败后的诊断与修复、环境问题排查（端口冲突、依赖版本、Playwright 浏览器缺失等）、计划里已写死的默认值执行。
- **卡住时的自救（先自己解决，别急着找人）**：遇到失败先诊断根因→尝试修复→重试验证；最多自主尝试 3 轮修复；3 轮仍失败则记录阻塞原因到 docs/project-state.md 并停下，附上已尝试方案和失败证据，等用户介入。不要在失败里死循环空转。
- **必须停下来找用户的边界（只有这三处，不要越界也不不要漏）**：
  1. T4 owner gate：双角色具体形象设定要用户选；两路径差异化程度若导致工作量翻倍要用户确认是否收敛；结局呈现方式要用户确认。
  2. T6 human-input gate：真人玩测原始反馈证据要用户提供（agent 不得编造，R3 红线）。
  3. T10 human-credential gate：GitHub 仓库 URL + gh auth + itch.io 账号要用户提供。
  - 除这三处外，任何 todo 都不该停下来问用户——自己跑到底或自救 3 轮后阻塞。
- **禁止行为**：不编造玩测反馈/数据/外部来源（R3）；不绕过验证命令宣称完成（R2）；不擅自加计划外的功能/机制/依赖；遇到人工 gate 不假装自动完成（如 T10 无凭证时不得写"已发布"）。
- **进度透明**：每个 todo 完成后更新 docs/project-state.md（当前状态+下一步+交接注意），让任何后续 agent 能接手，不依赖聊天历史。这是宪法 §9 的要求，自跑模式更要严格执行。
- Wave 1: T1 仓库体检
- Wave 2（依赖 T1）: T2 宪法骨架 + ADR-0001 + git init
- Wave 3（依赖 T2）: T3 Vite 脚手架 + 单键技术壳 + 回填验证命令 | T4 游戏 spec + 变体冻结（owner gate）
- Wave 4（依赖 T3,T4）: T5 灰盒可玩原型 + testMode
- Wave 5（依赖 T5）: T6 玩测 + 迭代（human-input gate）
- Wave 6（依赖 T6）: T7 打磨味道
- Wave 7（依赖 T7）: T8 发布链路准备
- Wave 8（依赖 T8）: T9 publish-ready 包（agent 可执行）
- Wave 9（依赖 T9 + 用户凭证）: T10 实际发布（human-credential gate）

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 | — | T2 | — |
| T2 | T1 | T3,T4 | — |
| T3 | T2 | T5 | T4 |
| T4 | T2 | T5 | T3 |
| T5 | T3,T4 | T6 | — |
| T6 | T5 | T7 | — |
| T7 | T6 | T8 | — |
| T8 | T7 | T9 | — |
| T9 | T8 | T10 | — |
| T10 | T9 + 用户凭证 | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. 仓库体检（只读）
  What to do / Must NOT do: 只读检查业务/源码文件（唯一允许写入 .omo/evidence/task-1-repo-check.md 作为证据）——`git status`（判断是否已 git repo；已 repo 则禁止重新 init，T2 跳过 git init）、列出已有文件（已有 package.json/AGENTS.md/README 等则记入体检报告，T2 合并不覆盖）、`node --version; npm --version`（不满足则阻塞，不进 T2）、网络可用性（PowerShell：`git ls-remote https://github.com/mckf111/vibe-starter-GPT refs/heads/master; if ($?) { "network=ok" } else { "network=blocked" }`，结果写入证据，network=blocked 则阻塞）；产出 .omo/evidence/task-1-repo-check.md（含 git 状态、文件清单、Node/npm 版本、网络结果、是否需 git init 的结论）。Must NOT: 不修改任何业务/源码文件（唯一写入 .omo/evidence/task-1-repo-check.md）；不 git init（T2 才 init）；不安装依赖。
  Parallelization: Wave 1 | Blocked by: — | Blocks: T2
  References: 当前目录 E:\OpenCode\Game_01 已知含 .codegraph/ 与 .omo/；环境为 Windows PowerShell 5.1。
  Acceptance criteria (agent-executable): .omo/evidence/task-1-repo-check.md 存在且含 git 状态结论 + 文件清单 + node/npm 版本 + 网络结果 + "是否需 git init"明确结论；node/npm 不满足或网络不可达则状态=blocked 且报告写明。
  QA scenarios (PowerShell): happy=`git status; node --version; npm --version` 全部有输出且写入 task-1-repo-check.md，Evidence .omo/evidence/task-1-repo-check.md；failure=git status 报错（非 repo）→记"需 git init"继续；node/npm 缺失→blocked 记录；网络不可达→`git ls-remote` 失败记 network=blocked 并阻塞。Evidence 同上。
  Commit: N（只读体检，无产物代码；若需留痕可 chore(repo): add pre-flight check report）

- [ ] 2. 装入 vibe-starter-GPT 宪法骨架 + ADR-0001 + git init
  What to do / Must NOT do: 据 T1 体检：若非 git repo 则 `git init` 并设默认分支 main（已 repo 则跳过）；从 https://github.com/mckf111/vibe-starter-GPT 获取 template/——**先 `git ls-remote https://github.com/mckf111/vibe-starter-GPT refs/heads/master` 取当前 commit SHA 并记录到 .vibe-starter-gpt.json 与 ADR-0001（pin 版本，可复现）**，再 clone 或 raw 逐文件 fetch（raw 用 `https://raw.githubusercontent.com/mckf111/vibe-starter-GPT/<SHA>/template/<path>`）；按 START_HERE.md 装到项目根，**只补缺失文件、遇同名先读后合并不覆盖**（lefthook.yml 与 CLAUDE.md 为 optional，用户不需要可跳过或最小化）；保留已有 .omo/ 与 .codegraph/；填占位符——项目定位=「一款单键时机的个人风格浏览器小游戏，取悦自己与他人」、非目标=不做多人/账号/支付/原生App/多机制/存档排行榜后端；项目类型=Web 浏览器游戏、主要语言=JavaScript、主要产物=可在线玩的 HTML5 游戏、默认分支=main；红线 R1 范围=不做多人/账号/支付/原生App/存档排行榜后端、R2 工程=不绕过验证命令宣称完成/新增依赖须说明理由+有 ADR/改架构接口须写 ADR、R3 事实=不编造玩测数据与外部来源；架构边界=src/ 游戏代码 + assets/ 资产 + public/ 静态 + dist/ 构建产物(忽略)；验证命令暂记"待定（T3 定后回填）"；填 .vibe-starter-gpt.json(installedOn=2026-06-23, projectType=web-game, constitutionSHA=<SHA>)；确保 .gitignore 含 .codegraph/、node_modules/、dist/；**前置写 docs/decisions/0001-tech-stack.md**（按 _template.md，状态 accepted，决策=原生 Canvas+JS+Vite+Vitest+Playwright，备选=Phaser/PixiJS/Godot，不选理由=引擎学习税/对首款小游戏偏重，失效条件=原型证明需要场景/物理/tilemap）；搜占位符列未填项。Must NOT: 不默认 Next.js/Vercel/pnpm；不覆盖已有 .omo/.codegraph 与现有规则；不写业务游戏代码；不安装 npm 依赖（T3 才装）；不用不明版本模板（必须 pin SHA）。
  Parallelization: Wave 2 | Blocked by: T1 | Blocks: T3,T4
  References: 宪法仓库 https://github.com/mckf111/vibe-starter-GPT（pin SHA，不硬编码 master）；其 README.md / OPENING_PROMPT.md / START_HERE.md / template/AGENTS.md / template/CLAUDE.md / template/docs/(project-state|architecture|interfaces|debt|decisions/_template).md / template/specs/_template.md / template/.vibe-starter-gpt.json / template/.github/workflows/ci.yml / template/lefthook.yml / template/.gitignore。规划阶段研究结论（内联）：技术栈首选原生 Canvas+JS（MDN Games 明确"从纯 JS 入手最利理解 web 游戏"），Phaser 为最稳带脚手架次选，Kaboom 官网已写"不再维护"（风险），Godot Web 导出对首款小游戏偏重，p5.js 适合艺术/玩具型——故选原生 Canvas+JS。
  Acceptance criteria (agent-executable): 项目根存在 AGENTS.md/CLAUDE.md(可选)/CHANGELOG.md/README.md/.vibe-starter-gpt.json/docs/project-state.md/docs/architecture.md/docs/interfaces.md/docs/debt.md/docs/decisions/README.md/docs/decisions/0001-tech-stack.md/specs/README.md/.github/workflows/ci.yml；占位符扫描 `rg "\{\{" --glob "!.omo/**" --glob "!node_modules/**" --glob "!.github/**"`（排除 .github 的 GitHub Actions `${{ }}` 表达式；.github 中 `${{ }}` 是 Actions 语法非待填占位符）仅剩 GitHub 仓库 URL 等明确待用户提供项；AGENTS.md §1 含定位与"非目标"、§4 含 R1/R2/R3、§2 验证命令标注待定；.vibe-starter-gpt.json 含 installedOn/projectType/constitutionSHA；ADR-0001 状态=accepted 含备选方案表+失效条件；git 已 init（或已 repo）且默认分支 main；.gitignore 含 .codegraph/、node_modules/、dist/。
  QA scenarios (PowerShell): happy=文件齐全 + 占位符扫描仅剩用户待提供项 + ADR-0001 accepted + SHA 已记录，Evidence .omo/evidence/task-2-personal-browser-game.txt（扫描输出+文件清单+ADR-0001 全文+SHA）；failure=rg 不可用→改用 `Get-ChildItem -Recurse -File | Where-Object {$_.FullName -notmatch '\\\.omo\\' -and $_.FullName -notmatch '\\\.github\\' -and $_.FullName -notmatch '\\node_modules\\'} | Select-String -Pattern "{{" -SimpleMatch` 后过滤掉含 `${{` 的行；template 获取失败→用 raw.githubusercontent.com/<SHA>/template/<path> 逐文件 fetch；网络失败→blocked 记录 constitution-fetch-blocked。Evidence 同上。
  Commit: Y | chore(constitution): install governance skeleton (pinned) + ADR-0001 + git init

- [ ] 3. Vite vanilla JS 脚手架 + 单键技术壳 + 回填验证命令
  What to do / Must NOT do: 预检 `node --version; npm --version`（不满足阻塞）；在项目根用 Vite vanilla 模板初始化（package.json + vite.config.js + index.html + src/main.js），不引游戏引擎、不引 TS；**只做技术壳**——全屏 canvas、requestAnimationFrame 游戏循环、**双输入路径**（键盘空格 + 触摸/点击，统一为一个"单键按下"事件）、**响应式 canvas**（window resize 监听 + devicePixelRatio 高 DPI 适配 + canvas 尺寸跟随视口）、**index.html 加 viewport meta**（`width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover` 含 safe-area-inset）、**PWA manifest**（public/manifest.json：name/short_name/theme_color/display=fullscreen/icons 占位；index.html 引用 manifest link）、每帧渲染示意实体（沿固定路径移动的小球 + 一个时机窗口标记，仅用于验证渲染管线，非玩法）、按键/触摸后写入可断言状态（如 `document.body.dataset.state` 或 score 文本）；安装 devDependencies：vitest、@playwright/test；package.json scripts 加 `"test:e2e": "playwright test"`（运行时验证入口，亦可用 /playwright skill）；vite.config.js 设 `base: './'`；vite preview 固定端口 4173；把验证命令回填进宪法 AGENTS.md §2/§7/§8 与 docs/project-state.md：安装 `npm install`、开发 `npx vite`、构建 `npx vite build`、单测 `npx vitest run`、运行时 `npm run test:e2e`、最快可信验证 `npx vite build; if ($?) { npx vitest run }`；**写 docs/how-to-test.md**（怎么测，复制就能跑）：本机测（`npx vite` → 浏览器打开 http://localhost:5173）+ 局域网手机测（`npx vite --host` → 输出的 Network 地址如 http://192.168.x.x:5173，手机同 Wi-Fi 浏览器打开）；说明改代码后页面自动刷新、所见即所得；.gitignore 已含 node_modules/dist（T2 已设，此处确认）；一个占位测试（仅本 todo 允许，T5 替换为真实 judgeTiming 单测）；确认 `npx playwright --version` 可用并装浏览器二进制（`npx playwright --version; if ($?) { npx playwright install chromium }`，install 失败则记录 blocked，不伪称运行时验证通过）。Must NOT: 不装 Phaser/PixiJS 等引擎；不引 TypeScript；不实现具体玩法/节奏/难度/UI 文案（等 T4 冻结后 T5 做）；占位测试不进入 T5；触摸输入只搭管线不做玩法逻辑。
  Parallelization: Wave 3 | Blocked by: T2 | Blocks: T5 | Can parallelize with: T4
  References: ADR-0001（T2 已写）；Vite 指南 https://vitejs.dev/guide/（执行时记版本）；MDN Canvas API https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API ；MDN Breakout 教程 https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript ；requestAnimationFrame 游戏循环模式；MDN Touch Events https://developer.mozilla.org/en-US/docs/Web/API/Touch_events ；MDN devicePixelRatio https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio ；MDN viewport meta https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name ；MDN PWA manifest https://developer.mozilla.org/en-US/docs/Web/Manifest ；MDN safe-area-inset https://developer.mozilla.org/en-US/docs/Web/CSS/env ；宪法 AGENTS.md §2/§7/§8。研究结论（内联）：Vite 是构建工具非游戏引擎，零配置 dev/build/preview，对零基础负担最低；单键时机天然适合手机触摸（点击屏幕=单键），移动端适配增量主要在输入管线+响应式画布+viewport，不涉及换架构。
  Acceptance criteria (agent-executable): `npm install` 退出码 0；`npx vite build`（PowerShell：`npx vite build 2>&1 | Out-File -Encoding utf8 .omo/evidence/task-3-build.log; "EXIT=$LASTEXITCODE"`）退出码 0 且生成 dist/index.html；`npx vitest run` 通过占位测试（日志 .omo/evidence/task-3-vitest.log）；Playwright 打开 `npx vite preview --port 4173`，断言页面有 <canvas>、console 无 error、单键按下（键盘）后 `document.body.dataset.state` 或 score 文本发生具体值变化（断言具体值）；**移动端验证**：Playwright 用 mobile viewport（如 iPhone 13：`{width:390,height:844}`）+ 模拟触摸点击（`page.tap()`）断言同样状态变化；**viewport meta 存在**（`page.$('meta[name=viewport]')` 非 null）；**manifest link 存在**（`page.$('link[rel=manifest]')` 非 null）；**canvas 响应式**（resize 窗口后 canvas 尺寸跟随）；宪法验证命令已回填（`rg "vite build" AGENTS.md` 命中）；**docs/how-to-test.md 存在且含本机测（localhost:5173）+ 局域网手机测（--host + Network 地址）两部分命令**（`rg "localhost:5173" docs/how-to-test.md` 与 `rg "host" docs/how-to-test.md` 命中）。
  QA scenarios (PowerShell): happy=build+vitest+Playwright 全绿且断言具体值变化，Evidence .omo/evidence/task-3-personal-browser-game.png + task-3-build.log + task-3-vitest.log；failure=build 失败→读 build.log 修复；console error→修复；vitest 失败→修测试；playwright 不可用→blocked 记录。Evidence 同上。
  Commit: Y | feat(scaffold): vite vanilla + canvas + single-button tech shell

- [ ] 4. 游戏设计 spec：基于已定内容方向，冻结范围（owner gate）
  What to do / Must NOT do: **游戏内容方向已由用户与 planner 共同确定（见 Scope §游戏内容方向），执行者不得自行替换为通用模板或 copy 现有游戏内容**。执行者的工作是：把已定方向落成正式 spec——明确双角色（守序者+闯入者）的具体形象设定、入口选择界面、两条路径的关卡/节奏/难度曲线、"互相理解"结局的具体呈现、核心意象（书桌/床铺/衣柜）在画面中的使用、主角"偷偷观察/给世界打分"姿态的具体表现、触摸交互与横竖屏取向；写 specs/active/single-button-timing.md（按宪法 spec 模板：用户故事/≥3 条 agent 可验证验收标准（带命令/断言）/in-scope/out-of-scope/设计/技术任务/风险/验证计划）；**关键决策点须向用户确认**：双角色具体形象设定（2-3 个草图供选）、两路径差异化程度（若差异导致工作量翻倍则向用户确认是否收敛为单路径+配角）、结局具体呈现方式；out-of-scope=不做多机制/关卡编辑器/排行榜服务端/存档后端/copy现有游戏内容。Must NOT: 不在 spec 阶段写游戏代码；不撑大范围；不重写 ADR-0001；不得忽略已定内容方向自行换成通用变体；不得 copy 已发布游戏的角色/美术/音乐/剧情。
  Parallelization: Wave 3 | Blocked by: T2 | Blocks: T5 | Can parallelize with: T3
  References: **本计划 Scope §游戏内容方向（T4 spec 输入）——这是已定的创作方向，执行者基于它写 spec，不得替换**；宪法 template/specs/_template.md；ADR-0001（T2）。研究结论（内联）：设计法=一个机制做透+一个情绪+一个视觉母题+短体验（3-10 分钟或 30 秒进入）；版权注意=内容方向由用户个人元素推演，非抄自任何已发布游戏。
  Acceptance criteria (agent-executable): specs/active/single-button-timing.md 存在且含用户故事+≥3 条带命令/断言的可执行验收标准+in/out scope+设计+技术任务+验证计划小节；spec 内容与 Scope §游戏内容方向一致（`rg "守序者|闯入者" specs/active/single-button-timing.md` 命中双角色；`rg "归位|融入" specs/active/single-button-timing.md` 命中两路径）；spec 含双角色形象设定的用户确认记录（`rg "形象" specs/active/single-button-timing.md` 命中具体设定+用户选择记录）；spec 含两路径差异化程度说明（共享核心+差异层）；spec 含触摸交互与横竖屏取向；无用户确认记录则状态=blocked，不进 T5。
  QA scenarios (PowerShell): happy=spec 齐全 + 用户选择已记录，Evidence .omo/evidence/task-4-personal-browser-game.md（spec 全文+用户选择记录）；failure=用户未选/全拒→出第二轮或请用户提供种子，未明确选择则 blocked；验收标准不可执行→改写到带命令/断言。Evidence 同上。
  Commit: Y | docs(spec): freeze single-button-timing scope

- [ ] 5. 灰盒可玩原型（核心循环 + 确定性测试钩子）
  What to do / Must NOT do: 按 T4 选定变体实现灰盒原型——单键时机判定纯函数 judgeTiming(pressTime, windowCenter, windowHalf)→{hit,miss,early,late}（配 Vitest 单测覆盖命中/早/晚/边界，替换 T3 占位测试）、成功/失败反馈、计分、重开、难度递增（窗口随分数缩小或速度加快）；**输入走 T3 搭好的双输入管线**（键盘空格 + 触摸/点击统一为"单键按下"事件，原型逻辑只消费统一事件不区分来源）；视觉用方块/圆点/文本灰盒；音效占位（T7 做正式）；**确定性测试钩子**：`?testMode=1` 时注入固定 clock/seed、固定速度/窗口，并暴露 `window.__gameState`（仅非敏感状态：hit/miss/score/restart/窗口参数，不暴露内部实现或作弊入口），testMode 不改变正常玩法逻辑；Playwright 只读 `window.__gameState` 做断言，不依赖真实时间。Must NOT: 不做正式美术/音效（T7）；不加第二个机制；不预设关卡编辑器/排行榜；testMode 不得成为生产后门或作弊入口；不在非 testMode 改动正常玩法；不硬编码输入来源（统一事件）。
  Parallelization: Wave 4 | Blocked by: T3,T4 | Blocks: T6
  References: T4 spec specs/active/single-button-timing.md；T3 骨架 src/main.js；MDN Canvas 游戏循环模式。研究结论（内联）：灰盒原型先实现移动/输入/碰撞/计分/重开，目标是"能玩"而非好看。
  Acceptance criteria (agent-executable): `npx vitest run`（日志 .omo/evidence/task-5-vitest.log）通过 judgeTiming 全分支；`npx vite build` 退出码 0；Playwright 打开 `npx vite preview --port 4173` 带 `?testMode=1`，脚本化按键 + 读 `window.__gameState` 断言 hit/miss/score/restart 确定性变化（具体值，非肉眼，非真实时间）；难度递增可观测（窗口参数随分数变化的断言）。
  QA scenarios (PowerShell): happy=核心循环确定性跑通 + 单测全绿，Evidence .omo/evidence/task-5-personal-browser-game.png + task-5-vitest.log；failure=判定边界单测失败→修纯函数；Playwright flaky→确认 testMode/固定 seed 生效且不依赖真实时间；循环卡死→查游戏循环/输入监听。Evidence 同上。
  Commit: Y | feat(game): greybox prototype with timing judge + testMode

- [ ] 6. 3-5 人无解说玩测 + 迭代（human-input gate）
  What to do / Must NOT do: agent 生成临时试玩链接（`npx vite preview --port 4173 --host` 局域网，或临时 GitHub Pages 分支；外网不可达时改 zip+本地运行说明）+ 反馈表模板 + 记录模板；**raw 证据 schema（每份）**：玩家代号(匿名)、日期、设备（须含至少 1 份手机端试玩：设备型号+浏览器）、试玩时长、卡点、爽点、是否想再来、原话摘录——不收集姓名联系方式；**真人原始反馈证据由用户按 schema 存入 .omo/evidence/task-6-playtest-raw/**（≥3 份，其中≥1 份须为手机端试玩，agent 不得自行生成或合成）；agent 据 raw 证据整理 docs/playtest-001.md（结构化整理+迭代动作），据反馈迭代核心循环与难度曲线；迭代后跑回归。Must NOT: 不编造玩测反馈（R3）；agent 不得生成 raw 证据；<3 份或 0 份手机端 schema 完整的 raw 证据则 blocked；玩测后不擅自加新机制（只调既有）。
  Parallelization: Wave 5 | Blocked by: T5 | Blocks: T7
  References: 研究结论（内联）：低成本验证=无解说试玩/5 个有效反馈>100 空泛/灰盒就测/观察第一次笑或卡住；宪法 R3 事实红线。
  Acceptance criteria (agent-executable): .omo/evidence/task-6-playtest-raw/ 存在且含 ≥3 份 raw 证据文件（每份含 schema 各字段：代号/日期/设备/时长/卡点/爽点/想再来/原话），其中 ≥1 份设备字段含手机型号+浏览器（手机端试玩）；docs/playtest-001.md 含日期+≥3 条结构化反馈+迭代动作清单；迭代后回归 `npx vite build`（日志 task-6-build.log）; if ($?) { npx vitest run }（日志 task-6-vitest.log）通过；至少一条迭代可在代码 diff 追溯；raw 证据缺失或 <3 份或 0 份手机端则状态=blocked。
  QA scenarios (PowerShell): happy=raw 证据≥3份且 schema 完整 + 整理文档 + 迭代可追溯 + 回归绿，Evidence .omo/evidence/task-6-personal-browser-game.md + task-6-playtest-raw/ + task-6-build.log + task-6-vitest.log；failure=raw 证据不足3份或不符 schema→blocked 待用户补；试玩链接外网不可达→改临时 Pages 分支或 zip 本地说明；迭代引入回归→修复再测。Evidence 同上。
  Commit: Y | docs(playtest): record playtest-001 and iterate core loop

- [ ] 7. 打磨味道（个人风格落地）
  What to do / Must NOT do: 在冻结范围内打磨——定视觉母题（统一配色≤4 色、字体声明、画面风格化）、加音效（**默认用 Web Audio API 合成**；若用外部资产须记录 URL/license/作者/下载日期，优先 CC0/CC-BY）、加动效（命中/失败/重开的反馈，服务时机感为限，不堆粒子）、统一 UI（标题/分数/重开提示）+**触摸友好**（可点击目标尺寸≥44px、安全区域 env(safe-area-inset-*) 适配、横竖屏布局自适应、避免误触）；音频只在用户首次按键/触摸后初始化（浏览器自动播放策略）；写 docs/art-direction.md 记录视觉/音频母题与资产 license。Must NOT: 不加新机制；不引入庞大资产库；不替换已定核心循环；音效资产必须合规（license 记录）。
  Parallelization: Wave 6 | Blocked by: T6 | Blocks: T8
  References: 研究结论（内联）：一个视觉母题+一个声音气质+最后 20% 做手感；A Short Hike press kit（景观/原声/写作统一）https://ashorthike.com/press/ ；Web Audio API MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API ；T5 原型代码。
  Acceptance criteria (agent-executable): `npx vite build`; if ($?) { npx vitest run } 通过；Playwright 截图前后对比 + 断言：CSS/配置中颜色数量≤4（可读色值）、字体声明存在、≥3 关键事件有 Web Audio 触发函数或音频资源（代码引用可定位 + 资源文件存在或合成函数存在）、命中/失败/重开后 `window.__gameState` 某状态持续 N 帧变化（运行时断言非 grep 注释）、console 无 audio error。
  QA scenarios (PowerShell): happy=风格统一(可量化) + 音效合规 + 动效运行时可观测，Evidence .omo/evidence/task-7-personal-browser-game.png + task-7-art-direction.md；failure=音效 license 缺失→改 Web Audio 合成或补合规资产；audio console error→修路径/首次按键初始化。Evidence 同上。
  Commit: Y | feat(polish): art direction, web-audio sfx, juice, unified UI

- [ ] 8. 发布链路准备（相对 base，始终 ./，不写死仓库名）
  What to do / Must NOT do: vite.config.js 已设 `base: './'`（T3 已设，此处确认，**始终 ./，不写死仓库名，不引入 /repo/ 分支**）；写 .github/workflows/deploy.yml（push 到 main 时 vite build → 部署 dist/ 到 GitHub Pages）；写 docs/publish-itchio.md（vite build → dist/ 打 zip → itch.io 新建 HTML Game → 上传 → **勾选 Mobile friendly** → 设嵌入方式，按 itch.io HTML5 文档）；**补全 docs/how-to-test.md 的在线给别人测部分**（GitHub Pages 临时分支：推一个分支 → GitHub 自动给公开链接 → 任何人手机/电脑能打开；itch.io 草稿页：上传 zip 设草稿/不公开 → 只有拿到链接的人能玩）；验证 build 产物结构正确（含本地静态验证：`npx vite preview --port 4173` + Playwright 桌面 + **mobile viewport** 加载 http://localhost:4173/ 与某资产 URL，断言无 404）。Must NOT: 不实际推到 GitHub（需用户仓库，T10）；不上传 itch.io（需用户账号，T10）；不写死仓库名到 base；不引入 /repo/ base 分支；itch.io 文档必须含勾选 Mobile friendly 步骤。
  Parallelization: Wave 7 | Blocked by: T7 | Blocks: T9
  References: Vite GitHub Pages 指南 https://vitejs.dev/guide/（记版本）；itch.io HTML5 文档 https://itch.io/docs/creators/html5 ；GitHub Pages quickstart https://docs.github.com/en/pages/quickstart 。研究结论（内联）：相对 base `./` 兼容 itch.io 与 Pages 子路径。
  Acceptance criteria (agent-executable): `npx vite build`（日志 task-8-build.log）退出码 0 且 dist/index.html 存在、资产相对路径；workflow 语法校验三层 fallback：`actionlint .github/workflows/deploy.yml`（若 actionlint 可用）；否则 `npx yaml-lint .github/workflows/deploy.yml`（若可用）；再否则若 Python 可用则 `python -c "import yaml,sys; yaml.safe_load(open(sys.argv[1]))" .github/workflows/deploy.yml` 做 PyYAML 结构解析；若 PyYAML 也不可用则记录 lint 工具缺失并人工审查 workflow 结构；docs/publish-itchio.md 存在且含完整步骤（含勾选 Mobile friendly）；**docs/how-to-test.md 含在线给别人测部分**（`rg "临时分支|草稿" docs/how-to-test.md` 命中）；`npx vite preview --port 4173` + Playwright 加载 preview URL 与某资产 URL 断言无 404 + canvas 加载（截图）。
  QA scenarios (PowerShell): happy=build 产物 + workflow yaml-lint 通过 + itchio 文档齐全 + preview 无 404，Evidence .omo/evidence/task-8-personal-browser-game.md + task-8-build.log + .png；failure=资产 404→修 base/相对路径；workflow yaml 错→修。Evidence 同上。
  Commit: Y | build(publish): gh-pages workflow + itchio packaging guide

- [ ] 9. publish-ready 包（agent 可执行，无需凭证）
  What to do / Must NOT do: `npx vite build`（base 始终 `./`）→ 把 dist/ 打 zip 到 .omo/evidence/task-9-dist.zip → 验证 zip 含 index.html + 相对资产（对 dist/**/*.html,*.css,*.js 扫描绝对根路径引用：`rg '(src|href)="/' dist` 或 PowerShell `Get-ChildItem dist -Recurse -Include *.html,*.css,*.js | Select-String -Pattern 'src="/','href="/','url\(/'`，允许 https:// 外链，命中则失败）→ 写发布说明 docs/release-readme.md（含 GitHub Pages 部署步骤引用 T8 workflow + itch.io 上传步骤引用 docs/publish-itchio.md + 当前 blocked 项：需用户提供 GitHub 仓库 URL + gh auth + itch.io 账号）。Must NOT: 不实际推 GitHub/上传 itch.io（T10 才做）；不写 release commit；不宣称已发布。
  Parallelization: Wave 8 | Blocked by: T8 | Blocks: T10
  References: T8 deploy.yml 与 docs/publish-itchio.md。
  Acceptance criteria (agent-executable): .omo/evidence/task-9-dist.zip 存在且解压含 index.html + 相对资产（`Get-ChildItem -Recurse dist` 清单写入 task-9-dist-listing.txt，无以 `/` 开头的绝对路径引用——对 dist/**/*.html,*.css,*.js 扫描 `src="/`/`href="/`/`url(/`（`rg '(src|href)="/' dist` 或 `Get-ChildItem dist -Recurse -Include *.html,*.css,*.js | Select-String -Pattern 'src="/','href="/','url\(/'`，允许 https:// 外链）命中则失败，扫描结果写入 task-9-path-scan.log）；docs/release-readme.md 存在且含部署步骤 + itch.io 步骤 + 明确 blocked 项清单。
  QA scenarios (PowerShell): happy=dist.zip 齐全 + 发布说明含 blocked 项，Evidence .omo/evidence/task-9-personal-browser-game.md + task-9-dist.zip + task-9-dist-listing.txt；failure=zip 缺 index.html→重 build 重打包；含绝对路径→修 base。Evidence 同上。
  Commit: Y | build(release): produce publish-ready bundle (blocked on credentials)

- [ ] 10. 实际发布到 GitHub Pages + itch.io（human-credential gate）
  What to do / Must NOT do: 预检 `gh auth status`（失败→进 fallback，不伪称）；**需用户凭证**：GitHub 仓库 URL + gh auth + itch.io 账号；把项目推到仓库 main 触发 deploy workflow，等 GitHub Pages 上线；itch.io 由用户上传 dist.zip（或 butler，仅当 `butler -V` 且已登录）；验证两公开链接；两链接记进 README.md 顶部与 docs/project-state.md。**fallback**：凭证缺失→保持 T9 的 publish-ready 状态 + 写 .omo/evidence/task-10-blocked.md（含 publish-ready 包位置 + 待办：需仓库 URL/gh auth/itch 账号），状态=blocked，**不写 release commit、不宣称已发布**。Must NOT: 不替用户创建账号；不存 token 到仓库；不发布未通过验证的版本；不强依赖 butler；凭证缺失时不得写"已发布"口径。
  Parallelization: Wave 9 | Blocked by: T9 + 用户凭证 | Blocks: —
  References: T8 deploy.yml 与 docs/publish-itchio.md；gh CLI；itch.io butler 文档 https://itch.io/docs/butler/ 。
  Acceptance criteria (agent-executable): 凭证齐备：GitHub Pages URL HTTP 200 + Playwright canvas+单键+无 console error（截图）；itch.io URL（用户提供）Playwright 可加载；两链接记进 README+project-state。凭证缺失：.omo/evidence/task-10-blocked.md 存在含 publish-ready 位置 + 待办清单，状态=blocked，无 release commit。
  QA scenarios (PowerShell): happy=两公开链接可玩 + 证据齐全，Evidence .omo/evidence/task-10-personal-browser-game.png + .log；failure=gh auth 失败/无 URL/无 itch 账号→走 fallback 写 task-10-blocked.md + blocked，不伪称发布；Pages 404→查 base/workflow 日志；itch 加载失败→查 zip 结构与 index.html 入口。Evidence 同上。
  Commit: Y（仅凭证齐备且实际发布成功时）| chore(release): publish to github pages and itch.io

## Final verification wave
> 并行，全部 APPROVE 才算完成。完成标准=命令与证据文件全绿（用户确认属交付流程，非完成标准）。
- [ ] F1. 计划合规审计：每个 todo 的 References/Acceptance/QA/Commit 齐全且可执行；依赖矩阵一致；无技术判断遗漏。
- [ ] F2. 代码质量审查：src/ 代码无死代码/无过度抽象/风格一致；宪法红线（R1/R2/R3）未被违反。
- [ ] F3. 自动运行时 QA：Playwright 带 `?testMode=1` 跑完整游戏循环（开始→玩→失败/成功→重开），截图 + 无 console error；凭证齐备时两公开链接可玩；凭证缺失时通过条件=publish-ready 包验证通过 + task-10-blocked.md 存在（不要求公开链接通过）。
- [ ] F4. 范围 fidelity：只做了"单键时机"一个机制；Must NOT have 全部守住；玩测 raw 证据按 schema 真实存在（R3）。

## Commit strategy
- 每个 todo 一个 Conventional Commit（见各 todo Commit 行）；T10 仅在凭证齐备且实际发布成功时才提交 release commit。
- 宪法骨架+ADR(chore)、脚手架(feat)、spec(docs)、原型(feat)、玩测(docs)、打磨(feat)、发布准备(build)、publish-ready(build)、实际发布(chore)。
- 默认分支 main；T4/T5 等较大改动可走分支→PR（按宪法 §6）。

## Success criteria
- 一款有个人印记的"单键时机"浏览器小游戏——守序者与闯入者双角色、入口可选、热闹滑稽外皮+互相理解温馨内核、秩序几何vs有机暖色视觉、精准节拍vs温暖即兴音乐；**电脑+手机浏览器双端可玩 + PWA**；凭证齐备时公开链接（GitHub Pages + itch.io，itch.io 勾选 mobile friendly）他人可玩到，否则交付 publish-ready 包并诚实标 blocked（不伪称发布）。
- 核心时机判定有 Vitest 单测覆盖；运行时有 Playwright（?testMode 确定性）验证；玩测≥3 人真实 raw 证据按 schema（R3）。
- vibe-starter-GPT 宪法骨架已装入（pin SHA）并填好，ADR-0001 已前置，交接/留痕制度可用（下位 agent 读 AGENTS.md→project-state.md 即可接手）。
- Must NOT have 全部守住：无多人/账号/支付/引擎/多机制/存档排行榜后端/过度设计。
- 完成比完美重要：第一作发布（或 publish-ready）即成功，迭代留到后续。
