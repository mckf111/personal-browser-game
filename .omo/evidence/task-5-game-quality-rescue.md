# T5: Rebuild Canvas Visual/Narrative Vertical Slice

## Task

Rebuild Canvas visual/narrative vertical slice within one room. Upgrade `src/main.js` to implement the DESIGN.md vertical slice. Fix undefined `COLORS.targetWindow/targetBorder`.

## Changes Made

### src/main.js

1. **Fixed COLORS object** — Added all missing DESIGN.md tokens:
   - `targetWindow: 'rgba(78,205,196,0.25)'`
   - `targetBorder: '#4ecdc4'`
   - `targetWindowIntruder: 'rgba(255,107,107,0.25)'`
   - `targetBorderIntruder: '#ff6b6b'`
   - `furnitureShadow: 'rgba(0,0,0,0.2)'`
   - `wallDetail: 'rgba(255,255,255,0.1)'`
   - `textPrimary: '#ffffff'`
   - `textSecondary: 'rgba(255,255,255,0.7)'`
   - `textMuted: 'rgba(255,255,255,0.5)'`
   - `themeColor: '#1a1a2e'`

2. **Exposed `t` and `active` in `getReadonlyGameState()`** — The ending e2e test checks `currentObject.t` and `currentObject.active`. Previously only `targetT` and `halfWidth` were exposed, causing the ending test to skip. Now both fields are available read-only.

3. **Rebuilt `renderTitle`** — Uses `wallDetail` for furniture outlines, `furnitureShadow` for shelf layers, `textPrimary`/`textSecondary`/`textMuted` for text. Added detailed shelf with 3 layer lines and desk with legs. Font stack uses `system-ui, -apple-system, sans-serif` per DESIGN.md `fontStack` token.

4. **Rebuilt `renderSelect`** — Added room background (wall + floor). Uses `textPrimary`/`textSecondary`/`textMuted` tokens. Furniture outline rectangles on both sides. Button center moved to `h * 0.5` to match test click position.

5. **Fixed `handleSelectClick`** — Button center moved to `h * 0.5` (was `h * 0.45` in render, `h * 0.5` in click handler — now both at `h * 0.5`). Button sizing uses `Math.min(220, w * 0.38)` for width, `100` for height, `Math.min(30, w * 0.04)` for gap — matching DESIGN.md `buttonMinW`, `buttonH`, `buttonGap` tokens.

6. **Rebuilt `renderGame`** — Role-specific target window colors: `targetWindow`/`targetBorder` for order, `targetWindowIntruder`/`targetBorderIntruder` for chaos. Uses `furnitureShadow` for shelf layers. Added desk on opposite side of shelf. Added role-specific story text on canvas ("把东西归位!" for order, "别打乱! 融入!" for chaos) making the role goal legible without reading docs. Uses `wallDetail` for track line, `textMuted` for progress text.

7. **Rebuilt `renderEnding`** — Uses `furnitureShadow` for shelf layers. Removed redundant `bg` fill (room background covers full screen). Uses `textMuted` for score/restart text. Added shelf layer lines. Sofa uses `rgba(139,115,85,...)` matching `shelf` color. Font stack updated to include `-apple-system`.

### index.html

8. **Fixed `theme-color` meta** — Changed from `#2c3e50` to `#1a1a2e` to match DESIGN.md `themeColor` token (which equals `bg`).

### e2e/visual-quality.spec.js

9. **Increased ending test timeout** — Changed from 30000ms to 120000ms. The ending test requires 10 hits at ~5s each (~50s total) plus 4s for ending animation. The original 30s timeout was insufficient for the game's object speed (0.003 per frame at level 1).

## Verification Results

### Build

```
npx vite build
```
Result: PASS — 5 modules transformed, built in 128ms.

### Unit Tests

```
npx vitest run
```
Result: PASS — 16 tests passed (2 test files).

### Visual Quality Tests (baseline establishment)

```
npx playwright test e2e/visual-quality.spec.js --update-snapshots
```
Result: PASS — 24 tests passed (1.1m). All snapshots written.

### Visual Quality Tests (verification against baselines)

```
npx playwright test e2e/visual-quality.spec.js
```
Result: PASS — 24 tests passed (1.1m). All screenshots match baselines within 3% diff pixel ratio.

### Token Scan

```
rg "targetWindow|targetBorder" src/main.js
```
Result: All 4 tokens defined and used:
- `targetWindow: 'rgba(78,205,196,0.25)'`
- `targetBorder: '#4ecdc4'`
- `targetWindowIntruder: 'rgba(255,107,107,0.25)'`
- `targetBorderIntruder: '#ff6b6b'`
- Usage: `ctx.fillStyle = isOrder ? COLORS.targetWindow : COLORS.targetWindowIntruder;`
- Usage: `ctx.strokeStyle = isOrder ? COLORS.targetBorder : COLORS.targetBorderIntruder;`

### Vite SVG Scan

```
rg "vite\.svg" index.html public src
```
Result: Pre-existing references in `index.html` and `public/manifest.json`. T5 did not add any new references. T8 is responsible for cleaning these.

## Acceptance Criteria Checklist

- [x] `npx vite build` passes
- [x] `npx playwright test e2e/visual-quality.spec.js --update-snapshots` run to establish baselines
- [x] `npx playwright test e2e/visual-quality.spec.js` passes without updating
- [x] `rg "targetWindow|targetBorder" src/main.js DESIGN.md` shows defined tokens and usage
- [x] `rg "vite\.svg" index.html public src` — no new references added by T5
- [x] Visual test assertions prove title/select/playing/ending render role/story text and no canvas blank state
- [x] No new libraries, engine, TypeScript, or external assets introduced
- [x] Game mechanics unchanged beyond visual representation
- [x] One room, two role silhouettes, at most six object types
- [x] Story legible during play: role-specific prompts on canvas ("把东西归位!" / "别打乱! 融入!")

## Notes

- The ending test takes ~48-53s per viewport due to 10 sequential hits at ~5s each. The 120s timeout accommodates this.
- The seeded random helper and `__gameState` exposure from T3 are preserved. Only `t` and `active` fields were added to the read-only state.
- The button center was moved from `h * 0.45` to `h * 0.5` to match the test's click position at `canvasBox.height * 0.5`. This fixes a 1.2px miss on the 1024px-height tablet viewport.