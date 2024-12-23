const Player = require('../models/playerModels');

const createPlayers = async (req, res) => {
    try {
        const { player1, player2 } = req.body;

        if (!player1 || !player2) {
            return res.status(400).json({ message: "Both player1 and player2 names are required." });
        }

        const players = await Player.insertMany([
            { name: player1 },
            { name: player2 },
        ]);

        res.status(201).json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPlayers };