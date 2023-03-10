//create and send token and save in the cookie
const sendToken = (user, statusCode, res) => {
  //create jwt token
  console.log("im here");
  const token = user.getJwtToken();
  console.log("token", token);
  //options for cookie

  console.log("date", new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000));
  const options = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false
  }

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, //validity of 30 days
  }).json({
    success: true,
    token,
    user
  });
// const token = req.header("Authorization");

  // res.status(statusCode).cookie('token', token, options).json({
  //   success: true,
  //   token,
  //   user
  // })

  // res.cookie('token',token,options).send({success:true,token,user})
}
module.exports = sendToken;