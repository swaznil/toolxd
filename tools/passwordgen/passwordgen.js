const password = document.getElementById("password");
const copyBtn = document.getElementById("copyBtn");
const generateBtn = document.getElementById("generateBtn");
const slider = document.getElementById("slider");
const lengthInput = document.getElementById("lengthInput");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

function updateSlider() {
  const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;

  slider.style.background = `linear-gradient(
    90deg,
    #111 ${value}%,
    rgba(0,0,0,.08) ${value}%
    )`;
}

slider.addEventListener("input", () => {
  lengthInput.value = slider.value;

  updateSlider();
});

lengthInput.addEventListener("input", () => {
  let value = parseInt(lengthInput.value);

  if (isNaN(value)) value = 6;

  if (value < 6) value = 6;
  if (value > 64) value = 64;

  slider.value = value;
  lengthInput.value = value;

  updateSlider();
});

/* PASSWORD */

function generatePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+=-{}[]<>?/";

  let chars = "";

  if (uppercase.checked) chars += upper;
  if (lowercase.checked) chars += lower;
  if (numbers.checked) chars += nums;
  if (symbols.checked) chars += syms;

  if (chars.length === 0) {
    password.textContent = "Select at least one option";

    return;
  }

  let result = "";

  for (let i = 0; i < slider.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  password.textContent = result;
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(password.textContent);

  copyBtn.classList.add("copied");

  setTimeout(() => {
    copyBtn.classList.remove("copied");
  }, 1600);
});

updateSlider();
generatePassword();