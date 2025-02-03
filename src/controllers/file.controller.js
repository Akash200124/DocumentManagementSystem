import { Files } from "../models/file.model.js";

import { User } from "../models/user.model.js";
import fs from 'fs'

import { uploadOnCloudinary } from "../utils/cloudnary.js";
const uploadFile = async (req, res) => {

    const file = req.file;
    const { title, description } = req.body;
    const jwt = req.headers.refreshtoken;

    console.log("file", file);

    if (!file || !title || !description) {
        fs.unlinkSync(file.path);
        return res.status(400).json({
            "success": false,
            "message": "All fields are required"
        })
    }

    try {
        const user = await User.findOne({ refreshToken: jwt });

        // console.log("user :", user);
        if (!user) {
            fs.unlinkSync(file.path);

            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })
        }

        // for upload on cloudnary images and videos 
        // const result = await uploadOnCloudinary(file.path);

        // if (!result) {
        //     fs.unlinkSync(file.path);
        //     return res.status(500).json({
        //         "success": false,
        //         "message": "Something went wrong while uploading file"
        //     })
        // }

        // console.log("Result",result);

        const newFile = await Files.create({
            name: file.originalname,
            path: file.path,
            size: file.size,
            type: file.mimetype,
            owner: user._id,
            title,
            description
        })

        if (newFile) {
            return res.status(200).json({
                "success": true,
                "message": "File uploaded successfully",
                "data": newFile
            })
        }

    } catch (error) {
        console.log("Something went wrong while uploading file : ", error.message);
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong while uploading file"

        })
    }



}

const deleteFile = async (req, res) => {

    const id = req.params.documentid;
    const jwt = req.headers.refreshtoken;

    console.log("id : ", id);

    try {
        const user = await User.findOne({ refreshToken: jwt });
        if (!user) {
            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })
        }

        const file = await Files.findById(id);
        if (!file) {
            return res.status(404).json({
                "success": false,
                "message": "File not found"
            })
        }

        if (file.owner.toString() !== user._id.toString()) {
            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })
        }

        await Files.findByIdAndDelete(id);
        fs.unlinkSync(file.path);

        return res.status(200).json({
            "success": true,
            "message": "File deleted successfully"
        })

    } catch (error) {
        console.log("Something went wrong while deleting file : ", error.message);
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong while deleting file"
        })
    }
}

const getFile = async (req, res) => {

    const jwt = req.headers.refreshtoken;

    try {
        const user = await User.findOne({ refreshToken: jwt });
        if (!user) {
            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })            
        }

        const file = await Files.find({ owner: user._id });
        if (!file) {
            return res.status(404).json({
                "success": false,
                "message": "File not found"
            })
        }


        return res.status(200).json({
            "success": true,
            "data": file
        })

    } catch (error) {
        console.log("Something went wrong while getting file : ", error.message);
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong while getting file"
        })
    }

}

const downloadFile = async (req, res) => {

    const id = req.params.documentid;
    const jwt = req.headers.refreshtoken;

    try {
        const user = await User.findOne({ refreshToken: jwt });
        if (!user) {
            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })            
        }

        const file = await Files.findById(id);
        if (!file) {
            return res.status(404).json({
                "success": false,
                "message": "File not found"
            })
        }

        if (file.owner.toString() !== user._id.toString()) {
            return res.status(401).json({
                "success": false,
                "message": "unauthorized"
            })
        }

        res.download(file.path, file.name, (err) => {
            if (err) {
                console.log("Something went wrong while downloading file : ", err.message);
                return res.status(500).json({
                    "success": false,    
                    "message": "Something went wrong while downloading file"
                })
            }
        })
        
    } catch (error) {
        console.log("Something went wrong while downloading file : ", error.message);
        return res.status(500).json({
            "success": false,
            "message": "Something went wrong while downloading file"
        })
    }
}



export { uploadFile, deleteFile, getFile, downloadFile }