// controllers/UserController.js
import { models } from '../models/index.js'
import bcrypt from 'bcrypt'
import * as UserRepository from '../repositories/UserRepository.js'

const { User } = models

const token = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
        is_active: true
      }
    })
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.json({ token: null, permissions: [] })
    }
    const token = UserRepository.createToken(user)
    const permissions = UserRepository.getPermissionNames(user)

    return res.json({ token, permissions })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export { token }
