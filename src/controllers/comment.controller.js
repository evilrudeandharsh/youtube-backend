import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pageNo=parseInt(page)
    const limitNo=parseInt(limit)

    const comments=await Comment.find({video:videoId})
    .populate("Owner")
    .limit(limitNo)
    
    const totalComments = await Comment.countDocuments({video:videoId});
    const totalPages = Math.ceil(totalComments / limitNo);

    return res
    .status(200)
    .json(new ApiResponse({
        success: true,
        message: "Comments retrived successfully",
        data: comments,
        pagination: {
            page: pageNo,
            limit: limitNo,
            totalPages,
            totalComments,
        },
    }))


})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content} = req.body
    const comment = new Comment({
        content,
        video: videoId,
        owner: req.user._id
    })
    await comment.save()

    if(!comment){
        throw new ApiError(404, "Video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"Comment added successfully"))
    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {content} = req.body
    const comment=await findByIdandUpdate(comment
        ,{
            content
        },
        {
            new:true
        })
    if(!comment){
        throw new ApiError(404, "Comment not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200,comment,"Comment updated successfully"))
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const comment=await findByIdandDelete(commentId)
    return res

    .status(200)
    .json(new ApiResponse(200,comment,"Comment deleted successfully"))


    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }