/**
 * @file Defines the webhook router.
 * @module router/webhook router
 * @author Dongzhu Tan
 */

import express from 'express'
import { webhookManager } from '../../../utils/webhook-manager.js'

export const router = express.Router()

/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /api/v1/webhooks/register:
 *   post:
 *     summary: Register a new webhook
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://webhook.site/0cf065b6-8a1c-4c54-91d0-c3ac3bb4a982"
 *     responses:
 *       201:
 *         description: Webhook registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 message:
 *                   type: string
 *             example:
 *               id: "1234567890"
 *               message: "Webhook registered successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Webhook URL is required"
 */
router.post('/register', (req, res) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'Webhook URL is required' })
  }
  const id = webhookManager.registerWebhook(url)
  res.status(201).json({ id, message: 'Webhook registered successfully' })
})

/* eslint-disable jsdoc/check-tag-names */
/**
 * @swagger
 * /api/v1/webhooks/favorite:
 *   post:
 *     summary: Add an item to user's favorites
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - itemObjectId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 66d5aa63e76b3725fa458c7e
 *               itemObjectId:
 *                 type: string
 *                 example: 66e3e7046931818afb1c7025
 *     responses:
 *       200:
 *         description: Item added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Item added to favorites"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "User ID and Item ID are required"
 */
router.post('/favorite', (req, res) => {
  const { userId, itemObjectId } = req.body
  if (!userId || !itemObjectId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' })
  }
  webhookManager.addFavorite(userId, itemObjectId)
  res.status(200).json({ message: 'Item added to favorites' })
})
