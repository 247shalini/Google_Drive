const UserModel = require("../models/UserModel")

const subscriptionValidation = async (req, res, next) => {
    const Id = req.session.userId
    const user = await UserModel.findById({ _id: Id })
    // console.log(user)

    if (user.plan == 'Free-Plan') {
        next();
    }
    if (user.plan == 'Basic-Plan') {
        next();
    }
    if (user.plan == 'Standard') {
        next();
    }
    if (user.plan == 'Premium') {
        next();
    }
    return res.redirect('/plan')
}

module.exports = subscriptionValidation