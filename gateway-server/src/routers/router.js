/**
 * @file Defines the main router.
 * @module router
 * @author Dongzhu Tan
 */

import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { router as homeRouter } from './home-router.js'

export const router = express.Router()

const baseURL = process.env.BASE_URL || '/second-hand-store/'

// Home route
router.use(baseURL, homeRouter)

// Auth Server Routes
router.use(`${baseURL}auth`, createProxyMiddleware({
  target: `http://localhost:${process.env.AUTH_SERVER_PORT || '8084'}`,
  changeOrigin: true,
  pathRewrite: { [`^${baseURL}auth`]: '/' },
  logLevel: 'debug'
}))

// Item Server Routes
router.use(`${baseURL}items`, createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { [`^${baseURL}items`]: '' }
}))

// Category Routes (also handled by Item Server)
router.use(`${baseURL}categories`, createProxyMiddleware({
  target: `http://localhost:${process.env.ITEM_SERVER_PORT || '8085'}`,
  changeOrigin: true,
  pathRewrite: { [`^${baseURL}categories`]: '' }
}))

// Catch-all route for 404 errors
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' })
})
