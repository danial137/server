import express from 'express'
import { getNowplayingMovies } from '../controllers/showController.js'

const showRouter = express.Router()

showRouter.get('/now-playing', getNowplayingMovies)

export default showRouter