/**
 * @file Defines the main router.
 * @module router/main router
 * @author Dongzhu Tan
 */

import express from 'express'
import { router as homeRouter } from './home-router.js'
import { createProxyMiddleware } from 'http-proxy-middleware'

export const router = express.Router()
const baseURL = process.env.BASE_URL || '/second-hand-store/'
const apiVersion = 'api/v1'

// API v1 routes
router.use('/', homeRouter)

router.use(`${baseURL}${apiVersion}/auth`, createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_SERVER_PORT || '8084'}`,
  changeOrigin: true,
  [`^${baseURL}${apiVersion}/auth`]: `${apiVersion}/auth`,
  logLevel: 'debug'
}))

// Item Server Routes
router.use('api/vi/items', createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { '^/items': '/api/v1/items' },
  logLevel: 'debug'
}))

// Category Routes (also handled by Item Server)
router.use('api/vi/categories', createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { '^/categories': '/api/v1/categories' },
  logLevel: 'debug'
}))

// Catch-all route for 404 errors
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' })
})
