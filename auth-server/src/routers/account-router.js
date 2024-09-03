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
router.post('/users', (req, res, next) => accountController.addUser(req, res, next))
router.post('/admins', (req, res, next) => accountController.addAdmin(req, res, next))
router.post('/tokens', (req, res, next) => accountController.createToken(req, res, next))
router.get('/users/:userId', (req, res, next) => accountController.retrieveUser(req, res, next))

// Protected routes
router.delete('/tokens', (req, res, next) => accountController.removeToken(req, res, next))
router.get('/users', (req, res, next) => accountController.listUsers(req, res, next))
