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

let mode = "stopwatch";
let running = false;
let elapsed = 0;
let interval;
let startTime = 0;
let timerDuration = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `
  ${String(hrs).padStart(2, "0")}:
  ${String(mins).padStart(2, "0")}:
  ${String(secs).padStart(2, "0")}
  `.replace(/\s/g, "");
}

function formatMs(ms) {
  return String(ms % 1000).padStart(3, "0");
}

function moveBubble(ms) {

  const radius = window.innerWidth <= 980 ? 130 : 160;
  let angle;

  if (mode === "timer") {

    angle = -(ms / 1000) * 2;
  } else {

    angle = (ms / 1000) * 2;
  }

  const x = Math.cos(angle - Math.PI / 2) * radius;
  const y = Math.sin(angle - Math.PI / 2) * radius;
  bubble.style.transform = `translate(${x}px, ${y}px)`;
}

function playAlarm() {

  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",);

  audio.play();
}

function updateStopwatch() {

  elapsed = Date.now() - startTime;
  display.textContent = formatTime(elapsed);
  subDisplay.textContent = formatMs(elapsed);

  moveBubble(elapsed);
}

function updateTimer() {
  const remaining = timerDuration - (Date.now() - startTime);

  if (remaining <= 0) {

    clearInterval(interval);
    running = false;
    display.textContent = "00:00:00";
    subDisplay.textContent = "Done";
    startBtn.textContent = "Start";

    playAlarm();
    return;
  }

  display.textContent = formatTime(remaining);
  subDisplay.textContent = formatMs(remaining);

  moveBubble(remaining);
}

function toggleStart() {
  if (!running) {

    running = true;
    startBtn.textContent = "Pause";

    if (mode === "stopwatch") {

      startTime = Date.now() - elapsed;
      interval = setInterval(updateStopwatch, 10);
    }

    if (mode === "timer") {
      if (timerDuration === 0) {
        timerDuration =
          Number(hours.value) * 3600000 +
          Number(minutes.value) * 60000 +
          Number(seconds.value) * 1000;
      }

      startTime = Date.now();
      interval = setInterval(updateTimer, 10);
    }
  } else {

    clearInterval(interval);
    running = false;
    startBtn.textContent = "Start";

    if (mode === "timer") {
      timerDuration = timerDuration - (Date.now() - startTime);
    }
  }
}

startBtn.addEventListener("click", toggleStart);

function resetEverything() {
  clearInterval(interval);

  running = false;
  elapsed = 0;
  timerDuration = 0;
  display.textContent = "00:00:00";
  subDisplay.textContent = "000";
  startBtn.textContent = "Start";
  laps.innerHTML = "";
  bubble.style.transform = "translate(0px,-160px)";
}

resetBtn.addEventListener("click", resetEverything);

function addLap() {
  if (mode === "stopwatch") {
    if (!running) return;

    const lap = document.createElement("div");
    lap.className = "lap";
    lap.innerHTML = 
    `<span>
        Lap ${laps.children.length + 1}
      </span>

      <span>
        ${formatTime(elapsed)}.${formatMs(elapsed)}
      </span>`;

    laps.prepend(lap);
  }

  if (mode === "timer") {
    timerDuration += 60000;

    if (!running) {

      display.textContent = formatTime(timerDuration);
      subDisplay.textContent = formatMs(timerDuration);
    }

    const lap = document.createElement("div");
    lap.className = "lap";
    lap.innerHTML = `
      <span>
        +1 Minute
      </span>

      <span>
        ${formatTime(timerDuration)}
      </span>
    `;

    laps.prepend(lap);
  }
}

lapBtn.addEventListener("click", addLap);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {

    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    mode = tab.dataset.mode;

    resetEverything();

    if (mode === "timer") {

      timerInputs.style.display = "flex";
      lapBtn.style.display = "inline-flex";
      lapBtn.textContent = "Add Time";
      lapShortcut.innerHTML = `
        <kbd>L</kbd>
        Add Time
      `;
    } else {

      timerInputs.style.display = "none";
      lapBtn.style.display = "inline-flex";
      lapBtn.textContent = "Lap";
      lapShortcut.innerHTML = `
        <kbd>L</kbd>
        Lap
      `;
    }
  });
});

document.addEventListener("keydown", (e) => {

  const tag = document.activeElement.tagName;

  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (e.code === "Space") {
    e.preventDefault();

    toggleStart();
  }

  if (e.key.toLowerCase() === "r") {
    resetEverything();
  }

  if (e.key.toLowerCase() === "l") {
    addLap();
  }

  if (e.key === "1") {

    tabs.forEach((t) => t.classList.remove("active"));
    tabs[0].classList.add("active");
    mode = "stopwatch";

    resetEverything();

    timerInputs.style.display = "none";
    lapBtn.style.display = "inline-flex";
  }

  if (e.key === "2") {
    tabs.forEach((t) => t.classList.remove("active"));
    tabs[1].classList.add("active");
    mode = "timer";

    resetEverything();

    timerInputs.style.display = "flex";
    lapBtn.style.display = "none";
  }
});

bubble.style.transform = "translate(0px,-160px)";