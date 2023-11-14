// routes/index.js
import express from 'express'
import * as UserController from '../controllers/UserController.js'

const router = express.Router()

// Public routes
router.post('/token', UserController.token)

export default router
