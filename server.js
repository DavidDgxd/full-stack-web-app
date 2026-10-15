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

const Pokemon = mongoose.model('pokemon', pokemonSchema);

app.post('/api/pokemon', async (req, res) => {
  try {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    console.log('Added new pokemon:', pokemon);
    res.status(201).send(pokemon);
  } catch (err) {
    console.error('Save failed:', err.message);
    res.status(400).send({ error: err.message });
  }
});

app.get('/api/pokemon', async (req, res) => {
  try {
    const list = await Pokemon.find();
    res.send(list);
  } catch (err) {
    console.error('Fetch failed:', err.message);
    res.status(500).send({ error: err.message });
  }
});

app.put('/api/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pokemon) return res.status(404).send({ error: 'Pokémon not found.' });
    res.send(pokemon);
  } catch (err) {
    console.error('Update failed:', err.message);
    res.status(400).send({ error: err.message });
  }
});

app.delete('/api/pokemon/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    if (!pokemon) return res.status(404).send({ error: 'Pokémon not found.' });
    res.status(204).send();
  } catch (err) {
    console.error('Delete failed:', err.message);
    res.status(400).send({ error: err.message });
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