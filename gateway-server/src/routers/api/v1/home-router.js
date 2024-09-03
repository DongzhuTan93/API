/**
 * @file Defines the api/v1 home router.
 * @module routers/home-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

export const router = express.Router()

// Show welcome message from baseUrl with HATEOAS links
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Second-Hand Store API. Here you can find links to where you want to go!',
    auth: {
      register: { href: `${req.protocol}://${req.get('host')}/api/v1/auth/register` },
      login: { href: `${req.protocol}://${req.get('host')}/api/v1/auth/login` }
    },
    items: { href: `${req.protocol}://${req.get('host')}/api/v1/items` },
    categories: { href: `${req.protocol}://${req.get('host')}/api/v1/categories` }
  }
  )
})
