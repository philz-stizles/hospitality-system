import { Schema, model, Document } from 'mongoose'

export interface IReservationDocument extends Document {
  status: string
  hourly_rate: number
  expected_checkin_time: Date
  expected_checkout_time: Date
  customer_id: number
  room_type: string
}

const reservationSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'paid',
    },
    hourly_rate: {
      type: Number,
      required: true,
    },
    expected_checkin_time: {
      type: Date,
      required: true,
    },
    expected_checkout_time: {
      type: Date,
      required: true,
    },
    customer_id: { type: Number, required: [true, 'A customer is required'] },
    room_type: { type: String, required: [true, 'A room type is required'] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.reservation_id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

const Reservation = model<IReservationDocument>(
  'Reservation',
  reservationSchema
)

export default Reservation
