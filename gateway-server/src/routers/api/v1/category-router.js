/**
 * @file Defines the category router for the gateway server.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.3.0
 */

import express from 'express'
import { GatewayCategoryController } from '../../../controllers/gateway-category-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const gatewayCategoryController = new GatewayCategoryController()

// Public routes.
router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the category!!"}' }))
router.get('/categories', (req, res, next) => gatewayCategoryController.listCategories(req, res, next))
router.get('/categories/:categoryName', (req, res, next) => gatewayCategoryController.listCategoryItems(req, res, next))
router.get('/categories/:id', (req, res, next) => gatewayCategoryController.retrieveCategory(req, res, next))

// Protected routes.
router.post('/categories', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayCategoryController.addCategory(req, res, next))
