/**
 * @file Defines the api/vi item router.
 * @module routers/api/vi item router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

import { router as categoryRouter } from './category-router.js'
import { router as itemRouter } from './item-router.js'

export const router = express.Router()

router.use('/categories', categoryRouter)
router.use('/items', itemRouter)
