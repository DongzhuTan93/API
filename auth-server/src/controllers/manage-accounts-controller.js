/**
 * @file Defines the ManageAccounts controller class.
 * @module controllers/ManageAccountsController
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import { UserModel } from '../model/user-model.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'

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
  async register (req, res, next) {
    try {
      const { username, password, firstName, lastName, email } = req.body

      const userDocument = await UserModel.create({
        username,
        password,
        firstName,
        lastName,
        email
      })

      console.log('New user registered: ' + userDocument)

      res.status(201).json({ message: 'User registered successfully!' })
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
    console.log('hej från registerAdmin')
    try {
      const { username, password, firstName, lastName, email, adminSecret } = req.body

      // Check if the adminSecret is correct
      if (adminSecret !== process.env.ADMIN_SECRET) {
        res.status(403).json({ message: 'Invalid admin secret' })
      }

      const userDocument = await UserModel.create({
        username,
        password,
        firstName,
        lastName,
        email,
        role: 'admin'
      })

      console.log('New admin registered: ' + userDocument)

      res.status(201).json({ message: 'Admin  registered successfully!' })
    } catch (error) {
      console.log("catched err")
      console.log(error)
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
  async login (req, res, next) {
    try {
      const userDocument = await UserModel.authenticate(req.body.username, req.body.password)

      // Read the private key from private.pem file.
      const privateKey = await fs.readFile('./private.pem', 'utf8')

      const payload = {
        // username: userDocument.username
        userID: userDocument.id,
        username: userDocument.username,
        role: userDocument.role
      }

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      // Set the JWT token as an HttpOnly cookie.
      res.cookie('jwtToken', accessToken, {
        httpOnly: true,
        secure: true, // Enable this if using HTTPS in production.
        sameSite: 'strict' // Adjust based on your requirements.
      })

      res.status(201).json({
        message: 'User logged in successfully! The accesstoken: ' + accessToken,
        userId: userDocument.id,
        username: userDocument.username
      })
    } catch (error) {
      // Authentication failed.
      const err = createError(401)
      err.cause = error
      next(err)
    }
  }

  /**
   * Retrieves all users.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllUsers (req, res, next) {
    try {
      // Fetch all users from the database, including only username and email.
      const users = await UserModel.find({}, 'username email')

      if (users.length === 0) {
        res.status(200).json({
          users: [],
          message: 'No users found in the database.'
        })
      }

      res.status(200).json({
        users,
        message: 'All users retrieved successfully.'
      })
    } catch (error) {
      console.error('Error in listUsers:', error)
      next(createError(500, 'An error occurred while retrieving users'))
    }
  }

  /**
   * Get user information.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getUserInfo (req, res, next) {
    try {
      const user = await UserModel.findById(req.params.userId).select('-password')
      if (!user) {
        res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
    } catch (error) {
      next(error)
    }
  }
}
