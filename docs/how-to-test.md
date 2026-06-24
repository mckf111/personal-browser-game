# 怎么测

## 本机测

```powershell
npm install
npx vite
```

浏览器打开 http://localhost:5173

改代码后页面自动刷新，所见即所得。

## 局域网手机测

```powershell
npx vite --host
```

终端会输出 Network 地址，例如：

```
Network: http://192.168.x.x:5173
```

确保手机和电脑在同一 Wi-Fi 下，手机浏览器打开该地址即可。

## 在线给别人测

### GitHub Pages 原型

当前线上原型地址（质量救援通过前不视为 publish-ready）：
https://mckf111.github.io/personal-browser-game/

直接把链接发给测试者即可，支持手机/电脑浏览器打开。

### itch.io 草稿页（质量救援通过后使用）

1. `npx vite build` 生成 dist/
2. 把 dist/ 打 zip
3. itch.io 新建 HTML Game → 上传 zip
4. **勾选 Mobile friendly**
5. 设为草稿/不公开 → 只有拿到链接的人能玩

详见 [docs/publish-itchio.md](publish-itchio.md)。

## 质量救援版玩测须知

### 测试前

1. 确认测试者知道这是浏览器小游戏，不需要安装 App。
2. 至少邀请 3 位外部测试者（非项目作者）。
3. 其中至少 1 位必须使用手机或平板试玩。

### 测试中

1. 不要给测试者讲解玩法，让他们自己摸索。
2. 观察并记录：
   - 他们选了哪个角色？
   - 多久明白要干什么？
   - 哪里卡住或困惑？
   - 哪里笑了或表现出满足？
3. 记录原话，不要加工。

### 测试后

1. 让测试者回答："愿意再玩一次吗？" 并追问原因。
2. 把反馈复制到 `.omo/evidence/game-quality-rescue-playtest-raw/feedback-template.md` 模板中，每份反馈一个文件。
3. 运行验证脚本确认格式合规：

```powershell
node scripts/validate-playtest-raw.mjs .omo/evidence/game-quality-rescue-playtest-raw
```

### 验收标准

- 至少 3 份有效反馈（不含模板本身）。
- 每份反馈必须包含：玩家代号、日期、设备、浏览器、角色、时长、卡点、爽点、是否再玩（含原因）、原话摘录。
- 至少 1 份来自手机/平板端。
- 验证脚本必须输出 `PASS`。

如果数量不足或缺少移动端，项目质量门禁标记为 blocked，直到补齐证据。
