require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./models/Task');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Middleware ---
const validateTask = (req, res, next) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title cannot be empty" });
  }
  next();
};

// --- API Endpoints ---

// GET /api/tasks?completed=true|false
app.get('/api/tasks', async (req, res) => {
  const { completed } = req.query;
  const filter = {};
  
  if (completed === 'true' || completed === 'false') {
    filter.completed = completed === 'true';
  }
  
  try {
    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks
app.post('/api/tasks', validateTask, async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title.trim(),
      completed: false
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: "Could not create task" });
  }
});

// PUT /api/tasks/:id (toggle completion)
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});