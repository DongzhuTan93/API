/**
 * @file Defines the item router.
 * @module routers/item-router
 * @author Dongzhu Tan
 */

import express from 'express'

import { authenticateJWT } from '../middlewares/auth.js'
import { ItemsController } from '../controllers/items-controller.js'

export const router = express.Router()
const itemsController = new ItemsController()

// Middleware to load a task document if :id is present.
router.param('id', (req, res, next, id) => itemsController.loadItemsDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', authenticateJWT, (req, res, next) => itemsController.getAllItems(req, res, next))

router.get('/my-items', authenticateJWT, (req, res, next) => itemsController.showAllItemsFromUser(req, res, next))

router.post('/create', authenticateJWT, (req, res, next) => itemsController.createItem(req, res, next))

router.get('/:itemId', authenticateJWT, (req, res, next) => itemsController.showItemWithId(req, res, next))

router.put('/:itemId', authenticateJWT, (req, res, next) => itemsController.updateTheWholeItem(req, res, next))

router.patch('/:itemId', authenticateJWT, (req, res, next) => itemsController.partialUpdateOneItem(req, res, next))

router.delete('/:itemId', authenticateJWT, (req, res, next) => itemsController.deleteOneItem(req, res, next))

router.get('/by-category/:categoryId', (req, res, next) => itemsController.getItemsByCategory(req, res, next))
