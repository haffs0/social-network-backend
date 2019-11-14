const express = require('express');
const stuffCTRL = require('../controllers/stuff');
const multerConfig = require('../middleware/multer-config');
const authentication = require('../middleware/authentication');
const per = require('../middleware/checkPermission');
const { validateArticlePosted, validateArticleUpdatedPosted } = require('../middleware/inputValidation')


const router = express.Router();


router.post('/gifs', authentication, per.checkPermission('user_access'), multerConfig.multerUploads, stuffCTRL.createGif);
router.post('/articles', authentication, per.checkPermission('user_access'), validateArticlePosted, stuffCTRL.createArticles);
router.patch('/articles/:articleId', authentication, per.checkPermission('user_access'), validateArticleUpdatedPosted, stuffCTRL.updateArticles);
router.delete('/articles/:articleId', authentication, per.checkPermission('user_access'), stuffCTRL.deleteArticles);
router.delete('/gifs/:gifId', authentication, per.checkPermission('user_access'), stuffCTRL.deleteGifs);
router.post('/articles/:articleId/comment', authentication, per.checkPermission('user_access'), stuffCTRL.createCommentOfArticle);

module.exports = router;


