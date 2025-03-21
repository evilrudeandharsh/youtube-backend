import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const user = await User.findById(req.user._id)
    const subscription= await Subscription.findOne({channel:channelId,subscriber: user._id})
    if(subscription){
        await
        Subscription.findByIdAndDelete(subscription._id)
        return res
        .status(200)
        .json(new ApiResponse(200,"Channel unsubscribed successfully"))

    // TODO: toggle subscription
    }


    const newSubscription = new Subscription({
        channel:channelId,
        subscriber:user
    })
    await newSubscription.save()
    return res
    .status(200)
    .json(new ApiResponse(200,"Channel subscribed successfully"))
}
)

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const subscribers = await Subscription.find({channel:channelId}).populate("subscriber")
    return res
    .status(200)
    .json(new ApiResponse(200,subscribers,"Channel subscribed successfully"))
   
        

    

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id")
    }
    const channels = await Subscription.find({ subscriber: subscriberId }).populate("channel");
    return res
    .status(200)
    .json(new ApiResponse(200,channels,"Channels subscribed"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}