/**
 * @file Defines the api/vi main router.
 * @module routers/api/vi/router main router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

import { router as categoryRouter } from './category-router.js'
import { router as itemRouter } from './items-router.js'
import { router as authRouter } from './auth-router.js'
import { router as webhookRouter } from './webhook-router.js'

export const router = express.Router()

router.use('/auth', authRouter)
router.use('/categories', categoryRouter)
router.use('/items', itemRouter)
router.use('/webhooks', webhookRouter)
