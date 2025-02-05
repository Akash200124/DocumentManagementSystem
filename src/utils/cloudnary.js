import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import dotenv from 'dotenv';

dotenv.config();

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("cloudinary config loaded");
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);

const uploadOnCloudinary = async (localFilePath) =>{

    try {
        if(!localFilePath)  return null ;
          

        //upload the file to cloudinary 
        const uploadResult= await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
        });
        // file has been uploaded sucessfully 
        // console.log("file uploaded sucessfully",uploadResult.url);
        // return uploadResult ;

        fs.unlinkSync(localFilePath)
        return uploadResult ;
        
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        fs.unlinkSync(localFilePath) // removed locally saved temparty file as the response failed 
        return null ;
    }
}

export {uploadOnCloudinary}