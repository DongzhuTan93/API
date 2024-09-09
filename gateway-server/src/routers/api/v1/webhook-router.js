/**
 * @file Defines the webhook router.
 * @module router/webhook router
 * @author Dongzhu Tan
 */

import express from 'express'
import { webhookManager } from '../../../utils/webhook-manager.js'

export const router = express.Router()

router.post('/register', (req, res) => {
  const { url } = req.body
  if (!url) {
    return res.status(400).json({ error: 'Webhook URL is required' })
  }
  const id = webhookManager.registerWebhook(url)
  res.status(201).json({ id, message: 'Webhook registered successfully' })
})

router.post('/favorite', (req, res) => {
  const { userId, itemObjectId } = req.body
  if (!userId || !itemObjectId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' })
  }
  webhookManager.addFavorite(userId, itemObjectId)
  res.status(200).json({ message: 'Item added to favorites' })
})
