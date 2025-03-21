import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const user = await User.findById(req.user._id)
    const likes= await Like.findOne({video:videoId,likedBy: user._id})
    if(likes){
        await Like.findByIdAndDelete(likes._id)
        return res
        .status(200)
        .json(new ApiResponse(200,"Video unliked successfully"))
    }
    const newLike = new Like({
        video:videoId,
        likedBy:user
    })
    await newLike.save()
    return res
    .status(200)
    .json(new ApiResponse(200,"Video liked successfully"))
    //TODO: toggle like on video
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
    const user = await User.findById(req.user._id)
    const likes= await Like.findOne({comment:commentId,likedBy: user._id})
    if(likes){
        await Like.findByIdAndDelete(likes._id)
        return res
        .status(200)
        .json(new ApiResponse(200,"Comment unliked successfully"))
    }
    const newLike = new Like({
        comment:commentId,
        likedBy:user
    })
    await newLike.save()
    return res
    .status(200)
    .json(new ApiResponse(200,"Comment liked successfully"))
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const user = await User.findById(req.user._id)
    const likes= await Like.findOne({tweet:tweetId, likedBy: user._id})
    if(likes){
        await Like.findByIdAndDelete(likes._id)
        return res
        .status(200)
        .json(new ApiResponse(200,"Tweet unliked successfully"))
    }
    const newLike = new Like({
        tweet:tweetId,
        likedBy:user
    })
    await newLike.save()
    return res
    .status(200)
    .json(new ApiResponse(200,"Tweet liked successfully"))
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    const likedVideos= await Like.find({likedBy:user._id}).populate("video")
    return res
    .status(200)
    .json(new ApiResponse(200,likedVideos,"Liked videos"))

    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}