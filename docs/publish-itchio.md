# itch.io 发布指南

## 打包步骤

1. **构建项目**
   ```powershell
   npx vite build
   ```

2. **检查产物**
   - 确认 `dist/index.html` 存在
   - 确认所有资源使用相对路径（`base: './'` 已配置）

3. **打 zip 包**
   ```powershell
   Compress-Archive -Path dist\* -DestinationPath dist.zip
   ```

4. **上传 itch.io**
   - 登录 https://itch.io
   - 新建项目 → 类型选择 **HTML**
   - 上传 `dist.zip`
   - **勾选 Mobile friendly**（重要！）
   - 嵌入方式：默认即可（iframe）
   - 设公开/草稿状态
   - 保存

## 注意事项

- **必须勾选 Mobile friendly**：否则 itch.io 不会为移动端优化显示
- 使用相对路径 `./`：vite.config.js 已配置 `base: './'`，兼容 itch.io 嵌入
- 文件大小：目前无外部资产，zip 应该 < 100KB
- 测试：上传后在 itch.io 点击 "Run game" 验证可玩性

## 用 Butler 上传（可选）

若已安装 butler：
```powershell
butler push dist.zip YOUR_ITCH_USERNAME/GAME_SLUG:html
```

需要 itch.io API key。
