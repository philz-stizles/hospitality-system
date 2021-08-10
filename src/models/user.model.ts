import { Schema, model, Document, Types, HookNextFunction } from 'mongoose'
import jwt from 'jsonwebtoken'
import { Password } from '../utils/password'

interface IUserToken {
  token: string
}

// Create an interface representing a document in MongoDB.
export interface IUserDocument extends Document {
  fullname: string
  email: string
  password?: string
  roles: string[]
  // eslint-disable-next-line no-unused-vars
  comparePassword: (candidatePassword: string) => Promise<boolean>
  createPasswordResetToken: () => string
  // eslint-disable-next-line no-unused-vars
  isPasswordChangedAfterTokenGen: (issuedAt: number) => boolean
  isActive: boolean
  tokens: IUserToken[]
}

// Put as much business logic in the models to keep the controllers as simple and lean as possible
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, 'A user must have a fullname'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, 'A valid email address is required'],
      index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: 6,
      select: false,
    }, // Using select: false
    // will omit the field that it is assigned to from any read executions e.g find, findOne  etc.
    // It will not omit from create, save
    roles: [
      {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

// Create schema methods
userSchema.pre('save', async function (next: HookNextFunction) {
  const user = this as IUserDocument
  // If password was not modified, do not encrypt
  if (!user.isModified('password')) return next()

  try {
    // Convert a plain password to a hashed password
    const hashed = await Password.toHash(this.get('password'))
    // reset user password with hashed password
    user.set('password', hashed)

    return next()
  } catch (error) {
    return next(error)
  }
})

userSchema.methods.comparePassword = async function (password: string) {
  // This is essentially the same as `return await bcrypt.compare();`,
  // but the rule checks only`await` in `return` statements
  const user = this as IUserDocument
  try {
    const isMatch = await Password.compare(user.password as string, password)
    return isMatch
  } catch (error) {
    console.log(error.message)
    return false
  }
}

userSchema.statics.findByAuthentication = async (
  email: string,
  password: string
) => {
  // You can use arrow functions here as we will not be requiring
  // the 'this' reference
  // eslint-disable-next-line no-use-before-define
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Invalid Credentials')
  }

  const isMatch = await user.comparePassword(password)
  // console.log(isMatch)
  if (!isMatch) {
    throw new Error('Invalid Credentials')
  }

  return user
}

userSchema.methods.generateAuthToken = async function () {
  const user = this as IUserDocument
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET as string,
    { expiresIn: +(process.env.JWT_SECRET_EXPIRES_IN as string) } // This has been defined in
    // env variables in seconds 1800 => 30mins
    // + is added to convert it from string to an integer as it will assume milliseconds
    // if string is detected
  )

  // Store current login in DB, this strategy enable a user to login from multiple devices and stay logged unless
  // the user logs out which will logout the current requesting device
  user.tokens = user.tokens.concat({ token })
  await user.save()

  // Return generated token
  return token
}

// Create a Model.
const User = model<IUserDocument>('User', userSchema)
export default User

//   {
//     timestamps: true,
//     toJSON: {
//       transform(doc, ret) {
//         ret.id = ret._id
//         delete ret._id
//         delete ret.password
//         delete ret.__v
//       },
//     },
//   }
// )
