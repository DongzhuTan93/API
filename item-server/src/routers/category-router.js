/**
 * @file Defines the home router.
 * @module routers/homeRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { authenticateJWT } from '../middlewares/auth.js'
import { CategoryController } from '../controllers/category-controller.js'
import { ItemsController } from '../controllers/items-controller.js'

export const router = express.Router()
const categoryController = new CategoryController()
const itemsController = new ItemsController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', authenticateJWT, (req, res, next) => categoryController.getAllCategories(req, res, next))

router.post('/', authenticateJWT, (req, res, next) => categoryController.createCategory(req, res, next))

router.get('/:id', authenticateJWT, (req, res, next) => categoryController.getCategoryById(req, res, next))

// New route to get items by category
router.get('/:id/items', authenticateJWT, (req, res, next) => itemsController.getItemsByCategory(req, res, next))
