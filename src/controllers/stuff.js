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
      id,
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
    console.log('here3')
    const data = {
      id,
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
      id: articleId,
      updatedOn: new Date(),
      title,
      article,
    };
    return respondWithSuccess(response, statusCode.created, responseMessage.articleUpdated, data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.deleteArticles = async (request, response) => {
  const articleId = parseInt(request.params.articleId, 10);
  try {
    await pool.query('DELETE FROM public.article_comment WHERE article_id = $1', [articleId]);
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
    await pool.query('DELETE FROM public.gifs_comment WHERE gif_id = $1', [gifId]);
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
    const value = await pool.query('SELECT title, article, article_id FROM public.article WHERE article_id = $1', [articleId]);
    const data = {
      commentId: id,
      createdOn: new Date(),
      articleTitle: value.rows[0].title,
      id: value.rows[0].article_id,
      comment,
    };
    return respondWithSuccess(response, statusCode.created, 'Comment successfully created', data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.createCommentOfGif = async (request, response) => {
  const { userId, comment } = request.body;
  const gifId = parseInt(request.params.gifId, 10);
  let id;
  try {
    const result = await pool.query('SELECT gifs_comment_id FROM public.gifs_comment');
    if (result.rows.length === 0) {
      id = result.rows.length + 1;
    }
    else {
      const commentId = result.rows.map((element) => element.gifs_comment_id);
      const maxValue = Math.max(...commentId);
      id = maxValue + 1;
    }
    await pool.query('INSERT INTO public.gifs_comment (gif_id, user_id, gif_comment, date) VALUES($1, $2, $3, $4)', [gifId, userId, comment, new Date()]);
    const value = await pool.query('SELECT gif_id, title FROM public.gifs WHERE gif_id = $1', [gifId]);
    const data = {
      commentId: id,
      createdOn: new Date(),
      gifTitle: value.rows[0].title,
      id: value.rows[0].gif_id,
      comment,
    };
    return respondWithSuccess(response, statusCode.created, 'Comment successfully created', data);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.getAll = async (request, response) => {
  try {
    const result = await pool.query('select u.user_id, gif_id id, first_name, last_name, g.title gifTitle, g.date gifDate, image_url from public.user u LEFT JOIN public.gifs g ON u.user_id = g.user_id ORDER BY g.date DESC');
    // console.log(result.rows);
    const article = await pool.query('select u.user_id, article_id id, first_name, last_name, a.date articleDate, a.title articleTitle, article from public.user u LEFT JOIN public.article a ON u.user_id = a.user_id ORDER BY a.date DESC');
    const articleData =article.rows;
    const data = result.rows;
    const articlesPost = articleData.map((ele) => ({name: `${ele.first_name} ${ele.last_name}`, id: ele.id, createdOn: ele.articledate, title: ele.articletitle, article: ele.article, authorId: ele.user_id }));
    const gifsPost = data.map((ele) => ({name: `${ele.first_name} ${ele.last_name}`, id: ele.id, createdOn: ele.gifdate, title: ele.giftitle, url: ele.image_url, authorId: ele.user_id }));
    const filterArticles = articlesPost.filter((ele) => ele.article !== null);
    const filterGifs = gifsPost.filter((ele) => ele.url !== null);
    const articleComment = await pool.query('select a.user_id authorId, a.article_id id, article_comment_id commentId, c.date createdOn, c.comment articleComment from public.article a LEFT JOIN public.article_comment c ON a.article_id = c.article_id ORDER BY c.date DESC');
    const commentValue = articleComment.rows;
    const gifComment = await pool.query('select g.user_id authorId, g.gif_id id, gifs_comment_id commentId, c.date createdOn, c.gif_comment gifComment from public.gifs g LEFT JOIN public.gifs_comment c ON g.gif_id = c.gif_id ORDER BY c.date DESC');
    const gifsCommentValue = gifComment.rows;
    for (let i = 0; i < filterArticles.length; i++) {
      commentValue.forEach((ele) => {
        if (filterArticles[i].id === ele.id) {
          if (ele.articlecomment !== null) {
            if (typeof filterArticles[i].comments === 'undefined') {
              filterArticles[i].comments = [];
              filterArticles[i].comments.push(ele)
            }
            else {
              filterArticles[i].comments.push(ele);
            }
          };
        };
      });
    }
    for (let i = 0; i < filterGifs.length; i++) {
      gifsCommentValue.forEach((ele) => {
        if (filterGifs[i].id === ele.id) {
          if (ele.gifcomment !== null) {
            if (typeof filterGifs[i].comments === 'undefined') {
              filterGifs[i].comments = [];
              filterGifs[i].comments.push(ele);
            }
            else {
              filterGifs[i].comments.push(ele);
            }
          }
        };
      });
    }
    filterArticles.push(...filterGifs);
    return respondWithSuccess(response, statusCode.success, 'Successfully', filterArticles);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
};

exports.viewSpecficArticle = async (request, response) => {
  const articleId = parseInt(request.params.articleId, 10);
  try {
    const article = await pool.query('select u.user_id authorID, article_id id, first_name firstName, last_name lastName, a.date createdOn, a.title articleTitle, article from public.user u LEFT JOIN public.article a ON u.user_id = a.user_id where article_id =$1', [articleId]);
    const articleComment = await pool.query('select a.user_id authorId, a.article_id articleId, article_comment_id commentId, c.date createdOn, c.comment articleComment from public.article a LEFT JOIN public.article_comment c ON a.article_id = c.article_id where a.article_id = $1', [articleId]);
    const articleValue = article.rows[0];
    const commentValue = articleComment.rows;
    articleValue.comments = [...commentValue]
    return respondWithSuccess(response, statusCode.success, 'Successfully', articleValue);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
}

exports.viewSpecficGif = async (request, response) => {
  const gifId = parseInt(request.params.gifId, 10);
  try {
    const gif = await pool.query('select u.user_id authorId, gif_id id, first_name firstName, last_name lastName, g.title gifTitle, g.date gifDate, image_url from public.user u LEFT JOIN public.gifs g ON u.user_id = g.user_id where gif_id =$1', [gifId]);
    const gifComment = await pool.query('select g.user_id authorId, g.gif_id gifId, gifs_comment_id commentId, c.date createdOn, c.gif_comment gifComment from public.gifs g LEFT JOIN public.gifs_comment c ON g.gif_id = c.gif_id where g.gif_id = $1', [gifId]);
    const gifValue = gif.rows[0];
    const commentValue = gifComment.rows;
    gifValue.comments = [...commentValue]
    return respondWithSuccess(response, statusCode.success, 'Successfully', gifValue);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
}

exports.category = async (request, response) => {
  const { category } = request.body;
  try {
    const article = await pool.query('select u.user_id, article_id, first_name, last_name, a.date articleDate, a.title articleTitle, article from public.user u LEFT JOIN public.article a ON u.user_id = a.user_id where article like  $1', [`%${category}%`]);
    const articleData = article.rows;
    const articlesPost = articleData.map((ele) => ({name: `${ele.first_name} ${ele.last_name}`, id: ele.article_id, createdOn: ele.articledate, title: ele.articletitle, article: ele.article, authorId: ele.user_id }))
    const filterArticles = articlesPost.filter((ele) => ele.article !== null);
    const articleComment = await pool.query('select a.user_id authorId, a.article_id articleId, article_comment_id commentId, c.date createdOn, c.comment articleComment from public.article a LEFT JOIN public.article_comment c ON a.article_id = c.article_id ORDER BY c.date DESC');
    const commentValue = articleComment.rows;
    for (let i = 0; i < filterArticles.length; i++) {
      commentValue.forEach((ele) => {
        if (filterArticles[i].articleId === ele.articleid) {
          if (ele.articlecomment !== null) {
            if (typeof filterArticles[i].comments === 'undefined') {
              filterArticles[i].comments = [];
              filterArticles[i].comments.push(ele)
            }
            else {
              filterArticles[i].comments.push(ele);
            }
          };
        };
      });
    }
    return respondWithSuccess(response, statusCode.success, 'Successfully', filterArticles);
  }
  catch (error) {
    return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
  }
}

exports.flagPosts = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { tableName } = request.body;
  switch (tableName) {
    case 'article':
      try {
        await pool.query('UPDATE public.article SET article_flag = $1 WHERE article_id = $2', ['flag', id]);
        return respondWithSuccess(response, statusCode.created, 'Article flag as inappropriate');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    case 'gif':
      try {
        await pool.query('UPDATE public.gifs SET gif_flag = $1 WHERE gif_id = $2', ['flag', id]);
        return respondWithSuccess(response, statusCode.created, 'Gif flag as inappropriate');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    case 'gifComment':
      try {
        await pool.query('UPDATE public.gifs_comment SET gif_comment_flag = $1 WHERE gifs_comment_id = $2', ['flag', id]);
        return respondWithSuccess(response, statusCode.created, 'Comment flag as inappropriate');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      };
    case 'articleComment':
      try {
        await pool.query('UPDATE public.article_comment SET article_comment_flag = $1 WHERE article_comment_id = $2', ['flag', id]);
        return respondWithSuccess(response, statusCode.created, 'Comment flag as inappropriate');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      };
    default:
      return respondWithWarning(response, statusCode.internalServerError, 'Server Error');
  }
}

exports.deleteFlagPosts = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  const { tableName } = request.body;
  switch (tableName) {
    case 'article':
      try {
        await pool.query('DELETE FROM public.article_comment WHERE article_id = $1', [id]);
        await pool.query('DELETE FROM public.article WHERE article_id = $1', [id]);
        return respondWithSuccess(response, statusCode.success, 'Article flag as inappropriate deleted');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    case 'gif':
      try {
        await pool.query('DELETE FROM public.gifs_comment WHERE gif_id = $1', [id]);
        await pool.query('DELETE FROM public.gifs WHERE gif_id = $1', [id]);
        return respondWithSuccess(response, statusCode.success, 'Gif flag as inappropriate deleted');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    case 'gifComment':
      try {
        await pool.query('DELETE FROM public.gifs_comment WHERE gifs_comment_id = $1', [id]);
        return respondWithSuccess(response, statusCode.success, 'Gif comment flag as inappropriate deleted');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    case 'articleComment':
      try {
        await pool.query('DELETE FROM public.article_comment WHERE article_comment_id = $1', [id]);
        return respondWithSuccess(response, statusCode.success, 'Article comment flag as inappropriate deleted');
      }
      catch (error) {
        return respondWithWarning(response, statusCode.internalServerError, 'Server Error', error);
      }
    default:
      return respondWithWarning(response, statusCode.internalServerError, 'Server Error');
  }
}

exports.logout = (request, response) => respondWithSuccess(response, statusCode.success, 'Successfully Logged out');