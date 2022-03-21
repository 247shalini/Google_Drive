const UserModel = require("../models/UserModel")

const privateShareValidation = async (req, res, next) => {
    const userId = req.session.userId
    const user = await UserModel.findById({ _id: userId })
    console.log("img....",user)

    if (user.privateShare >= 0 && user.plan == 'freePlan') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 2 && user.plan == 'basicPlan') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 100 && user.plan == 'standard') {
        return res.redirect('/plan')
    }
    if (user.privateShare >= 100 && user.plan == 'premium') {
        return res.redirect('/plan')
    }
    next();
}

module.exports = privateShareValidation;