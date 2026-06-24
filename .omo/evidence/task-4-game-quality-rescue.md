# Task 4 - game-quality-rescue evidence

日期：2026-06-24

## 范围

- 新增 `e2e/character-select.spec.js`：角色选择流测试框架，断言 role、文案、视觉帧差异；依赖 T3 暴露 `currentObject.startT/targetT` 的细字段断言已用 `TODO` 跳过。
- 新增 `e2e/difficulty.spec.js`：难度递增测试框架；依赖 T3 暴露 `currentObject.t/speed/halfWidth` 的断言已用 `TODO` 跳过。
- 新增 `e2e/visual-quality.spec.js`：覆盖 375 / 768 / 1280 宽度，title / select / playing / ending 四态的 Playwright 截图门禁；ending 依赖 T3 的 `currentObject.t`，当前跳过。
- 更新 `specs/active/single-button-timing.md`：移除当前不存在/并行中的 `e2e/testmode.spec.js` 路径引用，改为 T3 待补说明，避免规格引用幽灵文件。
- 未修改产品代码：本任务未编辑 `src/`、`index.html`、`public/`。

## 命令输出

### `npx vite build`

结果：通过。

```text
vite v5.4.21 building for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                1.80 kB │ gzip: 0.85 kB
dist/assets/index-D3zP9ZVi.js  14.40 kB │ gzip: 5.40 kB
✓ built in 150ms
```

### `rg "e2e/.*\.spec\.js" specs docs`

结果：通过；引用的两个路径均存在。

```text
specs\active\single-button-timing.md:   - 验证命令：`npx playwright test e2e/character-select.spec.js`
specs\active\single-button-timing.md:   - 验证命令：`npx playwright test e2e/difficulty.spec.js`
```

### `npx playwright test e2e/character-select.spec.js e2e/difficulty.spec.js`

结果：命令退出成功，但当前 6 个测试全部跳过。原因：T3 并行中的 testMode 状态契约尚未完整；当前运行环境未稳定暴露 T4 需要的 `currentObject.startT/targetT/t/speed/halfWidth`。

```text
Running 6 tests using 6 workers

  -  4 [chromium] › e2e\character-select.spec.js:45:3 › role selection flow › choosing intruder starts the intruder path with different state and visual framing
  -  1 [chromium] › e2e\character-select.spec.js:28:3 › role selection flow › choosing order starts the order path with order-specific prompt and movement
  -  5 [Mobile Chrome] › e2e\character-select.spec.js:45:3 › role selection flow › choosing intruder starts the intruder path with different state and visual framing
  -  3 [chromium] › e2e\difficulty.spec.js:33:1 › difficulty tightens the timing window or increases object speed as score rises
  -  2 [Mobile Chrome] › e2e\difficulty.spec.js:33:1 › difficulty tightens the timing window or increases object speed as score rises
  -  6 [Mobile Chrome] › e2e\character-select.spec.js:28:3 › role selection flow › choosing order starts the order path with order-specific prompt and movement

  6 skipped
```

说明：这不是状态断言通过；只是 T4 框架已落地，待 T3 完成后跳过条件会解除。

### `npx playwright test e2e/visual-quality.spec.js`

结果：预期红灯。18 个截图断言失败，原因是没有批准的快照基线；6 个 ending 截图测试跳过，原因是 T3 尚未暴露 `currentObject.t` 以脚本化推进到 ending。

```text
Running 24 tests using 7 workers

  18 failed
    [chromium] › e2e\visual-quality.spec.js:70:5 › visual quality gates at mobile-375 › title state screenshot and story text gate
    [chromium] › e2e\visual-quality.spec.js:79:5 › visual quality gates at mobile-375 › select state screenshot and role choice gate
    [chromium] › e2e\visual-quality.spec.js:88:5 › visual quality gates at mobile-375 › playing state screenshot and role difference gate
    [chromium] › e2e\visual-quality.spec.js:70:5 › visual quality gates at tablet-768 › title state screenshot and story text gate
    [chromium] › e2e\visual-quality.spec.js:79:5 › visual quality gates at tablet-768 › select state screenshot and role choice gate
    [chromium] › e2e\visual-quality.spec.js:88:5 › visual quality gates at tablet-768 › playing state screenshot and role difference gate
    [chromium] › e2e\visual-quality.spec.js:70:5 › visual quality gates at desktop-1280 › title state screenshot and story text gate
    [chromium] › e2e\visual-quality.spec.js:79:5 › visual quality gates at desktop-1280 › select state screenshot and role choice gate
    [chromium] › e2e\visual-quality.spec.js:88:5 › visual quality gates at desktop-1280 › playing state screenshot and role difference gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:70:5 › visual quality gates at mobile-375 › title state screenshot and story text gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:79:5 › visual quality gates at mobile-375 › select state screenshot and role choice gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:88:5 › visual quality gates at mobile-375 › playing state screenshot and role difference gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:70:5 › visual quality gates at tablet-768 › title state screenshot and story text gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:79:5 › visual quality gates at tablet-768 › select state screenshot and role choice gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:88:5 › visual quality gates at tablet-768 › playing state screenshot and role difference gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:70:5 › visual quality gates at desktop-1280 › title state screenshot and story text gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:79:5 › visual quality gates at desktop-1280 › select state screenshot and role choice gate
    [Mobile Chrome] › e2e\visual-quality.spec.js:88:5 › visual quality gates at desktop-1280 › playing state screenshot and role difference gate
  6 skipped
```

首个截图失败原文示例：

```text
Error: A snapshot doesn't exist at E:\OpenCode\Game_01\e2e\visual-quality.spec.js-snapshots\mobile-375-title-chromium-win32.png, writing actual.
```

## 未批准快照处理

Playwright 在失败时写出了本地 snapshot 文件。按 T4 要求，它们不是批准基线，已删除；最终确认 `e2e/visual-quality.spec.js-snapshots/*.png` 无残留。

## 结论

- T4 测试文件已创建。
- 规格中不再引用不存在的 e2e 文件。
- 视觉 QA 门禁已建立，但当前为预期红灯，不能声明视觉通过。
- 状态类细断言等待 T3 完成 testMode 契约后启用。
