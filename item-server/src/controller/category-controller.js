/**
 * Module for the itemsCategoryController.
 *
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import { CategoryModel } from '../models/itemsCategoryModel.js'
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
        items: (await CategoryModel.find()).map(item => item.toObject()),
        message: 'Categories fetching successful!'
      }

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
      const { name, description } = req.body
      const category = new CategoryModel({ name, description })
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
}
