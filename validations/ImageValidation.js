const UserModel = require("../models/UserModel")

const imageValidation = async (req, res, next) => {
    const Id = req.session.userId
    const user = await UserModel.findById({ _id: Id })
    // console.log("img....",user)

    if (user.uploadImage >= 5 && user.plan == 'Free-Plan') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 10 && user.plan == 'Basic-Plan') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 20 && user.plan == 'Standard') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 100 && user.plan == 'Premium') {
        return res.redirect('/plan')
    }
    next();
}

module.exports = imageValidation;
