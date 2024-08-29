/**
 * @file Defines the home router.
 * @module routers/home-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

export const router = express.Router()

// Show welcome message from second-sand-stor.
router.get('/', (req, res) => {
  res.json({
    message: `{
        "message": Hooray! Welcome to Second-Hand Store. Visit https://second-hand-store/dongzhutan.com/auth/register to create an account. If you already have an account, visit https://second-hand-store/dongzhutan.com/auth/login to log in. Explore all items at https://second-hand-store/dongzhutan.com/items or browse categories at https://second-hand-store/dongzhutan.com/categories.
      }`
  })
})
