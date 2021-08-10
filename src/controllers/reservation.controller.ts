import { Request, Response } from 'express'
import Reservation from '../models/reservation.model'

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expected_checkin_time, expected_checkout_time } = req.body
    const createdReservation = await new Reservation({
      expected_checkin_time,
      expected_checkout_time,
    }).save()

    res.status(201).json({
      status: true,
      data: createdReservation,
      message: 'Created successfully',
    })
  } catch (err) {
    console.log(err)
  }
}

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reservations = await Reservation.find({})

    res.json({
      status: true,
      data: reservations,
      message: 'Retrieved successfully',
    })
  } catch (err) {
    console.log(err)
  }
}
