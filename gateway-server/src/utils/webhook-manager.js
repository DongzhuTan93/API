/**
 * @file Defines the WebhookManager.
 * @module controllers/WebhookManager
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a WebhookManager for handling webhooks and favorites.
 */
class WebhookManager {
  /**
   * Initializes a new instance of the WebhookManager.
   */
  constructor () {
    this.webhooks = new Map() // Map to store webhooks with their IDs and URLs.
    this.favorites = new Map() //  Map to store user favorites by itemObjectId.
  }

  /**
   * Registers a new webhook.
   *
   * @param {string} url - The URL of the webhook to register.
   * @returns {string} The ID of the registered webhook.
   */
  registerWebhook (url) {
    const id = Date.now().toString()
    this.webhooks.set(id, url)
    return id
  }

  /**
   * Adds an item to a user's favorites.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} itemObjectId - The ID of the item to favorite.
   */
  addFavorite (userId, itemObjectId) {
    if (!this.favorites.has(itemObjectId)) {
      this.favorites.set(itemObjectId, new Set())
    }
    this.favorites.get(itemObjectId).add(userId)
  }

  /**
   * Notifies all registered webhooks about a price change for an item.
   *
   * @param {string} itemObjectId - The objectId of the item whose price changed.
   * @param {number|string} newPrice - The new price of the item.
   * @returns {Promise<void>}
   */
  async notifyPriceChange (itemObjectId, newPrice) {
    console.log(`Attempting to notify price change for item ${itemObjectId} to ${newPrice}`)

    const userIds = this.favorites.get(itemObjectId) || new Set()

    console.log(`Found ${userIds.size} users who favorited this item`)

    const notifications = Array.from(userIds).map(userId => ({
      userId,
      message: `Price of item with id : ${itemObjectId} has changed to ${newPrice} kr`
    }))

    for (const [id, url] of this.webhooks) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemObjectId, newPrice, notifications })
        })
        console.log(`Webhook ${id} notified:`, response.status)
      } catch (error) {
        console.error(`Failed to notify webhook ${id}:`, error)
      }
    }
  }
}

export const webhookManager = new WebhookManager()
