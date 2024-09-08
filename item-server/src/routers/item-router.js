/**
 * @file Defines the item router.
 * @module routers/item-router
 * @author Dongzhu Tan
 */

import express from 'express'

import { ManageItemsController } from '../controllers/manage-items-controller.js'

export const router = express.Router()
const manageItemsController = new ManageItemsController()

// Middleware to load a task document if :id is present.
router.param('id', (req, res, next, id) => manageItemsController.loadItemsDocument(req, res, next, id))

router.get('/', (req, res, next) => manageItemsController.getAllItems(req, res, next))
router.get('/:itemId', (req, res, next) => manageItemsController.showItemWithId(req, res, next))
router.get('/user/:userId/items', (req, res, next) => manageItemsController.showAllItemsFromUser(req, res, next))
router.post('/create', (req, res, next) => manageItemsController.createItem(req, res, next))
router.put('/:itemId', (req, res, next) => manageItemsController.updateTheWholeItem(req, res, next))
router.patch('/:itemId', (req, res, next) => manageItemsController.partialUpdateOneItem(req, res, next))
router.delete('/:itemId', (req, res, next) => manageItemsController.deleteOneItem(req, res, next))

router.get('/admin/users-with-items', (req, res, next) => manageItemsController.getAllUsersWithItems(req, res, next))
