// Global variables
let selectedQuestions = [];
let currentIndex = 0;
let timerInterval;
let timeLeft = 30;

// Question banks
const questions = {
    trivia: [
        { q: "What’s the capital of France?", options: ["Paris", "London", "Berlin"], a: "Paris" },
        { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter"], a: "Mars" },
        { q: "Who painted the Mona Lisa?", options: ["Van Gogh", "Da Vinci", "Picasso"], a: "Da Vinci" },
        { q: "What is the name of our galaxy?", options: ["Andromeda", "Milky Way", "Android"], a: "Milky Way" },
        { q: "In which continent is Angola?", options: ["South America", "Asia", "Africa"], a: "Africa" },
        { q: "Who was the first person to win two Nobel Prizes in different scientific fields?", options: ["Marie Curie", "Albert Einstein", "Nikola Tesla"], a: "Marie Curie" },
        { q: "What is the longest river in the world?", options: ["The Amazon River", "The River Thames", "The Nile River"], a: "The Nile River" },
        { q: "In which year did the Berlin Wall fall?", options: ["1985", "1989", "Yet to Fall"], a: "1989" },
        { q: "Who was the first person to travel into space?", options: ["Yuri Gagarin", "Neil Armstrong", "Elon Musk"], a: "Yuri Gagarin" },
        { q: "What is the smallest country in the world by land area?", options: ["Andorra", "Iceland", "Vatican City"], a: "Vatican City" },
    ],
    math: [
        { q: "What is the square root of 36?", options: ["4", "5", "6"], a: "6" },
        { q: "What is 10 × 2?", options: ["20", "12", "22"], a: "20" },
        { q: "What is 15 - 7?", options: ["8", "7", "9"], a: "8" },
        { q: "What is the square root of 144?", options: ["10", "12", "14"], a: "12" },
        { q: "What is 7 × 8?", options: ["54", "56", "64"], a: "56" },
        { q: "What is 25% of 80?", options: ["15", "20", "25"], a: "20" },
        { q: "What is the perimeter of a rectangle with length 5 and width 3?", options: ["16", "15", "18"], a: "16" },
        { q: "What is 9²?", options: ["72", "81", "90"], a: "81" },
        { q: "If a triangle has angles of 30° and 60°, what is the third angle?", options: ["60°", "90°", "100°"], a: "90°" },
        { q: "What is 3/4 of 16?", options: ["10", "12", "14"], a: "12" },
    ],
    football: [
        { q: "Which team won the first-ever Premier League season in 1992-93?", options: ["Manchester United", "Liverpool", "Arsenal"], a: "Manchester United" },
        { q: "Who is the all-time top goal scorer in Premier League history?", options: ["Wayne Rooney", "Alan Shearer", "Harry Kane"], a: "Alan Shearer" },
        { q: "Which player has won the most Premier League titles?", options: ["Ryan Giggs", "John Terry", "Paul Scholes"], a: "Ryan Giggs" },
        { q: "Which club went unbeaten for an entire Premier League season?", options: ["Chelsea", "Manchester City", "Arsenal"], a: "Arsenal" },
        { q: "Who was the first manager to win three consecutive Premier League titles?", options: ["José Mourinho", "Sir Alex Ferguson", "Pep Guardiola"], a: "Sir Alex Ferguson" },
        { q: "Which team holds the record for the most points in a single Premier League season?", options: ["Manchester City", "Liverpool", "Chelsea"], a: "Manchester City" },
        { q: "Which club has the longest unbeaten run in Premier League history?", options: ["Manchester United", "Arsenal", "Liverpool"], a: "Arsenal" },
        { q: "Who scored the fastest hat-trick in Premier League history?", options: ["Sergio Agüero", "Sadio Mané", "Thierry Henry"], a: "Sadio Mané" },
        { q: "Which team suffered the heaviest defeat in Premier League history (9-0)?", options: ["Norwich City", "Southampton", "Hull City"], a: "Southampton" },
        { q: "Which goalkeeper has kept the most clean sheets in Premier League history?", options: ["Petr Čech", "David de Gea", "Edwin van der Sar"], a: "Petr Čech" }
    ]
};

function startQuiz() {
    const category = document.getElementById("category").value;
    const count = parseInt(document.getElementById("questionCount").value) || 1;
    const difficulty = parseInt(document.getElementById("difficulty").value);
    timeLeft = difficulty; // Set initial time based on difficulty

    const startPage = document.getElementById("startPage");
    const quizPage = document.getElementById("quizPage");
    startPage.style.display = "none";
    quizPage.style.display = "block";

    selectedQuestions = []; // Reset the global array
    const availableQuestions = [...questions[category]]; // Copy array
    for (let i = 0; i < count && availableQuestions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        selectedQuestions.push(availableQuestions.splice(randomIndex, 1)[0]);
    }

    currentIndex = 0;
    displayQuestion();
    document.getElementById("nextBtn").style.display = "inline";
    document.getElementById("submitBtn").style.display = "inline";
    startTimer();
}

function displayQuestion() {
    const quizArea = document.getElementById("quizArea");
    if (currentIndex < selectedQuestions.length) {
        const question = selectedQuestions[currentIndex];
        quizArea.innerHTML = `
            <div class="question">
                <p>${currentIndex + 1}. ${question.q}</p>
                ${question.options.map(opt => `
                    <label>
                        <input type="radio" name="q${currentIndex}" value="${opt}"> ${opt}
                    </label><br>
                `).join("")}
            </div>
        `;
    }
}

function nextQuestion() {
    const selected = document.querySelector(`input[name="q${currentIndex}"]:checked`);
    if (selected) {
        selectedQuestions[currentIndex].userAnswer = selected.value; // Store user answer
    }
    currentIndex++;
    if (currentIndex < selectedQuestions.length) {
        displayQuestion();
        resetTimer();
    } else {
        endQuiz();
    }
}

function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            nextQuestion(); // Move to next question or end quiz
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = parseInt(document.getElementById("difficulty").value); // Reset to selected difficulty
    startTimer();
}

function submitQuiz() {
    const selected = document.querySelector(`input[name="q${currentIndex}"]:checked`);
    if (selected) {
        selectedQuestions[currentIndex].userAnswer = selected.value; // Store the last answer
    }
    endQuiz();
}

function endQuiz() {
    const quizPage = document.getElementById("quizPage");
    const endPage = document.getElementById("endPage");
    quizPage.style.display = "none";
    endPage.style.display = "block";
    clearInterval(timerInterval); // Stop the timer
    let score = 0;

    selectedQuestions.forEach((question, index) => {
        if (question.userAnswer === question.a) {
            score++;
        }
    });

    document.getElementById("results").innerHTML = `You scored ${score}/${selectedQuestions.length}!`;
    document.getElementById("timer").style.display = "none"; // Hide timer on end page
}

function shareResults() {
    const score = document.getElementById("results").textContent;
    const shareText = encodeURIComponent(`I just scored ${score} on the Random Quiz Generator! Test yourself: https://yourusername.github.io/random-quiz-site`);
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
}

function restartQuiz() {
    const endPage = document.getElementById("endPage");
    const startPage = document.getElementById("startPage");
    endPage.style.display = "none";
    startPage.style.display = "block";
    document.getElementById("timer").style.display = "block"; // Reset timer visibility
    currentIndex = 0;
    selectedQuestions = [];
}