/**
 * @file Defines the AccountController class.
 * @module controllers/AccountController
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import { UserModel } from '../model/userModel.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async addUser (req, res, next) {
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
  async addAdmin (req, res, next) {
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
      const userDocument = await UserModel.authenticate(req.body.username, req.body.password)

      // Read the private key from private.pem file.
      const privateKey = await fs.readFile('./private.pem', 'utf8')

      const payload = {
        // username: userDocument.username
        userID: userDocument.id,
        username: userDocument.username,
        role: userDocument.role
        // This change assumes that userDocument.id contains the user's unique identifier, which is often a better choice for the payload in a JWT.
        // Using the user ID (often a numeric or UUID value) is more stable, as usernames might change, but IDs generally do not.
        // Additionally, using the ID can enhance privacy and security, as it avoids exposing the username in the token payload. Make sure that the rest of your system is capable of handling the user ID instead of the username wherever necessary.
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
   * User logout from application.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async removeToken (req, res, next) {
    try {
      res.clearCookie('jwtToken')
      res.status(200).json({ message: 'Logged out successfully' })
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
      // Fetch all users from the database, excluding the password field
      const users = await UserModel.find({}, '-password')

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
      console.error('Error in getAllUsers:', error)
      next(createError(500, 'An error occurred while retrieving users'))
    }
  }

  /**
   * Retrieve one users information.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async retrieveUser (req, res, next) {
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
