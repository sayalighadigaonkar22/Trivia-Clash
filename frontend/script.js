const createPlayersBtn = document.getElementById('create-players-btn');
const startGameBtn = document.getElementById('start-game-btn');
const playerForm = document.getElementById('player-form');
const gameSettings = document.getElementById('game-settings');
const gameScreen = document.getElementById('game-screen');
const questionText = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const scoreText = document.getElementById('score');
const gameOver = document.getElementById('game-over');
const winnerText = document.getElementById('winner');
const restartGameBtn = document.getElementById('restart-game-btn');

let gameId = '';
let player1Id = '';
let player2Id = '';
let currentPlayerId = '';
let gameData = {};
let currentQuestionIndex = 0;

createPlayersBtn.addEventListener('click', async () => {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;

    if (!player1Name || !player2Name) {
        alert("Both player names are required.");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/players/createPlayers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ player1: player1Name, player2: player2Name }),
        });

        const players = await response.json();
        player1Id = players[0]._id;
        player2Id = players[1]._id;

        alert("Players created successfully!");
        playerForm.style.display = 'none';
        gameSettings.style.display = 'block';
    } catch (error) {
        console.error('Error creating players:', error);
        alert('Failed to create players. Please try again.');
    }
});

startGameBtn.addEventListener('click', async () => {
    const categorySelect = document.getElementById('category');
    const difficultySelect = document.getElementById('difficulty');

    const category = { id: parseInt(categorySelect.value), name: categorySelect.options[categorySelect.selectedIndex].text };
    const difficulty = difficultySelect.value;

    try {
        const response = await fetch('http://localhost:5000/api/games/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerIds: [player1Id, player2Id],
                category: category,
                difficulty: difficulty,
            }),
        });

        gameData = await response.json();
        gameId = gameData._id;
        currentPlayerId = gameData.players[0]._id; 
        gameSettings.style.display = 'none';
        gameScreen.style.display = 'block';

        displayQuestion(gameData.questions[0]);
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start the game. Please try again.');
    }
});

function displayQuestion(question) {
    questionText.innerHTML = question.question;
    optionsDiv.innerHTML = '';
    question.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => answerQuestion(index, question._id);
        optionsDiv.appendChild(button);
    });
}

async function answerQuestion(selectedIndex, questionId) {
    try {
        console.log('Attempting to submit answer...');
        console.log('Game ID:', gameId);
        console.log('Player ID:', currentPlayerId);
        console.log('Question ID:', questionId);
        console.log('Selected Index:', selectedIndex);

        const response = await fetch(`http://localhost:5000/api/games/${gameId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: currentPlayerId,
                questionId: questionId,
                selectedIndex: selectedIndex,
            }),
        });

        console.log('Server response status:', response.status);
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Backend Error:', errorDetails);
            throw new Error(errorDetails.message || 'Failed to submit answer.');
        }

        const result = await response.json();
        console.log('Answer submission result:', result);

        scoreText.textContent = `Player 1: ${result.updatedGame.players[0].score} | Player 2: ${result.updatedGame.players[1].score}`;
        currentPlayerId = result.updatedGame.players[result.updatedGame.currentTurn]._id;

        currentQuestionIndex++;
        if (currentQuestionIndex < result.updatedGame.questions.length) {
            displayQuestion(result.updatedGame.questions[currentQuestionIndex]);
        } else {
            endGame(result.updatedGame);
        }
    } catch (error) {
        console.error('Error answering question:', error);
        alert(error.message);
    }
}

async function endGame(updatedGame) {
    try {
        const response = await fetch(`http://localhost:5000/api/games/${gameId}/end`, {
            method: 'POST',
        });

        const result = await response.json();
        const winner = updatedGame.players[0].score > updatedGame.players[1].score
            ? updatedGame.players[0]
            : updatedGame.players[1];

        winnerText.innerHTML = `${winner.name} Wins with a score of ${winner.score}`;
        gameScreen.style.display = 'none';
        gameOver.style.display = 'block';
    } catch (error) {
        console.error('Error ending game:', error);
        alert('Failed to end the game. Please try again.');
    }
}

restartGameBtn.addEventListener('click', () => {
    location.reload(); 
});