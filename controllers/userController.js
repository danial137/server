import Booking from "../models/Booking";
import { clerkClient } from "@clerk/express";


// API controller Function to Get User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;
        const bookings = await Booking.find({ user }).populate({
            path: 'show',
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//API controller Function to add Favorite movie in Clerk User Metadata
export const getFavorite = async (req, res) => {
    try {

        const { movieId } = req.body
        const userId = req.auth().userId;
        const user = await clerkClient.users.getUser(userId)
        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        }

        await clerkClient.users.updateUserMetadata(userId,{privateMetadata:user.privateMetadata})

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
