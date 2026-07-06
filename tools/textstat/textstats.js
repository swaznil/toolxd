const textInput = document.getElementById("textInput");

const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const sentenceCount = document.getElementById("sentenceCount");
const paragraphCount = document.getElementById("paragraphCount");
const readingTime = document.getElementById("readingTime");
const charNoSpace = document.getElementById("charNoSpace");

function updateStats() {
  const text = textInput.value;

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordTotal = text.trim() ? words.length : 0;
  const charTotal = text.length;
  const charWithoutSpaces = text.replace(/\s/g, "").length;

  const sentences = text
    .split(/[.!?]+/)
    .filter((sentence) => sentence.trim().length > 0);

  const paragraphs = text
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim().length > 0);

  const readMinutes = Math.max(1, Math.ceil(wordTotal / 200));
  wordCount.textContent = wordTotal;
  charCount.textContent = charTotal;
  sentenceCount.textContent = sentences.length;
  paragraphCount.textContent = paragraphs.length;
  readingTime.textContent = `${readMinutes}m`;
  charNoSpace.textContent = charWithoutSpaces;
}

textInput.addEventListener("input", updateStats);

updateStats();