const Product = require("../models/product");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
const ErrorHandler = require('../utils/errorHandler');
//create product
exports.createProduct = async (req, res) => {
  try {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images)
    } else {
      images = req.body.images;
    }
    console.log("images", images);
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products"
      })
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      })
    }
    req.body.images = imagesLinks;
    console.log("create product called");
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.send({ success: true, product });
  } catch (err) {
    res.send(err);
  }
}
//get all products
exports.getProducts = async (req, res, next) => {
  try {
    const resPerPage = 4;
    const productsCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query.clone();
    console.log("resPerPage", resPerPage)
    res.send({
      productsCount,
      resPerPage,
      filteredProductsCount,
      products
    });
  } catch (err) {
    res.send("error", err);
  }
}
//get single product 
exports.getSingleProduct = async (req, res, next) => {
  try {
    var product = await Product.findById(req.params.id);
    console.log("product", product);
    if (product == undefined) {
      console.log("im here");
      return next(new ErrorHandler('product not found', 401));

    } else {
      res.send({ product });
    }
  } catch (err) {
    res.send(err);
  }
}
//update product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    console.log("product", product);
    console.log("body", req.body);
    if (product == undefined) {
      console.log("im here");
      return next(new ErrorHandler('product not found', 401));
      // return res.send({msg:"product not found"});
    }
    let images = []
    if (typeof req.body.images === "string") {
      images.push(req.body.images)
    } else {
      images = req.body.images;
    }
    if (images != undefined) {
      console.log("im in update image");
      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
      }
      let imagesLinks = [];
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products"
        })
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        })
      }
      req.body.images = imagesLinks;
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
    res.send({ product, success: "true" });
  } catch (err) {
    res.send(err);
  }
}
//Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    console.log("im in delete product");
    console.log("id", req.params.id);
    const product = await Product.findById(req.params.id);
    console.log("product", product);
    if (!product) {
      return next(new ErrorHandler('Product does not exist', 400))
    }
    for (let i = 0; i < product.images.length; i++) {

      // const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
      const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    await product.deleteOne();

    res.send({ success: true });
  } catch (err) {
    res.send(err);
  }
}

//create a review
exports.createProductReview = async (req, res) => {
  console.log("im in createProductReview");
  try {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment
    }
    const product = await Product.findById(productId);
    console.log("product", product);
    const isReviewed = product.reviews.find(r =>
      r.user.toString() === req.user.id.toString()
    )
    if (isReviewed) {
      console.log("reviews", product.reviews);
      product.reviews.forEach(review => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
          review.rating = rating
        }
      })
    } else {
      console.log("im in else part");
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true
    })
  } catch (err) {
    console.log(err);
    res.send({ error: err });
  }
}
//get admins all products
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.send({
      success: true,
      products
    });
  } catch (err) {
    res.send(err.message);
  }
}

//get all reviews
exports.getProductReviews = async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
}

//delete review
exports.deleteReview = async (req, res) => {
  console.log("im in delete review");
  try {
    console.log(req.query.productId);
    console.log(req.query.id);
    const product = await Product.findById(req.query.productId);
    console.log("product", product);
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    console.log("reviews", reviews);
    const numOfReviews = reviews.length;
    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      numOfReviews,
      ratings
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
    res.status(200).json({
      success: true
    })
  } catch (err) {
    res.send({ error: err })
  }
}