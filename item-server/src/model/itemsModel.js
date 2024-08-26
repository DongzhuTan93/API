/**
 * @file Defines the item model.
 * @module model/ImageModel
 * @author Dongzhu Tan
 * @version 3.1.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'The items name is required.']
  },
  itemPrice: {
    type: String,
    required: [true, 'The items price is required.']
  },
  description: {
    type: String,
    required: [true, 'The items description is required.']
  },
  itemId: {
    type: String,
    required: [true, 'The user id is required.']
  }
}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information(When we send a Mongoose document (for example, a user record) to a client, it needs to be converted into a JSON format. This conversion is automatically triggered when you use operations like res.json(user) in an Express.js application).
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id // This removes the _id field from the JSON output. _id is MongoDB's internal identifier, and we might not want to expose it for reasons like security or simplicity for the client.
      delete ret.__v
    },
    virtuals: true // ensure virtual fields are serialized.
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const ItemsModel = mongoose.model('Item', schema)

// I got inspiration here: https://gitlab.lnu.se/1dv026/student/dt222ha/exercises/example-restful-tasks-with-jwt
