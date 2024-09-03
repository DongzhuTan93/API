/**
 * @file Defines the item router.
 * @module routers/item-router
 * @author Dongzhu Tan
 */

import express from 'express'

import { ItemsController } from '../controllers/items-controller.js'

export const router = express.Router()
const itemsController = new ItemsController()

// Middleware to load a task document if :id is present.
router.param('id', (req, res, next, id) => itemsController.loadItemsDocument(req, res, next, id))

router.get('/items', (req, res, next) => itemsController.listItems(req, res, next))
router.get('/items/:itemId', (req, res, next) => itemsController.retrieveItem(req, res, next))
router.get('/users/:userId/items', (req, res, next) => itemsController.listUserItems(req, res, next))
router.post('/items', (req, res, next) => itemsController.addItem(req, res, next))
router.put('/items/:itemId', (req, res, next) => itemsController.replaceItem(req, res, next))
router.patch('/items/:itemId', (req, res, next) => itemsController.modifyItem(req, res, next))
router.delete('/items/:itemId', (req, res, next) => itemsController.deleteItem(req, res, next))
router.get('/users-with-items', (req, res, next) => itemsController.listUsersWithItems(req, res, next))
