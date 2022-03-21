const express = require('express');
const router = express.Router();
const { subscription } = require('../controllers');

router.post("/plan", subscription.subscriptionAction)
router.get("/plan", subscription.subscription)

router.post("/payment", subscription.paymentAction)
router.get("/paymentpage", subscription.paymentPage)

module.exports = router