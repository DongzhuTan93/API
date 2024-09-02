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
   * Displays a list of items at the store.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async getAllItems (req, res, next) {
    try {
      const items = {
        items: (await ItemsModel.find()).map(item => item.toObject()),
        message: 'Items fetching successful!'
      }

      // Add Cache-Control header.
      res.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes.
      res.status(200).json(items)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Displays a list of items from a specific user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async showAllItemsFromUser (req, res, next) {
    try {
      const userId = req.params.userId
      const userItems = await ItemsModel.find({ itemId: userId })

      if (userItems.length === 0) {
        return res.status(404).json({ message: 'No items found for this user.' })
      }

      const viewItemData = {
        items: userItems.map(item => item.toObject()),
        message: 'User items fetching successful!'
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
      const error = new Error('Missing required fields.')
      error.status = 400
      return next(error)
    }

    try {
      // Verify if the category exists.
      const category = await CategoryModel.findOne({ name: req.body.category })
      if (!category) {
        const error = new Error('Invalid category')
        error.status = 400
        return next(error)
      }

      console.log(' category: ' + req.body.category)

      const itemDocument = await ItemsModel.create({
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        description: req.body.description,
        itemId: req.body.userId,
        category: category._id
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
      const item = await ItemsModel.findById(req.params.itemId)

      if (!item) {
      // If the item document is not found, return a 404 Not Found response.
        const error = new Error('Item not found.')
        error.status = 404
        return next(error)
      }

      // Add Cache-Control header
      res.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes.
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
    try {
      const userID = req.headers['x-user-id']
      console.log(`Attempting to update item ${req.params.itemId} for user ${userID}`)

      if (!userID) {
        return res.status(401).json({ message: 'User ID not provided' })
      }

      if (!req.body.itemName || !req.body.itemPrice || !req.body.description || !req.body.category) {
        return res.status(400).json({ message: 'Missing required fields.' })
      }

      const category = await CategoryModel.findOne({ name: req.body.category })
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' })
      }

      // Find the item first to check if it exists and belongs to the user
      const existingItem = await ItemsModel.findOne({
        _id: req.params.itemId,
        itemId: userID
      })

      if (!existingItem) {
        console.log(`Item ${req.params.itemId} not found or does not belong to user ${userID}`)
        return res.status(404).json({ message: 'Item not found or you do not have permission to update it.' })
      }

      // If the item exists and belongs to the user, update it
      const updateItem = await ItemsModel.findOneAndUpdate(
        { _id: req.params.itemId, itemId: userID },
        {
          itemName: req.body.itemName,
          itemPrice: req.body.itemPrice,
          description: req.body.description,
          category: category._id
        },
        { new: true }
      )

      console.log('Updated item:', updateItem)
      res.status(200).json(updateItem)
    } catch (error) {
      console.error('Error in updateTheWholeItem:', error)
      next(error)
    }
  }

  /**
   * Partial update the specific items with its id.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async partialUpdateOneItem (req, res, next) {
    try {
      const userID = req.headers['x-user-id'] // Get the user ID from the custom header

      if (!userID) {
        return res.status(401).json({ message: 'User ID not provided' })
      }

      if (!req.body.itemPrice) {
        return res.status(400).json({ message: 'Item price is required for partial update.' })
      }

      const partialUpdateItem = await ItemsModel.findOneAndUpdate(
        { _id: req.params.itemId, itemId: userID },
        { itemPrice: req.body.itemPrice },
        { new: true }
      )

      console.log('Partial update document:', partialUpdateItem)

      if (!partialUpdateItem) {
        return res.status(404).json({ message: 'Item not found or you do not have permission to update it.' })
      }

      res.status(200).json(partialUpdateItem)
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
      const userID = req.headers['x-user-id']
      console.log(`Attempting to delete item ${req.params.itemId} for user ${userID}`)

      if (!userID) {
        return res.status(401).json({ message: 'User ID not provided' })
      }

      const deletedItem = await ItemsModel.findOneAndDelete({
        _id: req.params.itemId,
        itemId: userID
      })

      if (!deletedItem) {
        console.log(`Item ${req.params.itemId} not found or does not belong to user ${userID}`)
        return res.status(404).json({ message: 'Item not found or you do not have permission to delete it.' })
      }

      console.log(`Item ${req.params.itemId} successfully deleted`)
      res.status(204).send()
    } catch (error) {
      console.error('Error in deleteOneItem:', error)
      next(error)
    }
  }

  /**
   * Retrieves all users and their items (admin only).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllUsersWithItems (req, res, next) {
    try {
      // Fetch all users from auth server
      const usersResponse = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/admin/users`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users from auth server')
      }

      const usersData = await usersResponse.json()

      // Fetch items for each user
      const usersWithItems = await Promise.all(usersData.users.map(async (user) => {
        const items = await ItemsModel.find({ itemId: user.id })
        return {
          ...user,
          items
        }
      }))

      res.status(200).json({
        users: usersWithItems,
        message: 'All users and their items retrieved successfully.'
      })
    } catch (error) {
      next(error)
    }
  }
}
