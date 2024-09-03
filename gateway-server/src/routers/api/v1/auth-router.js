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
router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the auth!"}' }))
router.post('/users', (req, res, next) => gatewayAccountController.addUser(req, res, next))
router.post('/admins', (req, res, next) => gatewayAccountController.addAdmin(req, res, next))
router.post('/tokens', (req, res, next) => gatewayAccountController.createToken(req, res, next))
router.get('/users/:userId', (req, res, next) => gatewayAccountController.getUserInfo(req, res, next))

// Protected routes.
router.delete('/tokens', authenticateJWT, (req, res, next) => gatewayAccountController.removeToken(req, res, next))
router.get('/users', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayAccountController.listUsers(req, res, next))
