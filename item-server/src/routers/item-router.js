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

router.get('/show', (req, res, next) => itemsController.getAllItems(req, res, next))
router.get('/:itemId', (req, res, next) => itemsController.showItemWithId(req, res, next))
router.get('/user/:userId/items', (req, res, next) => itemsController.showAllItemsFromUser(req, res, next))
router.post('/create', (req, res, next) => itemsController.createItem(req, res, next))
router.put('/:itemId', (req, res, next) => itemsController.updateTheWholeItem(req, res, next))
router.patch('/:itemId', (req, res, next) => itemsController.partialUpdateOneItem(req, res, next))
router.delete('/:itemId', (req, res, next) => itemsController.deleteOneItem(req, res, next))
router.get('/admin/users-with-items', (req, res, next) => itemsController.getAllUsersWithItems(req, res, next))
