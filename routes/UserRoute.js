const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const multer = require("multer");
const fs = require('fs-extra');
const path = require('path');
const sendEmailTemplate = require('../middleware/email');
const subscriptionValidation = require('../validations/subscriptionValidation');
const imageValidation = require('../validations/ImageValidation');
const publicShareValidation = require('../validations/publicShareValidation');
const privateShareValidation = require('../validations/privateShareValidation');
const { userValidation } = require('../validations/userValidation');
const { handleValidationErrors } = require('../middleware/validate');

// home page
router.get('/', UserController.homePage)
router.post('/', UserController.homeAction)

// login page
router.get('/login', UserController.loginPage)
router.post('/login', UserController.loginAction)

// register page
router.get('/register', UserController.registerPage)
router.post('/register', userValidation, handleValidationErrors, UserController.registerAction)

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

//view Image code
// router.post('/viewimage', UserController.viewImage)
// router.get('/viewimage' , UserController.viewImageAction)

// logout api
router.post('/logout', UserController.logOut)

// sendemail and permitted users API
router.post('/permitted', privateShareValidation, sendEmailTemplate, UserController.permittedUsers)
router.post('/public', publicShareValidation, UserController.publicShare)

module.exports = router