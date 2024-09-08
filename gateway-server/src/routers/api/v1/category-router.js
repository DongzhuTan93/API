/**
 * @file Defines the category router for the gateway server.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.3.0
 */

import express from 'express'
import { ManageCategoriesController } from '../../../controllers/manage-categories-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const manageCategoriesController = new ManageCategoriesController()

// Public routes.
router.get('/', (req, res, next) => manageCategoriesController.fetchAllCategories(req, res, next))
router.get('/:categoryName', (req, res, next) => manageCategoriesController.fetchCategoryWithItems(req, res, next))
router.get('/id/:id', (req, res, next) => manageCategoriesController.getCategoryById(req, res, next))

// Protected routes.
router.post('/create', authenticateJWT, authenticateAdmin, (req, res, next) => manageCategoriesController.createNewCategory(req, res, next))
router.delete('/:categoryName', authenticateJWT, authenticateAdmin, (req, res, next) => manageCategoriesController.deleteCategory(req, res, next))
