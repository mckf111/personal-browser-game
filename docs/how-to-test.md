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

### GitHub Pages 临时分支

推一个分支到 GitHub，若已配置 deploy workflow，GitHub 会自动生成公开链接。任何人用手机/电脑都能打开。

### itch.io 草稿页

1. `npx vite build` 生成 dist/
2. 把 dist/ 打 zip
3. itch.io 新建 HTML Game → 上传 zip
4. **勾选 Mobile friendly**
5. 设为草稿/不公开 → 只有拿到链接的人能玩

详见 [docs/publish-itchio.md](publish-itchio.md)。
