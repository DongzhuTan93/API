/**
 * @file Defines the category router.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'
import { CategoryController } from '../../../controllers/category-controller.js'

export const router = express.Router()
const categoryController = new CategoryController()

// Public routes.
router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next))

router.get('/:categoryName', (req, res, next) => categoryController.getCategoryWithItems(req, res, next))

// Protected routes.
router.post('/create', authenticateJWT, authenticateAdmin, (req, res, next) => categoryController.createCategory(req, res, next))
