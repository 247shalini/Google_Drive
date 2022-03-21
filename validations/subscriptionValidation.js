const UserModel = require("../models/UserModel")

const subscriptionValidation = async (req, res, next) => {
    const userId = req.session.userId
    const user = await UserModel.findById({ _id: userId })
    console.log(user)

    if (user.plan == 'freePlan') {
        next();
    }
    if (user.plan == 'basicPlan') {
        next();
    }
    if (user.plan == 'standard') {
        next();
    }
    if (user.plan == 'premium') {
        next();
    }
    return res.redirect('/plan')
}

module.exports = subscriptionValidation