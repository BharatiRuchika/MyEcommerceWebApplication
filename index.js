var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

const bodyParser = require('body-parser')
var cloudinary = require("cloudinary");
var logger = require('morgan');
const fileUpload = require('express-fileupload')
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: './config/config.env' })
// require('dotenv').config({ path: './config/config.env' })
const connectDatabase = require("./config/database");
connectDatabase.connect();
// const errorMiddleware = require("./middlewares/errors");
const APIFeatures = require("./utils/apiFeatures");
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var productsRouter = require('./routes/product');
const paymentRouter = require("./routes/payment");
var orderRouter = require("./routes/order");
const errorMiddleware = require('./middlewares/errors')
// require('dotenv').config({path: path.resolve(__dirname+'config/config.env')});
// require("dotenv").config;

var app = express();
app.use(cookieParser());

const cors = require("cors");
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials:true,
//   optionSuccessStatus:200
// }));
// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })
console.log("port", process.env.PORT);
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://my-ecommerce-web-application.vercel.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

const corsOptions = {
  origin: true,
  credentials: true,
};
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
//setting cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));



if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/auth', authRouter);
app.use('/order', orderRouter);
app.use('/user', paymentRouter);
app.use(errorMiddleware);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  res.render('error');
});
// Middleware to handle errors

// app.listen(`${process.env.PORT}`,()=>console.log(`server started at ${process.env.PORT} in ${process.env.NODE_ENV}`
// ));
const PORT = 3000;
app.listen(process.env.PORT || 3001, () => console.log(`server started at ${process.env.PORT}`));
// app.listen(3000,()=>console.log("Server started"))
module.exports = app;
