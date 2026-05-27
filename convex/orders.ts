import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const seedOrders = [
  {
    orderNumber: 'ORD-4532',
    requestedBy: 'Encargado de Depósito',
    item: 'Cadenas de transmisión',
    quantity: 12,
    sector: 'Molino 2',
    status: 'Aprobada',
    eta: '1 día',
  },
  {
    orderNumber: 'ORD-4518',
    requestedBy: 'Jefe de Mantenimiento',
    item: 'Rodamiento 6206',
    quantity: 20,
    sector: 'Línea de empaque',
    status: 'Pendiente',
    eta: '2 días',
  },
  {
    orderNumber: 'ORD-4490',
    requestedBy: 'Operario de Riego',
    item: 'Filtros hidráulicos',
    quantity: 8,
    sector: 'Sistema de riego',
    status: 'Rechazada',
    eta: 'N/A',
  },
  {
    orderNumber: 'ORD-4476',
    requestedBy: 'Supervisor de Planta',
    item: 'Correas de transmisión',
    quantity: 15,
    sector: 'Secado',
    status: 'Pendiente',
    eta: '3 días',
  },
]

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('orders')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()
  },
})

export const add = mutation({
  args: {
    orderNumber: v.string(),
    requestedBy: v.string(),
    item: v.string(),
    quantity: v.number(),
    sector: v.string(),
    status: v.string(),
    eta: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('orders', {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingOrders = await ctx.db
      .query('orders')
      .withIndex('by_createdAt')
      .order('desc')
      .collect()

    if (existingOrders.length > 0) {
      return {
        seeded: false,
        message: 'La tabla orders ya contiene datos.',
      }
    }

    await Promise.all(
      seedOrders.map((order) =>
        ctx.db.insert('orders', {
          ...order,
          createdAt: Date.now(),
        }),
      ),
    )

    return {
      seeded: true,
      count: seedOrders.length,
    }
  },
})
