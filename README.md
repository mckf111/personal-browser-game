# 守序者与闯入者

一款单键时机的个人风格浏览器小游戏。选一个角色进入世界：守序者把变乱的东西归位，闯入者别打乱想融入。热闹夸张滑稽的外皮下，是两个不搭界生命偶然相遇、互相理解的温馨。

## 当前状态

- 项目类型：Web 浏览器游戏
- 主要产物：可在线玩的 HTML5 游戏
- 当前阶段：prototype（灰盒原型阶段）
- 默认分支：main

更多交接信息见 [docs/project-state.md](docs/project-state.md)。

## 架构

架构边界、目录职责和核心数据流见 [docs/architecture.md](docs/architecture.md)。

关键接口、数据结构和模块契约见 [docs/interfaces.md](docs/interfaces.md)。

## 本地运行

```powershell
npm install
npx vite
```

## 验证

最快可信验证：

```powershell
npx vite build; if ($?) { npx vitest run }
```

完整检查：

```powershell
npm run test:e2e
```

## 项目宪法

- [AGENTS.md](AGENTS.md)：所有 agent 必读的最高规则源
- [.vibe-starter-gpt.json](.vibe-starter-gpt.json)：宪法版本和安装元信息
- [docs/project-state.md](docs/project-state.md)：当前状态和跨 agent 交接
- [docs/architecture.md](docs/architecture.md)：架构与目录职责
- [docs/interfaces.md](docs/interfaces.md)：接口和契约
- [docs/debt.md](docs/debt.md)：技术债和临时方案
- [docs/decisions/](docs/decisions/)：ADR 决策记录
- [CHANGELOG.md](CHANGELOG.md)：用户可见变化

## 环境变量

N/A（本项目无环境变量需求）
