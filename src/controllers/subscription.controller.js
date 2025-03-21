import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const user = await User.findById(req.user._id)
    const subscription= await Subscription.findOne({channelId,user})
    if(subscription){
        await
        Subscription.findByIdAndDelete(subscription._id)
        return new ApiResponse(res).success("Unsubscribed")
    // TODO: toggle subscription
    }
    const newSubscription = new Subscription({
        channelId,
        user
    })
    await newSubscription.save()
    return new ApiResponse(res).success("Subscribed")
}
)

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const subscribers= await Subscription.aggregate([
        

    ])

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}