/**
 * @file Defines the home router.
 * @module routers/home-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

export const router = express.Router()

// Show welcome message from baseUrl.
router.get('/', (req, res) => {
  res.json({
    message: `{
        "message": Hooray! Welcome to Second-Hand Store. Visit https://api.dongzhutan.com/auth/register to create an account. If you already have an account, visit https://api.dongzhutan.com/auth/login to log in. Explore all items at https://api.dongzhutan.com/items or browse categories at https://api.dongzhutan.com/categories.
      }`
  })
})
