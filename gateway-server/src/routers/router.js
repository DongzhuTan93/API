/**
 * @file Defines the main router.
 * @module router/main router
 * @author Dongzhu Tan
 */

import express from 'express'
import http from 'node:http'

import { router as apiV1Router } from './api/v1/router.js'
import { router as homeRouter } from './api/v1/home-router.js'

export const router = express.Router()

router.use('/', homeRouter)
router.use('/api/v1', apiV1Router)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  console.log(`404 Error: Path ${req.path} not found.`)
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode

  next(error)
})
