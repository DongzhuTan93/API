/**
 * @file Defines the item router for the gateway server.
 * @module routers/item-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'
import { GatewayItemsController } from '../../../controllers/gateway-items-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const gatewayItemsController = new GatewayItemsController()

// Middleware to load an item document if :id is present.
router.param('id', (req, res, next, id) => gatewayItemsController.loadItemsDocument(req, res, next, id))

// Public routes.
router.get('/', (req, res, next) => gatewayItemsController.fetchAllItems(req, res, next))
router.get('/:itemId', (req, res, next) => gatewayItemsController.fetchItemById(req, res, next))

// Protected routes.
router.get('/user/items', authenticateJWT, (req, res, next) => gatewayItemsController.fetchUserItems(req, res, next))
router.post('/create', authenticateJWT, (req, res, next) => gatewayItemsController.createNewItem(req, res, next))
router.put('/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.updateEntireItem(req, res, next))
router.patch('/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.updateItemPartially(req, res, next))
router.delete('/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.removeItem(req, res, next))
router.get('/admin/users-with-items', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayItemsController.fetchAllUsersWithItems(req, res, next))
