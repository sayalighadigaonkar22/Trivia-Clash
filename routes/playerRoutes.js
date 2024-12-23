const express = require('express');
const { createPlayer, createPlayers } = require('../controllers/playerControllers');
const router = express.Router();

router.post('/createPlayers', createPlayers);

module.exports = router;