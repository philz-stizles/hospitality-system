import { Schema, model, Document } from 'mongoose'

export interface IRoomDocument extends Document {
  room_type: string
  hourly_rate: number
  weekday_percent: number
  weekend_percent: number
}

const roomSchema = new Schema(
  {
    room_type: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hourly_rate: {
      type: Number,
      required: true,
    },
    weekday_percent: {
      type: Number,
      required: true,
      max: 20,
    },
    weekend_percent: {
      type: Number,
      required: true,
      max: 20,
    },
  },
  { timestamps: true }
)

const Room = model<IRoomDocument>('Room', roomSchema)

export default Room
