import Reservation from './reservation.model'
import Room from './room.model'
import User from './user.model'

const users = [
  {
    fullname: 'Admin User',
    email: 'admin@carbon.io',
    password: 'p@ssw0rd',
    roles: ['admin'],
  },
]

export const seedUsers = async () => {
  try {
    const count = await User.countDocuments()
    if (count <= 0) {
      for (const user of users) {
        const newUser = new User(user)
        await newUser.save()
      }

      console.log('Users seeded successfully!!')
    } else {
      console.log('Users in database!!')
    }
  } catch (error) {
    console.log('Users seeding failed', error.message)
  }
}

export const seedRooms = async () => {
  try {
    const rooms = [
      {
        room_type: 'regular',
        hourly_rate: 150000,
        weekday_percent: 7,
        weekend_percent: 10,
      },
      {
        room_type: 'deluxe',
        hourly_rate: 230000,
        weekday_percent: 8.5,
        weekend_percent: 12,
      },
      {
        room_type: 'palatial',
        hourly_rate: 560000,
        weekday_percent: 11,
        weekend_percent: 16,
      },
    ]
    const count = await Room.countDocuments()
    if (count <= 0) {
      for (const room of rooms) {
        const newRoom = new Room(room)
        await newRoom.save()
      }

      console.log('Rooms seeded successfully!!')
    } else {
      console.log('Rooms in database!!')
    }
  } catch (error) {
    console.log('Rooms seeding failed', error.message)
  }
}

export const seedReservations = async () => {
  try {
    const reservations = [
      {
        room_type: 'deluxe',
        customer_id: '12323',
        hourly_rate: 230000,
        expected_checkin_time: '2020-12-12 12:00',
        expected_checkout_time: '2021-01-01 11:00',
      },
      {
        room_type: 'regular',
        customer_id: '12324',
        hourly_rate: 150000,
        expected_checkin_time: '2020-12-12 12:00',
        expected_checkout_time: '2021-01-01 11:00',
      },
      {
        room_type: 'palatial',
        customer_id: '12100',
        hourly_rate: 560000,
        expected_checkin_time: '2020-12-12 12:00',
        expected_checkout_time: '2021-01-01 11:00',
      },
      {
        room_type: 'regular',
        customer_id: '12323',
        hourly_rate: 200000,
        expected_checkin_time: '2020-12-25 12:00',
        expected_checkout_time: '2021-01-04 11:00',
      },
    ]
    const count = await Reservation.countDocuments()
    if (count <= 0) {
      for (const reservation of reservations) {
        const newReservation = new Reservation(reservation)
        await newReservation.save()
      }

      console.log('Reservations seeded successfully!!')
    } else {
      console.log('Reservations in database!!')
    }
  } catch (error) {
    console.log('Reservations seeding failed', error.message)
  }
}
