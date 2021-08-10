import express from 'express'
import {
  calcOverstayByReservation,
  calcOverstayByCustomer,
} from '../../controllers/v1/admin.controller'

const router = express.Router()

router.get('/api/v1/admin/calcOverstayByReservation', calcOverstayByReservation)
router.get('/api/v1/admin/calcOverstayByCustomer', calcOverstayByCustomer)

export default router
