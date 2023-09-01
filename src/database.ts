import mongoose from 'mongoose'
import { MongoDbUrl, MongoDbOptions } from './config'

mongoose.connection.on('error', (e) => {
  console.log('MongoDB connection error:', e)
})

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  return await mongoose.connect(MongoDbUrl, MongoDbOptions)
}

export const disconnectDatabase = async (): Promise<void> => {
  return await mongoose.connection.close()
}
