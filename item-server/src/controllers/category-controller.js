/**
 * Module for the itemsCategoryController.
 *
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import { CategoryModel } from '../models/itemsCategoryModel.js'
import { ItemsModel } from '../models/itemsModel.js'
import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class CategoryController {
  /**
   * Displays a list of category at the store.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async getAllCategories (req, res, next) {
    try {
      const categories = {
        categories: (await CategoryModel.find()).map(item => item.toObject()),
        message: 'Categories fetching successful!'
      }

      // Add Cache-Control header.
      res.set('Cache-Control', 'public, max-age=3600') // Cache for 1 hour.
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create category at the store.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async createCategory (req, res, next) {
    try {
      const { name } = req.body
      const category = new CategoryModel({ name })
      await category.save()
      res.status(201).json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get the specify category.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async getCategoryById (req, res, next) {
    try {
      const category = await CategoryModel.findById(req.params.id)
      if (!category) {
        throw createError(404, 'Category not found')
      }
      res.status(201).json(category)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get category with items.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getCategoryWithItems (req, res, next) {
    try {
      const categoryName = req.params.categoryName

      // Find the category by name.
      const category = await CategoryModel.findOne({ name: categoryName })

      if (!category) {
        res.status(404).json({ message: 'Category not found' })
      }

      // Find items in this category.
      const items = await ItemsModel.find({ category: category._id })

      // Prepare the response
      const response = {
        category: {
          id: category._id,
          name: category.name
          // Include other category fields as needed.
        },
        itemCount: items.length,
        items
      }

      // Add Cache-Control header.
      res.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes without needing to request it again from server.
      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}
