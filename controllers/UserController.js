const UserModel = require("../models/UserModel");
const file = require('../models/file')
const File = require("../models/file.js")
const { Email, AVAILABLE_TEMPLATES } = require("../utils/Email.js");


const homePage = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      res.redirect('/login')
    } else {
      const userEmail = req.session.userEmail;
      const files = await file
        .find({ permittedUsers: { $elemMatch: { userEmail } } })
        .lean();
      return res.render('home/home', {
        total: files.length,
        files: files
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};
const homeAction = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data saved successfully.",
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};

const loginPage = async (req, res, next) => {
  try {
    return res.render('login/login')
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};
const loginAction = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.redirect("/login");
    }

    const user = await UserModel.findOne({ email });
    if (user.email === email && user.password === password) {
      req.session.userId = user._id;
      req.session.userEmail = user.email;
      return res.redirect("/");
    }
    else {
      return res.redirect("/login")
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};

const registerPage = async (req, res, next) => {
  try {
    return res.render('register/register')
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};
const registerAction = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body
    await UserModel.create({
      firstname,
      lastname,
      email,
      password,
    });
    return res.redirect('/login')
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    const { userEmail } = req.session;
    await File.create({
      name: file.originalname,
      path: file.filename,
      size: file.size,
      type: file.mimetype,
      permittedUsers: [
        {
          userEmail,
          isOwner: true,
        },
      ],
    });
    return res.redirect("/");

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};

const viewImage = async (req, res, next) => {
  const { file } = req
  console.log(file)
}

const permittedUsers = async (req, res, next) => {
  try {

    const { fileId, emails } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.redirect("/");
    }
    const userEmail = [];
    userEmail.push({ userEmail: emails, isOwner: false });
    file.permittedUsers.push(...userEmail);
    await file.save(userEmail);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
};

module.exports = {
  homePage,
  homeAction,
  loginPage,
  loginAction,
  registerPage,
  registerAction,
  uploadFile,
  viewImage,
  permittedUsers
};
