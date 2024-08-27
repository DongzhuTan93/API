/**
 * @file Defines the home router.
 * @module routers/homeRouter
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

export const router = express.Router()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res) => res.json({ message: '{"message":"Welcome to the second-hand store, item server！"}' }))
