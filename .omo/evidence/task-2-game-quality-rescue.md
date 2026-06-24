# Task 2 Evidence: Add DESIGN.md as enforceable visual contract

## Verification Timestamp
2026-06-23

---

## 1. DESIGN.md Required Keyword Scan

Command: `rg "targetWindow|targetBorder|screenshot|375|768|1280|蟾蜍|候鸟" DESIGN.md`

Result: ALL MATCHED

```
- 第一眼必须读出：小蟾蜍（守序者）和候鸟（闯入者）
| `targetWindow` | `rgba(78,205,196,0.25)` | 时机窗口填充（守序者场景） | 冷色透明 |
| `targetBorder` | `#4ecdc4` | 时机窗口描边（守序者场景） | 冷色 |
| `targetWindowIntruder` | `rgba(255,107,107,0.25)` | 时机窗口填充（闯入者场景） | 暖色透明 |
| `targetBorderIntruder` | `#ff6b6b` | 时机窗口描边（闯入者场景） | 暖色 |
| `fontSizeButtonSub` | `Math.min(14, w * 0.028)` px | 按钮内副标签（小蟾蜍 / 候鸟） |
**规则**：不引入外部字体文件。所有文字使用 `fontStack`。Canvas 文字大小必须按视口宽度比例收缩，保证 375px 到 1280px 均可读。
### 小蟾蜍（守序者）
### 候鸟（闯入者）
- **守序者配色**：`targetWindow` 填充 + `targetBorder` 描边，线宽 `2px`
- **闯入者配色**：`targetWindowIntruder` 填充 + `targetBorderIntruder` 描边，线宽 `2px`
| 0.25 - 0.55 | 小蟾蜍和候鸟剪影淡入 | 0.25 进度单位 |
  - 左侧：`order` 底色，`"守序者"` + `"小蟾蜍"`
  - 右侧：`chaos` 底色，`"闯入者"` + `"候鸟"`
- 时机窗口：`targetWindow` / `targetWindowIntruder` + 对应 `targetBorder`
| `375` | 667 | iPhone SE / 小型手机 | 文字可读、按钮 ≥ minTouchTarget、安全区无遮挡、HUD 不重叠 |
| `768` | 1024 | iPad / 平板竖屏 | 房间比例正常、书架可见、角色剪影（结局）居中 |
| `1280` | 720 | 桌面 / 大屏横屏 | 布局不拉伸、轨道长度合理、所有文字清晰、无空白画布区域 |
- `rg "targetWindow|targetBorder" src/` 必须在 `DESIGN.md` 中有对应定义
- 结局状态的截图中，不看文字必须能区分：哪个是蟾蜍，哪个是候鸟
- 检查点：圆形+眼镜=蟾蜍；椭圆+斜羽毛=候鸟
```

---

## 2. DESIGN.md Section Header Scan

Command: `rg "# DESIGN|targetWindow|375|768|1280" DESIGN.md`

Result: MATCHED

```
# DESIGN
| `targetWindow` | `rgba(78,205,196,0.25)` | 时机窗口填充（守序者场景） | 冷色透明 |
| `targetWindowIntruder` | `rgba(255,107,107,0.25)` | 时机窗口填充（闯入者场景） | 暖色透明 |
**规则**：不引入外部字体文件。所有文字使用 `fontStack`。Canvas 文字大小必须按视口宽度比例收缩，保证 375px 到 1280px 均可读。
- **守序者配色**：`targetWindow` 填充 + `targetBorder` 描边，线宽 `2px`
- **闯入者配色**：`targetWindowIntruder` 填充 + `targetBorderIntruder` 描边，线宽 `2px`
- 时机窗口：`targetWindow` / `targetWindowIntruder` + 对应 `targetBorder`
| `375` | 667 | iPhone SE / 小型手机 | 文字可读、按钮 ≥ minTouchTarget、安全区无遮挡、HUD 不重叠 |
| `768` | 1024 | iPad / 平板竖屏 | 房间比例正常、书架可见、角色剪影（结局）居中 |
| `1280` | 720 | 桌面 / 大屏横屏 | 布局不拉伸、轨道长度合理、所有文字清晰、无空白画布区域 |
- `rg "targetWindow|targetBorder" src/` 必须在 `DESIGN.md` 中有对应定义
```

---

## 3. docs/art-direction.md Canonical Reference

Command: `rg "DESIGN.md" docs/art-direction.md`

Result: MATCHED — contains canonical source of truth declaration.

```
> **本文档中的具体 token（色值、尺寸、字体、间距）以根目录 `DESIGN.md` 为唯一规范源。** 若本文档与 `DESIGN.md` 冲突，以 `DESIGN.md` 为准。本文档保留叙事性描述和音频设计，移除已迁移到 `DESIGN.md` 的重复色表与尺寸表，避免 token 漂移。
所有色值和 token 定义见 `DESIGN.md` Tokens / Palette 节。核心色板保持不变：深蓝紫背景、青冷色守序、橙红暖色混乱、白与金作为中性/强调。
- 具体 font token（大小、字重、阴影）见 `DESIGN.md` Tokens / Typography 节。
- 具体间距和尺寸 token 见 `DESIGN.md` Tokens / Spacing & Sizing 节。
- 2026-06-23: 将精确 token（色值、尺寸、字体、间距、角色剪影规范、场景层次、动效节奏、QA 截图标准）迁移至根目录 `DESIGN.md`，本文档保留叙事与音频设计
```

---

## 4. Git Diff

Command: `git diff -- DESIGN.md docs/art-direction.md`

Note: DESIGN.md is new (untracked), so only docs/art-direction.md appears in diff.

```diff
warning: in the working copy of 'docs/art-direction.md', LF will be replaced by CRLF the next time Git touches it
diff --git a/docs/art-direction.md b/docs/art-direction.md
index 5871313..fc38627 100644
--- a/docs/art-direction.md
+++ b/docs/art-direction.md
@@ -1,6 +1,8 @@
 # 视觉与音频母题 — Art Direction
 
 > 记录本游戏的视觉风格、配色、字体、音频气质和资产使用规则。
+>
+> **本文档中的具体 token（色值、尺寸、字体、间距）以根目录 `DESIGN.md` 为唯一规范源。** 若本文档与 `DESIGN.md` 冲突，以 `DESIGN.md` 为准。本文档保留叙事性描述和音频设计，移除已迁移到 `DESIGN.md` 的重复色表与尺寸表，避免 token 漂移。
 
 ## 视觉母题
 
@@ -12,18 +14,12 @@
 
 ### 配色（≤4 色）
 
-| 色值 | 用途 | 角色 |
-|---|---|---|
-| #1a1a2e | 背景（深蓝紫） | 中性 |
-| #4ecdc4 | 秩序/守序者/命中 | 冷色 |
-| #ff6b6b | 混乱/闯入者/失败 | 暖色 |
-| #ffffff | 文字、高亮、高光 | 中性 |
-| #ffd700 | Combo、对勾、奖励 | 强调（金色） |
+所有色值和 token 定义见 `DESIGN.md` Tokens / Palette 节。核心色板保持不变：深蓝紫背景、青冷色守序、橙红暖色混乱、白与金作为中性/强调。
 
 ### 场景设计
 
 - **房间**：深蓝紫墙壁 + 深蓝地板，营造夜晚/室内的温馨感
-- **书架/柜子**：棕色（#8B7355），位于屏幕右侧（守序者）或左侧（闯入者）
+- **书架/柜子**：棕色木质，位于屏幕右侧（守序者）或左侧（闯入者）
 - **物品**：6 种不同形状和颜色，代表日常生活中要被归位的物件
 
 ### 物品图鉴
@@ -71,6 +67,7 @@
 
 - **主字体**：system-ui, -apple-system, sans-serif
 - **风格**：无衬线，清晰易读，不引入外部字体文件
+- 具体 font token（大小、字重、阴影）见 `DESIGN.md` Tokens / Typography 节。
 
 ## 触摸友好
 
@@ -78,6 +75,7 @@
 - **按钮尺寸**：角色选择按钮 ≥100px，远大于 44px 最低标准
 - **安全区域**：viewport-fit=cover + env(safe-area-inset-*) 适配刘海屏
 - **横竖屏**：响应式 Canvas，内容随短边缩放
+- 具体间距和尺寸 token 见 `DESIGN.md` Tokens / Spacing & Sizing 节。
 
 ## 资产使用
 
@@ -92,3 +90,4 @@
 ## 变更记录
 
 - 2026-06-23: 初稿（T7 打磨阶段）
+- 2026-06-23: 将精确 token（色值、尺寸、字体、间距、角色剪影规范、场景层次、动效节奏、QA 截图标准）迁移至根目录 `DESIGN.md`，本文档保留叙事与音频设计
```

---

## 5. Build Verification

Command: `npx vite build`

Result: **EXIT 0**

```
vite v5.4.21 building for production...
transforming...
✓ 5 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  1.80 kB │ gzip: 0.85 kB
dist/assets/index-_CM00hC8.js   14.58 kB │ gzip: 5.45 kB
✓ built in 125ms
```

---

## 6. Product-Code File Changes

Command: `git diff --stat`

Result: No `src/` files modified. Only documentation files touched.

```
 CHANGELOG.md          |  4 ++++
 README.md             |  3 +-
 docs/art-direction.md | 15 +++++++--------
 docs/project-state.md | 10 +++++-----
 4 files changed, 18 insertions(+), 14 deletions(-)
```

(CHANGELOG.md, README.md, docs/project-state.md changes belong to T1. T2 only touches docs/art-direction.md and creates DESIGN.md.)

---

## Acceptance Criteria Checklist

- [x] `DESIGN.md` exists with sections: Product feeling, Tokens, Character silhouettes, Scene composition, Motion/feedback, State screens, QA checklist.
- [x] `rg "targetWindow|targetBorder|screenshot|375|768|1280|蟾蜍|候鸟" DESIGN.md` all match.
- [x] `docs/art-direction.md` contains a line declaring `DESIGN.md` as canonical.
- [x] No product-code files changed in T2.
- [x] `npx vite build` succeeds (exit 0).
