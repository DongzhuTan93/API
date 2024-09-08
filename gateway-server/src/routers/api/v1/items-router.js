/**
 * @file Defines the item router for the gateway server.
 * @module routers/item-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { ManageItemsController } from '../../../controllers/manage-items-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const manageItemsController = new ManageItemsController()

// Middleware to load an item document if :id is present.
router.param('id', (req, res, next, id) => manageItemsController.loadItemsDocument(req, res, next, id))

// Public routes.
router.get('/', (req, res, next) => manageItemsController.fetchAllItems(req, res, next))
router.get('/:itemId', (req, res, next) => manageItemsController.fetchItemById(req, res, next))

// Protected routes.
router.get('/user/items', authenticateJWT, (req, res, next) => manageItemsController.fetchUserItems(req, res, next))
router.post('/create', authenticateJWT, (req, res, next) => manageItemsController.createNewItem(req, res, next))
router.put('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.updateEntireItem(req, res, next))
router.patch('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.updateItemPartially(req, res, next))
router.delete('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.removeItem(req, res, next))
router.get('/admin/users-with-items', authenticateJWT, authenticateAdmin, (req, res, next) => manageItemsController.fetchAllUsersWithItems(req, res, next))
