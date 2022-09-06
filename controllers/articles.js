/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const Article = require("../models/article");
const { ForbiddenError } = require("../errors/errorHandler");
const { NotFoundError } = require("../errors/errorHandler");

const getArticles = (req, res, next) => {
  const owner = req.user._id;
  Article.find({ owner })
    .then((articles) => {
      res.send(articles);
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
    .catch((err) =>
      // next(err)
      console.log(err)
    );
};

const deleteArticle = (req, res, next) => {
  Article.findOne({ _id: req.params.articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError("Forbidden");
      }

      // console.log({ delete: req.params.articleId });
      return Article.findOneAndDelete({ _id: req.params.articleId });
    })
    .then((deleteArticle) => {
      console.log({ deleted: deleteArticle._id });
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
