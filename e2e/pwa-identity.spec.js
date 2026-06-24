import { test, expect } from '@playwright/test'

const expectedThemeColor = '#1a1a2e'

test('PWA identity metadata and icons load', async ({ page, request }) => {
  await page.goto('http://localhost:4173/')

  await expect(page).toHaveTitle('守序者与闯入者')

  const metadata = await page.evaluate(() => ({
    description: document.querySelector('meta[name="description"]')?.content,
    themeColor: document.querySelector('meta[name="theme-color"]')?.content,
    manifestHref: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
    faviconHref: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
  }))

  expect(metadata.description).toBeTruthy()
  expect(metadata.themeColor).toBe(expectedThemeColor)
  expect(metadata.manifestHref).toBe('./manifest.json')
  expect(metadata.faviconHref).toBe('./favicon.svg')

  const faviconUrl = new URL(metadata.faviconHref, page.url()).toString()
  await expectResourceOk(request, faviconUrl)

  const manifestUrl = new URL(metadata.manifestHref, page.url()).toString()
  const manifestResponse = await request.get(manifestUrl)
  expect(manifestResponse.status()).toBe(200)

  const manifest = await manifestResponse.json()
  expect(manifest.name).toBe('守序者与闯入者')
  expect(manifest.short_name).toBe('守序闯入')
  expect(manifest.description).toBeTruthy()
  expect(manifest.theme_color).toBe(expectedThemeColor)
  expect(manifest.background_color).toBe(expectedThemeColor)

  for (const icon of manifest.icons) {
    const iconUrl = new URL(icon.src, manifestUrl).toString()
    await expectResourceOk(request, iconUrl)
  }
})

async function expectResourceOk(request, url) {
  const response = await request.get(url)
  expect(response.status(), `${url} should load`).toBe(200)
}
