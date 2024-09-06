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
router.get('/', (req, res, next) => gatewayCategoryController.fetchAllCategories(req, res, next))
router.get('/:categoryName', (req, res, next) => gatewayCategoryController.fetchCategoryWithItems(req, res, next))
router.get('/id/:id', (req, res, next) => gatewayCategoryController.getCategoryById(req, res, next))

// Protected routes.
router.post('/create', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayCategoryController.createNewCategory(req, res, next))
router.delete('/:categoryName', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayCategoryController.deleteCategory(req, res, next))
