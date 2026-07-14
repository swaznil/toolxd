const colorPicker = document.getElementById("colorPicker");
const hexInput = document.getElementById("hexInput");
const hexValue = document.getElementById("hexValue");
const rgbValue = document.getElementById("rgbValue");
const hslValue = document.getElementById("hslValue");
const presets = document.querySelectorAll(".preset");

const paletteGrid = document.getElementById("paletteGrid");
const generateBtn = document.getElementById("generateBtn");
const styleButtons = document.querySelectorAll(".style-btn");

let currentStyle = "modern";

presets.forEach((preset) => {
  preset.style.background = preset.dataset.color;

  preset.addEventListener("click", () => {

    colorPicker.value = preset.dataset.color;
    hexInput.value = preset.dataset.color;
    generatePalette();
  });
});

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {

    styleButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentStyle = button.dataset.style;
    generatePalette();
  });
});

colorPicker.addEventListener("input", () => {

  hexInput.value = colorPicker.value;
  generatePalette();
});

hexInput.addEventListener("input", () => {

  const value = hexInput.value;
  if (/^#([0-9A-F]{6})$/i.test(value)) {

    colorPicker.value = value;
    generatePalette();
  }
});

generateBtn.addEventListener("click", generatePalette);

function hexToRgb(hex) {

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0"),
      ).join("")
  );
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } 
  else {

    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function buildPalette(base) {
  const rgb = hexToRgb(base);

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  let palette = [];

  if (currentStyle === "modern") {
    palette = [
      [hsl.h, 85, 12],
      [hsl.h, 65, 24],
      [hsl.h, 72, 52],
      [hsl.h + 10, 78, 68],
      [hsl.h + 18, 90, 94],
    ];
  }

  if (currentStyle === "pastel") {
    palette = [
      [hsl.h - 12, 45, 92],
      [hsl.h - 4, 52, 84],
      [hsl.h, 58, 76],
      [hsl.h + 8, 54, 68],
      [hsl.h + 16, 48, 60],
    ];
  }

  if (currentStyle === "dark") {
    palette = [
      [hsl.h, 40, 8],
      [hsl.h, 44, 14],
      [hsl.h, 52, 24],
      [hsl.h + 8, 64, 36],
      [hsl.h + 16, 72, 48],
    ];
  }

  if (currentStyle === "vibrant") {
    palette = [
      [hsl.h, 100, 42],
      [hsl.h + 18, 96, 52],
      [hsl.h + 42, 90, 58],
      [hsl.h + 65, 88, 54],
      [hsl.h + 90, 82, 48],
    ];
  }

  return palette.map((color) => {
    let hue = color[0];

    if (hue > 360) {
      hue -= 360;
    }
    if (hue < 0) {
      hue += 360;
    }

    const rgb = hslToRgb(hue, color[1], color[2]);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  });
}

function generatePalette() {

  const base = colorPicker.value;
  const palette = buildPalette(base);
  paletteGrid.innerHTML = "";
  palette.forEach((color) => {
    const card = document.createElement("div");

    card.className = "palette-card";

    card.innerHTML = `
      <div
        class="palette-color"
        style="background:${color}"
      ></div>

      <div class="palette-info">
        <button>${color}</button>
      </div>
    `;

    paletteGrid.appendChild(card);
    const button = card.querySelector("button");
    button.addEventListener("click", async () => {

      await navigator.clipboard.writeText(color);
      const original = color;
      button.textContent = "Copied";
      button.classList.add("copied");

      setTimeout(() => {
        button.textContent = original;
        button.classList.remove("copied");
      }, 1400);
    });
  });

  const rgb = hexToRgb(base);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  hexValue.textContent = base;
  rgbValue.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  hslValue.textContent = `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
}

generatePalette();