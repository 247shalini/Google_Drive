const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const multer = require("multer");
const fs = require('fs-extra');
const path = require('path');
const sendEmailTemplate = require('../middleware/email');
const imageValidation = require('../validations/ImageValidation');
const publicShareValidation = require('../validations/publicShareValidation');
const privateShareValidation = require('../validations/privateShareValidation');
const { userValidation } = require('../validations/userValidation');
const { handleValidationErrors } = require('../middleware/validate');

// login page
router.get('/login', UserController.loginPage)
router.post('/login', UserController.loginAction)

// register page
router.get('/register', UserController.registerPage)
router.post('/register', userValidation, handleValidationErrors, UserController.registerAction)

//forgot password
router.get('/forgotpassword', UserController.forgotPasswordPage)
router.post('/forgotpassword', UserController.forgotPasswordPageAction)

// new password 
router.get('/newpassword/:id/:token', UserController.newPasswordPage)
router.post('/newpassword/:id/:token', UserController.newPasswordPageAction)

// home page
router.get('/', UserController.homePage)
router.post('/', UserController.homeAction)

// multer module code
const uploadPath = path.join(__dirname, "..", "uploads");
fs.ensureDirSync(uploadPath); // sure that path is exiting or not 
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: function (req, file, cb) {
        try {
            cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
        } catch (err) {
            console.log("error")
        }
    }
});
const upload = multer({ storage: storage });

// file upload
router.post('/upload', imageValidation, upload.single("file"), UserController.uploadFile)


// logout api
router.post('/logout', UserController.logOut)

// sendemail and permitted users API
router.post('/permitted', privateShareValidation, sendEmailTemplate, UserController.permittedUsers)
router.post('/public', publicShareValidation, UserController.publicShare)

module.exports = router