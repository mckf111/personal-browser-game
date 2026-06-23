# game-quality-rescue - Work Plan

## TL;DR (For humans)
**What you'll get:** 把现在这个“能跑但像 demo”的小游戏救成一个受控的高质量垂直切片：小蟾蜍和候鸟能一眼认出，房间和物件像一个真实小世界，单键时机不加机制但有节奏、戏剧反馈和小故事闭环；同时补上设计系统、确定性测试、截图验收、真人玩测门禁，避免再用“测试全绿”掩盖“没人想玩”。

**Why this approach:** 不推倒重来，因为用户否定的是当前执行质量，不是明确否定“守序者与闯入者”这个概念；也不靠加引擎/加机制救场，因为项目宪法明确冻结在原生 Canvas + 单键时机。救援抓手是：先锁质量标准，再修确定性测试，最后重做表现层和手感。

**What it will NOT do:** 不引入游戏引擎、不引入 TypeScript、不新增后端/账号/存档/排行榜；不编造玩测反馈；不把 GitHub Pages 上线原型继续包装成“质量批准版”。

**Effort:** Medium
**Risk:** Medium - 风险不在技术，而在“好玩/好看/想再玩”必须靠更硬的质量门槛和真实玩测来兜底。
**Decisions I made for you:** 默认保留现有概念与技术壳，做垂直切片救援；默认只做一个房间、两个可读角色剪影、最多六类物件、每个角色最多三个编排节拍；默认外部玩测不足时项目状态为 blocked，而不是假装完成。

Your next move: 如果要执行，另起执行会话或使用 `$start-work`；本计划本身不改产品代码。Full execution detail follows below.

---

> TL;DR (machine): Medium effort, Medium risk — rescue the existing vanilla Canvas single-button game by adding status/spec truth, DESIGN.md, deterministic testMode/contracts, screenshot/narrative QA, readable character/story visuals, authored rhythm beats, PWA identity cleanup, real playtest gate, and final quality certification.

## Scope
### Must have
- Gate 0 口径：默认“救援现有概念”，不是整仓重开；若用户在执行前明确否定“蟾蜍 + 候鸟 / 归位 + 融入”概念，执行者必须停下并要求新 spec/新计划。
- 把当前线上状态改成“GitHub Pages 已上线原型 / 未质量批准”，而不是继续说 publish-ready 或 finished game。
- 新增 `specs/active/game-quality-rescue.md` 或等价 rescue addendum，先定义救援目标、验收、外部玩测门禁，再改产品代码。
- 新增根目录 `DESIGN.md`：颜色、字体、形状语言、角色剪影、房间层次、动效节奏、截图验收规则都要有可执行 token/规范。
- 修复稳定契约：`testMode` 必须可重复；`miss` 归属必须明确；spec 引用的测试文件必须真实存在或被修正。
- 在单键时机内加深体验：一个房间、两个可读角色、最多六类物件、每个角色最多三个编排节拍；不新增第二机制。
- 画面从抽象轨道/方圆块升级到“玩具剧场/故事书式 Canvas”：房间有层次，蟾蜍和候鸟有轮廓特征，命中/失败像事件而不是数字反馈。
- Playwright 截图 QA 覆盖 375 / 768 / 1280 宽度的 title、select、playing、ending 四态；状态和文案断言必须能自动执行。
- 外部真人玩测门禁：至少 3 份 raw，其中至少 1 份手机端；agent 只能验证 schema 和汇总，不能生成反馈。
- 清理公开身份残留：不再使用 `vite.svg` 作为图标；manifest/favicon/title/description 与游戏一致。

### Must NOT have (guardrails, anti-slop, scope boundaries)
- 不新增 TypeScript，不新增 `.ts/.tsx` 源码。
- 不引入 Phaser / Pixi / Three / Matter 等游戏/渲染/物理引擎；需要则另写 ADR 并等待用户确认。
- 不新增服务端、数据库、账号、登录、支付、存档、在线排行榜、多人。
- 不新增第二核心机制；所有体验提升必须服务于“单键时机”。
- 不用外部图片/音频资产，除非写 ADR + 记录 license / 来源 / 下载日期；默认仍为 Canvas 绘制 + Web Audio 合成。
- 不用“SEO/分享/meta 全家桶”扩大范围；PWA polish 只清理明显脚手架残留与基础元信息。
- 不编造玩测数据、玩家反馈、截图证据或外部来源。
- 不把当前 GitHub Pages 线上原型称为 quality-approved / itch-ready / finished，除非本计划全部质量门通过。

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: hybrid. TDD for deterministic `testMode`, timing contract, red-line scans, and e2e assertions; tests-after for visual screenshot baselines after the intended design is implemented. Frameworks: Vitest + Playwright + Vite build + repository grep/scans.
- Human-input exception: external playtest raw evidence is required for quality approval, but agent does not create it. Agent-executable verification checks only schema/count/mobile coverage and writes `blocked` when evidence is missing.
- Fast regression after product-code todos: `npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test }`
- Visual QA command family: `npx playwright test e2e/visual-quality.spec.js --update-snapshots` only when intentionally establishing approved baselines; normal verification uses `npx playwright test e2e/visual-quality.spec.js` without updating.
- Evidence: `.omo/evidence/task-<N>-game-quality-rescue.*`, screenshot artifacts under Playwright output, plus raw playtest files under `.omo/evidence/game-quality-rescue-playtest-raw/`.
- Red-line scan must pass before final quality approval: no `.ts/.tsx`, no engine/backend deps, no `vite.svg`, no unlicensed assets, no invented playtest raw.

## Execution strategy
### Parallel execution waves
> Target 5-8 todos per wave. Fewer than 3 (except the final) means you under-split.
- Wave 1: Documentation/status/spec/design-system foundation. T1 and T2 are documentation-only and can run in parallel after the executor verifies dirty worktree safety.
- Wave 2: Contracts and QA harness. T3 and T4 can run in parallel only after T1/T2 because tests must reference the new rescue spec/design vocabulary.
- Wave 3: Product rescue implementation. T5, T6, and T7 are sequential enough to avoid visual/loop conflicts, but T7 can start after T5 if T6 has not touched audio/HUD.
- Wave 4: Public identity and external playtest gate. T8 can run after visual identity is stable; T9 runs after internal QA is green.
- Wave 5: Final certification/status. T10 only runs after all gates pass or blocks honestly.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| T1 | Approval to execute this plan | T3,T4,T9,T10 | T2 |
| T2 | Approval to execute this plan | T4,T5,T6,T7 | T1 |
| T3 | T1 | T4,T5,T6,T10 | — |
| T4 | T1,T2,T3 | T5,T6,T7,T10 | — |
| T5 | T2,T4 | T6,T7,T8,T9 | — |
| T6 | T3,T4,T5 | T7,T9,T10 | — |
| T7 | T5,T6 | T8,T9,T10 | — |
| T8 | T2,T5,T7 | T10 | T9 setup only |
| T9 | T5,T6,T7 | T10 | T8 |
| T10 | T1-T9 | — | — |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->
- [ ] 1. Status truth + rescue spec gate
  What to do / Must NOT do: Write `specs/active/game-quality-rescue.md` as the rescue contract before product-code changes. It must state Gate 0: default is rescuing existing concept; if the user explicitly rejects the core concept before execution starts, stop and mark blocked for a new concept plan. Update `docs/project-state.md`, `README.md`, and `CHANGELOG.md` to use honest wording: GitHub Pages hosts an online prototype, not a quality-approved finished game; itch.io remains out of quality approval until gates pass. Do not erase factual Pages URL. Do not claim unpublished if it is online. Do not edit product code in this todo.
  Parallelization: Wave 1 | Blocked by: execution approval | Blocks: T3,T4,T9,T10 | Can parallelize with: T2
  References (executor has NO interview context - be exhaustive): `.omo/drafts/game-quality-rescue.md:15-18,19-27,29-46,48-56`; `README.md:5-10`; `docs/project-state.md:5-10,32-41,73-79`; `CHANGELOG.md:7-21`; `AGENTS.md:114-121` (spec rules); `.omo/evidence/task-6-playtest-raw/p0-author-feedback.md:10-28`; `.omo/evidence/task-final-verification.md:46-59`.
  Acceptance criteria (agent-executable): `specs/active/game-quality-rescue.md` exists and contains sections: Rescue goal, Gate 0, Must have, Must not have, Agent-executable acceptance, External playtest gate, Release/status rules. `rg "quality-approved|itch-ready|finished game|发布级" README.md docs/project-state.md CHANGELOG.md` returns no misleading claims unless explicitly negated. `rg "GitHub Pages|线上原型|prototype|原型" docs/project-state.md README.md` shows factual online prototype wording. `npx vite build` still succeeds because docs changes must not break app.
  QA scenarios (name the exact tool + invocation): happy=`rg "Gate 0|External playtest|quality-approved" specs/active/game-quality-rescue.md; npx vite build` and save output to `.omo/evidence/task-1-game-quality-rescue.md`; failure=if current concept has been explicitly rejected in latest user instruction, do not write implementation tasks as complete; write `.omo/evidence/task-1-game-quality-rescue-blocked.md` stating new concept plan required.
  Commit: Y | docs(rescue): define quality rescue gate and honest status

- [ ] 2. Add DESIGN.md as enforceable visual contract
  What to do / Must NOT do: Create root `DESIGN.md` before visual implementation. It must convert `docs/art-direction.md` from mood note into executable design tokens: palette, role colors, target-window colors, typography, Canvas shape language, character silhouette rules, room layers, prop rules, motion timing, HUD rules, screenshot QA states. Align `docs/art-direction.md` to reference `DESIGN.md` as source of truth, not duplicate drifting tokens. Do not add new UI code yet. Do not invent a brand system larger than needed.
  Parallelization: Wave 1 | Blocked by: execution approval | Blocks: T4,T5,T6,T7 | Can parallelize with: T1
  References (executor has NO interview context - be exhaustive): no `DESIGN.md` found by glob; frontend design gate requires DESIGN.md before UI work; `docs/art-direction.md:5-22,23-45,70-90`; `src/main.js:62-72,541-545` (undefined target tokens); `index.html:10-53` (current HUD/canvas shell); `.omo/drafts/game-quality-rescue.md:22-27,41-46,48-56`.
  Acceptance criteria (agent-executable): `DESIGN.md` exists with sections: Product feeling, Tokens, Character silhouettes, Scene composition, Motion/feedback, State screens, QA checklist. `rg "targetWindow|targetBorder|screenshot|375|768|1280|蟾蜍|候鸟" DESIGN.md` all match. `docs/art-direction.md` contains a line declaring `DESIGN.md` as canonical. No product-code files changed in this todo except docs/design files. `npx vite build` succeeds.
  QA scenarios (name the exact tool + invocation): happy=`rg "# DESIGN|targetWindow|375|768|1280" DESIGN.md; git diff -- DESIGN.md docs/art-direction.md; npx vite build`, evidence `.omo/evidence/task-2-game-quality-rescue.md`; failure=if raw hex/token appears in future design prose without token name, revise DESIGN.md before proceeding.
  Commit: Y | docs(design): add rescue design system contract

- [ ] 3. Fix deterministic testMode and stable timing contract
  What to do / Must NOT do: Make `?testMode=1` deterministic as promised. Introduce a tiny seeded random helper or deterministic object sequence used only when testMode is active; expose enough read-only state for QA (`currentObject.targetT`, `halfWidth`, `speed`, role, beat index) without exposing mutation/cheat functions. Clarify `miss`: unless deliberately changing `judgeTiming`, `miss` is a game-loop timeout result, not a `judgeTiming()` return. Update `docs/interfaces.md`, tests, and code comments accordingly. Do not change normal-mode feel except making implementation testable.
  Parallelization: Wave 2 | Blocked by: T1 | Blocks: T4,T5,T6,T10
  References (executor has NO interview context - be exhaustive): `src/main.js:127-181,270-277` (Math.random); `src/main.js:852-881` (current testMode getter only); `specs/active/single-button-timing.md:27-29`; `docs/interfaces.md:20-42,58-63`; `src/game/timing.js:1-19`; `src/game/timing.test.js:1-76`; `src/main.test.js:1-43`; `.omo/drafts/game-quality-rescue.md:34-36`.
  Acceptance criteria (agent-executable): Add `e2e/testmode.spec.js`. Running `npx playwright test e2e/testmode.spec.js` twice from clean page loads proves identical state sequence for same scripted inputs: `score`, `hits`, `misses`, `currentObject.targetT`, `currentObject.halfWidth`, `level`, `objectsDone`. `npx vitest run src/game/timing.test.js src/main.test.js` passes. PowerShell-safe scan `rg "miss.*judgeTiming|judgeTiming.*miss" docs/interfaces.md src --glob "*.js"` shows no stale claim that `judgeTiming` returns `miss` unless tests prove it. `npx vite build` passes.
  QA scenarios (name the exact tool + invocation): happy=`npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test e2e/testmode.spec.js }`, evidence `.omo/evidence/task-3-game-quality-rescue.log`; failure=if deterministic sequence flakes, block visual QA until random source is isolated.
  Commit: Y | test(game): make testMode deterministic and clarify miss contract

- [ ] 4. Replace weak QA with narrative, role, difficulty, and screenshot gates
  What to do / Must NOT do: Reconcile spec references to real tests. Either create missing `e2e/character-select.spec.js`, `e2e/difficulty.spec.js`, `e2e/testmode.spec.js` or update specs to reference actual names; preferred: create focused files. Add `e2e/visual-quality.spec.js` with Playwright screenshot coverage for title/select/playing/ending at 375, 768, and 1280 widths, plus text/state assertions for role difference and story beat presence. Do not bless current screenshots as final if DESIGN.md requirements are not implemented; tests may initially fail/red until T5-T7 satisfy them.
  Parallelization: Wave 2 | Blocked by: T1,T2,T3 | Blocks: T5,T6,T7,T10
  References (executor has NO interview context - be exhaustive): `e2e/game.spec.js:3-75` (current weak checks); `playwright.config.js:1-29`; `package.json:6-17`; `specs/active/single-button-timing.md:13-29`; `docs/how-to-test.md:3-42`; `DESIGN.md` from T2; `.omo/drafts/game-quality-rescue.md:36-37,44-46`.
  Acceptance criteria (agent-executable): `e2e/character-select.spec.js`, `e2e/difficulty.spec.js`, `e2e/testmode.spec.js`, and `e2e/visual-quality.spec.js` exist or spec is updated to exact existing paths; no spec references nonexistent e2e files (`rg "e2e/.*\.spec\.js" specs docs` paths all exist). `npx playwright test e2e/testmode.spec.js e2e/character-select.spec.js e2e/difficulty.spec.js` passes after T3. `e2e/visual-quality.spec.js` contains screenshot assertions for 375/768/1280 and four game states. If snapshots are not yet approved, mark expected red in `.omo/evidence/task-4-game-quality-rescue.md` and do not claim visual pass.
  QA scenarios (name the exact tool + invocation): happy=`npx playwright test e2e/testmode.spec.js e2e/character-select.spec.js e2e/difficulty.spec.js; npx playwright test e2e/visual-quality.spec.js` after T7, evidence `.omo/evidence/task-4-game-quality-rescue.log`; failure=current visuals fail screenshot gates before T5-T7, expected; keep failing evidence and unblock only after implementation.
  Commit: Y | test(e2e): add rescue quality gates for story visuals and roles

- [ ] 5. Rebuild Canvas visual/narrative vertical slice within one room
  What to do / Must NOT do: Upgrade `src/main.js` and, if needed, small vanilla JS modules under `src/` to implement the DESIGN.md vertical slice. The title/selection/play/ending states must show a toy-theatre/storybook room with readable toad and bird silhouettes, props, shelves/desk/floor layers, and object states. During play, story must be visible: role-specific prompts and scene changes must make “归位 / 融入” legible without reading docs. Fix undefined `COLORS.targetWindow/targetBorder`. Keep one room, two role silhouettes, at most six object types. Do not introduce new libraries, engine, TypeScript, or external assets.
  Parallelization: Wave 3 | Blocked by: T2,T4 | Blocks: T6,T7,T8,T9
  References (executor has NO interview context - be exhaustive): `src/main.js:62-93,426-497,499-618,620-648,650-745`; `specs/active/single-button-timing.md:56-82,127-167`; `docs/art-direction.md:5-45`; `DESIGN.md`; `.omo/evidence/task-6-playtest-raw/p0-author-feedback.md:10-28`; `.omo/drafts/game-quality-rescue.md:29-34,41-46,48-56`.
  Acceptance criteria (agent-executable): `npx vite build` passes. `npx playwright test e2e/character-select.spec.js e2e/visual-quality.spec.js --update-snapshots` is run only to establish intended new baselines, then `npx playwright test e2e/visual-quality.spec.js` passes without updating. `rg "targetWindow|targetBorder" src/main.js DESIGN.md` shows defined tokens and usage. `rg "vite\.svg" index.html public src` returns no product identity references after T8, but T5 must not add any. Visual test assertions prove title/select/playing/ending render role/story text and no canvas blank state.
  QA scenarios (name the exact tool + invocation): happy=`npx vite build; if ($?) { npx playwright test e2e/visual-quality.spec.js }`, screenshots stored by Playwright plus summary `.omo/evidence/task-5-game-quality-rescue.md`; failure=if screenshots show abstract track-only play screen, fail even if state tests pass.
  Commit: Y | feat(visual): rebuild readable storybook canvas slice

- [ ] 6. Deepen single-button gameplay with authored beats, not new mechanics
  What to do / Must NOT do: Keep the single press action, but replace purely random one-object repetition with authored beat sequences per role: at most three beat patterns for order and three for intruder, using existing objects and timing windows. Add near-miss feedback, clearer anticipation, level pacing, combo tension, and role-specific success/failure consequences. Difficulty must be deterministic in testMode and observable in e2e. Do not add movement controls, multi-key input, inventory, physics system, enemies, or second mechanic.
  Parallelization: Wave 3 | Blocked by: T3,T4,T5 | Blocks: T7,T9,T10
  References (executor has NO interview context - be exhaustive): `src/main.js:151-185,188-292,227-257,761-806`; `GAME_CONFIG` at `src/main.js:74-84`; `specs/active/single-button-timing.md:31-44,95-113,137-147`; `.omo/evidence/task-6-playtest-raw/p0-author-feedback.md:12-22,30-61`; `DESIGN.md` motion/feedback rules from T2.
  Acceptance criteria (agent-executable): `npx playwright test e2e/difficulty.spec.js e2e/testmode.spec.js` passes and asserts at least two distinct beat pattern IDs appear in deterministic progression for each role, `halfWidth` or speed changes by level, and near-miss/late/early feedback states are observable. `npx vitest run` passes. No new input event beyond keyboard Space/pointer single press (`rg "Arrow|Key[A-Z]|touchmove|drag|mousedown.*move" src` should not reveal new control mechanics; investigate any hit).
  QA scenarios (name the exact tool + invocation): happy=`npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test e2e/difficulty.spec.js e2e/testmode.spec.js }`, evidence `.omo/evidence/task-6-game-quality-rescue.log`; failure=if improvement requires new controls, stop and write ADR/scope-change note instead of implementing.
  Commit: Y | feat(gameplay): add authored single-button beat pacing

- [ ] 7. Polish audio, HUD, and feedback without expanding scope
  What to do / Must NOT do: Use Web Audio synthesis and Canvas/HUD feedback to make hit/miss/near-miss/ending feel intentional. Add role-specific timbre or rhythm differences within Web Audio; add squash/stretch, anticipation, and feedback text duration consistent with DESIGN.md. HUD must explain the current beat and role goal, not just score. Respect browser audio policy: audio initializes only after user gesture. Do not import audio files unless ADR + license; do not remove animations for test convenience.
  Parallelization: Wave 3 | Blocked by: T5,T6 | Blocks: T8,T9,T10
  References (executor has NO interview context - be exhaustive): `src/main.js:22-59,218-291,370-397,575-617,821-847`; `docs/art-direction.md:46-69`; `specs/active/single-button-timing.md:67-82`; `DESIGN.md`; `.omo/drafts/game-quality-rescue.md:31-37,48-56`.
  Acceptance criteria (agent-executable): `npx playwright test e2e/game.spec.js e2e/visual-quality.spec.js` passes. A dedicated e2e or unit spy verifies hit/fail/near-miss paths call audio trigger functions after user gesture in test-safe mode (do not require real speakers). `window.__gameState` exposes feedback state read-only in testMode long enough for Playwright assertions. Console has no audio errors. `npx vite build; if ($?) { npx vitest run }` passes.
  QA scenarios (name the exact tool + invocation): happy=`npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test e2e/game.spec.js e2e/visual-quality.spec.js }`, evidence `.omo/evidence/task-7-game-quality-rescue.log`; failure=if browser blocks audio before gesture, fix initialization path, not tests.
  Commit: Y | feat(polish): add role audio and tactile feedback

- [ ] 8. Clean PWA identity and public-facing metadata
  What to do / Must NOT do: Replace Vite scaffold identity with project-owned lightweight SVG/favicon/manifest icons created in-repo (simple geometric toad/bird mark is fine). Update `index.html` title/description/theme color/manifest link and `public/manifest.json` icon entries to match DESIGN.md. Keep scope tiny: no analytics, no SEO package, no social-share feature, no external image generator. Update docs only to state “online prototype pending quality gate” until T10 passes.
  Parallelization: Wave 4 | Blocked by: T2,T5,T7 | Blocks: T10 | Can parallelize with: T9 setup
  References (executor has NO interview context - be exhaustive): `index.html:1-63` especially `index.html:6-9`; `public/manifest.json:1-15`; `docs/project-state.md:32-41,73-79`; `docs/release-readme.md`; `DESIGN.md`; `.omo/drafts/game-quality-rescue.md:27,38-39,51-56`.
  Acceptance criteria (agent-executable): `rg "vite\.svg" index.html public src docs` returns no live product identity references except historical notes if explicitly marked. `public/manifest.json` has project-owned icon paths that exist. `index.html` has a non-empty meta description and theme color matching DESIGN.md token. Add `e2e/pwa-identity.spec.js`; it loads the built preview, fetches `manifest.json`, and asserts every manifest icon URL plus favicon URL returns HTTP 200.
  QA scenarios (name the exact tool + invocation): happy=`npx vite build; if ($?) { npx playwright test e2e/pwa-identity.spec.js e2e/game.spec.js }`, evidence `.omo/evidence/task-8-game-quality-rescue.md`; failure=if icon files 404 in preview, fix paths/base rather than disabling PWA.
  Commit: Y | chore(pwa): replace scaffold identity with game icons

- [ ] 9. External playtest gate and bounded iteration
  What to do / Must NOT do: Create/update `.omo/evidence/game-quality-rescue-playtest-raw/feedback-template.md` and `docs/how-to-test.md` with exact instructions for the rescued build. Verify raw evidence only; do not generate it. Required schema: anonymous player code, date, device/browser, role played, duration, stuck point, satisfying moment, “would play again?” yes/no + reason, quote. If fewer than 3 valid files or zero mobile files exist, write blocked evidence and stop before quality approval. If valid evidence exists, summarize in `docs/playtest-rescue-001.md` and perform at most one bounded iteration addressing the top 1-3 issues without adding new mechanics.
  Parallelization: Wave 4 | Blocked by: T5,T6,T7 | Blocks: T10 | Can parallelize with: T8
  References (executor has NO interview context - be exhaustive): `.omo/evidence/task-6-playtest-raw/p0-author-feedback.md:1-61`; `.omo/evidence/task-6-personal-browser-game.md:59-63`; `.omo/evidence/task-6-blocked.md:6-37`; `docs/how-to-test.md:3-42`; `AGENTS.md:104-112` (R20/R21 facts/content red lines); `.omo/drafts/game-quality-rescue.md:26,36-37,45-46,56`.
  Acceptance criteria (agent-executable): Add `scripts/validate-playtest-raw.mjs`. `docs/playtest-rescue-001.md` exists only if raw evidence is valid; otherwise `.omo/evidence/task-9-game-quality-rescue-blocked.md` exists and explicitly says quality approval blocked. `node scripts/validate-playtest-raw.mjs .omo/evidence/game-quality-rescue-playtest-raw` confirms at least 3 markdown files excluding template, each containing all schema labels, and at least one device/browser line indicating mobile. If iteration occurs, `npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test }` passes after changes.
  QA scenarios (name the exact tool + invocation): happy=`node scripts/validate-playtest-raw.mjs .omo/evidence/game-quality-rescue-playtest-raw; if ($?) { npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test } }`, evidence `.omo/evidence/task-9-game-quality-rescue.md`; failure=missing/insufficient raw, write blocked file and do not mark project quality-approved.
  Commit: Y if raw valid and/or docs updated | docs(playtest): add rescue playtest gate and findings

- [ ] 10. Final quality certification, red-line scan, and release-status update
  What to do / Must NOT do: Run the final gate only after T1-T9. If every automated gate and external playtest gate passes, update README/project-state/release docs to say quality rescue passed and GitHub Pages is quality-approved; itch.io remains manual unless uploaded and verified. If any gate fails or playtest evidence is missing, update docs to blocked/online prototype honestly. Run red-line scans and final Playwright screenshot QA. Do not commit a “done” status on partial evidence.
  Parallelization: Wave 5 | Blocked by: T1-T9 | Blocks: —
  References (executor has NO interview context - be exhaustive): all previous task evidence; `AGENTS.md:88-112,150-158` (quality/reporting); `README.md:5-10`; `docs/project-state.md:5-10,73-79`; `CHANGELOG.md:7-21`; `.omo/drafts/game-quality-rescue.md:41-56`.
  Acceptance criteria (agent-executable): Commands pass: `npx vite build; if ($?) { npx vitest run }; if ($?) { npx playwright test }`. Red-line scans pass: no `.ts/.tsx` under `src/`; `package.json` has no engine/backend/database deps; `rg "vite\.svg" index.html public src` no live references; no unlicensed asset files outside allowed generated SVG/icon files; playtest gate not blocked. Visual screenshots pass at 375/768/1280. `docs/project-state.md` and README agree on status. Final report `.omo/evidence/task-10-game-quality-rescue.md` lists every gate result.
  QA scenarios (name the exact tool + invocation): happy=all commands/scans pass and docs say quality-approved online build, evidence `.omo/evidence/task-10-game-quality-rescue.md`; failure=any gate fails, docs say blocked/online prototype, no quality-approved claim.
  Commit: Y | chore(rescue): certify quality gate or record blocked status

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit: verify every todo has references, acceptance, QA, and commit line; all Must NOT constraints are represented in scans; no todo requires hidden human judgment except explicit external playtest raw evidence.
- [ ] F2. Code quality review: inspect changed JS for overlarge/duplicated logic, accidental new mechanisms, unseeded randomness in testMode, stale docs, and undefined visual tokens. Reject if `src/main.js` becomes a worse untestable blob without documented reason.
- [ ] F3. Real browser QA: run Playwright in Chromium at 375 / 768 / 1280 for title/select/playing/ending, capture screenshots, exercise keyboard Space and pointer input, verify no console errors/warnings and no blank/cropped critical UI.
- [ ] F4. Scope fidelity/security/content audit: confirm no engine/TS/backend/deps, no unlicensed assets, no invented playtest raw, no claim of quality approval if gates failed, and no copying existing game content or trademarked art.

## Commit strategy
- One atomic Conventional Commit per todo when changes are real and verifiable.
- Docs/spec/design: `docs(rescue): ...` / `docs(design): ...`.
- Tests/contracts: `test(game): ...`.
- Product visuals/gameplay/polish: `feat(visual): ...`, `feat(gameplay): ...`, `feat(polish): ...`.
- PWA identity: `chore(pwa): ...`.
- Final status: `chore(rescue): certify quality gate` only if gates pass; otherwise `docs(rescue): record blocked quality gate`.
- Never commit generated Playwright screenshots blindly without intentional baseline approval; evidence may live under `.omo/evidence/` as needed.

## Success criteria
- The project status is honest: online prototype vs quality-approved build is unambiguous in README and project-state.
- `DESIGN.md` exists and product visuals trace to its tokens; no undefined visual tokens remain.
- `testMode` is deterministic; `judgeTiming` / `miss` semantics are documented and tested.
- The game still has exactly one core mechanic: single-button timing.
- The play screen no longer reads as abstract lines/squares/circles only: toad, bird, room, props, and role goal are visible in screenshots.
- Role paths differ through authored beats, visual framing, and feedback while sharing the core timing mechanic.
- Build, Vitest, Playwright state tests, and Playwright visual QA pass.
- Public identity no longer uses Vite scaffold assets.
- At least 3 valid external playtest raw files exist, including at least one mobile, and the summary shows whether players would replay; if missing, the project is blocked rather than certified.
- Red-line scans pass: no TypeScript, no game engine, no backend/database/online systems, no unlicensed external assets, no invented data.
