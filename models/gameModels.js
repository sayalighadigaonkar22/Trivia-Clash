const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    choices: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    difficulty: { type: String, required: true },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
});

const gameSchema = new mongoose.Schema({
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true
    }],
    category: {
        id: { type: Number, required: true }, 
        name: { type: String, required: true } 
    },
    difficulty: { type: String, required: true },
    questions: [questionSchema], 
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