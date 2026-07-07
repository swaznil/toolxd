const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const choiceInput = document.getElementById("choiceInput");
const addChoiceBtn = document.getElementById("addChoiceBtn");
const choicesList = document.getElementById("choicesList");
const choiceCount = document.getElementById("choiceCount");
const winnerText = document.getElementById("winnerText");
const spinBtn = document.getElementById("spinBtn");
const clearBtn = document.getElementById("clearBtn");

const colors = [
  "#ff0000",
  "#ff6f00",
  "#d7cb24",
  "#3cff00",
  "#20d82f",
  "#1cb6a4",
  "#1da9ef",
  "#286ddd",
  "#7468f5",
  "#ce5af9",
  "#f33d83",
  "#f72a2a",
];

let choices = [];
let rotation = 0;
let spinning = false;

function resizeCanvas() {
  const size = canvas.parentElement.clientWidth;
  canvas.width = size;
  canvas.height = size;
  drawWheel();
}

function drawWheel() {
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 6;

  ctx.clearRect(0, 0, size, size);

  if (choices.length === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#888";
    ctx.font = '600 16px "IBM Plex Mono", monospace';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Add choices", cx, cy);
    return;
  }

  const sliceAngle = (Math.PI * 2) / choices.length;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  choices.forEach((choice, i) => {
    const start = i * sliceAngle;
    const end = start + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.font = '600 14px "IBM Plex Mono", monospace';
    const label = choice.length > 18 ? choice.slice(0, 16) + "…" : choice;
    ctx.fillText(label, radius - 16, 0);
    ctx.restore();
  });

  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fillStyle = "#111";
  ctx.fill();
}

function renderChoicesList() {
  choiceCount.textContent = choices.length;

  if (choices.length === 0) {
    choicesList.innerHTML =
      '<div class="choice-empty">No choices yet. Add some above.</div>';
    return;
  }

  choicesList.innerHTML = choices
    .map(
      (choice, i) => `
    <div class="choice-row" data-index="${i}">
      <span class="choice-swatch" style="background:${colors[i % colors.length]}"></span>
      <span class="choice-number">${String(i + 1).padStart(2, "0")}</span>
      <input class="choice-input" value="${choice.replace(/"/g, "&quot;")}" maxlength="40" />
      <button class="choice-remove" type="button" aria-label="Remove">×</button>
    </div>`,).join("");

  choicesList.querySelectorAll(".choice-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const idx = Number(e.target.closest(".choice-row").dataset.index);
      choices[idx] = e.target.value;
      drawWheel();
    });
  });

  choicesList.querySelectorAll(".choice-remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.target.closest(".choice-row").dataset.index);
      choices.splice(idx, 1);
      renderChoicesList();
      drawWheel();
    });
  });
}

function addChoice() {
  const value = choiceInput.value.trim();
  if (!value) return;
  choices.push(value);
  choiceInput.value = "";
  renderChoicesList();
  drawWheel();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spin() {
  if (spinning || choices.length === 0) return;
  spinning = true;
  spinBtn.disabled = true;
  winnerText.textContent = "Spinning...";
  
  const spins = 4 + Math.random() * 3 ;
  const extraAngle = Math.random() * Math.PI * 2;
  const totalRotation = spins * Math.PI * 2 + extraAngle;
  const startRotation = rotation;
  const duration = 4200;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    rotation = startRotation + totalRotation * eased;
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      spinBtn.disabled = false;
      const sliceAngle = (Math.PI * 2) / choices.length;
      const normalized =
        ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const pointerAngle =
        (Math.PI * 2 - normalized + Math.PI * 1.5) % (Math.PI * 2);
      const index = Math.floor(pointerAngle / sliceAngle) % choices.length;
      winnerText.textContent = choices[index];
    }
  }

  requestAnimationFrame(animate);
}

function clearChoices() {
  choices = [];
  rotation = 0;
  winnerText.textContent = "Add choices to begin";
  renderChoicesList();
  drawWheel();
}

addChoiceBtn.addEventListener("click", addChoice);
choiceInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addChoice();
});
spinBtn.addEventListener("click", spin);
clearBtn.addEventListener("click", clearChoices);
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
renderChoicesList();