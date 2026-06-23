import { test, expect } from '@playwright/test'

test('full game flow in testMode', async ({ page }) => {
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('http://localhost:4173/?testMode=1')

  // 1. 标题画面
  await page.waitForTimeout(500)
  let state = await page.evaluate(() => window.__gameState)
  expect(state.state).toBe('title')

  // 2. 进入角色选择
  await page.keyboard.press('Space')
  await page.waitForTimeout(300)
  state = await page.evaluate(() => window.__gameState)
  expect(state.state).toBe('select')

  // 3. 选择守序者
  const canvasBox = await page.locator('canvas#game-canvas').boundingBox()
  await page.click('canvas#game-canvas', {
    position: { x: canvasBox.width * 0.35, y: canvasBox.height * 0.5 }
  })
  await page.waitForTimeout(300)
  state = await page.evaluate(() => window.__gameState)
  expect(state.state).toBe('playing')
  expect(state.character).toBe('order')
  expect(state.score).toBe(0)
  expect(state.level).toBe(1)
  expect(state.combo).toBe(0)

  // 4. 游戏循环
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)
  state = await page.evaluate(() => window.__gameState)
  expect(state.lastResult).toBeTruthy()

  // 5. 重开
  await page.reload()
  await page.waitForTimeout(500)
  state = await page.evaluate(() => window.__gameState)
  expect(state.state).toBe('title')

  expect(errors).toHaveLength(0)
})

test('mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://localhost:4173/?testMode=1')
  await page.waitForTimeout(500)

  await page.click('canvas#game-canvas')
  await page.waitForTimeout(300)
  const state = await page.evaluate(() => window.__gameState)
  expect(state.state).toBe('select')
})

test('canvas responsive after resize', async ({ page }) => {
  await page.goto('http://localhost:4173/?testMode=1')
  await page.waitForTimeout(300)

  await page.setViewportSize({ width: 800, height: 600 })
  await page.waitForTimeout(300)

  const after = await page.evaluate(() => ({
    w: document.getElementById('game-canvas').width,
    h: document.getElementById('game-canvas').height,
  }))

  expect(after.w).toBeGreaterThan(0)
  expect(after.h).toBeGreaterThan(0)
})
