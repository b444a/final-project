// routes/index.js
const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

router.get('/', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.render('index', {
      title: 'hello to my future self',
      entries,
    });
  } catch (err) {
    console.error('Error loading homepage:', err);
    res.status(500).render('error', { message: 'Error loading page', error: err });
  }
});

module.exports = router;

