# Carbon Hospitality System

## Table of contents

1. [Introduction](#introduction)
2. [Assumptions](#assumptions)
3. [Observations & Modifications](#observations-&-modifications)
4. [End Points of Interest](#end-points-of-interest)
   [5. Corner Cases](#corner-cases)
   [6. How to Run the Application](#how-to-run-the-application)
   [7. How to Run Tests](#how-to-run-tests)
   [8. Overstay Fee Algorithm(Important)](#overstay-fee-algorithm)
   [9. TypeScript Installation(Optional)](#typescript-installation)
   [10. Jest Installation(Optional)](#jest-installation)
   [11. API Docs(Optional)](#api-docs)

## Introduction

The hospitality system was built to demonstrate a couple of endpoints created for the purpose of calculating
overstay fees for customers who have stayed beyond their designated checkout time.

## Assumptions

This implementation is based on the following assumptions:

- A customer can make multiple reservations and therefore should be billed based on the number of reservations.
- Each room has both a weekday and a weekend rate.
- Each room has one hourly rate.

## Observations & Modifications

- Customers:
  - In a real world scenario, it would be helpful to differentiate reservations for which a customer
    has cleared their "overstay fees" from those which have not been cleared.
  - Thus, an active field has been added to support the demonstration. When the active field is true, the
    customer has either not exceeded expected_checkout_time or has not paid for over stay. When the active
    field is false, the user has either checked out with no overstay fees to pay, or has checked out as well
    as cleared the overstay fees.

## End Points of Interest

- Calculate Overstay Fee by Reservation['/api/v1/admin/calcOverstayReservation']: An administrator can calculate
  the overstay fee using the reservation_id

- Calculate Overstay Fee by Customer['/api/v1/admin/calcOverstayCustomer']: An administrator can calculate
  the overstay fee using the customer_id. This means that any active reservation by that customer will be
  included in the calculation.

## Corner Cases

## How to Run the Application

- Ensure that you have internet connection.
- Clone the repository
- Ensure that you have Docker running on your system: [Download Docker](https://www.docker.com/products/docker-desktop)
- Navigate to the project root an run:

  ```bash
  docker-compose up
  ```

  When you run the above command, docker will spin up the application container as well as a mongodb container

- Application would be available at:

  ```lang-http
  http://localhost:3000
  ```

- Retrieve seeded reservations:
  Use the following endpoint to retrieve a list of seeded reservations:-

  ```lang-http
  GET http://localhost:3000/api/v1/reservations
  ```

  You can then select either a reservation_id or a customer_id to use in the "Calculate Overstay fee" step

- Retrieve seeded rooms(Optional):
  Use the following endpoint to retrieve a list of seeded rooms:-

  ```lang-http
  GET http://localhost:3000/api/v1/rooms

  ```

- Calculate Overstay fee:

  - Option 1: Using reservation_id

    - Use the following endpoint to retrieve a list of seeded rooms:-

      ```lang-http
      GET http://localhost:3000/api/v1/admin/calcOverstayByReservation?reservationId=insert-reservation_id-here
      ```

  - Option 2: Using customer_id

    - Use the following endpoint to retrieve a list of seeded rooms:-

      ```lang-http
      GET http://localhost:3000/api/v1/admin/calcOverstayByCustomer?customerId=insert-customer_id-here
      ```

## How to Run Tests

- Run tests:

  ```bash
  npm run test
  ```

- Run tests with coverage:

  ```bash
  npm run test:coverage
  ```

## Overstay Fee Algorithm

```lang-js
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

      // for each hour
      for (let hr = extraHours; hr > 0; hr--) {
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
          extra_hours: extraHours,
          overdue_fee: overdueFee,
        },
        message: 'Success',
      })
    }
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
  npm install -D typescript ts-node-dev
  ```

- Configure package.json:

  ```json
  "scripts": {
    "start": "ts-node-dev src/index.ts",
    ...
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

  ```js
  module.exports = {
    ...,
    setupFilesAfterEnv: ['./src/test/setup.ts'],
  }
  ```

- Configure 'package.json':

  ```json
  "scripts": {
    ...,
    "test": "jest",
    "test:watch": "jest --watchAll --no-cache",
    "test:coverage": "jest --coverage"
    },
    ...
  },
  ```

## API Docs
