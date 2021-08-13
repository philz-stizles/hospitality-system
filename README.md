# Carbon Hospitality System

## Table of contents

1. [Introduction](#introduction)
2. [Assumptions](#assumptions)
3. [End Points of Interest](#end-points-of-interest)
4. [Corner Cases](#corner-cases)
5. [How to Run the Application](#how-to-run-the-application)
6. [How to Run Tests](#how-to-run-tests)
7. [Overstay Fee Algorithm using Customer Id(Important)](#overstay-fee-algorithm-using-customer-id)
8. [Overstay Fee Algorithm using Reservation Id(Important)](#overstay-fee-algorithm-using-reservation-id)
9. [TypeScript Installation(Optional)](#typescript-installation)
10. [Jest Installation(Optional)](#jest-installation)

## Introduction

The hospitality system was built to demonstrate a couple of endpoints created for the purpose of calculating
overstay fees for customers who have stayed beyond their designated checkout time.

This application was implemented using Node JS and mongoose. However i could have used either .Net Core any other RDBMS

## Assumptions

This implementation is based on the following assumptions:

- A customer can make multiple reservations and therefore should be billed based on the number of reservations.
- Each room has both a weekday and a weekend rate.
- Each room has one hourly rate.

## End Points of Interest

- Calculate Overstay Fee by Reservation['/api/v1/admin/calcOverstayReservation']: An administrator can calculate
  the overstay fee using the reservation_id

- Calculate Overstay Fee by Customer['/api/v1/admin/calcOverstayCustomer']: An administrator can calculate
  the overstay fee using the customer_id. This means that any active reservation by that customer will be
  included in the calculation.

## Corner Cases

It is possible for a customer to make a reservation on a weekday and overstay into a weekend day.
Thus, such a case must be factored into any algorithm implemented to calculate overstay

## How to Run the Application

- **Ensure that you have internet connection.**
- **Clone the repository**:

  ```bash
  git clone https://github.com/philz-stizles/hospitality-system.git
  ```

- **Ensure that you have Docker running on your system**: [Download Docker](https://www.docker.com/products/docker-desktop)
- **Ensure that port 3000 is not in use**.
- **Navigate to the project root an run**:

  ```bash
  docker-compose up --build
  ```

  When you run the above command, docker will spin up the application container as well as a mongodb container.
  You need to wait until all containers are up and running. If you are running it for the first time, it will take a while.

  Application would be available at:

  ```lang-http
  http://localhost:3000
  ```

- **Retrieve seeded reservations**: Use the following endpoint to retrieve a list of seeded reservations:-

  ```lang-http
  GET http://localhost:3000/api/v1/reservations
  ```

  You can then select either a reservation_id or a customer_id to use in the "Calculate Overstay fee" step

- **Retrieve seeded rooms(Optional)**: Use the following endpoint to retrieve a list of seeded rooms:-

  ```lang-http
  GET http://localhost:3000/api/v1/rooms

  ```

  You might want to view information about existing room types

- **Calculate Overstay fee**:

  - Option 1: Using reservation_id, use the following endpoint to calculate overstay fee:-

    ```lang-http
    GET http://localhost:3000/api/v1/admin/calcOverstayByReservation?reservationId=insert-reservation_id-here
    ```

    For Example:

    ```lang-http
    GET http://localhost:3000/api/v1/admin/calcOverstayByReservation?reservationId=61128fd10f5442a360ebfd8d
    ```

  - Option 2: Using customer_id, use the following endpoint to calculate overstay fee:-

    ```lang-http
    GET http://localhost:3000/api/v1/admin/calcOverstayByCustomer?customerId=insert-customer_id-here
    ```

    For Example:

    ```lang-http
    GET http://localhost:3000/api/v1/admin/calcOverstayByCustomer?customerId=12323
    ```

## How to Run Tests

- **Open the project in a separate terminal.**
- **Install dependencies**:

  ```bash
  npm install
  ```

- **Run tests**:

  ```bash
  npm run test
  ```

- **Run tests with coverage**:

  ```bash
  npm run test:coverage
  ```

## Overstay Fee Algorithm using Customer Id

Note: The following algorithm can be easily simplified or modified. For example, many
of the verbs within the algorithm can be extracted into their on methods and reused
to conform with the laws of Segregation etc. This is for demonstration purposes, so as
to be able to visualize from top to bottom

```lang-js
  // Check if reservation exists
  const customerReservations = await Reservation.find(filter)

  let total_overdue_hours = 0
  let total_overdue_fee = 0
  const customerReservationDetails: any = []

  for (const reservation of customerReservations) {
    const { room_type, expected_checkout_time, _id } = reservation

    // Check if room exists
    const existingRoom = await Room.findOne({
      room_type,
    })
    if (!existingRoom) {
      continue
    }

    const { weekday_percent, weekend_percent } = existingRoom

    const now = new Date()
    const expectedCheckout = new Date(expected_checkout_time)
    let overdueHours = 0
    let overdueFee = 0

    if (now.getTime() <= expectedCheckout.getTime()) {
      customerReservationDetails.push({
        reservation_id: _id,
        overdueHours,
        overdueFee,
      })
      continue
    } else {
      overdueHours = Math.ceil(
        (now.getTime() - expectedCheckout.getTime()) / 3600000
      )

      let currentOverstayedDate = expectedCheckout

      const weekends = [0, 6]

      // for each hour
      for (let hr = overdueHours; hr > 0; hr--) {
        // initialize current hour fee
        let currentHourFee = 0

        // add hour to current overstayed date
        currentOverstayedDate = addHoursToDate(currentOverstayedDate, 1)

        // check the day of the week
        const dayOfWeek = currentOverstayedDate.getDay()

        // make calculations based on the day of the week
        if (weekends.includes(dayOfWeek)) {
          currentHourFee = reservation.hourly_rate * (weekend_percent / 100)
        } else {
          currentHourFee = reservation.hourly_rate * (weekday_percent / 100)
        }

        // add to grand total
        overdueFee += currentHourFee
      }

      total_overdue_hours += overdueHours
      total_overdue_fee += overdueFee

      customerReservationDetails.push({
        reservation_id: _id,
        overdueHours,
        overdueFee,
      })
    }
  }

  res.json({
    status: true,
    data: {
      customer_id: parsed_customer_id,
      total_overdue_hours,
      total_overdue_fee,
      summary: customerReservationDetails,
    },
    message: 'Customer over-stay fee retrieved successfully',
  })
```

## Overstay Fee Algorithm using Reservation Id

Note: The following algorithm can be easily simplified or modified. For example, many
of the verbs within the algorithm can be extracted into their on methods and reused
to conform with the laws of Segregation etc. This is for demonstration purposes, so as
to be able to visualize from top to bottom

```lang-js
   // Check if reservation exists
  const existingReservation = await Reservation.findById(reservationId)
  if (!existingReservation) {
    throw new NotFoundError()
  }

  const { customer_id, room_type, expected_checkout_time } = existingReservation

  // Check if room exists
  const existingRoom = await Room.findOne({
    room_type,
  })
  if (!existingRoom) {
    throw new NotFoundError()
  }

  // Extract week daily rates from room
  const { weekday_percent, weekend_percent } = existingRoom

  const now = new Date()
  const expectedCheckout = new Date(expected_checkout_time)

  // Initialize overdue fee
  let overdueFee = 0

  if (now.getTime() <= expectedCheckout.getTime()) {
    return res.json({
      status: true,
      data: {
        customer_id,
        overdue_fee: overdueFee,
        extra_hours: 0,
        expected_checkout_time,
        hours_left: (expectedCheckout.getTime() - now.getTime()) / 3600000,
      },
      message: 'Reservation is still active',
    })
  } else {
    // Calculate number of overdue hours since expected checkout
    const overdueHours = Math.ceil(
      (now.getTime() - expectedCheckout.getTime()) / 3600000
    )

    // Initialize current overstayed date to equal expected checkout date
    let currentOverstayedDate = expectedCheckout

    // Initialize weekends where 0 is Sunday and 6 is Saturday
    // 0 = Sun | 1 = Mon |  2 = Tues | 3 = Wed | 4 = Thur | 5 = Fri | 6 = Sat
    const weekends = [0, 6]

    // Calculate fee per hour overstayed
    for (let hr = overdueHours; hr > 0; hr--) {
      // initialize current hour fee
      let currentHourFee = 0

      // add hour to current overstayed date
      currentOverstayedDate = addHoursToDate(currentOverstayedDate, 1)

      // check the day of the week
      const dayOfWeek = currentOverstayedDate.getDay()

      // make calculations based on the day of the week
      if (weekends.includes(dayOfWeek)) {
        currentHourFee =
          existingReservation.hourly_rate * (weekend_percent / 100)
      } else {
        currentHourFee =
          existingReservation.hourly_rate * (weekday_percent / 100)
      }

      // add to grand total
      overdueFee += currentHourFee
    }

    return res.json({
      status: true,
      data: {
        customer_id,
        extra_hours: overdueHours,
        overdue_fee: overdueFee,
      },
      message: 'Reservation over-stay fee retrieved successfully',
    })
```

## Typescript Installation

- Install typescript globally to use the "tsc CLI":

  ```bash
  npm install -g typescript
  ```

- Generate default typescript config file(i.e. tsconfig.json) in project:

  ```bash
  npx tsc --init
  ```

- Install typescript dependencies:

  ```bash
  npm install -D typescript ts-node
  ```

- Configure package.json:

  ```json
  "scripts": {
    "dev": "ts-node src/index.ts",
    "start": "ts-node dist/index.js",
    "build": "tsc -p ."
  },
  ```

## Jest Installation

- Install dependencies:

  ```bash
  npm install -D jest ts-jest @types/jest supertest @types/supertest mongodb-memory-server
  ```

- Generate default jest configuration file (i.e. 'jest.config.js'):

  ```bash
  npx ts-jest config:init
  ```

- Add your configs to 'jest.config.js'

  ```json
  module.exports = {
    verbose: true,
    setupFilesAfterEnv: ['./src/test/setup.ts'],
  }
  ```

- Configure 'package.json':

  ```json
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watchAll --no-cache",
    "test:coverage": "jest --coverage"
    }
  },
  ```
