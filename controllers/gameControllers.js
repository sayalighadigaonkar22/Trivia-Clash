const { mongoose } = require('mongoose');
const Game = require('../models/gameModels');
const Player = require('../models/playerModels');
const axios = require('axios');

const fetchQuestions = async (categoryId, difficulty) => {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=6&category=${categoryId}&difficulty=${difficulty}`);
        const data = await response.json();
        return data.results.map((q) => ({
            question: q.question,
            correct_answer: q.correct_answer,
            incorrect_answers: q.incorrect_answers,
            difficulty: q.difficulty,
            answeredBy: null 
        }));
    } catch (error) {
        console.error('Failed to fetch questions:', error.message);
        throw new Error('Failed to fetch questions');
    }
};

const startGame = async (req, res) => {
    try {
        const { playerIds, category, difficulty } = req.body;
        
        const players = await Player.find({ '_id': { $in: playerIds } });

        if (players.length !== 2) {
            return res.status(400).json({ message: 'Invalid player IDs' });
        }

        const questions = await fetchQuestions(category.id, difficulty);

        questions.forEach((question) => {
            const options = [...question.incorrect_answers, question.correct_answer]; 
            question.choices = options;
            question.correctIndex = options.length - 1;
            question.answeredBy = null; 
        });

        const game = new Game({
            players: players.map(player => player._id), 
            category: { id: category.id, name: category.name },
            difficulty,
            questions
        });

        await game.save();

        const populatedGame = await Game.findById(game._id).populate('players');
        res.status(201).json(populatedGame);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const answerQuestion = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { playerId, questionId, selectedIndex } = req.body;

        const game = await Game.findById(gameId).populate('players');
        if (!game) return res.status(404).json({ message: 'Game not found' });

        console.log('Game Players:', game.players);

        const question = game.questions.find((q) => q._id && q._id.toString() === questionId);
        if (!question) {
            console.error('Invalid Question ID:', questionId);
            return res.status(404).json({ message: 'Question not found' });
        }

        const player = game.players.find((p) => p._id && p._id.toString() === playerId);
        if (!player) {
            console.error('Invalid Player ID:', playerId);
            return res.status(404).json({ message: 'Player not found' });
        }

        if (question.answeredBy) {
            return res.status(400).json({ message: 'Question has already been answered' });
        }

        const isCorrect = question.correctIndex === selectedIndex;
        let points = 0;
        if (isCorrect) {
            points = question.difficulty === 'easy' ? 10 :
                     question.difficulty === 'medium' ? 15 : 20;

            player.score += points; 
            await player.save();
        }

        question.answeredBy = playerId;
        game.currentQuestionIndex++;
        game.currentTurn = 1 - game.currentTurn; 
        if (game.currentQuestionIndex >= game.questions.length) {
            game.isCompleted = true;
        }

        await game.save();

        res.status(200).json({
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer.',
            scoreAdded: points,
            updatedGame: game,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const endGame = async (req, res) => {
    try {
        const { gameId } = req.params;

        const game = await Game.findById(gameId).populate('players');

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (game.status === 'completed') {
            return res.status(400).json({ message: 'Game is already completed' });
        }

        const [player1, player2] = game.players;
        let winner = null;

        if (player1.score > player2.score) {
            winner = player1;
        } else if (player2.score > player1.score) {
            winner = player2;
        }

        game.status = 'completed';
        game.winner = winner ? { id: winner._id, name: winner.name } : { id: null, name: 'Tie' };

        await game.save();

        res.status(200).json({
            message: 'Game completed successfully',
            game,
            winner: winner ? { id: winner._id, name: winner.name } : 'It\'s a tie!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { startGame, answerQuestion, endGame };