const Product = require("../models/product");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");
const products = require("../data/products");
dotenv.config({path:"backend/config/config.env"})
connectDatabase.connect();
const seedProducts = async(req,res)=>{
    try{
        await Product.deleteMany();
        console.log("products deleted");
        await Product.insertMany(products);
        console.log("products added");
    }catch(err){
        console.log(err.message);
        process.exit();
    }
}
seedProducts();