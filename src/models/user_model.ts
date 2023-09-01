import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true
    },
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
    photo: {
      data: Buffer,
      contentType: String
    },
    resetPasswordLink: {
      data: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

/* validation in schema doesn't work since we're using pre "save" hook. invalidate() doesn't run in save hook so we need
to use a "validate" hook for password validation instead */
userSchema.pre('validate', async function(next) {
  if (this.password && this.password.length < 6) {
    this.invalidate('password', 'Error, expected `password` to be at least 6 characters.')
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

export default mongoose.model('User', userSchema)
