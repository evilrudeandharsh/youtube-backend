import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloud.js"
import {User} from "../models/user.model.js"
 
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens=async(userId)=>{

    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()


        user.refreshToken=refreshToken 
        await user.save({validateBeforeSave:false})
        

        return {accessToken,refreshToken}


         



    }
    catch(error){
        throw new ApiError(500,"Something is wrong while generating tokens")
    }
}


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

const loginUser= asyncHandler(async (req,res)=>{

    const {email,password,username}=req.body

    if(!username || !email){
        throw new ApiError(400,"Username or password required")


    }

    const user =awaitUser.findOne({
        $or:[{username},{email}]
    
    })

    if(!user){
        throw new ApiError(404,"User does not exist")

    }


    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password invalid")

    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={

        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)

    .json(
        new ApiResponse(200,
        
        {user:loggedInUser,accessToken,refreshToken},
        "User logged in Succesfully"
         
    )

)

})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,{
            $set:
            {
                refreshToken:undefined
            }
        }
    )
    const options={

        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out"))
}
)





export { 
    registerUser,
    loginUser,
    logoutUser

};
