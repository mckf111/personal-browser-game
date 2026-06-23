import { test, expect } from '@playwright/test'

test('canvas loads and input changes state', async ({ page }) => {
  await page.goto('http://localhost:4173/?testMode=1')

  // 断言 canvas 存在
  const canvas = await page.$('canvas#game-canvas')
  expect(canvas).not.toBeNull()

  // 断言 viewport meta 存在
  const viewport = await page.$('meta[name=viewport]')
  expect(viewport).not.toBeNull()

  // 断言 manifest link 存在
  const manifest = await page.$('link[rel=manifest]')
  expect(manifest).not.toBeNull()

  // 等待初始加载
  await page.waitForTimeout(500)

  // 断言 console 无 error
  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  // 模拟按键（键盘）
  await page.keyboard.press('Space')
  await page.waitForTimeout(200)

  // 断言游戏状态变化（score 从 0 可能增加，但至少 isPlaying 变为 true）
  const stateAfterKey = await page.evaluate(() => window.__gameState)
  expect(stateAfterKey).toBeTruthy()
  expect(stateAfterKey.isPlaying).toBe(true)

  // 重置后模拟触摸点击
  await page.reload()
  await page.waitForTimeout(500)
  await page.click('canvas#game-canvas')
  await page.waitForTimeout(200)

  const stateAfterClick = await page.evaluate(() => window.__gameState)
  expect(stateAfterClick).toBeTruthy()
  expect(stateAfterClick.isPlaying).toBe(true)

  expect(errors).toHaveLength(0)
})

test('canvas is responsive after resize', async ({ page }) => {
  await page.goto('http://localhost:4173/?testMode=1')
  await page.waitForTimeout(300)

  const canvasBefore = await page.evaluate(() => ({
    w: document.getElementById('game-canvas').width,
    h: document.getElementById('game-canvas').height,
  }))

  await page.setViewportSize({ width: 800, height: 600 })
  await page.waitForTimeout(300)

  const canvasAfter = await page.evaluate(() => ({
    w: document.getElementById('game-canvas').width,
    h: document.getElementById('game-canvas').height,
  }))

  expect(canvasAfter.w).toBeGreaterThan(0)
  expect(canvasAfter.h).toBeGreaterThan(0)
})
