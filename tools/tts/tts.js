const textInput = document.getElementById("textInput");
const voiceSelect = document.getElementById("voiceSelect");
const speed = document.getElementById("speed");
const pitch = document.getElementById("pitch");
const speedValue = document.getElementById("speedValue");
const pitchValue = document.getElementById("pitchValue");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");
const speechCard = document.querySelector(".speech-card");

let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");

    option.value = index;

    option.textContent = `${voice.name} • ${voice.lang}`;

    voiceSelect.appendChild(option);
  });
}

loadVoices();

speechSynthesis.onvoiceschanged = loadVoices;

speed.addEventListener("input", () => {
  speedValue.textContent = `${speed.value}x`;
});

pitch.addEventListener("input", () => {
  pitchValue.textContent = pitch.value;
});

function speak() {
  const text = textInput.value.trim();

  if (!text) return;

  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.voice = voices[voiceSelect.value];

  utterance.rate = Number(speed.value);

  utterance.pitch = Number(pitch.value);

  utterance.onstart = () => {
    status.textContent = "Speaking";

    speechCard.classList.add("speaking");
  };

  utterance.onend = () => {
    status.textContent = "Idle";

    speechCard.classList.remove("speaking");

    pauseBtn.textContent = "Pause";
  };

  speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", speak);

pauseBtn.addEventListener("click", () => {
  if (speechSynthesis.speaking) {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();

      pauseBtn.textContent = "Pause";

      status.textContent = "Speaking";
    } else {
      speechSynthesis.pause();

      pauseBtn.textContent = "Resume";

      status.textContent = "Paused";
    }
  }
});

stopBtn.addEventListener("click", () => {
  speechSynthesis.cancel();

  speechCard.classList.remove("speaking");

  pauseBtn.textContent = "Pause";

  status.textContent = "Idle";
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && document.activeElement !== textInput) {
    event.preventDefault();

    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();

      pauseBtn.textContent = "Resume";

      status.textContent = "Paused";
    } else if (speechSynthesis.paused) {
      speechSynthesis.resume();

      pauseBtn.textContent = "Pause";

      status.textContent = "Speaking";
    } else {
      speak();
    }
  }

  if (event.key.toLowerCase() === "s") {
    speechSynthesis.cancel();

    speechCard.classList.remove("speaking");

    pauseBtn.textContent = "Pause";

    status.textContent = "Idle";
  }
});