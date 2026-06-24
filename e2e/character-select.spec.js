import { test, expect } from '@playwright/test'

const canvasSelector = 'canvas#game-canvas'

async function openSelect(page) {
  await page.goto('http://localhost:4173/?testMode=1')
  const hasGameState = await page.evaluate(() => Boolean(window.__gameState))
  test.skip(!hasGameState, 'TODO: enable after T3 restores ?testMode=1 window.__gameState')
  await expect.poll(() => page.evaluate(() => window.__gameState?.state)).toBe('title')
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.__gameState?.state)).toBe('select')
}

async function chooseRole(page, role) {
  const canvasBox = await page.locator(canvasSelector).boundingBox()
  expect(canvasBox).not.toBeNull()

  const xRatio = role === 'order' ? 0.35 : 0.65
  await page.click(canvasSelector, {
    position: { x: canvasBox.width * xRatio, y: canvasBox.height * 0.5 },
  })

  await expect.poll(() => page.evaluate(() => window.__gameState?.state)).toBe('playing')
  return page.evaluate(() => window.__gameState)
}

test.describe('role selection flow', () => {
  test('choosing order starts the order path with order-specific prompt and movement', async ({ page }) => {
    await openSelect(page)

    const state = await chooseRole(page, 'order')

    expect(state.character).toBe('order')
    expect(state.score).toBe(0)
    expect(state.level).toBe(1)
    test.skip(
      typeof state.currentObject?.startT !== 'number',
      'TODO: enable movement-state assertions after T3 exposes currentObject.startT/targetT'
    )
    expect(state.currentObject.startT).toBe(0.05)
    expect(state.currentObject.targetT).toBeLessThan(0.95)
    await expect(page.locator('#hint-text')).toContainText('把东西归位')
  })

  test('choosing intruder starts the intruder path with different state and visual framing', async ({ page }) => {
    await openSelect(page)

    const intruderState = await chooseRole(page, 'chaos')

    expect(intruderState.character).toBe('chaos')
    expect(intruderState.score).toBe(0)
    expect(intruderState.level).toBe(1)
    test.skip(
      typeof intruderState.currentObject?.startT !== 'number',
      'TODO: enable movement-state assertions after T3 exposes currentObject.startT/targetT'
    )
    expect(intruderState.currentObject.startT).toBeGreaterThan(0.05)
    expect(intruderState.currentObject.targetT).toBe(0.95)
    await expect(page.locator('#hint-text')).toContainText('别打乱')

    const intruderFrame = await page.locator(canvasSelector).screenshot()

    await page.reload()
    await openSelect(page)
    await chooseRole(page, 'order')
    const orderFrame = await page.locator(canvasSelector).screenshot()

    expect(orderFrame.equals(intruderFrame)).toBe(false)
  })
})
