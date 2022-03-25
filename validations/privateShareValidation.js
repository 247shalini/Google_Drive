const UserModel = require("../models/UserModel")

const privateShareValidation = async (req, res, next) => {
    const Id = req.session.userId
    const user = await UserModel.findById({ _id: Id })
    console.log("img....",user)

    if (user.privateShare >= 1 && user.plan == 'Free-Plan') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 2 && user.plan == 'Basic-Plan') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 100 && user.plan == 'Standard') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 100 && user.plan == 'Premium') {
        return res.redirect('/plan')
    }
    next();
}

module.exports = privateShareValidation;