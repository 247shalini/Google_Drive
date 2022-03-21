const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const multer = require("multer");
const fs = require('fs-extra');
const path = require('path');
const subscriptionPlan = require('../middleware/subscription')
const sendEmailTemplate = require('../middleware/email');
const subscriptionValidation = require('../validations/subscriptionValidation');
const imageValidation = require('../validations/ImageValidation');
const publicShareValidation = require('../validations/publicShareValidation');
const privateShareValidation = require('../validations/privateShareValidation');

// home page
router.get('/' ,UserController.homePage)
router.post('/', UserController.homeAction)

// login page
router.get('/login' , UserController.loginPage)
router.post('/login', UserController.loginAction)

// register page
router.get('/register' , UserController.registerPage)
router.post('/register', UserController.registerAction)

// multer module code
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({storage: storage});

// file upload
router.post('/upload', imageValidation ,upload.single("file") , UserController.uploadFile)

//view Image code
router.post('/viewimage', UserController.viewImage)
router.get('/viewimage' , UserController.viewImageAction)

// logout api
router.post('/logout' , UserController.logOut)

// sendemail and permitted users API
router.post('/permitted', privateShareValidation, sendEmailTemplate ,UserController.permittedUsers)
router.post('/public', publicShareValidation, sendEmailTemplate ,UserController.publicShare)

module.exports = router