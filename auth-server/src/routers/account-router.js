/**
 * @file Defines the account router.
 * @module routers/accountRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { ManageAccountsController } from '../controllers/manage-accounts-controller.js'

export const router = express.Router()
const manageAccountsController = new ManageAccountsController()

// Public routes.
router.post('/register', (req, res, next) => manageAccountsController.register(req, res, next))
router.post('/register-admin', (req, res, next) => manageAccountsController.registerAdmin(req, res, next))
router.post('/login', (req, res, next) => manageAccountsController.login(req, res, next))
router.get('/users/:userId', (req, res, next) => manageAccountsController.getUserInfo(req, res, next))

// Protected routes.
router.get('/admin/users', (req, res, next) => manageAccountsController.getAllUsers(req, res, next))
router.delete('/admin/users/:userId', (req, res, next) => manageAccountsController.deleteUser(req, res, next))
