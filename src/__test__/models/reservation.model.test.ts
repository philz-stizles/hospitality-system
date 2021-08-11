import Reservation from '../../models/reservation.model'

describe('Reservation Model', () => {
  it('should have status, expected_checkin_time, expected_checkout_time, customer_id and room_type attributes', () => {
    let expectedKeys = [
      'status',
      'expected_checkin_time',
      'expected_checkout_time',
      'customer_id',
      'room_type',
    ]
    let keys = Object.keys(Reservation.schema.paths)
    let userAttributes = [keys[0], keys[1], keys[2], keys[3], keys[4]]
    expect(userAttributes).toStrictEqual(expectedKeys)
  })

  it('should be able to create a new reservation', async () => {
    try {
      const newReservation = new Reservation({
        room_type: 'deluxe',
        customer_id: '12323',
        hourly_rate: 230000,
        expected_checkin_time: '2020-12-12 12:00',
        expected_checkout_time: '2021-01-01 11:00',
      })
      const createdUser = await newReservation.save()
      expect(createdUser.room_type).toEqual(newReservation.room_type)
      expect(createdUser.customer_id).toEqual(newReservation.customer_id)
      expect(createdUser.hourly_rate).toEqual(newReservation.hourly_rate)
      expect(createdUser.expected_checkin_time).toEqual(
        newReservation.expected_checkin_time
      )
      expect(createdUser.expected_checkout_time).toEqual(
        newReservation.expected_checkout_time
      )
    } catch (error) {
      throw new Error(error)
    }
  })

  it('should throw an error on save if the room_type field is empty', async () => {
    try {
      await new Reservation({
        room_type: '',
        customer_id: '12323',
        hourly_rate: 230000,
        expected_checkin_time: '2020-12-12 12:00',
        expected_checkout_time: '2021-01-01 11:00',
      }).save()
    } catch (error) {
      expect(error.errors.room_type.kind).toEqual('required')
    }
  })
})
