const mongoose = require('mongoose');

// Define the schema for questions
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    difficulty: { type: String, required: true },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
});

// Define the schema for games
const gameSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference Player model directly
        ref: 'Player', // Reference to Player model
        required: true
    }],
    category: {
        id: { type: Number, required: true }, // Category ID from trivia API
        name: { type: String, required: true } // Category name
    },
    difficulty: { type: String, required: true },
    questions: [questionSchema], // Embed the question schema
    currentQuestionIndex: { type: Number, default: 0 },
    currentTurn: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['ongoing', 'paused', 'completed'],
        default: 'ongoing'
    },
    winner: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
        name: { type: String, default: null }
    }
}, { 
    timestamps: true,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
