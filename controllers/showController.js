import axios from 'axios'
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

// API to get now playing movies from TMDB API 
export const getNowplayingMovies = async (req, res) => {

    try {

        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
        })
        const movies = data.results;
        res.json({ success: true, movies: movies })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}

// API to add a new show to the database


export const addshow = async (req, res) => {
    try {
        const { movieId, showInput, showPrice } = req.body;

        if (!Array.isArray(showInput) || showInput.length === 0) {
            return res.status(400).json({ success: false, message: 'showInput is required and must be an array' });
        }

        let movie = await Movie.findById(movieId);

        if (!movie) {
            // Fetch movie details and credits
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }
                })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

            movie = await Movie.create({
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || '',
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            });
        }

        // ✅ تعریف showsToCreate قبل از حلقه
        const showsToCreate = [];

        showInput.forEach(show => {
            if (!show.time || !Array.isArray(show.time)) return;
            const showDate = show.date;
            show.time.forEach(time => {
                const dateTimeString = `${showDate}T${time}`;
                const showDateTime = new Date(dateTimeString);
                if (!isNaN(showDateTime)) {
                    showsToCreate.push({
                        movie: movieId,
                        showDateTime,
                        showPrice,
                        occupiedSeats: {}
                    });
                }
            });
        });

        if (showsToCreate.length > 0) {
            await Show.insertMany(showsToCreate);
        }

        res.status(200).json({ success: true, message: 'Show added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
