const UserModel = require("../models/UserModel")

const imageValidation = async (req, res, next) => {
    const userId = req.session.userId
    const user = await UserModel.findById({ _id: userId })
    console.log("img....",user)

    if (user.uploadImage >= 5 && user.plan == 'freePlan') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 10 && user.plan == 'basicPlan') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 20 && user.plan == 'standard') {
        return res.redirect('/plan')
    }
    if (user.uploadImage >= 100 && user.plan == 'premium') {
        return res.redirect('/plan')
    }
    next();
}

module.exports = imageValidation;
