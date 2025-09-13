import express from 'express'
import { addshow, getNowplayingMovies, getshow, getShows } from '../controllers/showController.js'
import { protectAdmin } from '../middleware/auth.js'

const showRouter = express.Router()

showRouter.get('/now-playing',protectAdmin, getNowplayingMovies)
showRouter.post('/add', protectAdmin, addshow)
showRouter.get('/all', getShows)
showRouter.get('/:movieId', getshow)

export default showRouter