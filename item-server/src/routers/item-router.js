/**
 * @file API version 1 router.
 * @module routes/router
 * @author Dongzhu Tan
 */

import express from 'express'

import { authenticateJWT } from '../middlewares/auth.js'
import { ItemsController } from '../controller/items-controller.js'

export const router = express.Router()
const itemsController = new ItemsController()

// Middleware to load a task document if :id is present.
router.param('id', (req, res, next, id) => itemsController.loadItemsDocument(req, res, next, id))

// Map HTTP verbs and route paths to controller action methods.
router.get('/', authenticateJWT, (req, res, next) => itemsController.showAllItemsFromUser(req, res, next))

router.post('/', authenticateJWT, (req, res, next) => itemsController.createItem(req, res, next))

router.get('/:imageId', authenticateJWT, (req, res, next) => itemsController.showItemWithId(req, res, next))

router.put('/:imageId', authenticateJWT, (req, res, next) => itemsController.updateTheWholeItem(req, res, next))

router.patch('/:imageId', authenticateJWT, (req, res, next) => itemsController.partialUpdateOneItem(req, res, next))

router.delete('/:imageId', authenticateJWT, (req, res, next) => itemsController.deleteOneItem(req, res, next))
