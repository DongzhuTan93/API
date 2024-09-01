/**
 * @file Defines the api/vi auth router.
 * @module routers/auth-router
 * @author Dongzhu Tan
 * @version 3.2.0
 */

import express from 'express'

import { router as accountRouter } from './accountRouter.js'

export const router = express.Router()

router.use('/auth', accountRouter)
