/**
 * @file Defines the account router.
 * @module routers/accountRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { AccountController } from '../controllers/account-controller.js'

export const router = express.Router()
const accountController = new AccountController()

// Public routes.
router.post('/register', (req, res, next) => accountController.register(req, res, next))
router.post('/register-admin', (req, res, next) => accountController.registerAdmin(req, res, next))
router.post('/login', (req, res, next) => accountController.login(req, res, next))
router.post('/logout', (req, res, next) => accountController.logout(req, res, next))
router.get('/users/:userId', (req, res, next) => accountController.getUserInfo(req, res, next))

// Protected routes.
router.get('/admin/users', (req, res, next) => accountController.getAllUsers(req, res, next))
