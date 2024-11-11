// seed.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/jokebook.db');

// Initial data from the assignment
const categories = ['funnyJoke', 'lameJoke'];
const funnyJokeList = [
  { setup: 'Why did the student eat his homework?', delivery: 'Because the teacher told him it was a piece of cake!' },
  { setup: 'What kind of tree fits in your hand?', delivery: 'A palm tree' },
  { setup: 'What is worse than raining cats and dogs?', delivery: 'Hailing taxis' }
];
const lameJokeList = [
  { setup: 'Which bear is the most condescending?', delivery: 'Pan-DUH' },
  { setup: 'What would the Terminator be called in his retirement?', delivery: 'The Exterminator' }
];

// Function to seed categories and jokes
function seedDatabase() {
  db.serialize(() => {
    // Insert categories if not present
    categories.forEach(category => {
      db.run(`INSERT OR IGNORE INTO Categories (name) VALUES (?)`, [category]);
    });

    // Fetch category IDs to associate with jokes
    db.get(`SELECT id FROM Categories WHERE name = ?`, [categories[0]], (err, funnyJokeCategory) => {
      if (err) throw err;
      funnyJokeList.forEach(joke => {
        db.run(`INSERT OR IGNORE INTO Jokes (category_id, setup, delivery) VALUES (?, ?, ?)`,
          [funnyJokeCategory.id, joke.setup, joke.delivery]);
      });
    });

    db.get(`SELECT id FROM Categories WHERE name = ?`, [categories[1]], (err, lameJokeCategory) => {
      if (err) throw err;
      lameJokeList.forEach(joke => {
        db.run(`INSERT OR IGNORE INTO Jokes (category_id, setup, delivery) VALUES (?, ?, ?)`,
          [lameJokeCategory.id, joke.setup, joke.delivery]);
      });
    });

    console.log('Database seeded successfully.');
  });
}

// Run the seeding function
seedDatabase();
