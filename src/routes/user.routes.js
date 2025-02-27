import { Router } from "express";
import { loginUser, registerUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";

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
router.route("/refresh-token".post(refreshAccessToken))
export default router;

