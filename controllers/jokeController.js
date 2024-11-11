
const categoryModel = require('../models/category');
const jokeModel = require('../models/joke');

// Controller to get all categories
function getCategories(req, res) {
  categoryModel.getCategories((err, categories) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve categories' });
    } else {
      res.json(categories);
    }
  });
}

// Controller to get jokes by category with optional limit
function getJokesByCategory(req, res) {
  const categoryName = req.params.category;
  const limit = parseInt(req.query.limit) || null;

  // Finds category id
  categoryModel.getCategories((err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve categories' });
    }

    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Fetch jokes for the found category ID
    jokeModel.getJokesByCategory(category.id, limit, (err, jokes) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve jokes' });
      } else {
        res.json(jokes);
      }
    });
  });
}

// Controller to add a new joke to a specific category
function addJoke(req, res) {
  const { category, setup, delivery } = req.body;

  // Check for missing parameters
  if (!category || !setup || !delivery) {
    return res.status(400).json({ error: 'Missing required fields: category, setup, or delivery' });
  }

  
  categoryModel.getCategories((err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve categories' });
    }

    let existingCategory = categories.find(cat => cat.name.toLowerCase() === category.toLowerCase());

    const handleJokeInsertion = (categoryId) => {
      jokeModel.addJoke(categoryId, setup, delivery, (err, newJoke) => {
        if (err) {
          res.status(500).json({ error: 'Failed to add joke' });
        } else {
          res.json(newJoke);
        }
      });
    };

    if (existingCategory) {
      
      handleJokeInsertion(existingCategory.id);
    } else {
      // Add a new category and then add the joke
      categoryModel.addCategory(category, (err, newCategory) => {
        if (err) {
          res.status(500).json({ error: 'Failed to add new category' });
        } else {
          handleJokeInsertion(newCategory.id);
        }
      });
    }
  });
}

module.exports = {
  getCategories,
  getJokesByCategory,
  addJoke
};
