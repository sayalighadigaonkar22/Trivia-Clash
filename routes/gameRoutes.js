const express = require('express');
const { startGame, answerQuestion, endGame } = require('../controllers/gameControllers');
const router = express.Router();

router.post('/start', startGame);
router.post('/:gameId/answer', answerQuestion);
router.post('/:gameId/end', endGame);

// const axios = require('axios');

// router.get('/categories', async (req, res) => {
//     try {
//         const response = await fetch('https://opentdb.com/api_category.php');
//         const data = await response.json();
//         const categories = data.trivia_categories.map(cat => ({
//             id: cat.id,
//             name: cat.name,
//         }));

//         res.json({ categories });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Failed to fetch categories' });
//     }
// });

module.exports = router;