/**
 * @file Defines the home router.
 * @module routers/home-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

export const router = express.Router()

// Show welcome message from item server.
router.get('/', (req, res) => {
  res.json({
    message: `{
        "message": Hooray! Welcome to Second-Hand Store. Items server.
      }`
  })
})
