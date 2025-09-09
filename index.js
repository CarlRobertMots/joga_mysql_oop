const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const articleControllerClass = require('./controllers/article')
const articleController = new articleControllerClass()

const articleRoutes = require('./routes/articles')
app.use('/', articleRoutes)

// Start the app
app.listen(3025, () => {
    console.log(`App started at http://localhost:3025`);
});