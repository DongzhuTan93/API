/**
 * @file Defines the user router.
 * @module routes/userRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { AccountController } from '../../controller/AccountController.js'

export const router = express.Router()
const accountController = new AccountController()


// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the second-hand store！"}' }))

// Register
router.post('/register', (req, res, next) => accountController.register(req, res, next))

// Log in
router.post('/login', (req, res, next) => accountController.login(req, res, next))