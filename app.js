const express = require('express');
const connectDB = require('./config/db');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cors = require('cors');

require('dotenv').config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());



app.use('/api/players', playerRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/categories', categoryRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));