const pool = require('../models/connect');
const { respondWithSuccess, respondWithWarning } = require('../helpers/responseHandler');
const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessages');
const cloud = require('../helpers/cloudinary-config');
const multerConfig = require('../middleware/multer-config');


exports.createGif = async (request, response) => {
  const form = JSON.parse(JSON.stringify(request.body));
  const { userId, title } = form;
  let id;
  try {
    const file = multerConfig.dataUri(request).content;
    const result = await cloud.uploader.upload(file);
    const imageUrl = result.url;
    const user = await pool.query('SELECT gif_id FROM public.gifs');
    if (user.rows.length === 0) {
      id = user.rows.length + 1;
    }
    else {
      const gifsId = user.rows.map((element) => element.gif_id);
      const maxValue = Math.max(...gifsId);
      id = maxValue + 1;
    }
    await pool.query('INSERT INTO public.gifs (user_id, title, image_url, date) VALUES($1, $2, $3, $4)', [userId, title, imageUrl, new Date()]);
    const data = {
      gifId: id,
      createdOn: new Date(),
      title,
      imageUrl,
    };
    return respondWithSuccess(response, statusCode.created, responseMessage.gifCreated, data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.createArticles = async (request, response) => {
  const { userId, title, article } = request.body;
  let id;
  try {
    const result = await pool.query('SELECT article_id FROM public.article');
    if (result.rows.length === 0) {
      id = result.rows.length + 1;
    }
    else {
      const articleId = result.rows.map((element) => element.article_id);
      const maxValue = Math.max(...articleId);
      id = maxValue + 1;
    }
    await pool.query('INSERT INTO public.article (user_id, title, article, date) VALUES($1, $2, $3, $4)', [userId, title, article, new Date()]);
    const data = {
      articleId: id,
      createdOn: new Date(),
      title,
      article,
    };
    return respondWithSuccess(response, statusCode.created, responseMessage.articleCreated, data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.updateArticles = async (request, response) => {
  const articleId = parseInt(request.params.articleId, 10);
  const { title, article } = request.body;
  try {
    await pool.query('UPDATE public.article SET title = $1, article = $2, date = $3 WHERE article_id = $4', [title, article, new Date(), articleId]);
    const data = {
      articleId,
      updatedOn: new Date(),
      title,
      article,
    };
    return respondWithSuccess(response, statusCode.created, responseMessage.articleUpdated, data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
;}

exports.deleteArticles = async (request, response) => {
  const articleId = parseInt(request.params.articleId, 10);
  try {
    await pool.query('DELETE FROM public.article  WHERE article_id = $1', [articleId]);
    return respondWithSuccess(response, statusCode.success, 'Article successfully deleted');
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.deleteGifs = async (request, response) => {
  const gifId = parseInt(request.params.gifId, 10);
  try {
    await pool.query('DELETE FROM public.gifs  WHERE gif_id = $1', [gifId]);
    return respondWithSuccess(response, statusCode.success, 'gifs post successfully deleted');
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.createCommentOfArticle = async (request, response) => {
  const { userId, comment } = request.body;
  const articleId = parseInt(request.params.articleId, 10);
  let id;
  try {
    const result = await pool.query('SELECT article_comment_id FROM public.article_comment');
    if (result.rows.length === 0) {
      id = result.rows.length + 1;
    }
    else {
      const commentId = result.rows.map((element) => element.article_comment_id);
      const maxValue = Math.max(...commentId);
      id = maxValue + 1;
    }
    await pool.query('INSERT INTO public.article_comment (article_id, user_id, comment, date) VALUES($1, $2, $3, $4)', [articleId, userId, comment, new Date()]);
    const value = await pool.query('SELECT title, article FROM public.article');
    const data = {
      commentId: id,
      createdOn: new Date(),
      articleTitle: value.rows[0].title,
      article: value.rows[0].article,
      comment,
    };
    return respondWithSuccess(response, statusCode.created, 'Comment successfully created', data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
}
