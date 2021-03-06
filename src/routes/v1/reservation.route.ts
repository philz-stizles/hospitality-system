import express from 'express'
import { create, list } from '../../controllers/v1/reservation.controller'

const router = express.Router()

router.route('/api/v1/reservations').post(create).get(list)

export default router
