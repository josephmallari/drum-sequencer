const steps = document.querySelectorAll(".step");
const startButton = document.getElementById("start-button");
const tempoSlider = document.getElementById("tempo-slider");
const tempoDisplay = document.getElementById("tempo-display");
const soundButtons = document.querySelectorAll(".sound-button");
let intervalId = null;
let tempo = 135;

// Create a Web Audio API context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load and store the audio buffers for each sound
const audioBuffers = {};

async function loadSound(sound) {
  const response = await fetch(`sounds/${sound}.wav`);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

async function loadAllSounds() {
  audioBuffers.kick = await loadSound("kick");
  audioBuffers.clap = await loadSound("clap");
  audioBuffers.hihat = await loadSound("hihat");
  audioBuffers.bass = await loadSound("bass");
}

// Call the function to load all sounds
loadAllSounds();

function playSound(sound) {
  const buffer = audioBuffers[sound];
  if (buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  }
}

steps.forEach((step) => {
  step.addEventListener("click", () => {
    step.classList.toggle("active");
  });
});

soundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const sound = button.dataset.sound;
    playSound(sound);
  });
});

startButton.addEventListener("click", () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    startButton.textContent = "Start";
  } else {
    startSequencer();
    startButton.textContent = "Stop";
  }
});

tempoSlider.addEventListener("input", () => {
  tempo = tempoSlider.value;
  tempoDisplay.textContent = tempo;
  if (intervalId) {
    clearInterval(intervalId);
    startSequencer();
  }
});

function startSequencer() {
  const interval = (60 / tempo / 2) * 1000;
  let index = 0;

  function playStep() {
    const currentSteps = document.querySelectorAll(`.step:nth-child(${index + 1})`);
    const previousSteps = document.querySelectorAll(`.step:nth-child(${index === 0 ? 8 : index})`);

    previousSteps.forEach((step) => {
      step.classList.remove("current");
    });

    currentSteps.forEach((step) => {
      step.classList.add("current");
      if (step.classList.contains("active")) {
        const sound = step.parentElement.previousElementSibling.dataset.sound;
        playSound(sound);
      }
    });

    index = (index + 1) % 8;
  }

  playStep(); // Play the first step immediately
  intervalId = setInterval(playStep, interval);
}
