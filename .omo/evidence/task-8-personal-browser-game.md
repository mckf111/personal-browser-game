# Task 8 - 发布链路验证报告

日期: 2026-06-23

## Build 产物结构

```
dist/
├── index.html          1832 B
├── manifest.json        288 B
└── assets/
    └── index-_CM00hC8.js  15036 B
```

- index.html 存在 ✅
- 资产使用相对路径 ✅
- 无绝对路径引用（`src="/"` / `href="/"` / `url(/`）✅

## GitHub Pages Workflow

- `.github/workflows/deploy.yml` 已写
- push 到 main 时自动 build → upload-pages-artifact → deploy-pages
- 使用 `actions/deploy-pages@v4`

## itch.io 文档

- `docs/publish-itchio.md` 已写
- 含完整步骤 + **勾选 Mobile friendly** 提醒
- 含 Butler 上传说明（可选）

## 测试文档

- `docs/how-to-test.md` 已含在线测部分：
  - GitHub Pages 临时分支
  - itch.io 草稿页

## Playwright 验证

- `npx playwright test`：EXIT=0 ✅
- webServer 自动启动 preview（端口 4173）
- 3 tests passed

## 结论

发布链路准备完成。
