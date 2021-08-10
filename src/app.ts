import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
// Errors
import { NotFoundError } from './errors'
// Middlewares
import { currentUser } from './middlewares/current-user'
import { errorHandler } from './middlewares/error-handler'
// Routes
import authRouter from './routes/v1/auth.route'
import adminRouter from './routes/v1/admin.route'
import customerRouter from './routes/v1/customer.route'
import roomRouter from './routes/v1/room.route'
import reservationRouter from './routes/v1/reservation.route'

const app = express()

app.set('trust proxy', true)

app.use(helmet())

app.use(cors())

app.use(compression())

app.use(express.json())

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)

app.use(authRouter)
app.use(adminRouter)
app.use(customerRouter)
app.use(roomRouter)
app.use(reservationRouter)

app.all('*', async (_req, _res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export default app
