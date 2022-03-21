require('dotenv').config()
const UserModel = require("../models/UserModel");
const file = require('../models/file');
const File = require("../models/file.js");
const { Email, AVAILABLE_TEMPLATES } = require("../utils/Email.js");
const { count } = require('../models/UserModel');

const homePage = async (req, res, next) => {
  try {
    const userId = req.session.userId
    if (!userId) {
      res.redirect('/login')
    }

    const planSubscription = await UserModel.findById({_id: userId });

    if(planSubscription.plan == 'none') {
       return res.redirect('/plan')
    }

    const userEmail = req.session.userEmail;
    const files = await file
      .find({ permittedUsers: { $elemMatch: { userEmail } } })
      .lean();
    return res.render('home/home', {
      total: files.length,
      files: files
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
        "please create your account",
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
    const userId = req.session.userId;
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

const viewImage = async (req, res, next) => {
  await File.find()
    .select("name path")
    .exec()
    .then(docs => {
      return res.redirect("/viewimage")
    })
}

const viewImageAction = async (req, res, next) => {
  const { fileId } = req.body
  const image = File.find({})
  image.exec(function (err, data) {
    return res.render("home/home", {
      data: data,
    })
  })
}

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
    // console.log("permitted",shareLimit)
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

const publicShare = async(req,res,next) => {
  try {
    const { fileId } = req.body;
    const userId = req.session.userId;
    const file = await File.findById(fileId);
    if (!file) {
      return res.redirect("/");
    }

    // public image share count
    const shareLimit = await UserModel.findById({ _id: userId })
    console.log("permitted",shareLimit)
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
  uploadFile,
  viewImage,
  viewImageAction,
  permittedUsers,
  publicShare,
  logOut
};
