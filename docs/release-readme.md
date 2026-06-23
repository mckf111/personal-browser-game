# 守序者与闯入者 — 发布说明

## 版本

v0.1.0 — 首款可玩原型

## 这是什么

一款单键时机的个人风格浏览器小游戏。选一个角色进入：
- **守序者（小蟾蜍）**：把变乱的东西归位
- **闯入者（候鸟）**：别打乱想融入整齐世界

热闹夸张滑稽的外皮下，是两个不搭界生命偶然相遇、互相理解的温馨。

## 技术栈

- 原生 HTML5 Canvas + JavaScript (ES2022+)
- Vite（构建工具）
- Web Audio API（音效合成）
- Vitest + Playwright（测试）

## 部署方式

### GitHub Pages

1. 将本项目推送到 GitHub 仓库 main 分支
2. `.github/workflows/deploy.yml` 会自动部署 dist/ 到 GitHub Pages
3. 访问 `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### itch.io

1. 解压 `task-9-dist.zip`
2. 登录 itch.io → 新建项目 → 类型选 HTML
3. 上传 zip 内的文件
4. **勾选 Mobile friendly**
5. 保存并发布

详见 [docs/publish-itchio.md](docs/publish-itchio.md)。

## 验证

```powershell
# 构建
npx vite build

# 单测
npx vitest run

# 运行时验证
npm run test:e2e
```

## 资产

- 所有图形：Canvas 2D 代码绘制
- 所有音效：Web Audio API 合成
- 零外部图片/音频/字体资产

## 当前状态

- [x] 核心时机判定 + Combo 系统
- [x] 双角色路径 + 结局画面
- [x] Web Audio 节拍 + 音效
- [x] 响应式 Canvas + PWA
- [x] 移动端触摸支持
- [x] Playwright 运行时验证

## 待办（需用户提供）

- [ ] GitHub 仓库 URL（用于 Pages 部署）
- [ ] gh auth 登录状态
- [ ] itch.io 账号（用于 itch.io 发布）

## 文件清单

- `index.html` — 入口
- `assets/index-xxx.js` — 游戏代码（含 Canvas 渲染、音频、状态机）
- `manifest.json` — PWA 配置

---

生成日期：2026-06-23
