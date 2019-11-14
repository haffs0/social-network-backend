const express = require('express');

const router = express.Router();
const userCtrl = require('../controllers/user');
const authentication = require('../middleware/authentication')
const per = require('../middleware/checkPermission')
const { validateCreateUserFormData } = require('../middleware/inputValidation')


router.post('/create-user', authentication, per.checkPermission('create_user'), validateCreateUserFormData, userCtrl.createUser);


module.exports = router;
