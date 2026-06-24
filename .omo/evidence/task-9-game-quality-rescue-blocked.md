# T9  blocked: 外部玩测证据不足

## 状态

**质量救援计划 T9 — 外部真人玩测门禁：BLOCKED**

本项目不能通过质量认证，直到补齐外部玩测证据。

## 证据核查结果

### 救援版目录 `.omo/evidence/game-quality-rescue-playtest-raw/`

- 有效反馈文件：0 份（模板本身不计入）
- 移动端反馈：0 份
- 验证脚本输出：`FAIL`

### 历史目录 `.omo/evidence/task-6-playtest-raw/`

- `p0-author-feedback.md`：1 份（项目作者本人，P0）
- `feedback-template.md`：模板，不计入
- 无移动端记录（P0 使用 Windows 桌面浏览器）

**结论**：即使计入 P0 反馈，也仅有 1 份，且不是外部测试者、不含移动端。不满足救援计划要求。

## 救援计划要求（T9 验收标准）

1. 至少 3 份有效原始反馈（排除模板）。
2. 每份反馈必须包含完整 schema：玩家代号、日期、设备、浏览器、角色、时长、卡点、爽点、是否再玩（含原因）、原话摘录。
3. 至少 1 份来自手机/平板端。
4. 验证脚本 `node scripts/validate-playtest-raw.mjs <dir>` 必须输出 `PASS`。

## 已交付的 T9 产物

- `scripts/validate-playtest-raw.mjs`：验证脚本已就绪，可执行。
- `.omo/evidence/game-quality-rescue-playtest-raw/feedback-template.md`：已创建，含完整 schema。
- `docs/how-to-test.md`：已更新，含救援版玩测须知和验收标准。

## 解锁条件

1. 邀请至少 3 位外部测试者（非项目作者）试玩。
2. 确保至少 1 人使用手机或平板。
3. 按模板填写反馈，放入 `.omo/evidence/game-quality-rescue-playtest-raw/`。
4. 重新运行 `node scripts/validate-playtest-raw.mjs .omo/evidence/game-quality-rescue-playtest-raw`，确认 `PASS`。
5. 只有验证通过后，才能创建 `docs/playtest-rescue-001.md` 并进入 T10 最终质量认证。

## 红线确认

- R20：未编造任何玩测数据、反馈或引用。
- R21：未复制任何现有游戏内容。
- 项目状态保持诚实：GitHub Pages 上是线上原型，未通过质量门禁。

## 验证记录

- `npx vite build`：通过（docs 变更未破坏构建）。
- `node scripts/validate-playtest-raw.mjs`：2026-06-24 执行，输出 `FAIL`（见 `.omo/evidence/task-9-game-quality-rescue.md`）。
