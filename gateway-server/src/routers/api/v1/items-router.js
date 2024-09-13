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
/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Retrieve all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter items by category
 *     responses:
 *       200:
 *         description: A list of items with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       price:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       seller:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                       _links:
 *                         type: object
 *                         properties:
 *                           self:
 *                             type: object
 *                             properties:
 *                               href:
 *                                 type: string
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 _links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                     createItem:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                         method:
 *                           type: string
 *             example:
 *               items:
 *                 - name: "The old man and the sea"
 *                   price: "50 kr"
 *                   description: "Used"
 *                   createdAt: "2024-09-13T07:01:35.921Z"
 *                   seller:
 *                     username: "Admn"
 *                     email: "admn@gmail.com"
 *                   _links:
 *                     self:
 *                       href: "http://localhost:8083/api/v1/items/66e3e34f6931818afb1c701e"
 *               currentPage: 1
 *               totalPages: 1
 *               totalItems: 6
 *               message: "Items fetching successful!"
 *               _links:
 *                 self:
 *                   href: "http://localhost:8083/api/v1/items"
 *                 createItem:
 *                   href: "http://localhost:8083/api/v1/items/create"
 *                   method: "POST"
 */
router.get('/', (req, res, next) => manageItemsController.fetchAllItems(req, res, next))

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     summary: Get a specific item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Details of the item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemName:
 *                   type: string
 *                 itemPrice:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *             example:
 *               itemName: "adidas shoes"
 *               itemPrice: "200 kr"
 *               description: "Eu 38"
 *               category: "clothes"
 *               createdAt: "2024-09-08T17:59:55.506Z"
 *               updatedAt: "2024-09-08T17:59:55.506Z"
 *       404:
 *         description: Item not found
 */
router.get('/:itemId', (req, res, next) => manageItemsController.fetchItemById(req, res, next))

// Protected routes.

/**
 * @swagger
 * /api/v1/items/user/items:
 *   get:
 *     summary: Get authenticated user's items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's items. Authorization must be submitted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemObjectId:
 *                         type: string
 *                         example: "66e3ede84ef1857bdc19059e"
 *                       itemName:
 *                         type: string
 *                         example: "Sofa"
 *                       itemPrice:
 *                         type: string
 *                         example: "500 kr"
 *                       description:
 *                         type: string
 *                         example: "The sofa has been used for one year!"
 *                       category:
 *                         type: string
 *                         example: "66e3ed364ef1857bdc190587"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-13T07:46:48.046Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-09-13T07:46:48.046Z"
 *                 message:
 *                   type: string
 *                   example: "User items fetching successful!"
 *       401:
 *         description: Unauthorized - Not authenticated
 *       500:
 *         description: Internal server error
 */
router.get('/user/items', authenticateJWT, (req, res, next) => manageItemsController.fetchUserItems(req, res, next))

/**
 * @swagger
 * /api/v1/items/create:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - itemPrice
 *               - description
 *               - category
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: Drum Set
 *               itemPrice:
 *                 type: string
 *                 example: 5000 kr
 *               description:
 *                 type: string
 *                 example: Barely used
 *               category:
 *                 type: string
 *                 example: musical instruments
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', authenticateJWT, (req, res, next) => manageItemsController.createNewItem(req, res, next))

/**
 * @swagger
 * /api/v1/items/{itemId}:
 *   put:
 *     summary: Update an entire item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - itemPrice
 *               - description
 *               - category
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: Sofa
 *               itemPrice:
 *                 type: string
 *                 example: 600 kr
 *               description:
 *                 type: string
 *                 example: The sofa has been used for 2 year!
 *               category:
 *                 type: string
 *                 example: furniture
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itemName:
 *                   type: string
 *                   example: Sofa
 *                 itemPrice:
 *                   type: string
 *                   example: 600 kr
 *                 description:
 *                   type: string
 *                   example: The sofa has been used for 2 year!
 *                 itemId:
 *                   type: string
 *                   example: 6bd5ab6ce76b37255fa458c8a
 *                 category:
 *                   type: string
 *                   example: 66d6d14d2ce8af03d372493a
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-02T18:21:53.583Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-13T08:47:48.397Z"
 *                 id:
 *                   type: string
 *                   example: "66d602412ce8af03d372494c"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.put('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.updateEntireItem(req, res, next))

/**
 * @swagger
 * /api/v1/items/{itemId}:
 *   patch:
 *     summary: Partially update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemPrice:
 *                 type: string
 *                 example: 110 kr
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.patch('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.updateItemPartially(req, res, next))

/**
 * @swagger
 * /api/v1/items/{itemId}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The itemObjectId
 *     responses:
 *       204:
 *         description: Item deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 */
router.delete('/:itemId', authenticateJWT, (req, res, next) => manageItemsController.removeItem(req, res, next))

/**
 * @swagger
 * /api/v1/items/admin/users-with-items:
 *   get:
 *     summary: Retrieve all users with their items (Admin only)
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all users with their items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       id:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             itemName:
 *                               type: string
 *                             itemPrice:
 *                               type: string
 *                             description:
 *                               type: string
 *                             itemId:
 *                               type: string
 *                             category:
 *                               type: string
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                             id:
 *                               type: string
 *                 message:
 *                   type: string
 *             example:
 *               users:
 *                 - username: "Tan"
 *                   email: "tan@student.lnu.se"
 *                   id: "66d5aa63e76b3725fa458c7e"
 *                   items: []
 *                 - username: "user2"
 *                   email: "user2@student.lnu.se"
 *                   id: "66d5ab6ce76b3725fa458c8a"
 *                   items:
 *                     - itemName: "Sofa (Update user2's whole item)"
 *                       itemPrice: "600 kr (patch with items objects id, user2)"
 *                       description: "The sofa has been used for 2 year! (Whole update)"
 *                       itemId: "66d5ab6ce76b3725fa458c8a"
 *                       category: "66d6014d2ce8af03d372493a"
 *                       createdAt: "2024-09-02T18:21:53.583Z"
 *                       updatedAt: "2024-09-13T08:47:48.397Z"
 *                       id: "66d602412ce8af03d372494c"
 *                 - username: "Ida"
 *                   email: "user1@student.lnu.se"
 *                   id: "66e33e48bb1efd3e4d3bc468"
 *                   items: []
 *                 - username: "Admn"
 *                   email: "admn@gmail.com"
 *                   id: "66e3e1bd9bd118eb5b7b9663"
 *                   items:
 *                     - itemName: "The old man and the sea"
 *                       itemPrice: "110 kr"
 *                       description: "Used"
 *                       itemId: "66e3e1bd9bd118eb5b7b9663"
 *                       category: "66d755a1f8efd196f66fe187"
 *                       createdAt: "2024-09-13T07:01:35.921Z"
 *                       updatedAt: "2024-09-13T08:43:26.841Z"
 *                       id: "66e3e34f6931818afb1c701e"
 *               message: "All users and their items retrieved successfully."
 *       401:
 *         description: Unauthorized - Not authenticated
 *       403:
 *         description: Forbidden - Not authorized as admin
 *       500:
 *         description: Internal server error
 */
router.get('/admin/users-with-items', authenticateJWT, authenticateAdmin, (req, res, next) => manageItemsController.fetchAllUsersWithItems(req, res, next))
