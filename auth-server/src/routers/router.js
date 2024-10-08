/**
 * @file Defines the main router.
 * @module router
 * @author Dongzhu Tan
 */

import express from 'express'
import http from 'node:http'
import { router as accountRouter } from './account-router.js'

export const router = express.Router()

router.use('/auth', accountRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode

  next(error)
})
