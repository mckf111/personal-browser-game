# DESIGN

> 视觉设计系统硬契约。所有 Canvas 绘制、CSS、HTML meta 和截图 QA 必须追踪到本文档的具名 token。本文档取代任何其他文件中的重复或冲突色值、尺寸、字体声明。

## 产品气质

热闹夸张滑稽的玩具剧场，内核是两个不搭界生命互相理解的温馨。画面像一本会动的故事书，不是抽象几何测试场。

- 第一眼必须读出：小蟾蜍（守序者）和候鸟（闯入者）
- 房间必须有层次：墙壁、地板、家具、物件、角色
- 单键时机不是轨道和方块，而是“把东西归位”或“别打乱想融入”的事件

---

## Tokens

### Palette

| Token | Hex | 用途 | 角色 |
|---|---|---|---|
| `bg` | `#1a1a2e` | 全局背景、HTML body、未加载时的遮罩 | 中性 |
| `wall` | `#16213e` | 房间墙壁 | 中性 |
| `floor` | `#0f3460` | 房间地板 | 中性 |
| `order` | `#4ecdc4` | 守序者主色、命中反馈、冷色装饰 | 冷色 |
| `chaos` | `#ff6b6b` | 闯入者主色、失败反馈、暖色装饰 | 暖色 |
| `white` | `#ffffff` | 文字、高亮、高光、眼镜框 | 中性 |
| `gold` | `#ffd700` | Combo、对勾、奖励、尺子、递东西连线 | 强调 |
| `shelf` | `#8B7355` | 书架/柜子/桌子主体 | 中性（木质） |
| `targetWindow` | `rgba(78,205,196,0.25)` | 时机窗口填充（守序者场景） | 冷色透明 |
| `targetBorder` | `#4ecdc4` | 时机窗口描边（守序者场景） | 冷色 |
| `targetWindowIntruder` | `rgba(255,107,107,0.25)` | 时机窗口填充（闯入者场景） | 暖色透明 |
| `targetBorderIntruder` | `#ff6b6b` | 时机窗口描边（闯入者场景） | 暖色 |
| `furnitureShadow` | `rgba(0,0,0,0.2)` | 家具层板阴影、书架分层线 | 中性 |
| `wallDetail` | `rgba(255,255,255,0.1)` | 墙壁装饰线、简单家具轮廓（标题状态） | 中性 |
| `textPrimary` | `#ffffff` | 主标题、按钮文字、得分 | 中性 |
| `textSecondary` | `rgba(255,255,255,0.7)` | 副标题、提示语、角色说明 | 中性 |
| `textMuted` | `rgba(255,255,255,0.5)` | 底部小字、额外提示 | 中性 |
| `themeColor` | `#1a1a2e` | HTML meta theme-color，必须与 `bg` 一致 | 中性 |

**规则**：任何新增视觉常量必须先在此表注册 token 名和 hex，再在代码中引用 token 名。禁止内联裸色值。

### Typography

| Token | 值 | 用途 |
|---|---|---|
| `fontStack` | `system-ui, -apple-system, sans-serif` | 所有 UI 和 Canvas 文字 |
| `fontSizeTitle` | `Math.min(48, w * 0.08)` px | 标题状态主标题 |
| `fontSizeSelectTitle` | `Math.min(32, w * 0.06)` px | 角色选择标题 |
| `fontSizeButtonLabel` | `Math.min(22, w * 0.045)` px | 按钮内主标签 |
| `fontSizeButtonSub` | `Math.min(14, w * 0.028)` px | 按钮内副标签（小蟾蜍 / 候鸟） |
| `fontSizeBody` | `Math.min(18, w * 0.035)` px | 正文提示 |
| `fontSizeSmall` | `Math.min(14, w * 0.028)` px 或 14 px | 底部小字、得分统计 |
| `fontSizeHud` | `24px` | HUD 分数显示（CSS 层） |
| `fontWeightTitle` | `bold` | 所有标题和按钮主标签 |
| `fontWeightBody` | `normal` | 正文和说明 |
| `textShadowHud` | `0 1px 2px rgba(0,0,0,0.5)` | HUD 文字投影 |

**规则**：不引入外部字体文件。所有文字使用 `fontStack`。Canvas 文字大小必须按视口宽度比例收缩，保证 375px 到 1280px 均可读。

### Spacing & Sizing

| Token | 值 | 用途 |
|---|---|---|
| `safeAreaTop` | `env(safe-area-inset-top)` | 刘海屏顶部安全区 |
| `safeAreaRight` | `env(safe-area-inset-right)` | 右侧安全区 |
| `safeAreaBottom` | `env(safe-area-inset-bottom)` | 底部安全区 |
| `safeAreaLeft` | `env(safe-area-inset-left)` | 左侧安全区 |
| `hudPadding` | `12px` | HUD 文字内边距 |
| `trackMarginH` | `w * 0.08` | 轨道左右边距 |
| `trackY` | `h * 0.5` | 轨道垂直中心（游玩状态） |
| `roomWallH` | `h * 0.65` | 墙壁占画面高度比例（游玩/结局） |
| `roomFloorH` | `h * 0.35` | 地板占画面高度比例（游玩/结局） |
| `titleWallH` | `h * 0.7` | 标题状态墙壁比例 |
| `titleFloorH` | `h * 0.3` | 标题状态地板比例 |
| `buttonMinW` | `220px` | 角色选择按钮最大基准宽 |
| `buttonH` | `100px` | 角色选择按钮高 |
| `buttonGap` | `30px` | 角色选择按钮间距 |
| `buttonRadius` | `12px` | 按钮圆角 |
| `minTouchTarget` | `100px` | 最小触摸目标（远大于 44px 标准） |
| `particleGravity` | `0.1` | 粒子重力加速度（每帧 vy 增量） |
| `failGravity` | `0.15` | 失败物品掉落重力 |
| `shelfW` | `w * 0.12` | 书架宽度 |
| `shelfH` | `h * 0.35` | 书架高度（标题状态 `h * 0.35`） |
| `shelfLayers` | `3` | 书架层板数量 |
| `layerThickness` | `3px` | 书架层板厚度 |

### Audio

| Token | 值 | 用途 |
|---|---|---|
| `audioHitOrderBase` | `440` Hz | 守序者命中基础频率，sine |
| `audioHitChaosBase` | `330` Hz | 闯入者命中基础频率，sine |
| `audioHitComboStep` | `50` / `40` Hz | 每 combo 频率增量（order/chaos） |
| `audioHitDuration` | `0.15` s | 命中音持续 |
| `audioHitHarmonicMult` | `1.5` | 命中和声倍频（50ms 延迟） |
| `audioFailOrderFreq` | `150` Hz | 守序者失败基础频率，sawtooth |
| `audioFailChaosFreq` | `120` Hz | 闯入者失败基础频率，sawtooth |
| `audioFailDuration` | `0.3` s | 失败音持续 |
| `audioNearMissFreq` | `300` Hz | 差一点提示音，triangle |
| `audioNearMissDuration` | `0.05` s | 差一点音持续 |
| `audioBeatFreq` | `200` Hz | 节拍提示音，sine |
| `audioBeatDuration` | `0.05` s | 节拍音持续 |
| `audioEndingOrder` | `[523.25, 659.25, 783.99, 1046.50]` Hz | 守序者结局旋律（C5 E5 G5 C6） |
| `audioEndingChaos` | `[329.63, 392.00, 493.88, 659.25]` Hz | 闯入者结局旋律（E4 G4 B4 E5） |
| `audioEndingNoteDur` | `0.125` s | 结局旋律每音持续 |
| `audioVolumeHit` | `0.25` | 命中音量 |
| `audioVolumeFail` | `0.15` | 失败音量 |
| `audioVolumeNearMiss` | `0.12` | 差一点音量 |
| `audioVolumeBeat` | `0.08` | 节拍音量 |
| `audioVolumeEnding` | `0.2` | 结局旋律音量 |

**规则**：音频系统使用 Web Audio API 纯合成，不引入外部音频文件。音频初始化仅在用户手势（pointerdown）后触发。所有音频调用记录到 `audioLog` 数组供 testMode 验证。

---

## Character Silhouettes

必须在 Canvas 2D 纯代码绘制下做到“第一眼可读”：不看文字标签也能认出动物类型和角色气质。

### 小蟾蜍（守序者）

- **身体**：圆形，`arc(cx - 50, cy, 25)`，填充 `order`
- **眼镜**：两个白色小方块，`fillRect(cx - 62, cy - 6, 10, 10)` 和 `fillRect(cx - 48, cy - 6, 10, 10)`，填充 `white`
- **道具（尺子）**：细长金色矩形，`fillRect(cx - 85, cy + 15, 35, 3)`，填充 `gold`
- **气质要点**：几何感、对称、方正眼镜、手持精确工具

### 候鸟（闯入者）

- **身体**：椭圆，`ellipse(cx + 50, cy, 22, 18)`，填充 `chaos`
- **羽毛**：3 根斜线，`moveTo(cx + 68 + i * 6, cy - 8)` 到 `lineTo(cx + 72 + i * 6, cy + 12)`，描边 `chaos`，线宽 `2px`
- **气质要点**：流线型、不规则、向上扬起的羽毛、有机动态

### 绘制规则

1. 不使用外部图片、Sprite Sheet、或 SVG 嵌入。
2. 所有形状用 `arc`、`ellipse`、`fillRect`、`stroke` 组合。
3. 角色必须与其他图层有明确遮挡关系（房间背景 -> 家具 -> 角色 -> 前景 HUD）。

---

## Scene Composition

单房间原则：只有一个房间，通过家具位置和配色区分守序者/闯入者视角。

### Layer 顺序（从底到顶）

1. **Background**: `bg` 清屏
2. **Wall**: `wall` 填充上半部分（`roomWallH`）
3. **Floor**: `floor` 填充下半部分（`roomFloorH`）
4. **Furniture**: 书架/桌子/柜子（`shelf` + `furnitureShadow` 层板）
5. **Props**: 物品在轨道上的运动和静止状态
6. **Characters**: 仅在结局状态出现；游玩状态角色通过轨道配色和 HUD 文案暗示
7. **HUD / Feedback**: 分数、提示文字、浮动文字、粒子

### 书架规则

- **守序者**：书架在屏幕右侧（`trackRight - shelfW`），物品需要归位到右侧
- **闯入者**：书架在屏幕左侧（`trackLeft`），物品需要融入左侧整齐排列
- **层板**：3 条水平线，间隔均匀，用 `furnitureShadow` 色

### 物品（Props）

| 名称 | 形状 | 尺寸 | 代表意象 | 绘制方式 |
|---|---|---|---|---|
| 书 | 矩形 | 18 x 24 | 知识/秩序 | `fillRect` |
| 杯子 | 圆形 | r = 10 | 日常/温暖 | `arc` + `fill` |
| 袜子 | 矩形 | 12 x 16 | 琐碎/凌乱 | `fillRect` |
| 相框 | 矩形 | 20 x 20 | 记忆/珍贵 | `fillRect`（可加细边框） |
| 花瓶 | 圆形 | r = 8 | 美感/易碎 | `arc` + `fill` |
| 闹钟 | 圆形 | r = 12 | 时间/精确 | `arc` + `fill`（可加指针线） |

**配色**：物品使用 `itemColors` 数组（`#e74c3c`, `#3498db`, `#f39c12`, `#9b59b6`, `#1abc9c`, `#e67e22`），按生成索引循环。

---

## Motion / Feedback

### 时机窗口（Target Window）

- **形状**：矩形，高 `56px`，宽 `halfPx * 2`
- **守序者配色**：`targetWindow` 填充 + `targetBorder` 描边，线宽 `2px`
- **闯入者配色**：`targetWindowIntruder` 填充 + `targetBorderIntruder` 描边，线宽 `2px`
- **中心标记**：`white` 垂直线，宽 `2px`，高 `64px`，透明度 `0.6`
- **节拍提示**：目标处闪烁圆环，`arc(targetX, trackY, halfPx + 5 + pulse, 0, Math.PI * 2)`，描边 `rgba(255,255,255,0.3~0.6)`，线宽 `1px`

### 命中反馈

- **金色粒子爆炸**：从命中点向外散射 8-12 个粒子，初速度随机，受 `particleGravity` 影响
- **对勾**：白色对勾符号或文字 "+10"
- **浮动文字**：`"+10"` 或 `"3x COMBO!"`，向上飘动，生命周期约 60 帧
- **挤压/拉伸**：命中瞬间 `squashX=1.3, squashY=0.7`（横向压扁），每帧线性回弹至 1.0
- **反馈文字持续**：`feedbackTimer=36` 帧（0.6s @ 60fps）
- **音频**：高音 "叮"，sine, 440Hz + combo*50, 0.15s；连击加五度和声

### 失败反馈

- **物品飞走**：`failAnim` 激活，受 `failGravity` 下落，旋转 `+0.05` 弧度/帧
- **粒子散射**：暖红色粒子向外扩散
- **浮动文字**：`"错过了!东西飘走了!"`，颜色 `chaos`
- **挤压/拉伸**：失败瞬间 `squashX=0.7, squashY=1.3`（纵向拉长），每帧线性回弹至 1.0
- **反馈文字持续**：`feedbackTimer=60` 帧（1.0s @ 60fps）；差一点 `feedbackTimer=24` 帧（0.4s）
- **音频**：低音 "哐"，sawtooth, 150Hz, 0.3s + 沉闷 "嗡" square 100Hz 0.2s

### 预备挤压（Anticipation Squash）

- **触发条件**：物品进入目标窗口 2.4 倍半宽范围内（`anticipationActive`）
- **效果**：纵向轻微压缩 `squashY = 1 - intensity * 0.12`，横向轻微膨胀 `squashX = 1 + intensity * 0.08`
- **回弹**：每帧以 0.2 系数向目标值插值；离开窗口后以 0.15 系数回弹至 1.0

### 节拍提示

- **周期**：每 30 帧轻 "嗒" 一次（sine, 200Hz, 0.05s, 低音量）
- **视觉**：目标位置圆环脉冲（见时机窗口）

### 结局动画节奏

| 进度段 | 内容 | 淡入时长 |
|---|---|---|
| 0.00 - 0.10 | 房间背景 | 即时 |
| 0.10 - 0.25 | 标题 "他们相遇了" | 0.2 进度单位 |
| 0.25 - 0.55 | 小蟾蜍和候鸟剪影淡入 | 0.25 进度单位 |
| 0.55 - 0.75 | 递东西连线 + 文案 | 0.2 进度单位 |
| 0.75 - 0.90 | 沙发 + 引语 | 0.15 进度单位 |
| 0.90 - 1.00 | 得分统计 + 重开提示 | 0.1 进度单位 |

- `endingTimer` 上限 `240` 帧，progress = `endingTimer / 240`
- 所有淡入使用 `globalAlpha` 或 `rgba` alpha 线性插值
- **结局旋律**：进入结局状态时播放角色专属 4 音上行旋律，0.5s 总时长
  - 守序者：C5-E5-G5-C6（523.25, 659.25, 783.99, 1046.50 Hz），明亮上行
  - 闯入者：E4-G4-B4-E5（329.63, 392.00, 493.88, 659.25 Hz），温暖上行
  - 每音 0.125s，sine 波，音量 0.2

---

## State Screens

每个状态必须有明确的视觉区分，Playwright 截图 QA 覆盖以下四个状态。

### Title（标题）

- 背景：`wall` 占 `titleWallH`，`floor` 占 `titleFloorH`
- 装饰：简单家具轮廓线（`wallDetail`），书架和桌子
- 主标题：`"守序者与闯入者"`，`fontSizeTitle`，`textPrimary`
- 副标题：`"按空格或点击屏幕"`，`fontSizeBody`，`textSecondary`
- 底部小字：游戏说明和提示，`fontSizeSmall`，`textMuted`

### Select（角色选择）

- 背景：纯色 `bg`（或后续迭代加入房间背景）
- 标题：`"选择你的角色"`，`fontSizeSelectTitle`
- 两个按钮：
  - 左侧：`order` 底色，`"守序者"` + `"小蟾蜍"`
  - 右侧：`chaos` 底色，`"闯入者"` + `"候鸟"`
- 按钮尺寸：`buttonMinW` x `buttonH`，圆角 `buttonRadius`，间距 `buttonGap`
- 说明文字：两行角色描述 + 核心玩法提示，`textSecondary` / `textMuted`

### Playing（游玩）

- 房间背景：`wall` + `floor`
- 书架：根据角色在左或右侧
- 轨道：物品从 `startT` 移动到 `targetT`
- 时机窗口：`targetWindow` / `targetWindowIntruder` + 对应 `targetBorder`
- HUD：`score-display` 在左上角，`hint-text` 在底部
- 反馈层：粒子、浮动文字、节拍圆环

### Ending（结局）

- 房间背景：`wall` + `floor` + 右侧书架
- 渐进淡入：标题 -> 角色剪影 -> 递东西 -> 引语 -> 得分
- 引语：`"理解是一种归位"`，斜体，`textPrimary`
- 沙发：`shelf` 色半透明矩形，底部

---

## QA Checklist

### Screenshot 门禁

必须在以下视口宽度捕获 Playwright 截图，覆盖 title、select、playing、ending 四个状态。

| 宽度 | 高度 | 设备代表 | 验收重点 |
|---|---|---|---|
| `375` | 667 | iPhone SE / 小型手机 | 文字可读、按钮 ≥ minTouchTarget、安全区无遮挡、HUD 不重叠 |
| `768` | 1024 | iPad / 平板竖屏 | 房间比例正常、书架可见、角色剪影（结局）居中 |
| `1280` | 720 | 桌面 / 大屏横屏 | 布局不拉伸、轨道长度合理、所有文字清晰、无空白画布区域 |

### Token 完整性扫描

- `rg "targetWindow|targetBorder" src/` 必须在 `DESIGN.md` 中有对应定义
- `rg "rgba\(" src/main.js` 中出现的裸 rgba 值必须在 `DESIGN.md` 注册为 token
- `theme-color` meta 值必须等于 `themeColor` token

### 角色可读性扫描

- 结局状态的截图中，不看文字必须能区分：哪个是蟾蜍，哪个是候鸟
- 检查点：圆形+眼镜=蟾蜍；椭圆+斜羽毛=候鸟

### 状态完整性扫描

- title：必须有 `"守序者与闯入者"` 文字 + 房间背景层
- select：必须有两个颜色分明的按钮 + 角色名
- playing：必须有轨道、物品、时机窗口、HUD
- ending：必须有角色剪影 + 引语 + 得分

---

## 变更规则

1. 新增 token 必须先在此文档注册，再在代码/CSS 中引用 token 名。
2. 修改 hex 值属于设计决策变更，须同步更新截图基线。
3. 本文件为 `docs/art-direction.md` 的上位规范；若冲突，以本文档为准。
