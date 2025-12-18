// routes/api.js
const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

// GET /entries – get all entries (optionally filtered by tag)
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    const filter = tag && tag !== 'all' ? { tag } : {};
    const entries = await Entry.find(filter).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// GET /entries/:id – get a single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (err) {
    console.error('Error fetching entry:', err);
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// POST /entries – add a new entry
router.post('/', async (req, res) => {
  try {
    const { message, prompt, tag, timeframe } = req.body;

    if (!message || !prompt) {
      return res
        .status(400)
        .json({ error: 'Message and prompt are required' });
    }

    const entry = await Entry.create({
      message,
      prompt,
      tag: tag || 'other',
      timeframe: timeframe || 'sometime',
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('Error creating entry:', err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// PUT /entries/:id – optional edit
router.put('/:id', async (req, res) => {
  try {
    const { message, tag, timeframe } = req.body;
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      { message, tag, timeframe },
      { new: true, runValidators: true }
    );
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(entry);
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// DELETE /entries/:id – optional delete
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;

