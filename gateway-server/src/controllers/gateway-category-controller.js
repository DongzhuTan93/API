/**
 * Module for the GatewayCategoryController .
 *
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class GatewayCategoryController {
  /**
   * Displays a list of category at the store.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async fetchAllCategories (req, res, next) {
    try {
      // Fetch all categories
      const categoriesResponse = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/categories`)
      const categoriesData = await categoriesResponse.json()

      if (!categoriesData || !categoriesData.categories) {
        return res.status(200).json({
          categories: [],
          message: 'No categories found or invalid response from items server',
          _links: {
            self: { href: `${req.protocol}://${req.get('host')}${req.originalUrl}` }
          }
        })
      }

      // Fetch all items.
      const itemsResponse = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items`)
      const itemsData = await itemsResponse.json()

      // Group items by category.
      const itemsByCategory = itemsData.items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push({
          itemName: item.itemName,
          link: `http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${item._id}`
        })
        return acc
      }, {})

      // Combine categories with their items.
      const categoriesWithItems = categoriesData.categories.map(category => ({
        categoryName: category.name,
        items: itemsByCategory[category._id] || []
      }))

      res.status(200).json({
        categories: categoriesWithItems,
        message: 'Categories with items fetched successfully',
        _links: {
          self: { href: `${req.protocol}://${req.get('host')}${req.originalUrl}` }
        }
      })
    } catch (error) {
      console.error('Error in fetchAllCategories:', error)
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
  async createNewCategory (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/categories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        },
        body: JSON.stringify(req.body)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response from items server:', response.status, errorText)
        throw new Error(`Items server responded with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('Successfully created category:', data)

      res.status(response.status).json(data)
    } catch (error) {
      console.error('Error in createNewCategory:', error)
      next(error)
    }
  }

  /**
   * Get the specific category by ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async getCategoryById (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/categories/${req.params.id}`)

      if (!response.ok) {
        if (response.status === 404) {
          res.status(404).json({ message: 'Category not found' })
          return
        }
        throw new Error('Server responded with status: ' + response.status)
      }

      const data = await response.json()

      res.status(200).json(data)
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
  async fetchCategoryWithItems (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/categories/${req.params.categoryName}`)
      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
      next(error)
    }
  }
}
