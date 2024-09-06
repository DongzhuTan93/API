/**
 * @file Defines the auth router.
 * @module routers/auth-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { GatewayAccountController } from '../../../controllers/gateway-account-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const gatewayAccountController = new GatewayAccountController()

// Public routes.
router.post('/register', (req, res, next) => gatewayAccountController.registerUser(req, res, next))
router.post('/register-admin', (req, res, next) => gatewayAccountController.registerAdmin(req, res, next))
router.post('/login', (req, res, next) => gatewayAccountController.authenticateUser(req, res, next))
router.get('/users/:userId', (req, res, next) => gatewayAccountController.getUserInfo(req, res, next))

// Protected routes.
router.get('/admin/users', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayAccountController.fetchAllUsers(req, res, next))
