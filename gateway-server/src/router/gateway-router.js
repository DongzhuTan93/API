/**
 * @file Defines the gateway router.
 * https://www.npmjs.com/package/http-proxy-middleware
 * @module  router/gateway-router
 * @author Dongzhu Tan
 */

import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'

export const router = express.Router()

// Auth Server Routes.
router.use('/auth', createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_SERVER_PORT || '8084'}`,
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}))

// Item Server Routes.
router.use('/items', createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { '^/items': '' }
}))

// Category Routes (also handled by Item Server).
router.use('/categories', createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { '^/categories': '/categories' }
}))

// Catch-all route for 404 errors.
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' })
})
