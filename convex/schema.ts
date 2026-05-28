import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
    stock: v.number(),
    reorderThreshold: v.number(),
  }),
  orders: defineTable({
    orderNumber: v.string(),
    requestedBy: v.string(),
    item: v.string(),
    quantity: v.number(),
    sector: v.string(),
    status: v.string(),
    eta: v.string(),
    createdAt: v.number(),
  }).index('by_createdAt', ['createdAt']),
})
