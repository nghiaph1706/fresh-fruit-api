import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const createToken = async (user) => {
  return jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRED
  })
}

const getPermissionNames = async (user) => {
  return 'TEST'
}

export { createToken, getPermissionNames }
