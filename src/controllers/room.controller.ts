import { Request, Response } from 'express'
import Room from '../models/room.model'

export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find({})

    res.json({
      status: true,
      data: rooms,
      message: 'Success',
    })
  } catch (err) {
    console.log(err)
  }
}
