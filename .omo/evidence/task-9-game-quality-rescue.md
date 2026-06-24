# T9 执行记录：外部玩测门禁与验证

## 任务

执行游戏质量救援计划 T9：外部真人玩测门禁和有限迭代验证。

## 已执行步骤

1. **检查现有证据**
   - `.omo/evidence/game-quality-rescue-playtest-raw/`：不存在，新建。
   - `.omo/evidence/task-6-playtest-raw/`：存在 `p0-author-feedback.md`（P0，作者本人）和 `feedback-template.md`。
   - P0 反馈不满足救援计划要求：仅 1 份、非外部测试者、无移动端。

2. **更新测试指南**
   - 文件：`docs/how-to-test.md`
   - 新增：GitHub Pages 原型地址、质量救援版玩测须知、测试前/中/后步骤、验收标准。

3. **创建反馈模板**
   - 文件：`.omo/evidence/game-quality-rescue-playtest-raw/feedback-template.md`
   - 包含完整 schema：玩家代号、日期、设备、浏览器、角色、时长、卡点、爽点、是否再玩（含原因）、原话摘录。
   - 明确声明：agent 不得代填或生成内容；模板本身不计入有效反馈。

4. **创建验证脚本**
   - 文件：`scripts/validate-playtest-raw.mjs`
   - 功能：
     - 扫描目录下所有 `.md` 文件。
     - 排除 `template`、`readme`、`index`、`example` 文件。
     - 检查每份反馈是否包含全部 schema 标签（中英双语匹配）。
     - 检查是否至少 1 份反馈包含移动端标识（mobile / iPhone / Android / iOS / iPad / 三星 / xiaomi 等）。
     - 输出逐文件结果和汇总。
     - 退出码：0 = PASS，1 = FAIL。

5. **运行验证**

```
Directory: .omo/evidence/game-quality-rescue-playtest-raw
Total markdown files: 1
Excluding templates/readmes: 0

=== Summary ===
Valid raw files (excluding template): 0
Files passing all schema labels:     0
Files with mobile indicator:          0

RESULT: FAIL — quality approval is blocked.
  Reason: need at least 3 raw files, found 0.
  Reason: no file indicates a mobile device/browser.
```

6. **运行构建**

```
vite v5.4.21 building for production...
transforming...
✓ 5 modules transformed
rendering chunks...
computing gzip size...
dist/index.html                 1.89 kB │ gzip: 0.95 kB
dist/assets/index-_CM00hC8.js  14.58 kB │ gzip: 5.45 kB
✓ built in 159ms
```

构建通过，docs 变更未破坏产物。

7. **生成 blocked 文件**
   - 文件：`.omo/evidence/task-9-game-quality-rescue-blocked.md`
   - 原因：有效反馈 0 份，不满足 >=3 份且 >=1 移动端的要求。

## 结论

- **T9 产物**：验证脚本、反馈模板、测试指南均已就绪。
- **T9 门禁**：BLOCKED。未生成 `docs/playtest-rescue-001.md`。
- **解锁条件**：收集至少 3 份外部测试者反馈（含 1 份移动端），重新运行验证脚本直到 `PASS`。
- **未违反红线**：未编造任何玩测数据、未声称质量通过、未修改产品代码。
