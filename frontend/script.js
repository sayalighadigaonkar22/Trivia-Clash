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

    // Fetch categories when the page loads
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5000/api/categories');
            const data = await response.json();
            const categories = data.categories;

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
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
        
        fetchCategories();
    });

    // Handle category selection
    startQuizButton.addEventListener('click', function () {
        const categoryId = categorySelect.value;
        
        if (!categoryId) {
            alert('Please select a category');
            return;
        }
        
        gameData.category = categoryId;

        categorySelection.classList.add('hidden');
        questionSection.classList.remove('hidden');

        // Start the game by fetching questions
        fetchQuestions(categoryId);
    });

    // Fetch questions from API
    async function fetchQuestions(categoryId) {
        try {
            const response = await fetch(`http://localhost:5000/api/games/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerIds: ['player1', 'player2'],  // Use actual player IDs from your backend
                    category: { id: categoryId },
                    difficulty: 'easy',  // Adjust difficulty as needed
                })
            });
            const data = await response.json();
            questions = data.questions;
            displayQuestion();
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
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