require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Cache the connection so serverless (Vercel) reuses it between requests
let conn = null;
async function db() {
  if (!conn) conn = mongoose.connect(process.env.MONGODB_URI);
  return conn;
}

const Task = mongoose.models.Task || mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  done: { type: Boolean, default: false }
}, { timestamps: true }));

const wrap = fn => (req, res) => db().then(() => fn(req, res)).catch(e => res.status(500).json({ error: e.message }));

app.get('/api/tasks', wrap(async (req, res) => res.json(await Task.find().sort({ createdAt: -1 }))));

app.post('/api/tasks', wrap(async (req, res) => {
  if (!req.body.title || !req.body.title.trim()) return res.status(400).json({ error: 'Title required' });
  res.status(201).json(await Task.create({ title: req.body.title }));
}));

app.patch('/api/tasks/:id', wrap(async (req, res) =>
  res.json(await Task.findByIdAndUpdate(req.params.id, { done: !!req.body.done }, { new: true }))));

app.delete('/api/tasks/:id', wrap(async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log('Running on http://localhost:' + port));
}
module.exports = app;
