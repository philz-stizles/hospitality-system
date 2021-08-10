import express from 'express'
import {
  calcOverstayByReservation,
  calcOverstayByCustomer,
} from '../../controllers/admin.controller'

const router = express.Router()

router.post(
  '/api/v1/admin/calcOverstayByReservation',
  calcOverstayByReservation
)
router.post('/api/v1/admin/calcOverstayByCustomer', calcOverstayByCustomer)

export default router
