# Final Verification Wave (F1-F4) — game-quality-rescue

日期：2026-06-24

## 总结论

**FAIL — 不能质量批准。**

自动构建、单元测试、全量 Playwright 和本次真实 Chromium 截图 QA 均通过；但最终验证波要求 **F1-F4 全部 APPROVE**。当前 F1、F2、F4 存在明确缺口，且 T9 外部真人玩测门禁仍阻塞。

---

## 本次实际执行证据

| 检查 | 命令 / 文件 | 结果 |
|---|---|---|
| Build | `npx vite build` | PASS，`dist/index.html` + `dist/assets/index-_CM00hC8.js` |
| Unit | `npx vitest run` | PASS，2 files / 16 tests |
| E2E | `npx playwright test --timeout=180000` | PASS，44/44 |
| Browser QA | `node .omo/evidence/final-browser-qa.mjs` | PASS，12 screenshots + `badConsole: []` |
| Playtest raw | `node scripts/validate-playtest-raw.mjs .omo/evidence/game-quality-rescue-playtest-raw` | FAIL，0 valid raw files, 0 mobile |

浏览器 QA 证据：

- 脚本：`.omo/evidence/final-browser-qa.mjs`
- 结果：`.omo/evidence/final-verification-screenshots/qa-result.json`
- 截图：`.omo/evidence/final-verification-screenshots/{375,768,1280}-{title,select,playing,ending}.png`

---

## F1. Plan compliance audit — **FAIL**

### 通过项

- `.omo/plans/game-quality-rescue.md` 中 T1-T10 均包含：
  - `References`
  - `Acceptance criteria`
  - `QA scenarios`
  - `Commit`
- Must NOT 约束在计划中有扫描或验证入口：
  - 无 TypeScript：`src/**/*.{ts,tsx}` 扫描无结果。
  - 无引擎/后端/数据库依赖：`package.json` 只有 `@playwright/test`、`vite`、`vitest`。
  - 无 Vite scaffold 身份：`rg "vite\.svg" index.html public src docs` 在 T8 证据中通过。
  - 无外部图片/音频资产：`assets/` 为空，`public/` 仅项目内图标。
  - 无编造玩测：T9 阻塞证据明确 0 份有效 raw，不代填。

### 缺口

- T5 的失败场景包含“如果截图显示仍是 abstract track-only play screen，则失败”的判断。这是合理质量判断，但不是完全 agent-executable 的确定性断言；除外部 playtest raw 之外，计划仍残留一处隐性人工视觉判断口径。
- 旧 `.omo/evidence/task-final-verification.md` 曾把 T9 写成完成并把 P0 作者反馈当玩测证据；本报告已覆盖该旧结论。

---

## F2. Code quality review — **FAIL**

### 通过项

- 未发现新增第二核心机制：输入仍是 Space + pointer 的单键按下；`src/main.js` 中无 Arrow / Key[A-Z] / drag / touchmove 控制机制。
- `COLORS.targetWindow` / `targetBorder` / `targetWindowIntruder` / `targetBorderIntruder` 当前已定义于 `src/main.js:73-76`，不存在 undefined token。
- `ITEMS` 仍为 6 类物件。

### 失败项

- `generateObject()` 在 testMode 下仍直接使用 `Math.random()`：
  - `src/main.js:170-173`：`startT`、`targetT`、`item`、`color`
  - `src/main.js:177`：`swayFreq`
  - `src/main.js:192`：`swayPhase`
  - 粒子和失败动画也使用 `Math.random()`（视觉随机可接受性较高，但仍未被隔离到 testMode 随机源）。
- `src/main.js` 当前约 948 行、22 个函数；输入、音频、对象生成、状态机、渲染、动画、testMode 暴露仍集中在单文件。它能跑、也能被 E2E 覆盖，但没有达到“更可测试/更清晰”的救援目标，`generateObject` 仍缺直接单元覆盖。
- 视觉 token 存在漂移：`targetWindowIntruder` / `targetBorderIntruder` 已定义，但 `renderGame()` 当前仍固定使用 `COLORS.targetWindow` / `COLORS.targetBorder`，未按角色切换到 intruder token。

结论：自动测试绿不等于 F2 通过。F2 拒绝批准。

---

## F3. Real browser QA — **PASS**

本次使用真实 Chromium 执行：

- 视口：375×667、768×1024、1280×720。
- 状态：title、select、playing、ending。
- 输入：
  - Keyboard Space：title → select；playing 中按 Space。
  - Pointer input：select 中点击角色；playing 中点击 canvas。
- 截图：12 张已保存到 `.omo/evidence/final-verification-screenshots/`。
- 控制台：`qa-result.json` 中 `badConsole: []`，无 error / warning。
- 关键 UI 边界：`qa-result.json` 显示 canvas、score、hint box 均在视口内；三个视口最终状态均为 `ending`。

补充：`npx playwright test --timeout=180000` 也通过 44/44，包括既有 visual-quality 截图门禁。

---

## F4. Scope fidelity / security / content audit — **FAIL**

### 通过项

- 无 TypeScript：`src/**/*.{ts,tsx}` 无结果。
- 无游戏引擎/后端/数据库/账号依赖：`package.json` devDependencies 仅 `@playwright/test`、`vite`、`vitest`。
- 无外部图片/音频资产：`assets/` 为空；`public/favicon.svg` 是几何小蟾蜍/候鸟标记；`public/icon-192.png`、`public/icon-512.png` 为项目内 PWA 图标。
- 无明显已发布游戏 / 商标内容复制：代码和文档未命中 Mario / Nintendo / Pokémon / Disney / Angry Birds / Flappy Bird 等扫描词。
- 未编造外部 playtest：raw 目录只有模板，验证脚本诚实 FAIL。

### 失败项

- T9 仍阻塞：`.omo/evidence/game-quality-rescue-playtest-raw/` 中有效 raw 为 0，移动端 raw 为 0；质量批准不得继续。
- `docs/project-state.md:77` 仍写有 `task-9-dist.zip — publish-ready 包`。虽然 README 和当前状态多处写明 `not quality-approved`，但这句在 T9 阻塞时仍可能误导，应改成“构建包 / 待质量门禁包”之类的诚实措辞。

---

## 最终待修清单

1. 修复 testMode 随机源：`generateObject()` 在 `?testMode=1` 下不得直接依赖 `Math.random()`。
2. 让 `renderGame()` 按角色使用 `targetWindow` / `targetWindowIntruder` 与对应 border token，或删除未使用 token 并同步 DESIGN.md。
3. 拆分或补测 `src/main.js` 中对象生成 / 节拍 / 渲染可观察契约，避免 948 行单文件继续膨胀成不可测 blob。
4. 补齐 T9：至少 3 份外部 raw，其中至少 1 份移动端，并让 `scripts/validate-playtest-raw.mjs` PASS。
5. 清理 `docs/project-state.md:77` 的 `publish-ready 包` 误导性措辞。

在以上问题解决前，本项目只能称为 **online prototype, not quality-approved**。
