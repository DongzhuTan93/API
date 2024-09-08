/**
 * @file Defines the category router.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { ManageCategoriesController } from '../controllers/manage-categories-controller.js'

export const router = express.Router()
const manageCategoriesController = new ManageCategoriesController()

router.get('/', (req, res, next) => manageCategoriesController.getAllCategories(req, res, next))
router.get('/:categoryName', (req, res, next) => manageCategoriesController.getCategoryWithItems(req, res, next))
router.post('/create', (req, res, next) => manageCategoriesController.createCategory(req, res, next))
router.delete('/:categoryName', (req, res, next) => manageCategoriesController.deleteCategory(req, res, next))
