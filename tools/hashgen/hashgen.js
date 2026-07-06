const text = document.getElementById("text");
const algorithm = document.getElementById("algorithm");
const generateBtn = document.getElementById("generateBtn");
const hashOutput = document.getElementById("hashOutput");
const copyBtn = document.getElementById("copyBtn");

async function generateHash() {
  const value = text.value.trim();

  if (!value) {
    hashOutput.textContent = "Please enter some text";
    return;
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const buffer = await crypto.subtle.digest(algorithm.value, data);
  const hashArray = Array.from(new Uint8Array(buffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  hashOutput.textContent = hashHex;
}

async function copyHash() {
  const value = hashOutput.textContent;

  if (
    value === "Your hash will appear here" ||
    value === "Please enter some text"
  ) {
    return;
  }

  await navigator.clipboard.writeText(value);

  copyBtn.textContent = "Copied";
  copyBtn.classList.add("copied");

  setTimeout(() => {
    copyBtn.textContent = "Copy";
    copyBtn.classList.remove("copied");
  }, 1600);
}

generateBtn.addEventListener("click", generateHash);
copyBtn.addEventListener("click", copyHash);

text.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    generateHash();
  }
});