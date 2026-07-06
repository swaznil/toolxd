const text = document.getElementById("text");
const algorithm = document.getElementById("algorithm");
const generateBtn = document.getElementById("generateBtn");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const removeFile = document.getElementById("removeFile");
const hashOutput = document.getElementById("hashOutput");
const copyBtn = document.getElementById("copyBtn");

let selectedFile = null;

fileInput.addEventListener("change", () => {
  selectedFile = fileInput.files[0];

  if (!selectedFile) {
    fileInfo.textContent = "No file selected";
    return;
  }

  fileInfo.textContent = selectedFile.name;
});

removeFile.addEventListener("click", () => {
  selectedFile = null;

  fileInput.value = "";

  fileInfo.textContent = "No file selected";
});

generateBtn.addEventListener("click", async () => {
  try {
    hashOutput.textContent = "Generating hash...";

    let buffer;

    if (selectedFile) {
      buffer = await selectedFile.arrayBuffer();
    } else {
      const value = text.value.trim();

      if (!value) {
        hashOutput.textContent = "Enter text or upload a file";
        return;
      }

      buffer = new TextEncoder().encode(value);
    }

    const hashBuffer = await crypto.subtle.digest(algorithm.value, buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    hashOutput.textContent = hash;
  } catch {
    hashOutput.textContent = "Failed to generate hash";
  }
});

copyBtn.addEventListener("click", async () => {
  const value = hashOutput.textContent;

  if (
    value === "Your generated hash will appear here" ||
    value === "Generating hash..." ||
    value === "Enter text or upload a file"
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
});