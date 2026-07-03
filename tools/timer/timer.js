const display = document.getElementById("display");

const subDisplay = document.getElementById("subDisplay");

const startBtn = document.getElementById("startBtn");

const resetBtn = document.getElementById("resetBtn");

const lapBtn = document.getElementById("lapBtn");

const bubble = document.getElementById("bubble");

const laps = document.getElementById("laps");

const tabs = document.querySelectorAll(".tab");

const timerInputs = document.getElementById("timerInputs");

const hours = document.getElementById("hours");

const minutes = document.getElementById("minutes");

const seconds = document.getElementById("seconds");

/* STATE */

let mode = "stopwatch";

let running = false;

let elapsed = 0;

let interval;

let startTime = 0;

let timerDuration = 0;

/* FORMAT */

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

/* BUBBLE ORBIT */

function moveBubble(ms) {
  const radius = 160;

  const angle = (ms / 1000) * 2;

  const x = Math.cos(angle - Math.PI / 2) * radius;

  const y = Math.sin(angle - Math.PI / 2) * radius;

  bubble.style.transform = `translate(${x}px, ${y}px)`;
}

/* SOUND */

function playAlarm() {
  const audio = new Audio(
    "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
  );

  audio.play();
}

/* STOPWATCH */

function updateStopwatch() {
  elapsed = Date.now() - startTime;

  display.textContent = formatTime(elapsed);

  subDisplay.textContent = formatMs(elapsed);

  moveBubble(elapsed);
}

/* TIMER */

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

/* START */

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
    running = false;

    clearInterval(interval);

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
  if (mode !== "stopwatch" || !running) return;

  const lap = document.createElement("div");

  lap.className = "lap";

  lap.innerHTML = `
    <span>
      Lap ${laps.children.length + 1}
    </span>

    <span>
      ${formatTime(elapsed)}.${formatMs(elapsed)}
    </span>
  `;

  laps.prepend(lap);
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

      lapBtn.style.display = "none";
    } else {
      timerInputs.style.display = "none";

      lapBtn.style.display = "inline-flex";
    }
  });
});

document.addEventListener("keydown", (e) => {
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
});

bubble.style.transform = "translate(0px,-160px)";
