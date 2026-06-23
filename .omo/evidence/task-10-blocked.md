# Task 10 - 发布状态

日期: 2026-06-23
状态: **BLOCKED** — 缺少用户凭证

## 已完成（agent 可执行部分）

- [x] publish-ready 包：`.omo/evidence/task-9-dist.zip`
- [x] 发布说明：`docs/release-readme.md`
- [x] GitHub Pages workflow：`.github/workflows/deploy.yml`
- [x] itch.io 打包说明：`docs/publish-itchio.md`
- [x] 构建产物验证：无绝对路径引用
- [x] Playwright 运行时验证通过

## 阻塞原因

T10 为 human-credential gate，需要用户提供：

1. **GitHub 仓库 URL**
   - 用于 push 代码触发 deploy workflow
   - 用于 GitHub Pages 部署

2. **gh auth 登录状态**
   - 本地需 `gh auth login` 完成认证
   - 用于推送代码到 GitHub

3. **itch.io 账号**
   - 用于上传 dist.zip 到 itch.io
   - 可选：itch.io API key（用于 butler 上传）

## 当前交付物

- **publish-ready 包**：`.omo/evidence/task-9-dist.zip`
  - 解压后含 `index.html` + `manifest.json` + `assets/index-xxx.js`
  - 相对路径，兼容 GitHub Pages 子路径和 itch.io 嵌入

- **部署步骤**：见 `docs/release-readme.md`

## 待用户操作

1. 提供 GitHub 仓库 URL（或创建新仓库）
2. 运行 `gh auth login` 完成认证
3. 提供 itch.io 账号（或自行上传 dist.zip）

## Fallback

凭证缺失期间：
- 项目保持 publish-ready 状态
- 不宣称已发布
- 不写入 release commit
- 用户随时可提供凭证继续 T10

## 验证（凭证齐备后执行）

```powershell
# 预检
gh auth status

# 推送到 GitHub
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# 等待 GitHub Pages 部署完成，验证 URL
# 打开 https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
# Playwright 验证：canvas 加载 + 单键输入 + 无 console error

# itch.io
# 按 docs/publish-itchio.md 步骤上传
# 验证 itch.io URL 可加载
```
