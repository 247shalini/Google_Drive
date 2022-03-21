const UserModel = require("../models/UserModel")

const publicShareValidation = async (req, res, next) => {
    const userId = req.session.userId
    const user = await UserModel.findById({ _id: userId })
    console.log("img....",user)

    if (user.publicShare >= 2 && user.plan == 'freePlan') {
        return res.redirect('/plan')
    }
    if (user.publicShare >= 10 && user.plan == 'basicPlan') {
        return res.redirect('/plan')
    }
    if (user.publicShare >= 20 && user.plan == 'standard') {
        return res.redirect('/plan')
    }
    if (user.publicShare >= 100 && user.plan == 'premium') {
        return res.redirect('/plan')
    }
    next();
}

module.exports = publicShareValidation;