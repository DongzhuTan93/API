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
router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the items!!"}' }))
router.get('/items', (req, res, next) => gatewayItemsController.listItems(req, res, next))
router.get('/items/:itemId', (req, res, next) => gatewayItemsController.retrieveItem(req, res, next))

// Protected routes.
router.get('/users/:userId/items', authenticateJWT, (req, res, next) => gatewayItemsController.listUserItems(req, res, next))
router.post('/items', authenticateJWT, (req, res, next) => gatewayItemsController.addItem(req, res, next))
router.put('/items/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.replaceItem(req, res, next))
router.patch('/items/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.modifyItem(req, res, next))
router.delete('/items/:itemId', authenticateJWT, (req, res, next) => gatewayItemsController.deleteItem(req, res, next))
router.get('/users-with-items', authenticateJWT, authenticateAdmin, (req, res, next) => gatewayItemsController.listUsersWithItems(req, res, next))
