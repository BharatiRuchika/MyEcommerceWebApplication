const User = require("../models/user");
// const ErrorHandler = require('../utils/errorHandler');
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
//Register a User
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log("name", name);
        console.log("email", email);
        console.log("password", password);
        console.log("avatar", req.body.avatar);
        const olduser = await User.findOne({ email }).select('+password');
        if (olduser) {
            return next(new ErrorHandler('You already registered..Please log in..', 400))
        }
        if (req.body.avatar == "/images/default_avatar.jpg") {
            console.log("im in degault")
            var user = await User.create({
                name,
                email,
                password,
                avatar: {
                    public_id: "avatars/default_avatar_zvlo1q",
                    url: "https://res.cloudinary.com/daeuzh0zl/image/upload/v1641879724/default_avatar_wzezlf.jpg"
                }
            })
        } else {
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            })

            var user = await User.create({
                name,
                email,
                password,
                avatar: {
                    public_id: result.public_id,
                    url: result.secure_url
                }
            })
        }
        //    const token = user.getJwtToken();
        //    res.send({success:true,user,token})
        console.log("user", user);
        sendToken(user, 200, res);
    } catch (err) {
        console.log("Error", err);
        res.send({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
}
//Login User
exports.LoginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }
    const user = await User.findOne({ email }).select('+password');
    console.log("user", user);
    if (user == null) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    const isPasswordMatch = await user.comparePassword(password)
    console.log("isPasswordMatch", isPasswordMatch)
    if (!isPasswordMatch) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }
    // const token = user.getJwtToken();
    // res.send({success:true,token});
    sendToken(user, 200, res);

})
//logout user
exports.Logout = async (req, res, next) => {
    try {

        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.send({
            success: true,
            msg: "logged out"
        })
    } catch (err) {
        res.send({ error: err })
    }
}
//forget password
exports.forgetPassword = async (req, res, next) => {
    console.log("email", req.body.email);
    var user = await User.findOne({ email: req.body.email });
    console.log("user", user);
    if (user == null) {
        return next(new ErrorHandler('Invalid Email', 401));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    //Create password reset url
    const resetUrl = `http://localhost:3001/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this then please ignore`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIt Password Recovery',
            message
        })
        res.send({ message: `email sent to ${user.email}` })

    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        res.send(err.message);
    }
}

//Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        console.log("user", user);
        if (!user) {
            return res.send({ msg: "password reset token is invalid or has been expired" })
        }
        if (req.body.password !== req.body.confirmpassword) {
            return next(new ErrorHandler('Password doesnt match', 401));
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        sendToken(user, 200, res);
    } catch (err) {
        res.send({ error: err });
    }
}

//get currently logged in user details
exports.getUserProfile = async (req, res, next) => {
    try {
        console.log("im in get user profile");
        console.log("id", req.user.id);
        const user = await User.findById(req.user.id);
        console.log("user", user);
        res.send({
            success: true,
            user
        })
    } catch (err) {
        res.send({ error: err })
    }
}

//update or change password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    var isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler('Old password is incorrect.', 400))
        // return next(new ErrorHandler('Old password is incorrect'));
        //    return res.send({message:"Old password is incorrect"})
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
})

//update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }
        if (req.body.avatar !== '') {
            const user = await User.findById(req.user.id);
            const image_id = user.avatar.public_id;
            const res = await cloudinary.v2.uploader.destroy(image_id);
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
                crop: "scale"
            })
            newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true, user
        })
    } catch (err) {
        res.send({ error: err })
    }
}

//admin routes
//get all users
exports.allUsers = async (req, res, next) => {
    console.log("im in allUsers");
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            users
        })
    } catch (err) {
        res.send({ error: err })
    }
}

//get specific user dertails
exports.getUserDetails = async (req, res, next) => {
    console.log("im in getUserDetails");
    try {

        const user = await User.findById(req.params.id);
        console.log("currentuser", user);
        if (user == null) {
            return next(new ErrorHandler('User doesnt found', 401));
        }
        res.status(200).json({
            success: true,
            user
        })
    } catch (err) {
        res.send({ error: err });
    }
}

//
exports.updateUser = async (req, res, next) => {
    console.log("im in update");
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        res.send({
            success: true, user
        })
    } catch (err) {
        res.send({ error: err })
    }
}

//delete user

exports.deleteUser = async (req, res, next) => {
    try {
        console.log("im in delete function");
        console.log("id", req.params.id);
        const user = await User.findById(req.params.id);
        console.log("user", user);
        if (user == null) {
            return res.send({ msg: "user doesnt exist" })
        }
        //remove avatar from cloudinary - todo
        await user.remove();
        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.send({ error: err })
    }
}
