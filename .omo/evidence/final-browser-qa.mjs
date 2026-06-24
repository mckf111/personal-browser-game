import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const out = '.omo/evidence/final-verification-screenshots';
fs.mkdirSync(out, { recursive: true });

const server = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', '4173'], {
  shell: true,
  stdio: ['ignore', 'pipe', 'pipe'],
});

const serverLog = [];
server.stdout.on('data', (data) => serverLog.push(data.toString()));
server.stderr.on('data', (data) => serverLog.push(data.toString()));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitServer() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4173/?testMode=1');
      if (response.ok) return;
    } catch {
      // Keep polling until Vite preview is ready.
    }
    await wait(500);
  }
  throw new Error('vite preview did not start');
}

async function hitToEnding(page) {
  for (let i = 0; i < 10; i += 1) {
    await page.waitForFunction(
      () => window.__gameState?.state === 'playing'
        && window.__gameState?.currentObject?.active
        && window.__gameState.currentObject.t >= 0.88,
      { timeout: 70000 },
    );
    await page.keyboard.press('Space');
  }
  await page.waitForFunction(() => window.__gameState?.state === 'ending', { timeout: 10000 });
  await page.waitForTimeout(4000);
}

async function runViewport(browser, viewport) {
  const page = await browser.newPage({ viewport });
  const messages = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      messages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => messages.push({ type: 'pageerror', text: error.message }));

  await page.goto('http://127.0.0.1:4173/?testMode=1', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${out}/${viewport.name}-title.png`, fullPage: true });

  await page.keyboard.press('Space');
  await page.waitForFunction(() => window.__gameState?.state === 'select');
  await page.screenshot({ path: `${out}/${viewport.name}-select.png`, fullPage: true });

  const box = await page.locator('#game-canvas').boundingBox();
  await page.mouse.click(box.x + box.width * 0.35, box.y + box.height * 0.5);
  await page.waitForFunction(() => window.__gameState?.state === 'playing');
  await page.screenshot({ path: `${out}/${viewport.name}-playing.png`, fullPage: true });

  await page.keyboard.press('Space');
  await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

  await page.reload({ waitUntil: 'networkidle' });
  await page.keyboard.press('Space');
  await page.waitForFunction(() => window.__gameState?.state === 'select');
  const box2 = await page.locator('#game-canvas').boundingBox();
  await page.mouse.click(box2.x + box2.width * 0.35, box2.y + box2.height * 0.5);
  await page.waitForFunction(() => window.__gameState?.state === 'playing');
  await hitToEnding(page);
  await page.screenshot({ path: `${out}/${viewport.name}-ending.png`, fullPage: true });

  const finalState = await page.evaluate(() => window.__gameState?.state);
  const boxes = await page.evaluate(() => ({
    canvas: document.querySelector('#game-canvas').getBoundingClientRect().toJSON(),
    score: document.querySelector('#score-display').getBoundingClientRect().toJSON(),
    hint: document.querySelector('#hint-text').getBoundingClientRect().toJSON(),
    hintText: document.querySelector('#hint-text').textContent,
    scoreText: document.querySelector('#score-display').textContent,
  }));
  await page.close();
  return { viewport, finalState, messages, boxes };
}

try {
  await waitServer();
  const browser = await chromium.launch();
  const viewports = [
    { name: '375', width: 375, height: 667 },
    { name: '768', width: 768, height: 1024 },
    { name: '1280', width: 1280, height: 720 },
  ];
  const results = [];
  for (const viewport of viewports) {
    results.push(await runViewport(browser, viewport));
  }
  await browser.close();

  const badConsole = results.flatMap((result) => result.messages.map((message) => ({
    viewport: result.viewport.name,
    ...message,
  })));
  const summary = {
    screenshots: fs.readdirSync(out).filter((file) => file.endsWith('.png')).sort(),
    badConsole,
    finalStates: results.map((result) => ({
      viewport: result.viewport.name,
      state: result.finalState,
      hint: result.boxes.hintText,
      score: result.boxes.scoreText,
      canvas: result.boxes.canvas,
      hintBox: result.boxes.hint,
      scoreBox: result.boxes.score,
    })),
    serverLog,
  };
  fs.writeFileSync(`${out}/qa-result.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  if (badConsole.length > 0) process.exitCode = 2;
} finally {
  server.kill();
}
