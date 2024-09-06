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

router.get('/', (req, res, next) => categoryController.getAllCategories(req, res, next))
router.get('/:categoryName', (req, res, next) => categoryController.getCategoryWithItems(req, res, next))
router.post('/create', (req, res, next) => categoryController.createCategory(req, res, next))
router.delete('/:categoryName', (req, res, next) => categoryController.deleteCategory(req, res, next))
