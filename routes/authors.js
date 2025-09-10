const express = require('express');
const router = express.Router();

const authorControllerClass = require('../controllers/author');

const authorController = new authorControllerClass();

// get author data by id and his articles
router.get('/:author_id', (req, res) => {
    authorController.getAuthorById(req, res);
});

module.exports = router;