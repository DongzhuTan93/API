/**
 * Module for the GatewayItemsController.
 *
 * @author Dongzhu Tan
 * @version 3.1.0
 */

/**
 * Encapsulates a controller.
 */
export class GatewayItemsController {
  /**
   * Provide req.doc to the route if :id is present, checking if an item exists before performing operations like update or delete.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the item to load.
   * @returns {void} -Sends an HTTP response with status information but does not return a value explicitly.
   */
  async loadItemsDocument (req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      const error = new Error('Invalid Identifier')
      error.status = 404
      return next(error)
    }

    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${id}`)

      if (!response.ok) {
        if (response.status === 404) {
          const error = new Error('The item document you requested does not exist.')
          error.status = 404
          return next(error)
        }
        throw new Error('Server responded with status: ' + response.status)
      }

      const itemDoc = await response.json()

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
  async fetchAllItems (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items`)
      const data = await response.json()

      res.status(response.status).json(data)
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
  async fetchUserItems (req, res, next) {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json({ message: 'User not authenticated or userID not found' })
      }

      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/user/${req.user.userID}/items`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response from items server:', response.status, errorText)
        throw new Error(`Items server responded with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error in fetchUserItems:', error)
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
  async createNewItem (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        },
        body: JSON.stringify({
          ...req.body,
          userId: req.user.userID
        })
      })
      const data = await response.json()

      res.status(response.status).json(data)
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
  async fetchItemById (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${req.params.itemId}`)
      const data = await response.json()

      res.status(response.status).json(data)
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
  async updateEntireItem (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${req.params.itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        },
        body: JSON.stringify(req.body)
      })
      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
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
  async updateItemPartially (req, res, next) {
    try {
      if (!req.user || !req.user.userID) {
        return res.status(401).json({ message: 'User not authenticated or userID not found' })
      }

      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${req.params.itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': req.user.userID // Pass the user ID in a custom header
        },
        body: JSON.stringify(req.body)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response from items server:', response.status, errorText)
        return res.status(response.status).json({ message: errorText })
      }

      const data = await response.json()
      res.status(200).json(data)
    } catch (error) {
      console.error('Error in updateItemPartially:', error)
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
  async removeItem (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/${req.params.itemId}`, {
        method: 'DELETE',
        headers: { Authorization: req.headers.authorization }
      })
      if (response.status === 204) {
        res.status(204).send()
      } else {
        const data = await response.json()
        res.status(response.status).json(data)
      }
    } catch (error) {
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
  async fetchAllUsersWithItems (req, res, next) {
    try {
      console.log('Fetching users from auth server...')
      const usersResponse = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/admin/users`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })

      if (!usersResponse.ok) {
        const errorText = await usersResponse.text()
        console.error('Error response from auth server:', usersResponse.status, errorText)
        throw new Error(`Auth server responded with status ${usersResponse.status}: ${errorText}`)
      }

      const usersData = await usersResponse.json()
      console.log('Successfully fetched users from auth server')

      console.log('Fetching items for users from items server...')
      const itemsResponse = await fetch(`http://localhost:${process.env.ITEMS_SERVER_PORT}/items/admin/users-with-items`, {
        headers: {
          Authorization: req.headers.authorization
        }
      })

      if (!itemsResponse.ok) {
        const errorText = await itemsResponse.text()
        console.error('Error response from items server:', itemsResponse.status, errorText)
        throw new Error(`Items server responded with status ${itemsResponse.status}: ${errorText}`)
      }

      const itemsData = await itemsResponse.json()
      console.log('Successfully fetched items for users from items server')

      // Combine user data with items data
      const usersWithItems = usersData.users.map(user => ({
        ...user,
        items: itemsData.users.find(u => u.id === user.id)?.items || []
      }))

      res.status(200).json({
        users: usersWithItems,
        message: 'All users and their items retrieved successfully.'
      })
    } catch (error) {
      console.error('Error in fetchAllUsersWithItems:', error)
      next(error)
    }
  }
}
