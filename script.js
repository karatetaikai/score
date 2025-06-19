// State
let state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };
let presetSeconds = 60;

// Preload audio
const oneHue = new Audio('./1hue.mp3');
const twoHue = new Audio('./2hue.mp3');

// Timer variables
let timerInterval = null, paused = true, totalSeconds = presetSeconds;

// Timer functions
function updateTimer() {
  const m = String(Math.floor(totalSeconds/60)).padStart(2,'0');
  const s = String(totalSeconds%60).padStart(2,'0');
  document.getElementById('timer').textContent = m + ':' + s;
}
function startTimer() {
  paused = false;
  if(timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if(!paused && totalSeconds > 0) {
      totalSeconds--;
      updateTimer();
      if(totalSeconds === 16) { oneHue.play(); }
      if(totalSeconds === 0) { twoHue.play(); paused = true; }
    }
  }, 1000);
}
function stopTimer() {
  paused = true;
  if(timerInterval) clearInterval(timerInterval);
}
function resetTimer() {
  paused = true;
  if(timerInterval) clearInterval(timerInterval);
  totalSeconds = presetSeconds;
  updateTimer();
}

// Score functions
function updateScores() {
  ['ippon','waza','yuko','penalty'].forEach(type => {
    document.getElementById('red-'+type).textContent = state.red[type];
    document.getElementById('blue-'+type).textContent = state.blue[type];
  });
  document.getElementById('red-score').textContent = state.red.ippon*3 + state.red.waza*2 + state.red.yuko;
  document.getElementById('blue-score').textContent = state.blue.ippon*3 + state.blue.waza*2 + state.blue.yuko;
}
function changeScore(side,type,delta) {
  const newVal = state[side][type] + delta;
  if(type === 'penalty') {
    if(newVal >= 0 && newVal <= 5) state[side][type] = newVal;
  } else if(newVal >= 0) {
    state[side][type] = newVal;
  }
  updateScores();
}
function resetScores() {
  state = { red:{ippon:0,waza:0,yuko:0,penalty:0}, blue:{ippon:0,waza:0,yuko:0,penalty:0}, firstRed:false, firstBlue:false };
  updateScores();
  document.getElementById('first-red').style.backgroundColor = '#888';
  document.getElementById('first-blue').style.backgroundColor = '#888';
}

// First-take toggles
function toggleFirst(btnId) {
  const btn = document.getElementById(btnId);
  const side = btnId === 'first-red' ? 'red' : 'blue';
  const key = side === 'red' ? 'firstRed' : 'firstBlue';
  state[key] = !state[key];
  btn.style.backgroundColor = state[key] ? side : '#888';
}

// Preset time selection
function selectPreset(btn) {
  presetSeconds = parseInt(btn.dataset.time);
  // update active styles
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  resetTimer();
}

// Events
document.addEventListener('DOMContentLoaded', () => {
  // Timer controls
  document.getElementById('timer-start').addEventListener('click', startTimer);
  document.getElementById('timer-stop').addEventListener('click', stopTimer);
  document.getElementById('timer-plus').addEventListener('click', () => { totalSeconds++; updateTimer(); });
  document.getElementById('timer-minus').addEventListener('click', () => { if(totalSeconds>0) totalSeconds--; updateTimer(); });
  document.getElementById('timer-reset').addEventListener('click', resetTimer);

  // Score controls
  document.querySelectorAll('.plus-btn').forEach(btn => btn.addEventListener('click', e => {
    const sec = e.target.closest('.section');
    changeScore(sec.dataset.side, sec.dataset.type, 1);
  }));
  document.querySelectorAll('.minus-btn').forEach(btn => btn.addEventListener('click', e => {
    const sec = e.target.closest('.section');
    changeScore(sec.dataset.side, sec.dataset.type, -1);
  }));
  document.getElementById('score-reset').addEventListener('click', resetScores);

  // First-take toggles
  document.getElementById('first-red').addEventListener('click', () => toggleFirst('first-red'));
  document.getElementById('first-blue').addEventListener('click', () => toggleFirst('first-blue'));

  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => btn.addEventListener('click', () => selectPreset(btn)));
  // Set default active
  selectPreset(document.querySelector('.preset-btn[data-time="60"]'));

  // Next match
  document.getElementById('next-button').addEventListener('click', () => {
    resetScores();
    resetTimer();
    document.getElementById('match-id').textContent = 'ID: next';
  });

  // Init display
  resetScores();
  resetTimer();
});
