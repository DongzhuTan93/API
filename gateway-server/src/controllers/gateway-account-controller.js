/**
 * @file Defines the GatewayAccountController class.
 * @module controllers/GatewayAccountController
 * @author Dongzhu Tan
 * @version 3.1.0
 */

/**
 * Encapsulates a controller.
 */
export class GatewayAccountController {
  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addUser (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/register`, {
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
  async addAdmin (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/register-admin`, {
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
  async createToken (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/login`, {
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
   * User logout from application.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeToken (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: req.headers.authorization }
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
  async listUsers (req, res, next) {
    try {
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/admin/users`, {
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
      const response = await fetch(`http://localhost:${process.env.AUTH_SERVER_PORT}/auth/users/${req.params.userId}`)
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
}
