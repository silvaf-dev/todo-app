// server.js
import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
import Todo from './models/Todo.js';
import sequelize from './sequelize.js';

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});