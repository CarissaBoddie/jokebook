const express = require('express');
const router = express.Router();
const { getJokesByCategory, addJoke } = require('../controllers/jokeController');

router.get('/:category', getJokesByCategory);
router.post('/new', addJoke);

module.exports = router;