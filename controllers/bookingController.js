import { set } from "mongoose";
import Show from "../models/Show.js"
import Booking from "../models/Booking.js";


// Function to check availability of seleceted setas for movie



const checkSeatsAvailbility = async (showId, selectedSeats) => {

    try {
        const showDate = await Show.findById(showId)
        if (!showDate) return false;


        const occupiedSeats = showDate.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;


    } catch (error) {
        console.log(error.message);
        return false
    }


}


export const createBooking = async (req, res) => {

    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check if the seats is available for the selected show

        const isAvaileble = await checkSeatsAvailbility(showId, selectedSeats)
        if (!isAvaileble) {
            return res.json({ success: false, message: "selected seats are not availble" })
        }

        // get show details

        const showData = await Show.findById(showId).populate('movie')

        // create a new Booking

        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats

        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId
        })

        showData.unmarkModified('occupiedSeats');

        await showData.save()

        //stripe


        res.json({ success: true, message: 'boooked successfully' })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })

    }
}


export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({ success: true, occupiedSeats })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}
