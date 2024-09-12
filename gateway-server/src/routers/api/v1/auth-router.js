/**
 * @file Defines the auth router.
 * @module routers/auth-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { ManageAccountsController } from '../../../controllers/manage-accounts-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const manageAccountsController = new ManageAccountsController()

// Public routes.
router.post('/register', (req, res, next) => manageAccountsController.registerUser(req, res, next))
router.post('/register-admin', (req, res, next) => manageAccountsController.registerAdmin(req, res, next))
router.post('/login', (req, res, next) => manageAccountsController.authenticateUser(req, res, next))
router.get('/users/:userId', (req, res, next) => manageAccountsController.getUserInfo(req, res, next))

// Protected routes.
router.get('/admin/users', authenticateJWT, authenticateAdmin, (req, res, next) => manageAccountsController.fetchAllUsers(req, res, next))
router.delete('/admin/users/:userId', authenticateJWT, authenticateAdmin, (req, res, next) => manageAccountsController.deleteUser(req, res, next))
