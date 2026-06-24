import { test, expect } from '@playwright/test'

const canvasSelector = 'canvas#game-canvas'

async function startRun(page, role) {
  await page.goto('/?testMode=1')
  await page.waitForFunction(() => window.__gameState)
  await expect.poll(() => page.evaluate(() => window.__gameState.state)).toBe('title')
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.__gameState.state)).toBe('select')

  const canvasBox = await page.locator(canvasSelector).boundingBox()
  expect(canvasBox).not.toBeNull()
  await page.click(canvasSelector, {
    position: { x: canvasBox.width * (role === 'order' ? 0.35 : 0.65), y: canvasBox.height * 0.5 },
  })
  await expect.poll(() => page.evaluate(() => window.__gameState.state)).toBe('playing')
  await waitForActiveObject(page)
}

async function waitForActiveObject(page) {
  await page.waitForFunction(() => window.__gameState?.state === 'playing' && window.__gameState.currentObject?.active)
}

async function pressWhenNearTarget(page, tThreshold = 0.9) {
  await waitForActiveObject(page)
  await page.waitForFunction(
    (threshold) => window.__gameState?.currentObject?.t >= threshold,
    tThreshold
  )
  await page.keyboard.press('Space')
}

async function pressPerfect(page) {
  const before = await page.evaluate(() => window.__gameState)
  await pressWhenNearTarget(page, 0.9)
  await expect.poll(() => page.evaluate(() => window.__gameState.hits)).toBe(before.hits + 1)
}

async function pressEarly(page) {
  await waitForActiveObject(page)
  const state = await page.evaluate(() => window.__gameState)
  const object = state.currentObject
  // Press when t is very small (object just spawned)
  const framesToWait = Math.max(0, (0.15 - object.t) / object.speed)
  await page.waitForTimeout(Math.round(framesToWait * (1000 / 60)))
  await page.keyboard.press('Space')
}

async function pressLate(page) {
  await waitForActiveObject(page)
  const state = await page.evaluate(() => window.__gameState)
  const object = state.currentObject
  // Press when t is close to 1.0 but before auto-miss (t=0.98)
  // At t=0.98, currentT = startT + (targetT - startT) * 0.98
  // For chaos role with startT ~ 0.5 and targetT = 0.95:
  // currentT = 0.5 + 0.45 * 0.98 = 0.941, which is < targetT (0.95)
  // This would be early, not late.
  // We need to press AFTER the object passes targetT.
  // Since targetT may be before 1.0, we need a different approach.
  // Instead, wait for t to reach where currentT > targetT + halfWidth.
  const travel = object.targetT - object.startT
  const lateT = 1 + (object.halfWidth / Math.abs(travel))
  const framesToWait = Math.max(0, (lateT - object.t) / object.speed)
  await page.waitForTimeout(Math.round(framesToWait * (1000 / 60)))
  await page.keyboard.press('Space')
}

test('difficulty progression tightens timing windows and increases speed', async ({ page }) => {
  test.setTimeout(90000)
  await startRun(page, 'order')

  const initial = await page.evaluate(() => ({
    level: window.__gameState.level,
    speed: window.__gameState.currentObject.speed,
    halfWidth: window.__gameState.currentObject.halfWidth,
  }))

  // Hit 3 times to trigger level up
  for (let hit = 0; hit < 3; hit += 1) {
    await pressPerfect(page)
    if (hit < 2) await waitForActiveObject(page)
  }

  await expect.poll(() => page.evaluate(() => window.__gameState.level)).toBeGreaterThan(initial.level)
  await waitForActiveObject(page)

  const progressed = await page.evaluate(() => ({
    score: window.__gameState.score,
    hits: window.__gameState.hits,
    level: window.__gameState.level,
    speed: window.__gameState.currentObject.speed,
    halfWidth: window.__gameState.currentObject.halfWidth,
  }))

  expect(progressed.score).toBeGreaterThan(0)
  expect(progressed.hits).toBeGreaterThanOrEqual(3)
  expect(progressed.level).toBeGreaterThan(initial.level)
  expect(progressed.halfWidth < initial.halfWidth || progressed.speed > initial.speed).toBe(true)
})

test('early feedback state is observable', async ({ page }) => {
  test.setTimeout(60000)
  await startRun(page, 'chaos')

  const firstMisses = await page.evaluate(() => window.__gameState.misses)
  await pressEarly(page)
  await expect.poll(() => page.evaluate(() => window.__gameState.lastResult)).toBe('early')
  await expect.poll(() => page.evaluate(() => window.__gameState.misses)).toBe(firstMisses + 1)
})
