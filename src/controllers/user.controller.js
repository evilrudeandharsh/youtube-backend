import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloud.js"
import {User} from "../models/user.model.js"

import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    const {fullname,email,username,password}=req.body
    console.log(email)

    if ([fullname,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"Fields required required")
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]

    })

    if(existedUser){
        throw new ApiError(409,"User with email or username exists")


        
    }
    const localpathavatar=req.files?.avatar[0]?.path
    // const localpathcoverimage=req.files?.coverimage[0]?.path


    let localpathcoverimage;

    if(req.files&& Array.isArray(req.files.coverimage)&& req.files.coverimage.length>0){
        localpathcoverimage=req.files.coverimage[0].path

    }


    if(!localpathavatar){
        throw new ApiError(400,"Avatar file required")
    }


    const avatar=await uploadOnCloudinary(localpathavatar)
    const coverimage=await uploadOnCloudinary(localpathcoverimage)

    if(!avatar){
        throw new ApiError(400,"Avatar file required")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url|| "",
        email,
        password,
        username:username.toLowerCase()
    })


    const createduser=await User.findById(user._id).select(

        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500,"Something went wrong while registering user")



    }

    return res.status(201).json(
        new ApiResponse(200,createduser,"user registered succesfully")
    )









})

export { registerUser };
