import { Model, Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

export interface IUser {
  firstName: string
  lastName: string
  email: string
  password: string
  image: string
}

// Put all user instance methods in this interface:
export interface IUserMethods {
  authenticate(string): Promise<boolean>
}

// Create a new Model type that knows about IUserMethods...
export type UserModel = Model<IUser, Record<string, never>, IUserMethods>

const SALT_WORK_FACTOR = 10

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

/* validation in schema doesn't work since we're using pre "save" hook. invalidate() doesn't run in save hook so we need
to use a "validate" hook for password validation instead */
userSchema.pre('validate', async function (next) {
  if (this.password && this.password.length < 6) {
    this.invalidate(
      'password',
      'Error, expected `password` to be at least 6 characters.'
    )
  }
  if (this.isNew && !this.password) {
    this.invalidate('password', 'Path `password` is required.')
  }
  return next()
})

/* NOTE: Mongoose middleware is not invoked on update() operations, e.g., findOneAndUpdate(), so you must use a save()
if you want to update user passwords */
userSchema.pre('save', async function save(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    // override the cleartext password with the hashed one
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err)
  }
})

userSchema.methods = {
  async authenticate(plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password)
  }
}

// return Mongoose validation errors for uniqueness constraints instead of default MongoDB error codes
userSchema.plugin(uniqueValidator)

export default model('User', userSchema)
