
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/jokebook.db');

// Function to get all categories
function getCategories(callback) {
  const query = `SELECT * FROM Categories`;
  db.all(query, (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}

// Function to add a new category 
function addCategory(name, callback) {
  const query = `INSERT INTO Categories (name) VALUES (?)`;
  db.run(query, [name], function (err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: this.lastID, name });
    }
  });
}

module.exports = {
  getCategories,
  addCategory
};
