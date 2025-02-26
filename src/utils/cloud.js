import {v2 as cloudinary} from "cloudinary"

import fs from "fs"
 

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET

});



const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file uploaded succesfully
        
        // console.log("cloudUploaded succesfully",response.url)
        fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath)//remove locally saved temp files
        return null;


    }
}

export {uploadOnCloudinary}
    