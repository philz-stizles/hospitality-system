import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'
import dotenv from 'dotenv'
import { seedRooms, seedUsers, seedReservations } from './models/seeder'

dotenv.config()

const start = async () => {
  if (!process.env.JWT_AUTH_SECRET) {
    throw new Error('JWT_AUTH_SECRET must be defined')
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be defined')
  }

  try {
    // The domain must be the name of the auth mongo pod service in the kubernetes cluster
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))

    // Seed users data
    await seedUsers()

    // Seed users data
    await seedRooms()

    // Seed users data
    await seedReservations()
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(chalk.green(`Listening on port ${PORT}!`))
  })
}

start()
