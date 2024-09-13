/**
 * @file Defines the main router.
 * @module router/main router
 * @author Dongzhu Tan
 */

import express from 'express'
// import http from 'node:http'

import { router as apiV1Router } from './api/v1/router.js'
import { router as homeRouter } from './api/v1/home-router.js'

export const router = express.Router()

/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get the main link of the second-hand store API
 *     description: Retrieves links to API endpoints including authentication, items, and categories.
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Successful response with API links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to Second-Hand Store API. Here you can find links to where you want to go!
 *                 auth:
 *                   type: object
 *                   properties:
 *                     register:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: http://api.dongzhutan.com/api/v1/auth/register
 *                     login:
 *                       type: object
 *                       properties:
 *                         href:
 *                           type: string
 *                           example: http://api.dongzhutan.com/api/v1/auth/login
 *                 items:
 *                   type: object
 *                   properties:
 *                     href:
 *                       type: string
 *                       example: http://api.dongzhutan.com/api/v1/items
 *                 categories:
 *                   type: object
 *                   properties:
 *                     href:
 *                       type: string
 *                       example: http://api.dongzhutan.com/api/v1/categories
 */
router.use('/', homeRouter)
router.use('/api/v1', apiV1Router)
