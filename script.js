const exploreButton = document.getElementById("explore-btn");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const resultContainer = document.getElementById("result-container");
const resultText = document.getElementById("result-text");
const imageContainer = document.getElementById("image-container");
const generateFullBtn = document.getElementById("generate-full-btn");

let currentQuestionIndex, score, answeredQuestions;

const yayAudio = new Audio("assets/yay.mp4");
const wrongAudio = new Audio("assets/wrong.mp4");
yayAudio.preload = "auto";
wrongAudio.preload = "auto";

const questions = [
  {
    question: "Which part of the skeleton is the cozy 'house' that protects the brain?",
    type: "text",
    correctAnswer: "Cranium"
  },
  {
    question: "Which bone forms the forehead?",
    type: "text",
    correctAnswer: "Frontal bone",
    image: "assets/frontal.jpg"
  },
  {
    question: "Which pair of bones forms the roof and sides of the skull?",
    type: "text",
    correctAnswer: "Parietal bones",
    image: "assets/parietal.jpg"
  },
  {
    question: "What is the point where the coronal suture meets the sagittal suture?",
    type: "text",
    correctAnswer: "Bregma"
  },
  {
    question: "What is the point where the sagittal suture meets the lambdoid suture?",
    type: "text",
    correctAnswer: "Lambda"
  },
  {
    question: "What is this bone called?",
    type: "text",
    correctAnswer: "Temporal bone",
    image: "assets/temporal.jpg"
  },
  {
    question: "I'm the grand stage where the biggest star—the spinal cord—makes its entrance into the skull. Name the opening and the bone I belong to.",
    type: "text",
    correctAnswer: "Foramen magnum of the Occipital bone",
    image: "assets/occipital bone.jpg"
  },
  {
    question: "I'm the only freely movable bone of the skull. Who am I?",
    type: "text",
    correctAnswer: "Mandible",
    image: "assets/mandible.jpg"
  },
  {
    question: "Which bone forms the upper jaw and holds the upper teeth in place?",
    type: "text",
    correctAnswer: "Maxilla",
    image: "assets/maxilla.jpg"
  },
  {
    question: "Which is NOT part of the skull? (Bonus Question)",
    type: "multi-select",
    answers: [
      { text: "Inferior vena cava", correct: true },
      { text: "Inferior articular process", correct: true },
      { text: "Inferior nasal concha", correct: false },
      { text: "Inferior angle of the scapula", correct: true }
    ],
    bonus: true
  }
];


// Smooth scroll to first info section
exploreButton.addEventListener("click", () => {
  document.getElementById("first-info").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Quiz functionality
startButton.addEventListener("click", startQuiz);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartButton.addEventListener("click", startQuiz);
generateFullBtn.addEventListener("click", generateFullPicture);

function startQuiz() {
  startButton.classList.add("hide");
  restartButton.classList.add("hide");
  resultContainer.classList.add("hide");
  scoreContainer.classList.remove("hide");
  questionContainer.classList.remove("hide");
  imageContainer.innerHTML = "";
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions = 0;
  scoreElement.innerText = score;
  setNextQuestion();
  generateFullBtn.classList.remove("hide");   // Show button but disabled
  generateFullBtn.disabled = true;            // Disable at start
}

function setNextQuestion() {
  resetState();
  showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
  questionElement.innerText = question.question;

  if (question.type === "text") {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("btn-explore");
    input.placeholder = "Type your answer...";
    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        checkTextAnswer(input.value, question.correctAnswer, question.image);
      }
    });
    answerButtons.appendChild(input);
  } else if (question.type === "multi-select") {
    const answers = [...question.answers].sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = answer.text;
      if (answer.correct) {
        checkbox.dataset.correct = answer.correct;
      }
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(answer.text));
      label.classList.add("btn-explore");
      answerButtons.appendChild(label);
    });
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.classList.add("btn-explore");
    submitButton.addEventListener("click", () => checkMultiSelectAnswer(question.image));
    answerButtons.appendChild(submitButton);
  } else {
    const answers = [...question.answers].sort(() => Math.random() - 0.5);
    answers.forEach(answer => {
      const button = document.createElement("button");
      button.innerText = answer.text;
      button.classList.add("btn-explore");
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", () => selectAnswer(answer.correct, question.image));
      answerButtons.appendChild(button);
    });
  }
}

function resetState() {
  nextButton.classList.add("hide");
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(correct, image) {
  if (correct) {
    score += 1;
    scoreElement.innerText = score;
    yayAudio.play();
  } else {
    wrongAudio.play();
  }
  addImage(image);
  Array.from(answerButtons.children).forEach(button => {
    button.disabled = true;
  });
  showNextOrFinish();
}

function checkTextAnswer(userAnswer, correctAnswer, image) {
  const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase();
  if (isCorrect) {
    score += 1;
    scoreElement.innerText = score;
    yayAudio.play();
  } else {
    wrongAudio.play();
  }
  addImage(image);
  answerButtons.children[0].disabled = true;
  showNextOrFinish();
}

function checkMultiSelectAnswer(image) {
  const checkboxes = Array.from(answerButtons.querySelectorAll('input[type="checkbox"]'));
  const selectedAnswers = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
  const correctAnswers = questions[currentQuestionIndex].answers
    .filter(answer => answer.correct)
    .map(answer => answer.text);
  const isCorrect = selectedAnswers.length === correctAnswers.length &&
    selectedAnswers.every(val => correctAnswers.includes(val)) &&
    correctAnswers.every(val => selectedAnswers.includes(val));
  
  if (isCorrect) {
    score += 1;
    scoreElement.innerText = score;
    yayAudio.play();
  } else {
    wrongAudio.play();
  }
  addImage(image);
  checkboxes.forEach(cb => cb.disabled = true);
  answerButtons.lastChild.disabled = true;
  showNextOrFinish();
}

function addImage(imageSrc) {
  if (imageSrc) {
    answeredQuestions++;
    const img = document.createElement("img");
    img.src = imageSrc;
    img.setAttribute("data-aos", "fade-in");
    img.setAttribute("data-aos-duration", "1000");
    imageContainer.appendChild(img);
    AOS.refresh();
  }
}

function showNextOrFinish() {
  if (questions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  questionContainer.classList.add("hide");
  scoreContainer.classList.add("hide");
  resultContainer.classList.remove("hide");
  resultText.innerText = `Final Score: ${score}/${questions.length} 🎉`;
  restartButton.classList.remove("hide");
  generateFullBtn.disabled = false;   // Enable now
}


function generateFullPicture() {
  imageContainer.innerHTML = "";
  const fullImage = document.createElement("img");
  fullImage.src = "assets/full.jpg";
  fullImage.classList.add("full-image");
  fullImage.setAttribute("data-aos", "fade-in");
  fullImage.setAttribute("data-aos-duration", "1000");
  imageContainer.appendChild(fullImage);
  generateFullBtn.classList.add("hide");
  AOS.refresh();
}