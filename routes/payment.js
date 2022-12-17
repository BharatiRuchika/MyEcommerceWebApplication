const express = require("express");
const router = express.Router();
var {isAuthenticatedUser,authorizeRoles} = require("../middlewares/auth")
var {processPayment,sendStripeApi} = require("../modules/Payment")
router.post("/payment",isAuthenticatedUser,processPayment);
router.get("/payment/stripeApi",isAuthenticatedUser,sendStripeApi);

module.exports = router;