import { Router } from "express";
import { loginUser, registerUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory } from "../controllers/user.controller.js";

import verifyJWT from "../middlewares/auth.middlewares.js"
import {upload} from "../middlewares/multer.middlewares.js"
const router=Router();


router.route("/register").post(
    upload.fields([
        
        {
            name:"avatar",
            maxCount:1

        },
        {
            name:"coverimage",
            maxCount:1
        }]),
    
    registerUser
)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("coverimage"),updateUserCoverImage)
router.route("/c/:username").get(getUserChannelProfile)
router.route("/watch-history").get(verifyJWT,getWatchHistory)


export default router;

