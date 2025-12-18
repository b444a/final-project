require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const pageRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', pageRouter);
app.use('/entries', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

// IMPORTANT: Do NOT include app.listen() here.
// bin/www handles starting the server.
module.exports = app;
