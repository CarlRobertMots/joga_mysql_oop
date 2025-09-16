const express = require('express');
const sessions = require('express-session');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- Add this line

app.use(sessions({
    secret: "your_secret_key",
    saveUninitialized: true,  // typo fixed here too
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    resave: false
}));


const articleRouter = require('./routes/articles');
const authorRouter = require('./routes/authors');

app.use('/', articleRouter);
app.use('/author/', authorRouter);

const userRouter = require('./routes/users');
app.use('/', userRouter);

app.listen(3026, () => {
    console.log('Server running on http://localhost:3026');
});