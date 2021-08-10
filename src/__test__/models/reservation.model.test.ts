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
})
