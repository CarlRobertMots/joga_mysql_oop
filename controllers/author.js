const authorDbModel = require('../models/author');
const authorModel = new authorDbModel();

const articleDbModel = require('../models/article');
const articleModel = new articleDbModel();

class authorController {
    async getAuthorById(req, res) {
        try {
            const author = await authorModel.findById(req.params.author_id);
            const articles = await articleModel.findMany(author);
            author.articles = articles;
            res.status(201).json({author: author } );
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch author data' });
        }
    }
}

module.exports = authorController;