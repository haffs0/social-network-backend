const express = require('express');
const stuffCTRL = require('../controllers/stuff');
const multerConfig = require('../middleware/multer-config');
const authentication = require('../middleware/authentication');
const per = require('../middleware/checkPermission');


const router = express.Router();


router.post('/gifs', authentication, per.checkPermission('user_access'), multerConfig.multerUploads, stuffCTRL.createGif);

module.exports = router;


