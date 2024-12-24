const express = require('express');
const { startGame, answerQuestion, endGame } = require('../controllers/gameControllers');
const router = express.Router();

router.post('/start', startGame);
router.post('/:gameId/answer', answerQuestion);
router.post('/:gameId/end', endGame);

module.exports = router;