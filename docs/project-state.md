# Project State

> 给下一位 agent 的交接摘要。任何 agent 接手项目时，读完 `AGENTS.md` 后必须读这里。

## 当前状态

- 项目：守序者与闯入者
- 阶段：**published**（GitHub Pages 已上线，itch.io 待上传）
- 当前目标：项目已可玩，等待用户 itch.io 上传
- 最近一次更新：2026-06-23
- 当前维护者 / 决策人：用户

## 已完成

- T1 仓库体检：git main、node v24.14.0 / npm 11.9.0、网络可达
- T2 宪法骨架：vibe-starter-GPT（pin SHA: 12ae3d50）+ ADR-0001 + git init
- T3 脚手架：Vite vanilla + Canvas + 双输入 + 响应式 + PWA
- T4 游戏 spec：已冻结（1A/2B/3A），specs/active/single-button-timing.md
- T5 灰盒原型：judgeTiming 纯函数 + 角色选择 + 核心循环 + 难度递增 + 结局
- T6 玩测迭代：收到 P0 反馈，迭代 Combo 系统、Web Audio 节拍、视觉意象、失败戏剧化
- T7 打磨味道：art-direction.md、配色≤4色、触摸友好、粒子动效
- T8 发布链路：deploy.yml + publish-itchio.md + how-to-test.md
- T9 publish-ready 包：task-9-dist.zip + release-readme.md

## 验证状态

- 最快可信验证：`npx vite build; if ($?) { npx vitest run }` ✅
- 最近验证结果：T9 全部通过（build + vitest + playwright）
- 构建产物：dist/index.html + manifest.json + assets/index-xxx.js
- 路径扫描：无绝对路径引用 ✅

## 已完成（T10）

- GitHub Pages 已发布：https://mckf111.github.io/personal-browser-game/
- GitHub Actions 自动部署成功
- Playwright 远程验证通过

## 待办

- itch.io 手动上传（按 docs/publish-itchio.md 步骤）
  - publish-ready 包：.omo/evidence/task-9-dist.zip

## 技术栈

- 原生 HTML5 Canvas + JavaScript (ES2022+)
- Vite（base: './'）
- Vitest + Playwright
- Web Audio API（音效合成）
- 零外部游戏引擎 / 零外部图片音频资产

## 项目结构

```
src/
  main.js           — 游戏主循环（渲染+输入+音频+状态机）
  main.test.js      — Vitest 单测（judgeTiming）
  game/
    timing.js       — 时机判定纯函数
    timing.test.js  — 时机判定单测
e2e/
  game.spec.js      — Playwright 运行时验证
docs/
  art-direction.md  — 视觉/音频母题
  release-readme.md — 发布说明
  publish-itchio.md — itch.io 发布指南
  how-to-test.md    — 测试指南
specs/active/
  single-button-timing.md — 游戏设计 spec（已冻结）
.omo/evidence/
  task-9-dist.zip   — publish-ready 包
```

## 交接注意

- `.omo/` 目录含规划与审查证据，不要删除
- 宪法骨架已装入，AGENTS.md 为最高规则源
- 运行 `npx vite` 即可本地试玩
- 线上版本：https://mckf111.github.io/personal-browser-game/
- itch.io 待上传：按 docs/publish-itchio.md 步骤，使用 .omo/evidence/task-9-dist.zip
