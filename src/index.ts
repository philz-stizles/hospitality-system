import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'
import dotenv from 'dotenv'
import { seedRooms, seedUsers } from './models/seeder'

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
  } catch (error) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log(chalk.green('Listening on port 3000!'))
  })
}

start()
