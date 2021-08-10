import { Request, Response } from 'express'

export const calculateOverstay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {} = req.body

    res.json({
      status: true,
      message: 'Success',
    })
  } catch (err) {
    console.log(err)
  }
}
