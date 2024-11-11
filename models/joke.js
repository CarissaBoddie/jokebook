
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/jokebook.db');

// Function to get jokes by category with an optional limit
function getJokesByCategory(categoryId, limit, callback) {
  const query = `SELECT * FROM Jokes WHERE category_id = ? ${limit ? 'LIMIT ?' : ''}`;
  const params = limit ? [categoryId, limit] : [categoryId];
  db.all(query, params, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to add a new joke to a specific category
function addJoke(categoryId, setup, delivery, callback) {
  const query = `INSERT INTO Jokes (category_id, setup, delivery) VALUES (?, ?, ?)`;
  db.run(query, [categoryId, setup, delivery], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, categoryId, setup, delivery });
    }
  });
}

// Function to get a random joke
function getRandomJoke(callback) {
  const query = `SELECT * FROM Jokes ORDER BY RANDOM() LIMIT 1`;
  db.get(query, (err, row) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
}

module.exports = {
  getJokesByCategory,
  addJoke,
  getRandomJoke
};
