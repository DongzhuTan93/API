/**
 * @file Defines the account router.
 * @module routers/accountRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { AccountController } from '../controllers/account-controller.js'
import { authenticateJWT, authenticateAdmin } from '../middlewares/auth.js'

export const router = express.Router()
const accountController = new AccountController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the account page, where you can register an account!"}' }))

// Register user
router.post('/register', (req, res, next) => accountController.register(req, res, next))

// Register admin
router.post('/register-admin', (req, res, next) => accountController.registerAdmin(req, res, next))

// Log in
router.post('/login', (req, res, next) => accountController.login(req, res, next))

// Log out
router.post('/logout', (req, res, next) => accountController.logout(req, res, next))

// New admin route to get all users
router.get('/admin/users', authenticateJWT, authenticateAdmin, (req, res, next) => accountController.getAllUsers(req, res, next))
