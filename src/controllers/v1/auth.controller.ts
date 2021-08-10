import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BadRequestError } from '../../errors'
import { Password } from '../../utils/password'
import User from '../../models/user.model'

export const signup = async (req: Request, res: Response) => {
  const { fullname, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new BadRequestError('Email in use')
  }

  const newUser = new User({ fullname, email, password, roles: ['customer'] })
  await newUser.save()

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: newUser.id,
      email: newUser.email,
    },
    process.env.JWT_AUTH_SECRET!
  )

  // Store it on session object
  req.session = {
    jwt: userJwt,
  }

  res.status(201).send(newUser)
}

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials')
  }

  const passwordsMatch = await Password.compare(existingUser.password, password)
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials')
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
    },
    process.env.JWT_AUTH_SECRET!
  )

  // Store it on session object
  req.session = {
    jwt: userJwt,
  }

  res.status(200).send(existingUser)
}
