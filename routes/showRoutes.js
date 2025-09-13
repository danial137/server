import express from 'express'
import { addshow, getNowplayingMovies } from '../controllers/showController.js'

const showRouter = express.Router()

showRouter.get('/now-playing', getNowplayingMovies)
showRouter.post('/add', addshow)

export default showRouter