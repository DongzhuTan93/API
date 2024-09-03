/**
 * @file Defines the category router.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { CategoryController } from '../controllers/category-controller.js'

export const router = express.Router()
const categoryController = new CategoryController()

router.get('/categories', (req, res, next) => categoryController.listCategories(req, res, next))
router.get('/categories/:categoryName/items', (req, res, next) => categoryController.listCategoryItems(req, res, next))
router.get('/categories/:id', (req, res, next) => categoryController.retrieveCategory(req, res, next))
router.post('/categories', (req, res, next) => categoryController.addCategory(req, res, next))
