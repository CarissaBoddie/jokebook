
const jokeDisplay = document.getElementById('joke-display');
const categoryList = document.getElementById('category-list');
const jokeList = document.getElementById('joke-list');
const jokeForm = document.getElementById('jokeForm');
const formMessage = document.getElementById('form-message');

// Fetch and display a random joke
function fetchRandomJoke() {
  fetch('/jokebook/joke/random')
    .then(response => response.json())
    .then(data => {
      jokeDisplay.textContent = `${data.setup} - ${data.delivery}`;
    })
    .catch(error => {
      jokeDisplay.textContent = 'Failed to load a random joke.';
      console.error(error);
    });
}

// Fetch and display categories
function fetchCategories() {
  fetch('/jokebook/categories')
    .then(response => response.json())
    .then(data => {
      categoryList.innerHTML = ''; 
      data.forEach(category => {
        const li = document.createElement('li');
        li.textContent = category.name;
        li.addEventListener('click', () => fetchJokesByCategory(category.name));
        categoryList.appendChild(li);
      });
    })
    .catch(error => console.error('Failed to fetch categories:', error));
}

// Fetch and display jokes by category
function fetchJokesByCategory(category) {
  fetch(`/jokebook/joke/${category}`)
    .then(response => response.json())
    .then(data => {
      jokeList.innerHTML = ''; // Clear previous jokes
      data.forEach(joke => {
        const li = document.createElement('li');
        li.textContent = `${joke.setup} - ${joke.delivery}`;
        jokeList.appendChild(li);
      });
    })
    .catch(error => console.error('Failed to fetch jokes:', error));
}

// Submit a new joke
jokeForm.addEventListener('submit', event => {
  event.preventDefault();

  const category = jokeForm.category.value;
  const setup = jokeForm.setup.value;
  const delivery = jokeForm.delivery.value;

  fetch('/jokebook/joke/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ category, setup, delivery })
  })
    .then(response => response.json())
    .then(data => {
      formMessage.textContent = 'Joke added successfully!';
      jokeForm.reset(); // Clear form
      fetchJokesByCategory(category); // Refresh jokes in the selected category
    })
    .catch(error => {
      formMessage.textContent = 'Failed to add joke.';
      console.error(error);
    });
});


fetchRandomJoke();
fetchCategories();
