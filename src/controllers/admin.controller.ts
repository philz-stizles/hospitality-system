import { Request, Response } from 'express'
import { NotFoundError } from '../errors'
import Reservation from '../models/reservation.model'
import Room from '../models/room.model'
import { addHoursToDate } from '../utils/date.utils'

export const calcOverstayByReservation = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  try {
    const { reservationId } = req.body

    console.log(reservationId)

    // Check if reservation exists
    const existingReservation = await Reservation.findById(reservationId)
    if (!existingReservation) {
      throw new NotFoundError()
    }

    const { customer_id, room_type, expected_checkout_time } =
      existingReservation

    // Check if room exists
    const existingRoom = await Room.findOne({
      room_type,
    })
    if (!existingRoom) {
      throw new NotFoundError()
    }

    const { weekday_percent, weekend_percent } = existingRoom

    const now = new Date()
    const expectedCheckout = new Date(expected_checkout_time)
    console.log('now', now)
    console.log('expectedCheckout', expectedCheckout)
    console.log(now.getTime())
    console.log(expectedCheckout.getTime())
    if (now.getTime() <= expectedCheckout.getTime()) {
      return res.json({
        status: true,
        data: {
          expected_checkout_time,
          hours_left: (expectedCheckout.getTime() - now.getTime()) / 3600000,
        },
        message: 'Reservation is still active',
      })
    } else {
      let overdueFee = 0
      const extraHours = Math.ceil(
        (now.getTime() - expectedCheckout.getTime()) / 3600000
      )

      let currentOverstayedDate = expectedCheckout

      const weekends = [0, 6]

      console.log('weekends', weekends)

      console.log('hourly_rate', existingReservation.hourly_rate)

      // for each hour
      for (let hr = extraHours; hr > 0; hr--) {
        // initialize current hour fee
        let currentHourFee = 0

        // add hour to current overstayed date
        currentOverstayedDate = addHoursToDate(currentOverstayedDate, 1)

        console.log('currentOverstayedDate', currentOverstayedDate)

        // check the day of the week
        const dayOfWeek = currentOverstayedDate.getDay()
        console.log('dayOfWeek', dayOfWeek)

        // make calculations based on the day of the week
        if (weekends.includes(dayOfWeek)) {
          currentHourFee =
            existingReservation.hourly_rate * (weekend_percent / 100)
          console.log('weekend_percent', weekend_percent)
          console.log('weekend currentHourFee', currentHourFee)
        } else {
          currentHourFee =
            existingReservation.hourly_rate * (weekday_percent / 100)
          console.log('weekday_percent', weekday_percent)
          console.log('weekday currentHourFee', currentHourFee)
        }

        // add to grand total
        overdueFee += currentHourFee
      }

      return res.json({
        status: true,
        data: {
          customer_id,
          extra_hours: extraHours,
          overdue_fee: overdueFee,
        },
        message: 'Success',
      })
    }
  } catch (err) {
    console.log(err)
  }
}

export const calcOverstayByCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { reservationId } = req.body

    const existingReservation = await Reservation.findById(reservationId)
    if (!existingReservation) {
      throw new NotFoundError()
    }

    const { room_type } = existingReservation

    const existingRoom = await Reservation.findOne({
      room_type,
    })
    if (!existingRoom) {
      throw new NotFoundError()
    }

    res.json({
      status: true,
      message: 'Success',
    })
  } catch (err) {
    console.log(err)
  }
}
