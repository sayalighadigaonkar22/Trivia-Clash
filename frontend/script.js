document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const playerForm = document.getElementById('playerForm');
    const categorySelection = document.getElementById('categorySelection');
    const startQuizButton = document.getElementById('startQuizButton');
    const questionSection = document.getElementById('questionSection');
    const endSection = document.getElementById('endSection');
    const resultDisplay = document.getElementById('result');
    const nextButton = document.getElementById('nextButton');
    const restartButton = document.getElementById('restartButton');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const categorySelect = document.getElementById('category');
    
    let currentPlayer = 0;
    let questions = [];
    let currentQuestionIndex = 0;
    let scores = { player1: 0, player2: 0 };
    let gameData = { player1: '', player2: '', category: '' };

    // Static categories (no API call)
    const categories = [
        { id: '1', name: 'General Knowledge' },
        { id: '2', name: 'Science' },
        { id: '3', name: 'History' }
    ];

    // Function to populate category dropdown
    function populateCategories() {
        categorySelect.innerHTML = ''; // Clear previous categories

        // Add a default "Select category" option
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Select a Category';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        categorySelect.appendChild(defaultOption);

        // Populate dropdown with static categories
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    // Handle the start button click
    startButton.addEventListener('click', function () {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        
        if (!player1Name || !player2Name) {
            alert('Please enter names for both players');
            return;
        }
        
        gameData.player1 = player1Name;
        gameData.player2 = player2Name;

        playerForm.classList.add('hidden');
        categorySelection.classList.remove('hidden');
        
        // Populate categories on form load
        populateCategories();
    });

    // Handle category selection and start the quiz
    startQuizButton.addEventListener('click', function () {
        const categoryId = categorySelect.value;
        
        if (!categoryId || categoryId === 'Select a Category') {
            alert('Please select a category');
            return;
        }
        
        gameData.category = categoryId;

        categorySelection.classList.add('hidden');
        questionSection.classList.remove('hidden');

        // Start the game by fetching questions
        fetchQuestions(categoryId);
    });

    // Fetch questions from API (mock data)
    async function fetchQuestions(categoryId) {
        // Mock data: static questions for demonstration purposes
        const mockQuestions = [
            {
                question: 'What is the capital of France?',
                choices: ['Paris', 'London', 'Berlin', 'Rome'],
                correctIndex: 0,
                difficulty: 'easy'
            },
            {
                question: 'Who invented the lightbulb?',
                choices: ['Albert Einstein', 'Nikola Tesla', 'Thomas Edison', 'Isaac Newton'],
                correctIndex: 2,
                difficulty: 'medium'
            }
        ];

        questions = mockQuestions;
        displayQuestion();
    }

    // Display current question
    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('question').textContent = currentQuestion.question;

        const answersDiv = document.getElementById('answers');
        answersDiv.innerHTML = '';
        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(index);
            answersDiv.appendChild(button);
        });
    }

    // Handle answer checking
    function checkAnswer(selectedIndex) {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctIndex;

        if (currentPlayer === 0) {
            if (isCorrect) {
                scores.player1 += currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 15 : 20;
            }
        } else {
            if (isCorrect) {
                scores.player2 += currentQuestion.difficulty === 'easy' ? 10 : currentQuestion.difficulty === 'medium' ? 15 : 20;
            }
        }

        currentPlayer = 1 - currentPlayer;
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endGame();
        }
    }

    // End the game
    function endGame() {
        questionSection.classList.add('hidden');
        endSection.classList.remove('hidden');

        const winner = scores.player1 > scores.player2 ? gameData.player1 : (scores.player2 > scores.player1 ? gameData.player2 : 'Tie');
        resultDisplay.textContent = `Winner: ${winner} | Player 1: ${scores.player1} | Player 2: ${scores.player2}`;
    }

    // Restart the game
    restartButton.addEventListener('click', function () {
        location.reload();
    });
});