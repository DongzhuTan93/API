/**
 * @file Defines the gateway application.
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import httpContext from 'express-http-context' // Must be first!
import helmet from 'helmet'
import logger from 'morgan'
import { randomUUID } from 'node:crypto'
import http from 'node:http'
import dotenv from 'dotenv'
import { router } from './routers/router.js'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

dotenv.config()

try {
  // Create an Express application.
  const app = express()

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet())

  // Enable Cross Origin Resource Sharing (CORS) (https://www.npmjs.com/package/cors).
  app.use(cors())

  // Parse requests of the content type application/json.
  app.use(express.json())

  // Set the base URL to use for all relative URLs in a document.
  const baseURL = process.env.BASE_URL || '/'

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Add the request-scoped context.
  app.use(httpContext.middleware)

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    res.locals.baseURL = baseURL
    next()
  })

  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.originalUrl)
    next()
  })

  // Swagger config.
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Second-Hand Store API',
        version: '1.0.0',
        description: 'API for managing a second-hand store'
      },
      servers: [
        {
          url: 'https://api.dongzhutan.com',
          description: 'Production server'
        },
        {
          url: `http://localhost:${process.env.PORT}`,
          description: 'Development server'
        }
      ]
    },
    apis: ['./src/routers/*.js', './src/routers/api/v1/*.js'] // Paths to files containing OpenAPI definitions.
  }

  const swaggerSpec = swaggerJsdoc(swaggerOptions)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Use the gateway router
  app.use(baseURL, router)

  // Error handler.
  app.use((err, req, res, next) => {
    console.log(err)
    if (process.env.NODE_ENV === 'production') {
      if (!err.status) {
        err.status = 500
        err.message = http.STATUS_CODES[err.status]
      }

      res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })

      return
    }

    const copy = JSON.decycle(err, { includeNonEnumerableProperties: true })

    return res
      .status(err.status || 500)
      .json(copy)
  })

  // Catch 404 (ALWAYS keep this as the last route).
  router.use('*', (req, res, next) => {
    console.log(`404 Error: Path ${req.path} not found.`)
    const statusCode = 404
    const error = new Error(http.STATUS_CODES[statusCode])
    error.status = statusCode

    next(error)
  })

  // Starts the HTTP server listening for connections.
  const server = app.listen(process.env.PORT, () => {
    console.log(`Gateway server running at http://localhost:${server.address().port}${baseURL}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.log(err)
  process.exitCode = 1
}
