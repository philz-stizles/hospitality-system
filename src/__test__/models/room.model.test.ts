import Room from '../../models/room.model'

describe('Room Model', () => {
  it('should have room_type, hourly_rate, weekday_percent and weekend_percent attributes', () => {
    let expectedKeys = [
      'room_type',
      'hourly_rate',
      'weekday_percent',
      'weekend_percent',
    ]
    let keys = Object.keys(Room.schema.paths)
    let userAttributes = [keys[0], keys[1], keys[2], keys[3]]
    expect(userAttributes).toStrictEqual(expectedKeys)
  })
})
