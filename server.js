require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pokemonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  level: { type: Number, required: true, min: 1, max: 100 },
  nature: { type: String, required: true },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

app.post('/api/pokemon', async (req, res) => {
  try {
    console.log('POST body:', req.body);
    const pokemon = await Pokemon.create(req.body);
    res.status(201).json(pokemon);
  } catch (err) {
    console.error('Save failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/pokemon', async (req, res) => {
  try {
    const list = await Pokemon.find();
    res.json(list);
  } catch (err) {
    console.error('Fetch failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Check that .env is in the project root.');
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running at http://localhost:5000'));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

start();