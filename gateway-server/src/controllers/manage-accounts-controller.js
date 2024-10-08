/**
 * @file Defines the ManageAccounts controller class.
 * @module controllers/ManageAccountsController
 * @author Dongzhu Tan
 * @version 3.1.0
 */

// Define the auth base URL once.
const BASE_AUTH_URL = `http://localhost:${process.env.AUTH_SERVER_PORT}`

/**
 * Encapsulates a controller.
 */
export class ManageAccountsController {
  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerUser (req, res, next) {
    try {
      const response = await fetch(`${BASE_AUTH_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      })

      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Registers a admin.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async registerAdmin (req, res, next) {
    try {
      const response = await fetch(`${BASE_AUTH_URL}/auth/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      })

      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticateUser (req, res, next) {
    try {
      const response = await fetch(`${BASE_AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      })

      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Retrieves all users (admin only).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async fetchAllUsers (req, res, next) {
    try {
      const response = await fetch(`${BASE_AUTH_URL}/auth/admin/users`, {
        headers: { Authorization: req.headers.authorization }
      })

      const data = await response.json()

      res.status(response.status).json(data)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user information from gateway.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserInfo (req, res, next) {
    try {
      const response = await fetch(`${BASE_AUTH_URL}/auth/users/${req.params.userId}`)
      const data = await response.json()

      if (response.ok) {
        res.status(200).json(data)
      } else {
        res.status(response.status).json(data)
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a user (admin only).
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteUser (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/admin/users/${req.params.userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: req.headers.authorization
        },
        body: JSON.stringify(req.body)
      })

      if (!response.ok) {
        const errorData = await response.json()
        res.status(response.status).json(errorData)
      }

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
