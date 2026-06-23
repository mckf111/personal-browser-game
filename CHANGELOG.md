# Changelog

本文记录 守序者与闯入者 的用户可见变化。

格式建议遵循 Keep a Changelog；版本号策略由项目自行决定。

## [Unreleased]

### Added
- 项目接入 vibe-starter-GPT 项目宪法：AGENTS、spec、ADR、状态交接、架构边界、技术债和质量门禁模板。
- ADR-0001：选定技术栈（原生 Canvas+JS+Vite+Vitest+Playwright，不引入游戏引擎）。
- 单键时机核心玩法：选择角色（守序者/闯入者），在正确时机按键归位/融入物品。
- Combo 连击系统：连续命中得分倍率递增，最高连击记录。
- Web Audio API 合成音效：命中高音、失败低音、节拍提示。
- 6 种物品视觉意象：书、杯子、袜子、相框、花瓶、闹钟，各带颜色和形状。
- 房间场景背景：墙壁、地板、书架/柜子，营造温馨氛围。
- 失败戏剧化动画：物品飞走/掉落/旋转 + 粒子散射。
- 结局画面：两角色相遇递东西，"理解是一种归位"。
- PWA 支持：manifest.json + viewport meta + 响应式 Canvas。
- 移动端适配：触摸输入、devicePixelRatio、安全区域。
- GitHub Pages 自动部署：push main 即发布。

### Changed

### Fixed

### Removed

---

## 记录规则

- 用户能感知到的功能、行为、输出、接口变化必须记录。
- 纯内部重构可不记录，除非影响维护或部署方式。
- 不确定是否要记时，宁可简短记录。
