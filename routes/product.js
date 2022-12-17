const express = require("express");
const router = express.Router();
var {isAuthenticatedUser,authorizeRoles} = require("../middlewares/auth")
var product = require("../modules/product");
router.get("/getproducts",product.getProducts);
router.get("/admin/getproducts",product.getAdminProducts);
router.post("/admin/createProduct",isAuthenticatedUser,authorizeRoles('admin'),product.createProduct);
router.get("/getProduct/:id",product.getSingleProduct);
router.put("/admin/updateProduct/:id",isAuthenticatedUser,authorizeRoles('admin'),product.updateProduct);
router.delete("/admin/deleteProduct/:id",isAuthenticatedUser,authorizeRoles('admin'),product.deleteProduct);
router.put("/review",isAuthenticatedUser,product.createProductReview);
router.get("/reviews",isAuthenticatedUser,product.getProductReviews);
router.delete("/review",isAuthenticatedUser,product.deleteReview);
module.exports = router;