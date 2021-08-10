import express from 'express'
import { calculateOverstay } from '../../controllers/admin.controller'

const router = express.Router()

router.route('/api/v1/admin').post(calculateOverstay)

export default router
