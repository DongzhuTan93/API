/**
 * @file Defines the home router.
 * @module routers/homeRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { authenticateJWT } from '../middlewares/auth.js'
import { ItemsCategoryController } from '../controller/items-category-controller.js'

export const router = express.Router()
const itemsCategoryController = new ItemsCategoryController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', authenticateJWT, (req, res, next) => itemsCategoryController.getAllCategories(req, res, next))

router.post('/', authenticateJWT, (req, res, next) => itemsCategoryController.createCategory(req, res, next))

router.get('/:id', authenticateJWT, (req, res, next) => itemsCategoryController.getCategoryById(req, res, next))
