/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const Article = require('../models/article');
const { ForbiddenError } = require('../errors/errorHandler');
const { NotFoundError } = require('../errors/errorHandler');

const getArticles = (req, res, next) => {
  Article.find({})
    .then((articles) => {
      res.send({ data: articles });
    })
    .catch((err) => {
      next(err);
    });
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  const owner = req.user._id;
  Article.create({ keyword, title, text, date, source, link, image, owner })
    .then((article) => {
      res.send({ data: article });
    })
    .catch((err) => (
      next(err)
  ));
};

const deleteArticle = (req, res, next) => {
  Article.findOne({ _id: req.params.articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError();
      }
      console.log(req.user._id);
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      return Article.findOneAndDelete(req.params.articleId);
    })
    .then((deleteArticle) => {
      res.send({ data: deleteArticle });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};