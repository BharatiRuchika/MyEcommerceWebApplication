// require('dotenv').config({ path: './config/config.env' })
const mongoose = require("mongoose");
exports.connect = async()=>{
    try{
        console.log(
            "uri",process.env.DB_LOCAL_URI
        )
        console.log("in port",process.env.PORT)
    var con = await mongoose.connect(`${process.env.DB_LOCAL_URI}`,{useNewUrlParser:true,useUnifiedTopology:true})
    console.log("database connected");
    console.log(`MongoDB Database connected with HOST: ${con.connection.host}`)
    }catch(err){
        console.log(err);
    }
}


