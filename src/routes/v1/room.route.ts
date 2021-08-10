import express from 'express'
import { list } from '../../controllers/room.controller'

const router = express.Router()

router.route('/api/v1/rooms').get(list)

export default router
