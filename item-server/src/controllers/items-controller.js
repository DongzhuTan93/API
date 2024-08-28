/**
 * Module for the ItemsController.
 *
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import { ItemsModel } from '../models/itemsModel.js'
import { CategoryModel } from '../models/itemsCategoryModel.js'

import mongoose from 'mongoose'

/**
 * Encapsulates a controller.
 */
export class ItemsController {
  /**
   * Provide req.doc to the route if :id is present, checking if a item exists before performing operations like update or delete.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the item to load.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async loadItemsDocument (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error('Invalid Identifier')
      error.status = 404
      return next(error)
    }

    try {
      const itemDoc = await ItemsModel.findById(id)

      // If the item document is not found, throw an error.
      if (!itemDoc) {
        const error = new Error('The item document you requested does not exist.')
        error.status = 404
        return next(error)
      }

      // Provide the item document to req.
      req.doc = itemDoc

      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of items.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async showAllItemsFromUser (req, res, next) {
    console.log('Hello from /items !')
    try {
      // Assuming each item document has a 'itemId' field that matches 'req.user.id'.
      const userItems = await ItemsModel.find({ itemId: req.user.userID })

      if (userItems.length === 0) {
        const error = new Error('No items found for this user.')
        error.status = 404
        return next(error)
      }

      const viewItemData = {
        items: userItems.map(item => item.toObject()),
        message: 'Items fetching successful!'
      }

      res.status(200).json(viewItemData)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a item and save it to item server.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async createItem (req, res, next) {
    if (!req.body.itemName && !req.body.itemPrice && !req.body.description && !req.body.category) {
      const error = new Error('The request cannot or will not be processed due to client error (for example, validation error).')
      error.status = 400
      return next(error)
    }

    try {
      const loggedInUser = await req.user
      console.log('login user: ' + JSON.stringify(loggedInUser))

      // Verify if the category exists.
      const categoryExists = await CategoryModel.findById(req.body.category)
      if (!categoryExists) {
        const error = new Error('Invalid category')
        error.status = 400
        return next(error)
      }

      const itemDocument = await ItemsModel.create({
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        description: req.body.description,
        itemId: loggedInUser.userID,
        category: req.body.category
      })

      console.log('New item document has been save to database: ' + itemDocument)
      res.status(201).json(itemDocument)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Show the specific item with its id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async showItemWithId (req, res, next) {
    try {
      // Using 'itemId' field to find the document.
      const item = await ItemsModel.findOne({
        itemId: req.user.userID // req.user.userID should be the userId of the logged-in user.
      })

      if (!item) {
      // If the item document is not found, return a 404 Not Found response.
        const error = new Error('The requested resource was not found or you do not have permission to update it.')
        error.status = 404
        return next(error)
      }

      // Respond with the item document
      res.status(200).json(item)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update a specific item with its itemId.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async updateTheWholeItem (req, res, next) {
    if (!req.body.itemName && !req.body.itemPrice && !req.body.description) {
      const error = new Error('The request cannot or will not be processed due to client error (for example, validation error).')
      error.status = 400
      return next(error)
    }

    try {
      // Find the item by itemId and verify that the userId matches the logged-in user's id.
      const updateItem = await ItemsModel.findOne({
        itemId: req.user.userID // req.user.userID should be the userId of the logged-in user.
      })

      const loggedInUser = await req.user
      if (updateItem.itemId !== loggedInUser.userId) {
        throw new Error('You can not update another peoples item.')
      }

      if (!updateItem) {
      // If the item is not found or the userId does not match, return a 404 error.
        const error = new Error('The requested resource was not found or you do not have permission to update it.')
        error.status = 404
        return next(error)
      }

      // Update local database only after a successful update on the remote server.
      const updateDocument = await ItemsModel.findOneAndUpdate({ itemId: updateItem.itemId }, {
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        description: req.body.description
      }, { new: true })
      console.log('update document:' + updateDocument)

      res.status(204).json(updateDocument)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Partial update the specific items price with its id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async partialUpdateOneItem (req, res, next) {
    try {
      // Check if at least one field is provided for update.
      const fieldsToUpdate = ['itemPrice']

      const hasAtLeastOneField = fieldsToUpdate.some(field => Object.prototype.hasOwnProperty.call(req.body, field))

      // I got inspiration here:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
      // https://chat.openai.com/

      const partialUpdateItem = await ItemsModel.findOne({
        itemId: req.user.userID // req.user.userID should be the userId of the logged-in user.
      })

      if (!hasAtLeastOneField) {
        const error = new Error('The requested resource was not found or you do not have permission to update it.')
        error.status = 404
        return next(error)
      }

      const partialUpdateDocument = await ItemsModel.findOneAndUpdate({ itemId: partialUpdateItem.itemId }, {
        itemPrice: req.body.itemPrice
      }, { new: true })
      console.log('Partial update document:' + partialUpdateDocument)

      res.status(204).json()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete the specific item with its id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async deleteOneItem (req, res, next) {
    try {
      const itemDocument = await ItemsModel.findOne({
        itemId: req.user.userID // req.user.userID should be the userId of the logged-in user.
      })

      if (!itemDocument) {
        const error = new Error('The requested resource was not found or you do not have permission to update it.')
        error.status = 404
        return next(error)
      }

      const deletedItem = await ItemsModel.findOneAndDelete({ itemId: req.params.itemId })

      if (!deletedItem) {
        const error = new Error('The requested resource was not found or you do not have permission to update it.')
        error.status = 404
        return next(error)
      }

      res.status(204).json()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get items by category.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getItemsByCategory (req, res, next) {
    try {
      const categoryId = req.params.categoryId
      const items = await ItemsModel.find({ category: categoryId })
      res.json(items)
    } catch (error) {
      next(error)
    }
  }
}
