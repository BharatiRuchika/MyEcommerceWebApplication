var express = require('express');
var router = express.Router();
const user = require("../modules/auth");
const {isAuthenticatedUser,authorizeRoles} = require("../middlewares/auth");
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/register",user.registerUser);
router.post("/login",user.LoginUser);
router.get("/logout",user.Logout);
router.post("/password/forgot",user.forgetPassword);
router.put("/password/reset/:token",user.resetPassword);
router.get("/me",isAuthenticatedUser,user.getUserProfile);
router.put("/me/update",isAuthenticatedUser,user.updateProfile);
router.put("/password/updatepassword",isAuthenticatedUser,user.updatePassword);
router.get("/admin/users",isAuthenticatedUser,authorizeRoles('admin'),user.allUsers);
router.get("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),user.getUserDetails);
router.put("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),user.updateUser)
router.delete("/admin/user/:id",isAuthenticatedUser,authorizeRoles("admin"),user.deleteUser);
module.exports = router;
