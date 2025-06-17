// server.js
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import Todo from './models/Todo.js';
import sequelize from './sequelize.js';
import { postToChutes } from './ai/post-to-chutes.mjs';
import { queryWrapper } from './ai/generate-query.mjs';
import { chartWrapper } from './ai/generate-chart.mjs';

import dotenv from 'dotenv';
dotenv.config();

const apiToken = process.env.CHUTES_API_KEY;

const { json, urlencoded } = pkg;

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
const PORT = 3001;

// Ensure DB is ready
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Get all todos
app.get('/todos', async (req, res) => {
  const allTodos = await Todo.findAll();
  res.json(allTodos);
});

// Add new todo
app.post('/todos', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  const newTodo = await Todo.create({ text, completed: false });
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;
  const todo = await Todo.findByPk(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  if (text !== undefined) todo.text = text;
  if (completed !== undefined) todo.completed = completed;
  await todo.save();
  res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByPk(id);
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  await todo.destroy();
  res.status(204).send();
});

app.post('/sql', async (req, res) => {
  let { query } = req.body;

  if (typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ error: 'Query must be a non-empty string' });
  }

  query = query.trim();
  console.log('Executing SQL:', query);

  try {
    const [results, metadata] = await sequelize.query(query);
    res.json(results);
  } catch (err) {
    console.error('SQL error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const raw = await postToChutes(apiToken, queryWrapper(prompt));
    const clean = raw.trim().replace(/^```json\s*|```$/g, '');
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ error: 'Failed to generate response from LLM' });
  }
});

app.post('/format', async (req, res) => {
  const { chartType, data } = req.body;
  if (!chartType) return res.status(400).json({ error: 'chartType is required' });
  else if (!data) return res.status(400).json({ error: 'data is required' });

  try {
    const raw = await postToChutes(apiToken, chartWrapper(chartType, data));
    console.log('Format raw response: ' + raw);
    const clean = raw.trim().replace(/^```json\s*|```$/g, '');
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error('LLM error:', err);
    res.status(500).json({ error: 'Failed to generate response from LLM' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});