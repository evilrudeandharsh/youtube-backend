import dotenv from "dotenv";
import {app} from "./app.js"
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})


connectDB().then(()=>{
    app.listen(process.env.PORT||7000,()=>{

        console.log(`Server running at port : ${process.env.PORT}`)
    })



    
})
.catch((err)=>{console.log(err)})




























/*
;(async()=>{

    try{
        await mongoose.connect("${process.env.MONGODB_URL/${DB_NAME}");
        app.on("error",()=>{
            console.log("Error connecting to database");
        })
        app.listen(process.env.PORT,()=>{
            console.log("Server is running on port ${process.env.PORT}");
    })}

    catch(error){
        console.log("Error: ", error);
    }

})()

*/