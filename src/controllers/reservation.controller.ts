import { Request, Response } from 'express'
import Reservation from '../models/reservation.model'
import Room from '../models/room.model'
import { NotFoundError } from './../errors/not-found-error'

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      customer_id,
      expected_checkin_time,
      expected_checkout_time,
      room_type,
    } = req.body

    // Check if room exists
    const existingRoom = await Room.findOne({
      room_type,
    })
    if (!existingRoom) {
      throw new NotFoundError()
    }

    const createdReservation = await new Reservation({
      customer_id,
      expected_checkin_time,
      expected_checkout_time,
      room_type,
      hourly_rate: existingRoom.hourly_rate,
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
