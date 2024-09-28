const quizData = [
    {
        question: "What is the correct way to declare a JavaScript variable?",
        answers: ["var myVariable","let myVariable","const myVariable"," All of the above"],
        correct: 4
    },
    {
        question: "Which of the following is not a JavaScript data type?",
        answers: ["Number", "Boolean", "undefined", "float"],
        correct: 4
    },
    {
        question: " Which company developed JavaScript?",
        answers: ["Microsoft", "Netscape", "Apple", "Google"],
        correct: 2
    },
    {
        question: "What does 'typeof' operator return for an array?",
        answers: ["String", "Object", "Array", "undefined"],
        correct: 1
    },
    {
        question: "Which method adds an element to the end of an array?",
        answers: ["shift()", "pop()", "push()", "unshift()"],
        correct: 3
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let userName = "";
let userAnswers = [];

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const resultEl = document.getElementById('result');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const finalScoreEl = document.getElementById('final-score');
const nameInput = document.getElementById('name-input');
const randomBtn = document.getElementById('random-btn');
const saveScoreBtn = document.getElementById('save-score-btn');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const viewHighScoresBtn = document.getElementById('view-high-scores-btn');
const highScoresEl = document.getElementById('high-scores');
const prevBtn = document.getElementById('prev-btn');
const saveNextBtn = document.getElementById('save-next-btn');

const randomNames = ["Akuu", "Prabhas", "Meghuuu", "AlluArjun", "Sindhu", "Anupama","Satya","Kanksha","NTR"];

randomBtn.addEventListener('click', generateRandomName);
startBtn.addEventListener('click', startQuiz);
viewHighScoresBtn.addEventListener('click', viewHighScores);
saveScoreBtn.addEventListener('click', saveHighScore);
restartBtn.addEventListener('click', restartQuiz);
prevBtn.addEventListener('click', goToPreviousQuestion);
saveNextBtn.addEventListener('click', saveAndNextQuestion);

function generateRandomName() {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    nameInput.value = randomName;
}

function startQuiz() {
    userName = nameInput.value.trim();
    if (!userName) {
        alert("Please enter your name before starting the quiz.");
        return;
    }
    startScreen.style.display = 'none';
    quizScreen.style.display = 'block';
    userAnswers = new Array(quizData.length).fill(null);
    loadQuestion();
    startTimer();
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    questionEl.textContent = question.question;
    progressEl.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

    answersEl.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('btn');
        if (userAnswers[currentQuestion] === index) {
            button.classList.add('selected');
        }
        button.addEventListener('click', () => selectAnswer(index));
        answersEl.appendChild(button);
    });

    prevBtn.style.display = currentQuestion > 0 ? 'block' : 'none';
    saveNextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Save & Next';

    resultEl.textContent = '';
}

function selectAnswer(index) {
    userAnswers[currentQuestion] = index;
    loadQuestion();
}

function saveAndNextQuestion() {
    if (userAnswers[currentQuestion] === null) {
        alert('Please select an answer before proceeding.');
        return;
    }

    if (currentQuestion === quizData.length - 1) {
        endQuiz();
    } else {
        currentQuestion++;
        loadQuestion();
    }
}

function goToPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerInterval);
    score = calculateScore();
    quizScreen.style.display = 'none';
    endScreen.style.display = 'block';
    finalScoreEl.textContent = `Your final score is: ${score}/${quizData.length}`;
}

function calculateScore() {
    return userAnswers.reduce((total, answer, index) => {
        if (answer === quizData[index].correct) {
            return total + 1;
        }
        return total;
    }, 0);
}

function saveHighScore() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name: userName, score });
    localStorage.setItem('highScores', JSON.stringify(highScores));
    alert("Score saved!");
}

function viewHighScores() {
    startScreen.style.display = 'none';
    endScreen.style.display = 'none';
    highScoresEl.style.display = 'block';
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScoresEl.innerHTML = '<h2>High Scores</h2>';
    highScores.forEach(scoreEntry => {
        highScoresEl.innerHTML += `<p>${scoreEntry.name}: ${scoreEntry.score}</p>`;
    });
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 60;
    quizScreen.style.display = 'block';
    endScreen.style.display = 'none';
    loadQuestion();
    startTimer();
}