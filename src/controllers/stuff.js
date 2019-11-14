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
      const gifsId = user.rows.map((element) => element.gif_id)
      const maxValue = Math.max(...gifsId)
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
      const articleId = result.rows.map((element) => element.article_id)
      const maxValue = Math.max(...articleId)
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
}