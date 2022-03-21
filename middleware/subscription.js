const UserModel = require('../models/UserModel');

const subscriptionPlan = async (req, res, next) => {
    try {
        const userId = req.session.userId;
        console.log(userId)

        const userSubscription = await UserModel.find(
            { plan: { $elemMatch: { userId } } })
        // console.log("user subscribe", userSubscription);
        if (!userSubscription.length) {
            return res.redirect('/plan')
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "We are having some error while completing your request. Please try again after some time.",
            error: error
        });
    }
}

module.exports = subscriptionPlan ;