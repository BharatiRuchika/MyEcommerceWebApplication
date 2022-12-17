const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//Process Stripe Payments
exports.processPayment = async(req,res,next)=>{
    console.log("im in process Payment");
    console.log("body",req.body);
    console.log("amount",req.body.amount);
  const paymentIntent = await stripe.paymentIntents.create({
      amount : req.body.amount,
      currency : 'INR',
      metadata : {integration_check:"accept_a_payment"}
  })
  console.log("client_secret",paymentIntent.client_secret);
  res.status(200).json({
      success:true,
      client_secret : paymentIntent.client_secret
  })
 
}

//send stripe api key
exports.sendStripeApi = async(req,res,next)=>{
   
    res.status(200).json({
        success:true,
        stripeApiKey: process.env.STRIPE_API_KEY
    })
  }