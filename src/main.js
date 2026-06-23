import { judgeTiming } from './game/timing.js'

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const hintText = document.getElementById('hint-text');

// ========== 响应式 Canvas ==========
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ========== 音频系统 ==========
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playHitSound(combo) {
  const baseFreq = 440 + Math.min(combo * 50, 400);
  playTone(baseFreq, 0.15, 'sine', 0.25);
  setTimeout(() => playTone(baseFreq * 1.5, 0.1, 'sine', 0.15), 50);
}

function playFailSound() {
  playTone(150, 0.3, 'sawtooth', 0.15);
  setTimeout(() => playTone(100, 0.2, 'square', 0.1), 100);
}

function playBeat(interval = 0) {
  // 轻节拍提示
  if (!audioCtx) return;
  playTone(200 + interval * 100, 0.05, 'sine', 0.08);
}

// ========== 游戏常量 ==========
const COLORS = {
  bg: '#1a1a2e',
  wall: '#16213e',
  floor: '#0f3460',
  order: '#4ecdc4',
  chaos: '#ff6b6b',
  white: '#ffffff',
  gold: '#ffd700',
  shelf: '#8B7355',
  itemColors: ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'],
};

const GAME_CONFIG = {
  initialSpeed: 0.003,
  initialHalfWidth: 0.12,
  minHalfWidth: 0.04,
  speedIncrement: 0.0004,
  halfWidthDecrement: 0.006,
  scorePerHit: 10,
  maxLevel: 15,
  objectsToWin: 10,
  comboMultiplier: 0.5, // 每个 combo 增加 50% 得分
};

const ITEMS = [
  { name: '书', shape: 'rect', w: 18, h: 24 },
  { name: '杯子', shape: 'circle', r: 10 },
  { name: '袜子', shape: 'rect', w: 12, h: 16 },
  { name: '相框', shape: 'rect', w: 20, h: 20 },
  { name: '花瓶', shape: 'circle', r: 8 },
  { name: '闹钟', shape: 'circle', r: 12 },
];

// ========== 游戏状态机 ==========
const STATES = {
  TITLE: 'title',
  SELECT: 'select',
  PLAYING: 'playing',
  ENDING: 'ending',
};

let game = {
  state: STATES.TITLE,
  character: null,
  score: 0,
  hits: 0,
  misses: 0,
  level: 1,
  combo: 0,
  maxCombo: 0,
  lastResult: null,
  objectsDone: 0,
  currentObject: null,
  feedbackTimer: 0,
  feedbackText: '',
  feedbackColor: '',
  endingTimer: 0,
  beatTimer: 0,
  particles: [],
  floatingTexts: [],
};

// ========== 粒子系统 ==========
function spawnParticles(x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 2 + Math.random() * 3;
    game.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 3 + Math.random() * 4,
    });
  }
}

function spawnFloatingText(x, y, text, color) {
  game.floatingTexts.push({
    x, y,
    text,
    color,
    life: 60,
    vy: -1.5,
  });
}

// ========== 关卡生成 ==========
function generateObject(level, character) {
  const speed = GAME_CONFIG.initialSpeed + (level - 1) * GAME_CONFIG.speedIncrement;
  const halfWidth = Math.max(
    GAME_CONFIG.minHalfWidth,
    GAME_CONFIG.initialHalfWidth - (level - 1) * GAME_CONFIG.halfWidthDecrement
  );

  const startT = character === 'order' ? 0.05 : Math.random() * 0.8 + 0.1;
  const targetT = character === 'order' ? Math.random() * 0.8 + 0.1 : 0.95;
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
  const color = COLORS.itemColors[Math.floor(Math.random() * COLORS.itemColors.length)];

  // 动态目标：正弦摆动
  const swayAmp = Math.min(0.05, (level - 1) * 0.005);
  const swayFreq = 0.02 + Math.random() * 0.03;

  return {
    startT,
    targetT,
    t: 0,
    speed,
    halfWidth,
    windowCenter: null,
    active: true,
    settled: false,
    item,
    color,
    swayAmp,
    swayFreq,
    swayPhase: Math.random() * Math.PI * 2,
    // 失败时的动画状态
    failAnim: { x: 0, y: 0, rot: 0, vx: 0, vy: 0, active: false },
  };
}

// ========== 输入处理 ==========
function onPress() {
  if (game.state === STATES.TITLE) {
    initAudio();
    game.state = STATES.SELECT;
    updateUI();
    return;
  }

  if (game.state === STATES.ENDING) {
    resetGame();
    return;
  }

  if (game.state !== STATES.PLAYING || !game.currentObject || !game.currentObject.active) {
    return;
  }

  const obj = game.currentObject;

  // 计算当前位置（含摆动）
  const swayOffset = Math.sin(obj.t * 100 * obj.swayFreq + obj.swayPhase) * obj.swayAmp;
  const currentT = obj.startT + (obj.targetT - obj.startT) * obj.t + swayOffset;
  obj.windowCenter = currentT;

  const result = judgeTiming(
    currentT * 1000,
    obj.targetT * 1000,
    obj.halfWidth * 1000
  );

  game.lastResult = result.result;
  game.feedbackTimer = 45;

  const w = window.innerWidth;
  const trackLen = w * 0.8;
  const trackLeft = w * 0.1;
  const objX = trackLeft + currentT * trackLen;
  const trackY = window.innerHeight * 0.5;

  if (result.result === 'hit') {
    game.combo += 1;
    game.maxCombo = Math.max(game.maxCombo, game.combo);
    const multiplier = 1 + (game.combo - 1) * GAME_CONFIG.comboMultiplier;
    const points = Math.floor(GAME_CONFIG.scorePerHit * multiplier);
    game.score += points;
    game.hits += 1;
    game.objectsDone += 1;
    obj.settled = true;
    obj.active = false;

    game.feedbackText = game.combo >= 2 ? `${game.combo}连击! +${points}` : `+${points}`;
    game.feedbackColor = COLORS.gold;

    spawnParticles(objX, trackY, COLORS.gold, 10 + game.combo * 2);
    if (game.combo >= 3) {
      spawnFloatingText(objX, trackY - 30, `${game.combo}x COMBO!`, COLORS.gold);
    }
    playHitSound(game.combo);

    if (game.hits % 3 === 0 && game.level < GAME_CONFIG.maxLevel) {
      game.level += 1;
      spawnFloatingText(w / 2, trackY - 60, `LEVEL UP! ${game.level}`, COLORS.order);
    }

    if (game.objectsDone >= GAME_CONFIG.objectsToWin) {
      game.state = STATES.ENDING;
      game.endingTimer = 0;
    } else {
      game.currentObject = generateObject(game.level, game.character);
    }
  } else {
    game.combo = 0;
    game.misses += 1;
    obj.active = false;
    obj.failAnim.active = true;
    obj.failAnim.x = objX;
    obj.failAnim.y = trackY;
    obj.failAnim.rot = 0;

    if (result.result === 'early') {
      game.feedbackText = '早了!东西飞过头了!';
      game.feedbackColor = COLORS.chaos;
      obj.failAnim.vx = 3 + Math.random() * 2;
      obj.failAnim.vy = -4 - Math.random() * 2;
      spawnParticles(objX, trackY, COLORS.chaos, 6);
    } else {
      game.feedbackText = '晚了!东西掉了!';
      game.feedbackColor = COLORS.chaos;
      obj.failAnim.vx = -2 - Math.random() * 2;
      obj.failAnim.vy = 3 + Math.random() * 2;
      spawnParticles(objX, trackY, COLORS.chaos, 6);
    }

    spawnFloatingText(objX, trackY - 20, '断了!', COLORS.chaos);
    playFailSound();

    setTimeout(() => {
      if (game.state === STATES.PLAYING) {
        game.currentObject = generateObject(game.level, game.character);
      }
    }, 800);
  }

  updateUI();
}

function handleSelectClick(x, y) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = w / 2;
  const cy = h * 0.5;
  const btnW = Math.min(200, w * 0.35);
  const btnH = 80;
  const gap = 40;

  if (x >= cx - gap / 2 - btnW && x <= cx - gap / 2 && y >= cy - btnH / 2 && y <= cy + btnH / 2) {
    game.character = 'order';
    startPlaying();
    return;
  }
  if (x >= cx + gap / 2 && x <= cx + gap / 2 + btnW && y >= cy - btnH / 2 && y <= cy + btnH / 2) {
    game.character = 'chaos';
    startPlaying();
    return;
  }
}

function startPlaying() {
  game.state = STATES.PLAYING;
  game.score = 0;
  game.hits = 0;
  game.misses = 0;
  game.level = 1;
  game.combo = 0;
  game.maxCombo = 0;
  game.lastResult = null;
  game.objectsDone = 0;
  game.particles = [];
  game.floatingTexts = [];
  game.currentObject = generateObject(1, game.character);
  updateUI();
}

function resetGame() {
  game.state = STATES.TITLE;
  game.character = null;
  game.score = 0;
  game.hits = 0;
  game.misses = 0;
  game.level = 1;
  game.combo = 0;
  game.maxCombo = 0;
  game.lastResult = null;
  game.objectsDone = 0;
  game.currentObject = null;
  game.particles = [];
  game.floatingTexts = [];
  updateUI();
}

// ========== 事件监听 ==========
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    onPress();
  }
});

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  initAudio();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (game.state === STATES.SELECT) {
    handleSelectClick(x, y);
  } else {
    onPress();
  }
});

// ========== UI 更新 ==========
function updateUI() {
  if (game.state === STATES.TITLE) {
    scoreDisplay.textContent = '';
    hintText.textContent = '按空格或点击屏幕开始';
    return;
  }
  if (game.state === STATES.SELECT) {
    scoreDisplay.textContent = '';
    hintText.textContent = '选择你的角色';
    return;
  }
  if (game.state === STATES.PLAYING) {
    scoreDisplay.textContent = `Score: ${game.score}  Combo: ${game.combo}x  Level: ${game.level}`;
    if (game.feedbackTimer > 0) {
      hintText.textContent = game.feedbackText;
      hintText.style.color = game.feedbackColor;
    } else {
      hintText.textContent = game.character === 'order' ? '把东西归位! 听节拍!' : '别打乱! 听节拍!';
      hintText.style.color = '';
    }
    return;
  }
  if (game.state === STATES.ENDING) {
    scoreDisplay.textContent = `最终得分: ${game.score}  最高连击: ${game.maxCombo}x`;
    hintText.textContent = '按空格或点击重开';
    hintText.style.color = '';
  }
}

// ========== 渲染 ==========
function render() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  if (game.state === STATES.TITLE) {
    renderTitle(w, h);
    return;
  }
  if (game.state === STATES.SELECT) {
    renderSelect(w, h);
    return;
  }
  if (game.state === STATES.PLAYING) {
    renderGame(w, h);
    return;
  }
  if (game.state === STATES.ENDING) {
    renderEnding(w, h);
  }
}

function renderTitle(w, h) {
  // 背景装饰
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, w, h * 0.7);
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, h * 0.7, w, h * 0.3);

  // 简单的家具轮廓
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  // 书架
  ctx.strokeRect(w * 0.1, h * 0.3, w * 0.15, h * 0.35);
  // 桌子
  ctx.fillRect(w * 0.7, h * 0.5, w * 0.2, h * 0.05);
  ctx.fillRect(w * 0.75, h * 0.55, w * 0.02, h * 0.15);
  ctx.fillRect(w * 0.83, h * 0.55, w * 0.02, h * 0.15);

  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.min(48, w * 0.08)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('守序者与闯入者', w / 2, h * 0.35);

  ctx.font = `${Math.min(18, w * 0.035)}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('按空格或点击屏幕', w / 2, h * 0.55);

  ctx.font = `${Math.min(14, w * 0.028)}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('一个关于秩序、混乱与理解的单键时机游戏', w / 2, h * 0.62);
  ctx.fillText('Tips: 听节拍! 连击越高得分越多!', w / 2, h * 0.68);
}

function renderSelect(w, h) {
  ctx.fillStyle = COLORS.white;
  ctx.font = `bold ${Math.min(32, w * 0.06)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('选择你的角色', w / 2, h * 0.22);

  const cx = w / 2;
  const cy = h * 0.45;
  const btnW = Math.min(220, w * 0.38);
  const btnH = 100;
  const gap = Math.min(30, w * 0.04);

  // 守序者按钮
  ctx.fillStyle = COLORS.order;
  roundRect(ctx, cx - gap / 2 - btnW, cy - btnH / 2, btnW, btnH, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.bg;
  ctx.font = `bold ${Math.min(22, w * 0.045)}px system-ui, sans-serif`;
  ctx.fillText('守序者', cx - gap / 2 - btnW / 2, cy - 5);
  ctx.font = `${Math.min(14, w * 0.028)}px system-ui, sans-serif`;
  ctx.fillText('小蟾蜍', cx - gap / 2 - btnW / 2, cy + 18);

  // 闯入者按钮
  ctx.fillStyle = COLORS.chaos;
  roundRect(ctx, cx + gap / 2, cy - btnH / 2, btnW, btnH, 12);
  ctx.fill();
  ctx.fillStyle = COLORS.bg;
  ctx.font = `bold ${Math.min(22, w * 0.045)}px system-ui, sans-serif`;
  ctx.fillText('闯入者', cx + gap / 2 + btnW / 2, cy - 5);
  ctx.font = `${Math.min(14, w * 0.028)}px system-ui, sans-serif`;
  ctx.fillText('候鸟', cx + gap / 2 + btnW / 2, cy + 18);

  // 说明
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `${Math.min(15, w * 0.03)}px system-ui, sans-serif`;
  ctx.fillText('守序者：把变乱的东西归位', w / 2, h * 0.68);
  ctx.fillText('闯入者：别打乱想融入整齐世界', w / 2, h * 0.74);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('核心：听节拍，在正确时机按键', w / 2, h * 0.82);
}

function renderGame(w, h) {
  const trackY = h * 0.5;
  const trackLeft = w * 0.08;
  const trackRight = w * 0.92;
  const trackLen = trackRight - trackLeft;

  // 房间背景
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, w, h * 0.65);
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  // 书架/柜子
  ctx.fillStyle = COLORS.shelf;
  const shelfX = game.character === 'order' ? trackRight - w * 0.12 : trackLeft;
  ctx.fillRect(shelfX, h * 0.25, w * 0.12, h * 0.35);
  // 书架层板
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  for (let i = 1; i <= 3; i++) {
    ctx.fillRect(shelfX, h * 0.25 + i * h * 0.09, w * 0.12, 3);
  }

  // 轨道线
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(trackLeft, trackY);
  ctx.lineTo(trackRight, trackY);
  ctx.stroke();
  ctx.setLineDash([]);

  if (!game.currentObject) return;
  const obj = game.currentObject;

  // 目标位置（含摆动）
  const swayOffset = obj.active ? Math.sin(obj.t * 100 * obj.swayFreq + obj.swayPhase) * obj.swayAmp : 0;
  const targetT = obj.targetT + swayOffset;
  const targetX = trackLeft + targetT * trackLen;

  // 时机窗口
  const halfPx = obj.halfWidth * trackLen;
  ctx.fillStyle = COLORS.targetWindow;
  ctx.fillRect(targetX - halfPx, trackY - 28, halfPx * 2, 56);
  ctx.strokeStyle = COLORS.targetBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(targetX - halfPx, trackY - 28, halfPx * 2, 56);

  // 目标标记
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(targetX - 1, trackY - 32, 2, 64);

  // 节拍提示（目标处闪烁）
  if (obj.active && game.beatTimer % 20 < 10) {
    ctx.strokeStyle = `rgba(255,255,255,${0.3 + (game.beatTimer % 10) / 30})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(targetX, trackY, halfPx + 5 + (game.beatTimer % 10), 0, Math.PI * 2);
    ctx.stroke();
  }

  // 当前物品
  const currentT = obj.startT + (obj.targetT - obj.startT) * obj.t + (obj.active ? swayOffset : 0);
  const objX = trackLeft + currentT * trackLen;

  if (obj.active || obj.settled) {
    renderItem(objX, trackY, obj.item, obj.color, obj.settled);
  } else if (obj.failAnim.active) {
    // 失败动画
    ctx.save();
    ctx.translate(obj.failAnim.x, obj.failAnim.y);
    ctx.rotate(obj.failAnim.rot);
    renderItem(0, 0, obj.item, COLORS.chaos, false);
    ctx.restore();
  }

  // 粒子
  game.particles.forEach(p => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // 浮动文字
  game.floatingTexts.forEach(ft => {
    ctx.globalAlpha = ft.life / 60;
    ctx.fillStyle = ft.color;
    ctx.font = `bold 16px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
  });
  ctx.globalAlpha = 1;

  // Combo 显示
  if (game.combo >= 2) {
    ctx.fillStyle = COLORS.gold;
    ctx.font = `bold ${Math.min(24, w * 0.05)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`${game.combo}x COMBO!`, w / 2, h * 0.2);
  }

  // 进度条
  const barW = w * 0.25;
  const barH = 8;
  const barX = w * 0.5 - barW / 2;
  const barY = h * 0.88;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, barX, barY, barW, barH, 4);
  ctx.fill();
  ctx.fillStyle = game.character === 'order' ? COLORS.order : COLORS.chaos;
  roundRect(ctx, barX, barY, barW * (game.objectsDone / GAME_CONFIG.objectsToWin), barH, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `12px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`${game.objectsDone} / ${GAME_CONFIG.objectsToWin}`, w / 2, barY + 22);
}

function renderItem(x, y, item, color, settled) {
  ctx.fillStyle = color;
  if (item.shape === 'rect') {
    ctx.fillRect(x - item.w / 2, y - item.h / 2, item.w, item.h);
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x - item.w / 2, y - item.h / 2, item.w, 3);
  } else {
    ctx.beginPath();
    ctx.arc(x, y, item.r, 0, Math.PI * 2);
    ctx.fill();
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.arc(x - item.r * 0.3, y - item.r * 0.3, item.r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 归位后的对勾
  if (settled) {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x - 2, y + 4);
    ctx.lineTo(x + 6, y - 4);
    ctx.stroke();
  }
}

function renderEnding(w, h) {
  const progress = Math.min(1, game.endingTimer / 240);

  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  // 房间背景
  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(0, 0, w, h * 0.65);
  ctx.fillStyle = COLORS.floor;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  // 书架
  ctx.fillStyle = COLORS.shelf;
  ctx.fillRect(w * 0.75, h * 0.25, w * 0.15, h * 0.3);

  if (progress > 0.1) {
    const alpha = Math.min(1, (progress - 0.1) / 0.2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.font = `bold ${Math.min(36, w * 0.07)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('他们相遇了', w / 2, h * 0.2);
  }

  if (progress > 0.25) {
    const alpha = Math.min(1, (progress - 0.25) / 0.25);
    const cx = w / 2;
    const cy = h * 0.45;

    ctx.globalAlpha = alpha;

    // 小蟾蜍（守序者）
    ctx.fillStyle = COLORS.order;
    ctx.beginPath();
    ctx.arc(cx - 50, cy, 25, 0, Math.PI * 2);
    ctx.fill();
    // 眼镜
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(cx - 62, cy - 6, 10, 10);
    ctx.fillRect(cx - 48, cy - 6, 10, 10);
    // 尺子
    ctx.fillStyle = COLORS.gold;
    ctx.fillRect(cx - 85, cy + 15, 35, 3);

    // 候鸟（闯入者）
    ctx.fillStyle = COLORS.chaos;
    ctx.beginPath();
    ctx.ellipse(cx + 50, cy, 22, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    // 羽毛
    ctx.strokeStyle = COLORS.chaos;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + 68 + i * 6, cy - 8);
      ctx.lineTo(cx + 72 + i * 6, cy + 12);
      ctx.stroke();
    }

    // 递东西
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 5);
    ctx.lineTo(cx + 30, cy + 5);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  if (progress > 0.55) {
    const alpha = Math.min(1, (progress - 0.55) / 0.2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.font = `${Math.min(16, w * 0.032)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('蟾蜍递出了尺子，候鸟递出了羽毛', w / 2, h * 0.65);
  }

  if (progress > 0.75) {
    const alpha = Math.min(1, (progress - 0.75) / 0.2);
    // 沙发
    ctx.fillStyle = `rgba(139,115,85,${alpha * 0.5})`;
    ctx.fillRect(w * 0.3, h * 0.7, w * 0.4, 8);

    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.font = `italic ${Math.min(18, w * 0.035)}px system-ui, sans-serif`;
    ctx.fillText('"理解是一种归位"', w / 2, h * 0.78);
  }

  if (progress > 0.9) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `14px system-ui, sans-serif`;
    ctx.fillText(`最终得分: ${game.score}  最高连击: ${game.maxCombo}x`, w / 2, h * 0.88);
    ctx.fillText('按空格或点击屏幕重开', w / 2, h * 0.93);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ========== 游戏循环 ==========
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  // 节拍计时器
  game.beatTimer += 1;

  if (game.state === STATES.PLAYING && game.currentObject) {
    const obj = game.currentObject;

    if (obj.active) {
      obj.t += obj.speed;

      // 播放节拍提示音
      if (game.beatTimer % 30 === 0) {
        playBeat(0);
      }

      // 错过
      if (obj.t >= 1) {
        game.misses += 1;
        game.combo = 0;
        game.lastResult = 'miss';
        game.feedbackTimer = 45;
        game.feedbackText = '错过了!东西飘走了!';
        game.feedbackColor = COLORS.chaos;
        obj.active = false;
        obj.failAnim.active = true;
        const w = window.innerWidth;
        const trackLeft = w * 0.08;
        const trackLen = w * 0.84;
        const currentT = obj.startT + (obj.targetT - obj.startT) * obj.t;
        obj.failAnim.x = trackLeft + currentT * trackLen;
        obj.failAnim.y = window.innerHeight * 0.5;
        obj.failAnim.vx = 0;
        obj.failAnim.vy = -2;
        playFailSound();

        setTimeout(() => {
          if (game.state === STATES.PLAYING) {
            game.currentObject = generateObject(game.level, game.character);
          }
        }, 800);
      }
    }

    // 失败动画更新
    if (obj.failAnim.active) {
      obj.failAnim.x += obj.failAnim.vx;
      obj.failAnim.y += obj.failAnim.vy;
      obj.failAnim.vy += 0.15; // 重力
      obj.failAnim.rot += 0.05;
      if (obj.failAnim.y > window.innerHeight + 50) {
        obj.failAnim.active = false;
      }
    }
  }

  if (game.state === STATES.ENDING) {
    game.endingTimer += 1;
  }

  if (game.feedbackTimer > 0) {
    game.feedbackTimer -= 1;
    if (game.feedbackTimer === 0) {
      updateUI();
    }
  }

  // 更新粒子
  game.particles = game.particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 1;
    return p.life > 0;
  });

  // 更新浮动文字
  game.floatingTexts = game.floatingTexts.filter(ft => {
    ft.y += ft.vy;
    ft.life -= 1;
    return ft.life > 0;
  });

  render();
  requestAnimationFrame(gameLoop);
}

// ========== testMode 钩子 ==========
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('testMode') === '1') {
  game._testMode = true;
  Object.defineProperty(window, '__gameState', {
    get() {
      return {
        state: game.state,
        character: game.character,
        score: game.score,
        hits: game.hits,
        misses: game.misses,
        level: game.level,
        combo: game.combo,
        maxCombo: game.maxCombo,
        lastResult: game.lastResult,
        objectsDone: game.objectsDone,
        currentObject: game.currentObject ? {
          t: game.currentObject.t,
          startT: game.currentObject.startT,
          targetT: game.currentObject.targetT,
          halfWidth: game.currentObject.halfWidth,
          speed: game.currentObject.speed,
          active: game.currentObject.active,
          settled: game.currentObject.settled,
        } : null,
      };
    },
  });
}

// ========== 启动 ==========
updateUI();
requestAnimationFrame(gameLoop);
