require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const auth = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Note Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  color: { type: String, default: '#ffffff' },
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Note = mongoose.model('Note', noteSchema);

// Protected Routes
// GET all notes (user's notes only)
app.get('/api/notes', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).sort({ pinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create note
app.post('/api/notes', auth, async (req, res) => {
  try {
    const note = new Note({ ...req.body, userId: req.user.userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update note
app.put('/api/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE note
app.delete('/api/notes/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});