import {v2 as cloudinary} from "cloudinary"

import fs from "fs"
 

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_SECRET

});

import { v2 as cloudinary } from 'cloudinary';

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file uploaded succesfully
        console.log("cloudUploaded succesfully",response.url)
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath)//remove locally saved temp files
        return null;


    }
}

   
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
           // 
           {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    