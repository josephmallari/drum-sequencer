const steps = document.querySelectorAll(".step");
const startButton = document.getElementById("start-button");
let intervalId = null;

steps.forEach((step) => {
  step.addEventListener("click", () => {
    step.classList.toggle("active");
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

function startSequencer() {
  const tempo = 120;
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

function playSound(sound) {
  const audio = new Audio(`sounds/${sound}.wav`);
  audio.play();
}
