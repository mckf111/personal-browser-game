import { test, expect } from '@playwright/test'

const canvasSelector = 'canvas#game-canvas'

const viewports = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1280', width: 1280, height: 720 },
]

async function expectState(page, state) {
  const hasGameState = await page.evaluate(() => Boolean(window.__gameState))
  if (hasGameState) {
    await expect.poll(() => page.evaluate(() => window.__gameState?.state)).toBe(state)
  }
}

async function gotoTitle(page) {
  await page.goto('http://localhost:4173/?testMode=1')
  await expectState(page, 'title')
  await expect(page.locator('#hint-text')).toContainText('开始')
}

async function gotoSelect(page) {
  await gotoTitle(page)
  await page.keyboard.press('Space')
  await expectState(page, 'select')
  await expect(page.locator('#hint-text')).toContainText('选择你的角色')
}

async function gotoPlaying(page, role = 'order') {
  await gotoSelect(page)
  const canvasBox = await page.locator(canvasSelector).boundingBox()
  expect(canvasBox).not.toBeNull()
  await page.click(canvasSelector, {
    position: {
      x: canvasBox.width * (role === 'order' ? 0.35 : 0.65),
      y: canvasBox.height * 0.5,
    },
  })
  await expectState(page, 'playing')
}

async function gotoEnding(page) {
  await gotoPlaying(page, 'order')
  const state = await page.evaluate(() => window.__gameState)
  test.skip(
    typeof state?.currentObject?.t !== 'number',
    'TODO: enable ending screenshot setup after T3 exposes currentObject.t'
  )

  for (let hit = 0; hit < 10; hit += 1) {
    await page.waitForFunction(() => {
      const state = window.__gameState
      return state?.state === 'playing'
        && state.currentObject?.active
        && state.currentObject.t >= 0.88
    })
    await page.keyboard.press('Space')
  }

  await expectState(page, 'ending')
  await page.waitForTimeout(4000)
}

for (const viewport of viewports) {
  test.describe(`visual quality gates at ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('title state screenshot and story text gate', async ({ page }) => {
      await gotoTitle(page)

      await expect(page.locator('#hint-text')).toContainText('开始')
      await expect(page.locator(canvasSelector)).toHaveScreenshot(`${viewport.name}-title.png`, {
        maxDiffPixelRatio: 0.03,
      })
    })

    test('select state screenshot and role choice gate', async ({ page }) => {
      await gotoSelect(page)

      await expect(page.locator('#hint-text')).toContainText('选择你的角色')
      await expect(page.locator(canvasSelector)).toHaveScreenshot(`${viewport.name}-select.png`, {
        maxDiffPixelRatio: 0.03,
      })
    })

    test('playing state screenshot and role difference gate', async ({ page }) => {
      await gotoPlaying(page, 'order')

      await expect(page.locator('#score-display')).toContainText('Level: 1')
      await expect(page.locator('#hint-text')).toContainText('把东西归位')
      await expect(page.locator(canvasSelector)).toHaveScreenshot(`${viewport.name}-playing-order.png`, {
        maxDiffPixelRatio: 0.03,
      })

      await page.reload()
      await gotoPlaying(page, 'chaos')
      await expect(page.locator('#hint-text')).toContainText('别打乱')
      await expect(page.locator(canvasSelector)).toHaveScreenshot(`${viewport.name}-playing-intruder.png`, {
        maxDiffPixelRatio: 0.03,
      })
    })

    test('ending state screenshot and story beat gate', async ({ page }) => {
      test.setTimeout(120000)
      await gotoEnding(page)

      await expect(page.locator('#score-display')).toContainText('最终得分')
      await expect(page.locator('#hint-text')).toContainText('重开')
      await expect(page.locator(canvasSelector)).toHaveScreenshot(`${viewport.name}-ending.png`, {
        maxDiffPixelRatio: 0.03,
      })
    })
  })
}
