import axios from 'axios'
import Movie from '../models/Movie.js';

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

        const { movieId, showInput, showPrice } = req.body

        let movie = await Movie.findById(movieId)

        if (!movie) {
            // Fetch movie details and credits from TMDB API
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


            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.casts,
                release_date: movieApiData.release_date,
                orginal_language: movieApiData.orginal_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime:movieApiData.runtime
            }

            //add movie to database 

        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
