const express = require('express');
const stuffCTRL = require('../controllers/stuff');
const multerConfig = require('../middleware/multer-config');
const authentication = require('../middleware/authentication');
const per = require('../middleware/checkPermission');
const { validateArticlePosted } = require('../middleware/inputValidation')


const router = express.Router();


router.post('/gifs', authentication, per.checkPermission('user_access'), multerConfig.multerUploads, stuffCTRL.createGif);
router.post('/articles', authentication, per.checkPermission('user_access'), validateArticlePosted, stuffCTRL.createArticles);

module.exports = router;


