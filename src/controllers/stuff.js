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
    const res = await pool.query('INSERT INTO public.gifs (user_id, title, image_url, date) VALUES($1, $2, $3, $4)', [userId, title, imageUrl, new Date()]);
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

