import { Schema, Types, model, Document } from 'mongoose'

interface IUserRating {
  star: number
  postedBy: Types.ObjectId
}

export interface IReservationDocument extends Document {
  status: string
  expected_checkin_time: Date
  expected_checkout_time: Date
  customer_id: string
  room_type: string
}

const reservationSchema = new Schema(
  {
    status: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    expected_checkin_time: {
      type: Date,
    },
    expected_checkout_time: {
      type: Date,
    },
    customer_id: { type: Types.ObjectId, ref: 'User' },
    room_type: { type: Types.ObjectId, ref: 'Room' },
  },
  { timestamps: true }
)

const Reservation = model<IReservationDocument>(
  'Reservation',
  reservationSchema
)

export default Reservation
