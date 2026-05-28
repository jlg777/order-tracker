import { mutation, query } from './_generated/server'

const seedProducts = [
  {
    title: 'Cadenas de transmisión',
    imageId: 'transmission-chain',
    price: 120,
    stock: 28,
    reorderThreshold: 12,
  },
  {
    title: 'Rodamiento 6206',
    imageId: 'bearing-6206',
    price: 35,
    stock: 18,
    reorderThreshold: 10,
  },
  {
    title: 'Filtros hidráulicos',
    imageId: 'hydraulic-filter',
    price: 48,
    stock: 12,
    reorderThreshold: 8,
  },
  {
    title: 'Correas de transmisión',
    imageId: 'drive-belt',
    price: 55,
    stock: 22,
    reorderThreshold: 10,
  },
]

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('products').collect()
  },
})

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query('products').collect()

    if (existingProducts.length > 0) {
      return {
        seeded: false,
        message: 'La tabla products ya contiene datos.',
      }
    }

    await Promise.all(
      seedProducts.map((product) =>
        ctx.db.insert('products', {
          ...product,
        }),
      ),
    )

    return {
      seeded: true,
      count: seedProducts.length,
    }
  },
})
