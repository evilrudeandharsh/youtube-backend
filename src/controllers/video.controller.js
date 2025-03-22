import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const user=await User.findById(userId)

    const pageNo=parseInt(page)
    const limitNo=parseInt(limit)

    searchQuery={}
    if(query){
        searchQuery.title={$regex:query,$options:"i"}
                   .description={$regex:query,$options:"i"}

    }
    const videos=await Video.find(searchQuery)
    .populate("owner")
    .sort(sortType === "desc" ? {[sortBy]:-1}:{[sortBy]:1})
    .limit(limitNo)

    const totalVideos = await Video.countDocuments(searchConditions);

    const totalPages = Math.celi(totalVideos / pageLimit);

    return res.status(200).json(
        new ApiResponse({
        success: true,
        message: "Videos retrived successfully",
        data: videos,
        pagination: {
            page: pageNumber,
            limit: pageLimit,
            totalPages,
            totalVideos,
        },
        }))
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    const localpathvideo=req.files?.videoFile[0]?.path
    const localpaththumbnail=req.files?.thumbnail[0]?.path
    const videoFile=await uploadOnCloudinary(localpathvideo)
    const thumbNail=await uploadOnCloudinary(localpaththumbnail)

    const video=await Video.create({
        videoFile,
        title,
        description,
        thumbNail,
        owner:req.user._id
    })
    return res
    .status(201)
    .json(new ApiResponse(201,video,"Video published successfully"))


    
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const videos=await Video.findById(videoId)
    if(!videos){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"Video fetched successfully"))
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description, thumbnail } = req.body
    const video=await Video.findByIdAndUpdate(videoId,
        {
            $set:{
                title,
                description,
                thumbnail
            }

        },
        {new:true}
    )
return res
.status(200)
.json(new ApiResponse(200, video, "Video details updated successfully"))
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findByIdAndDelete(videoId)
    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video deleted succesfully"))

    

    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}