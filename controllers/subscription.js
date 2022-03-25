const UserModel = require("../models/UserModel");
var Publishable_Key = 'pk_test_51KdyM6BSVGNjFon4gTyQeEetTq0s9D8wsvj4p4kshqVx16PYv2o1OIyFoJ2sQH8GGMoVKuFb2t5TrEAqXUD1uU6m00OpOIyZ1S'
var Secret_Key = 'sk_test_51KdyM6BSVGNjFon46W18khZLGUnnJo2P9b3F3dvHeB86Pj6mTbeoflU2TgkQrpSKCYUu2kaEgsSLV2pLmhAggwYJ00zYTKPO84'
const stripe = require('stripe')(Secret_Key);

const subscription = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login')
        }
        const buttonValue = [
            { id: "Free-Plan", color: "bg-dark", name: "Free Plan", price: "5.00" },
            { id: "Basic-Plan", color: "bg-secondary", name: "Basic Plan", price: "10.00" },
            { id: "Standard", color: "bg-dark", name: "Standard", price: "15.00" },
            { id: "Premium", color: "bg-secondary", name: "Premium", price: "20.00" },
        ]
        return res.status(200).render('subscription/subscription', {
            data: buttonValue,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "We are having some error while completing your request. Please try again after some time.",
            error: error
        });
    }

}

const subscriptionAction = async (req, res) => {
    try {
        const { plan, price } = req.body;
        const userId = req.session.userId;
        console.log("subscription....", userId)
        await UserModel.findOneAndUpdate({ _id: userId }, { $set: { plan: plan } }, { new: true })
        return res.render("subscription/paymentpage",
            {
                key: Publishable_Key,
                plan: plan,
                price: price*100,
                prices: price
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "We are having some error while completing your request. Please try again after some time.",
            error: error
        });
    }
}

const paymentAction = (req, res) => {
    try {
        const amount = req.body.price
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Subscription Plan',
            address: {
                line1: 'TC 9/4 Old MES colony',
                postal_code: '452331',
                city: 'Indore',
                state: 'Madhya Pradesh',
                country: 'India',
            }
        })
        .then((customer) => {
            return stripe.charges.create({
                amount: `${amount}`,     // Charing Rs per plan
                description: 'Subscription Plan',
                currency: 'usd',
                customer: customer.id
            });
        })
        .then((charge) => {
           return res.redirect("/")  // If no error occurs
        })
        .catch((error) => {
            return res.status(500).json({
                success: false,
                message:
                    "payment failed",
                error: error
            });   // If some error occurs
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                "We are having some error while completing your request. Please try again after some time.",
            error: error
        });
    }
}

module.exports =
{
    subscription,
    subscriptionAction,
    paymentAction,
}
