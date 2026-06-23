const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
const hintText = document.getElementById('hint-text');

// 响应式 Canvas 尺寸 + devicePixelRatio 适配
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

// 游戏状态
let state = {
  score: 0,
  hits: 0,
  misses: 0,
  isPlaying: false,
  lastResult: null,
  // 示意实体：沿固定路径移动的小球
  ball: {
    x: 0,
    y: 0,
    t: 0, // 0~1 归一化时间
    speed: 0.005,
    radius: 12,
  },
  // 时机窗口标记
  target: {
    t: 0.5, // 目标位置（归一化）
    halfWidth: 0.08, // 窗口半宽
  },
};

// 统一输入：单键按下事件
function onPress() {
  if (!state.isPlaying) {
    startGame();
    return;
  }
  // 计算当前小球位置与目标窗口的距离
  const delta = Math.abs(state.ball.t - state.target.t);
  if (delta <= state.target.halfWidth) {
    state.score += 10;
    state.hits += 1;
    state.lastResult = 'hit';
  } else if (state.ball.t < state.target.t) {
    state.lastResult = 'early';
    state.misses += 1;
  } else {
    state.lastResult = 'late';
    state.misses += 1;
  }
  updateUI();
}

// 键盘输入
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    onPress();
  }
});

// 触摸/点击输入
canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  onPress();
});

function startGame() {
  state.isPlaying = true;
  state.score = 0;
  state.hits = 0;
  state.misses = 0;
  state.lastResult = null;
  state.ball.t = 0;
  hintText.textContent = '时机到就按！';
  updateUI();
}

function updateUI() {
  scoreDisplay.textContent = `Score: ${state.score}`;
  if (state.lastResult) {
    hintText.textContent = {
      hit: '命中！',
      early: '早了…',
      late: '晚了…',
    }[state.lastResult] || '';
  }
}

// 游戏循环
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  if (state.isPlaying) {
    // 更新小球位置
    state.ball.t += state.ball.speed;
    if (state.ball.t > 1) {
      state.ball.t = 0;
      state.misses += 1;
      state.lastResult = 'miss';
      updateUI();
    }
  }

  render();
  requestAnimationFrame(gameLoop);
}

function render() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  // 绘制轨道背景
  const trackY = h * 0.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, trackY);
  ctx.lineTo(w * 0.9, trackY);
  ctx.stroke();

  // 绘制时机窗口
  const targetX = w * 0.1 + state.target.t * (w * 0.8);
  const halfPx = state.target.halfWidth * (w * 0.8);
  ctx.fillStyle = 'rgba(100, 200, 100, 0.25)';
  ctx.fillRect(targetX - halfPx, trackY - 20, halfPx * 2, 40);
  ctx.strokeStyle = 'rgba(100, 200, 100, 0.6)';
  ctx.strokeRect(targetX - halfPx, trackY - 20, halfPx * 2, 40);

  // 绘制小球
  const ballX = w * 0.1 + state.ball.t * (w * 0.8);
  ctx.fillStyle = state.lastResult === 'hit' ? '#6f6' : state.lastResult ? '#f66' : '#fff';
  ctx.beginPath();
  ctx.arc(ballX, trackY, state.ball.radius, 0, Math.PI * 2);
  ctx.fill();

  // 绘制中心标记
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(targetX - 1, trackY - 24, 2, 48);
}

// testMode 钩子
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('testMode') === '1') {
  state.ball.speed = 0.01; // 固定速度，加快测试
  window.__gameState = state;
}

// 启动
requestAnimationFrame(gameLoop);
