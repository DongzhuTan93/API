/**
 * @file Defines the category router for the gateway server.
 * @module routers/category-router
 * @author Dongzhu Tan
 * @version 3.3.0
 */

import express from 'express'
import { ManageCategoriesController } from '../../../controllers/manage-categories-controller.js'
import { authenticateJWT, authenticateAdmin } from '../../../middlewares/auth.js'

export const router = express.Router()
const manageCategoriesController = new ManageCategoriesController()

// Public routes.

/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Retrieve all categories with their items
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories with their items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryName:
 *                         type: string
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             itemName:
 *                               type: string
 *                             link:
 *                               type: string
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
 *             example:
 *               categories:
 *                 - categoryName: "clothes"
 *                   items:
 *                     - itemName: "belt"
 *                       link: "http://localhost:8085/items/66d601622ce8af03d372493d"
 *                     - itemName: "adidas shoes"
 *                       link: "http://localhost:8085/items/66dde61bfc938441db156ff1"
 *                 - categoryName: "furniture"
 *                   items:
 *                     - itemName: "Sofa"
 *                       link: "http://localhost:8085/items/66d602412ce8af03d372494c"
 *               message: "Categories with items fetched successfully"
 *               _links:
 *                 self:
 *                   href: "http://localhost:8083/api/v1/categories"
 */
router.get('/', (req, res, next) => manageCategoriesController.fetchAllCategories(req, res, next))

/**
 * @swagger
 * /api/v1/categories/{categoryName}:
 *   get:
 *     summary: Get a category with its items
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The category name
 *     responses:
 *       200:
 *         description: Category details with items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 itemCount:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       itemName:
 *                         type: string
 *                       itemPrice:
 *                         type: string
 *                       description:
 *                         type: string
 *                       itemId:
 *                         type: string
 *                       category:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       id:
 *                         type: string
 *             example:
 *               category:
 *                 id: "66e2997b4ef1857bdc19056f"
 *                 name: "musical instruments"
 *               itemCount: 1
 *               items:
 *                 - itemName: "Electronic keyboard"
 *                   itemPrice: "500 kr"
 *                   description: "Electronic keyboard has been used for one year"
 *                   itemId: "66e29929b6e29828a01e8eba"
 *                   category: "66e2997b4ef1857bdc19056f"
 *                   createdAt: "2024-09-12T07:35:31.108Z"
 *                   updatedAt: "2024-09-12T07:35:31.108Z"
 *                   id: "66e299c34ef1857bdc190572"
 *       404:
 *         description: Category not found
 */
router.get('/:categoryName', (req, res, next) => manageCategoriesController.fetchCategoryWithItems(req, res, next))

// Protected routes.

/**
 * @swagger
 * /api/v1/categories/create:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: makeup
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create', authenticateJWT, authenticateAdmin, (req, res, next) => manageCategoriesController.createNewCategory(req, res, next))

/**
 * @swagger
 * /api/v1/categories/{categoryName}:
 *   delete:
 *     summary: Delete a category and its items (Admin only)
 *     description: Deletes a category and all the items associated with it.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the category to be deleted
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       401:
 *         description: Unauthorized - User is not authenticated
 *       403:
 *         description: Forbidden - User is not authorized to perform this action (must be an admin)
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:categoryName', authenticateJWT, authenticateAdmin, (req, res, next) => manageCategoriesController.deleteCategory(req, res, next))
