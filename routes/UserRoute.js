const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const multer = require("multer");
const fs = require('fs-extra');
const path = require('path');
const sendEmailTemplate = require('../middleware/email');

// home page
router.get('/' , UserController.homePage)
router.post('/', UserController.homeAction)

// login page
router.get('/login' , UserController.loginPage)
router.post('/login', UserController.loginAction)

// register page
router.get('/register' , UserController.registerPage)
router.post('/register', UserController.registerAction)

// file upload
const uploadPath = path.join(__dirname, "..", "uploads");
fs.ensureDirSync(uploadPath);
const upload = multer({dest: uploadPath})
router.post('/upload', upload.single("file") , UserController.uploadFile)
// router.get('/upload/:id', UserController.uploadFileAction)

// view Image
router.post('/view' , UserController.viewImage)

// sendemail and permitted users API
router.post('/permitted', sendEmailTemplate ,UserController.permittedUsers)

module.exports = router