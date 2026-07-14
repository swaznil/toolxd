const display = document.getElementById("display");
const subDisplay = document.getElementById("subDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");
const bubble = document.getElementById("bubble");
const laps = document.getElementById("laps");
const lapShortcut = document.getElementById("lapShortcut");
const tabs = document.querySelectorAll(".tab");
const timerInputs = document.getElementById("timerInputs");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const state = {
  mode: "stopwatch",
  running: false,
  stopwatchElapsed: 0,
  stopwatchStartAt: 0,
  timerRemaining: 0,
  timerStartAt: 0,
  timerEndAt: 0,
  timerDone: false,
  rafId: null,
};

function formatClock(ms) {
  const safeMs = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(safeMs / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatMs(ms) {
  return String(Math.floor(Math.max(0, ms)) % 1000).padStart(3, "0");
}

function getBubbleRadius() {
  return window.innerWidth <= 980 ? 130 : 160;
}

function resetBubble() {
  const radius = getBubbleRadius();
  bubble.style.transform = `translate(0px, -${radius}px)`;
}

function setBubblePosition(ms) {
  const radius = getBubbleRadius();
  const secondsValue = ms / 1000;
  const angle = state.mode === "timer" ? -(secondsValue * 2) : secondsValue * 2;
  const x = Math.cos(angle - Math.PI / 2) * radius;
  const y = Math.sin(angle - Math.PI / 2) * radius;
  bubble.style.transform = `translate(${x}px, ${y}px)`;
}

function renderClock(ms) {
  display.textContent = formatClock(ms);
  subDisplay.textContent = formatMs(ms);
}

function renderTimerDone() {
  display.textContent = "00:00:00";
  subDisplay.textContent = "Done";
  resetBubble();
}

function getTimerInputMs() {
  const h = Math.max(0, Number(hours.value) || 0);
  const m = Math.max(0, Number(minutes.value) || 0);
  const s = Math.max(0, Number(seconds.value) || 0);

  return h * 3600000 + m * 60000 + s * 1000;
}

function playAlarm() {
  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
  audio.play().catch(() => {});
}

function stopLoop() {
  if (state.rafId !== null) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function renderFrame(now) {
  if (!state.running) {
    state.rafId = null;
    return;
  }

  if (state.mode === "stopwatch") {
    const elapsed = now - state.stopwatchStartAt;
    state.stopwatchElapsed = elapsed;
    renderClock(elapsed);
    setBubblePosition(elapsed);
    state.rafId = requestAnimationFrame(renderFrame);
    return;
  }

  const remaining = state.timerEndAt - now;

  if (remaining <= 0) {
    finishTimer();
    return;
  }

  state.timerRemaining = remaining;
  renderClock(remaining);
  setBubblePosition(remaining);
  state.rafId = requestAnimationFrame(renderFrame);
}

function startLoop() {
  stopLoop();
  state.rafId = requestAnimationFrame(renderFrame);
}

function renderStaticView() {
  if (state.mode === "stopwatch") {
    if (state.stopwatchElapsed > 0) {
      renderClock(state.stopwatchElapsed);
      setBubblePosition(state.stopwatchElapsed);
      return;
    }

    display.textContent = "00:00:00";
    subDisplay.textContent = "000";
    resetBubble();
    return;
  }

  if (state.timerDone) {
    renderTimerDone();
    return;
  }

  const preview = state.timerRemaining > 0 ? state.timerRemaining : getTimerInputMs();
  renderClock(preview);
  resetBubble();
}

function syncModeUI() {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === state.mode);
  });

  const timerMode = state.mode === "timer";

  timerInputs.style.display = timerMode ? "flex" : "none";
  lapBtn.style.display = "inline-flex";
  lapBtn.textContent = timerMode ? "Add Time" : "Lap";
  lapShortcut.innerHTML = timerMode ? `<kbd>L</kbd> Add Time` : `<kbd>L</kbd> Lap`;
}

function resetEverything() {
  stopLoop();
  state.running = false;
  state.stopwatchElapsed = 0;
  state.stopwatchStartAt = 0;
  state.timerRemaining = 0;
  state.timerStartAt = 0;
  state.timerEndAt = 0;
  state.timerDone = false;
  startBtn.textContent = "Start";
  laps.innerHTML = "";
  renderStaticView();
}

function finishTimer() {
  stopLoop();
  state.running = false;
  state.timerRemaining = 0;
  state.timerStartAt = 0;
  state.timerEndAt = 0;
  state.timerDone = true;
  startBtn.textContent = "Start";
  renderTimerDone();
  playAlarm();
}

function toggleStart() {
  if (state.mode === "stopwatch") {
    if (!state.running) {
      state.running = true;
      state.stopwatchStartAt = performance.now() - state.stopwatchElapsed;
      startBtn.textContent = "Pause";
      startLoop();
      return;
    }

    state.stopwatchElapsed = performance.now() - state.stopwatchStartAt;
    state.running = false;
    startBtn.textContent = "Start";
    stopLoop();
    renderStaticView();
    return;
  }

  if (!state.running) {
    if (state.timerDone || state.timerRemaining <= 0) {
      state.timerRemaining = getTimerInputMs();
      state.timerDone = false;
    }

    if (state.timerRemaining <= 0) {
      renderStaticView();
      return;
    }

    state.running = true;
    state.timerStartAt = performance.now();
    state.timerEndAt = state.timerStartAt + state.timerRemaining;
    startBtn.textContent = "Pause";
    startLoop();
    return;
  }

  state.timerRemaining = Math.max(0, state.timerEndAt - performance.now());
  state.running = false;
  startBtn.textContent = "Start";
  stopLoop();
  renderStaticView();
}

function addLapOrTime() {
  if (state.mode === "stopwatch") {
    if (!state.running) return;

    const lap = document.createElement("div");
    lap.className = "lap";
    lap.innerHTML = `
      <span>Lap ${laps.children.length + 1}</span>
      <span>${formatClock(state.stopwatchElapsed)}.${formatMs(state.stopwatchElapsed)}</span>
    `;
    laps.prepend(lap);
    return;
  }

  const base = state.running
    ? state.timerRemaining
    : state.timerRemaining > 0
      ? state.timerRemaining
      : getTimerInputMs();

  state.timerRemaining = base + 60000;
  state.timerDone = false;

  if (state.running) {
    state.timerEndAt += 60000;
    renderClock(state.timerRemaining);
    setBubblePosition(state.timerRemaining);
  } else {
    renderStaticView();
  }

  const lap = document.createElement("div");
  lap.className = "lap";
  lap.innerHTML = `
    <span>+1 Minute</span>
    <span>${formatClock(state.timerRemaining)}</span>
  `;
  laps.prepend(lap);
}

function switchMode(nextMode) {
  if (state.mode === nextMode) return;
  state.mode = nextMode;
  syncModeUI();
  resetEverything();
}

startBtn.addEventListener("click", toggleStart);
resetBtn.addEventListener("click", resetEverything);
lapBtn.addEventListener("click", addLapOrTime);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchMode(tab.dataset.mode);
  });
});

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;

  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.code === "Space") {
    e.preventDefault();
    toggleStart();
    return;
  }

  if (e.code === "KeyR") {
    e.preventDefault();
    resetEverything();
    return;
  }

  if (e.code === "KeyL") {
    e.preventDefault();
    addLapOrTime();
    return;
  }

  if (e.code === "Digit1") {
    e.preventDefault();
    switchMode("stopwatch");
    return;
  }

  if (e.code === "Digit2") {
    e.preventDefault();
    switchMode("timer");
  }
});

[hours, minutes, seconds].forEach((input) => {
  input.addEventListener("input", () => {
    if (state.mode === "timer" && !state.running && !state.timerDone) {
      renderStaticView();
    }
  });
});

window.addEventListener("resize", () => {
  if (!state.running) {
    renderStaticView();
  }
});

resetBubble();
syncModeUI();
renderStaticView();