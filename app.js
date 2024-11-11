const express = require('express');
const bodyParser = require('body-parser');
const categoryRouter = require('./routes/categories');
const jokeRouter = require('./routes/jokes');

const app = express();
app.use(bodyParser.json());
app.use('/jokebook/categories', categoryRouter);
app.use('/jokebook/joke', jokeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
