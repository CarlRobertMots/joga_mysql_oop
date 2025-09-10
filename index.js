const express = require('express');

const app = express();
app.use(express.json());

const articleRouter = require('./routes/articles');
const authorRouter = require('./routes/authors');

app.use('/', articleRouter);
app.use('/author/', authorRouter);

app.listen(3026, () => {
    console.log('Server running on http://localhost:3026');
});