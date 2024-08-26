/**
 * @file Defines the main router.
 * @module router
 * @author Dongzhu Tan
 */

import express from 'express'
import http from 'node:http'
import { router as homeRouter } from './homeRouter.js'
import { router as itemRouter } from './itemRouter.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/items', itemRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  console.log(`404 Error: Path ${req.path} not found.`)
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode

  next(error)
})
