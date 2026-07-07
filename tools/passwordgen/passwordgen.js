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
  calculateStrength(result);
}

function calculateStrength(passwordValue) {
  let charsetSize = 0;

  if (/[A-Z]/.test(passwordValue)) charsetSize += 26;
  if (/[a-z]/.test(passwordValue)) charsetSize += 26;
  if (/[0-9]/.test(passwordValue)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(passwordValue)) charsetSize += 32;

  const entropy = passwordValue.length * Math.log2(charsetSize || 1);

  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");
  const crackTime = document.getElementById("crackTime");

  let label = "";
  let width = 0;
  let estimate = "";

  if (entropy < 40) {
    label = "Weak";
    width = 25;
    estimate = "a few seconds";
  } else if (entropy < 60) {
    label = "Moderate";
    width = 50;
    estimate = "a few hours";
  } else if (entropy < 80) {
    label = "Strong";
    width = 75;
    estimate = "thousands of years";
  } else {
    label = "Very Strong";
    width = 100;
    estimate = "millions of years";
  }

  strengthText.textContent = label;
  strengthFill.style.width = width + "%";

  crackTime.textContent = `Estimated crack time: ${estimate}`;
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
calculateStrength(password.textContent);