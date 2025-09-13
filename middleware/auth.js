import { clerkClient } from '@clerk/express'
import { response } from 'express';

export const protectAdmin = async (req,res,next) => {
    
    try {
        const { userId } = req.auth();
        const user = await clerkClient.user.getUser(userId)
        if (user.privateMetadata.role !== 'admin') {
            return response.json({success: false,message: "not allowed"})
        }

        next();

    } catch (error) {
        return res.json({success:false, message:"not allow"})
    }
}