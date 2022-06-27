require('dotenv').config()
const UserModel = require("../models/UserModel");
const file = require('../models/file');
const File = require("../models/file.js");
const { Email, AVAILABLE_TEMPLATES } = require("../utils/Email.js");
const { count, validate } = require('../models/UserModel');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "json web token secrate key"

const homePage = async (req, res, next) => {
  try {
    const userId = req.session.userId

    if (!userId) {
      return res.redirect('/login')
    }

    const planSubscription = await UserModel.findById({ _id: userId });

    if (planSubscription.plan == 'none') {
      return res.redirect('/plan')
    }

    const userEmail = req.session.userEmail;
    const files = await file
      .find({ permittedUsers: { $elemMatch: { userEmail } } })
      .lean();

    return res.render('home/home', {
      total: files.length,
      files: files,
      plan: planSubscription.plan,
      emailTaken: req.flash('emailTaken'),
    })

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
        "please create your account",
      error: error
    });
  }
};

const loginAction = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).render('login/login')
    }

    const user = await UserModel.findOne({ email });
    if (user.email === email && user.password === password) {
      req.session.userId = user._id;
      req.session.userEmail = user.email;
      return res.redirect("/");
    }
    else {
      return res.status(422).render("login/login", {
        error: "User Details is Incorrect !!",
      });
    }
  } catch (error) {
    return res.status(500).render(("login/login"), {
      message: "Please create your account !!",
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
    const { firstname, lastname, email, password, plan, uploadImage, publicShare, privateShare } = req.body
    await UserModel.create({
      firstname,
      lastname,
      email,
      password,
      plan,
      uploadImage,
      publicShare,
      privateShare,
    });

    return res.redirect('/login')
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error
    });
  }
};

const forgotPasswordPage = async (req, res, next) => {
  try {
    return res.render('login/forgotpassword')
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
}

const forgotPasswordPageAction = async (req, res, next) => {
  try {
    const { emails } = req.body;
    const user = await UserModel.findOne({ email: emails });

    // set the secret with jwt token + password
    const secret = JWT_SECRET + user.password
    const payLoad = {
      email: user.email,
      id: user.id
    }
    const token = jwt.sign(payLoad, secret, { expiresIn: '5m' })
    const link = `http://localhost:8000/newpassword/${user.id}/${token}`

    // send email to set the new password 
    const emailClient = new Email();
    emailClient.setTemplate(AVAILABLE_TEMPLATES.NEWPASSWORDREQUEST);
    emailClient.setBody({ link: link, firstname: user.firstname });
    emailClient.send(user.email);

    return res.render("login/forgotpassword", {
      link: "Reset password link has been sent to your Email !!"
    })

  } catch (error) {
    return res.render("login/forgotpassword", {
      error: "Email is Invalid !!",
    });
  }
}

const newPasswordPage = async (req, res, next) => {
  const { id, token } = req.params;
  const user = await UserModel.findOne({ id })

  // check if this id exist in database 
  if (id !== user.id) {
    return res.send("Invalid User Id...")
  }

  // we have a valid id, and we have a valid user with this id
  const secret = JWT_SECRET + user.password
  try {
    const payLoad = jwt.verify(token, secret) 
    return res.render('login/newpassword')

  } catch (error) {
    return res.render("login/forgotpassword", {
      message: "Invalid link, Try again later !!",
    });
  }
}

const newPasswordPageAction = async (req, res, next) => {
  const { id, token } = req.params;
  const { password, cpassword } = req.body;
  const user = await UserModel.findOne({ id })

  // check if this id exist in database 
  if (id !== user.id) {
    return res.send("Invalid User Id...")
  }

  const secret = JWT_SECRET + user.password
  try {
    const payLoad = jwt.verify(token, secret)

    // validate password and confirm password should match
    // we can simply find the user with the payLoad email and id and finally update with new password
    if (password == cpassword) {
      await UserModel.findOneAndUpdate({ _id: id }, { $set: { password: password } }, { new: true })
      return res.render("login/newpassword", {
        success: "Successfully changed your password !!"
      })
    } else {
      return res.render("login/newpassword", {
        error: "Password not matched !!"
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
}

const uploadFile = async (req, res, next) => {
  try {
    const { file } = req;
    const { userEmail } = req.session;
    const userId = req.session.userId;
    await File.create({
      name: file.originalname,
      path: file.filename,
      size: file.size,
      type: file.mimetype,
      permittedUsers: [
        {
          userEmail,
        },
      ],
    });

    const imageLimit = await UserModel.findById({ _id: userId })
    await UserModel.findOneAndUpdate({ _id: userId }, { $set: { uploadImage: imageLimit.uploadImage + 1 } }, { new: true })
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

const permittedUsers = async (req, res, next) => {
  try {
    const { fileId, emails } = req.body;
    const userId = req.session.userId;
    const file = await File.findById(fileId);

    if (!file) {
      return res.redirect("/");
    }

    // private image share count
    const shareLimit = await UserModel.findById({ _id: userId })
    // console.log("shareLimit...",shareLimit)
    await UserModel.findOneAndUpdate({ _id: userId }, { $set: { privateShare: shareLimit.privateShare + 1 } }, { new: true })

    // permittedUsers save
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

const publicShare = async (req, res, next) => {
  try {
    const { fileId, emails } = req.body;
    const userId = req.session.userId;
    const file = await File.findById(fileId);
    if (!file) {
      return res.redirect("/");
    }
    const emailClient = new Email();
    emailClient.setTemplate(AVAILABLE_TEMPLATES.PUBLICREQUEST);
    emailClient.setBody({ path: file.path });
    emailClient.send(emails);

    // public image share count
    const shareLimit = await UserModel.findById({ _id: userId })
    console.log("permitted", shareLimit)
    await UserModel.findOneAndUpdate({ _id: userId }, { $set: { publicShare: shareLimit.publicShare + 1 } }, { new: true })
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

const logOut = async (req, res, next) => {
  try {
    req.session.userId = undefined
    req.session.destroy(null);
    return res.redirect("/login")
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error
    });
  }
}

module.exports = {
  homePage,
  homeAction,
  loginPage,
  loginAction,
  registerPage,
  registerAction,
  forgotPasswordPage,
  forgotPasswordPageAction,
  newPasswordPage,
  newPasswordPageAction,
  uploadFile,
  permittedUsers,
  publicShare,
  logOut
};
