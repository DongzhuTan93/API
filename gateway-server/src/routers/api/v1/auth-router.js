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
/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: Admn
 *               password:
 *                 type: string
 *                 example: 3456453899
 *               firstName:
 *                 type: string
 *                 example: Admn
 *               lastName:
 *                 type: string
 *                 example: Berglund
 *               email:
 *                 type: string
 *                 example: admn@gmail.com
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', (req, res, next) => manageAccountsController.registerUser(req, res, next))

/**
 * @swagger
 * /api/v1/auth/register-admin:
 *   post:
 *     summary: Register a new admin (Admin only)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - email
 *               - adminSecret
 *             properties:
 *               username:
 *                 type: string
 *                 example: Tan
 *               password:
 *                 type: string
 *                 example: 1234567890
 *               firstName:
 *                 type: string
 *                 example: Dong
 *               lastName:
 *                 type: string
 *                 example: Tan
 *               email:
 *                 type: string
 *                 example: tan@student.lnu.se
 *               adminSecret:
 *                 type: string
 *                 example: iw3zcmgeOiPXahN2YjEGB53gS
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register-admin', (req, res, next) => manageAccountsController.registerAdmin(req, res, next))

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Admn
 *               password:
 *                 type: string
 *                 example: 3456453899
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Authentication failed
 */
router.post('/login', (req, res, next) => manageAccountsController.authenticateUser(req, res, next))

/**
 * @swagger
 * /api/v1/auth/users/{userId}:
 *   get:
 *     summary: Get user information
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *       404:
 *         description: User not found
 */
router.get('/users/:userId', (req, res, next) => manageAccountsController.getUserInfo(req, res, next))

// Protected routes.
/**
 * @swagger
 * /api/v1/auth/admin/users:
 *   get:
 *     summary: Fetch all users (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admin/users', authenticateJWT, authenticateAdmin, (req, res, next) => manageAccountsController.fetchAllUsers(req, res, next))

/**
 * @swagger
 * /api/v1/auth/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */
router.delete('/admin/users/:userId', authenticateJWT, authenticateAdmin, (req, res, next) => manageAccountsController.deleteUser(req, res, next))
