import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { anyApi } from 'convex/server'
import { ArrowRight, ClipboardList, Package2, Sparkles, Truck } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

type Order = {
  _id: string
  orderNumber: string
  requestedBy: string
  item: string
  quantity: number
  sector: string
  status: string
  eta: string
  createdAt?: number
}

type Product = {
  _id: string
  title: string
  imageId: string
  price: number
  stock: number
  reorderThreshold: number
}

function Home() {
  const orders = (useQuery(anyApi.orders.list) as Order[] | undefined) ?? []
  const products = (useQuery(anyApi.products.list) as Product[] | undefined) ?? []

  const activeOrders = orders.filter((order) => order.status !== 'Rechazada').length
  const completedOrders = orders.filter((order) => order.status === 'Aprobada').length
  const inTransit = orders.filter((order) => order.status === 'Pendiente').length
  const criticalItems = products.filter((product) => product.stock <= product.reorderThreshold).length

  const summaryCards = [
    {
      label: 'Pedidos activos',
      value: activeOrders.toString(),
      description: 'Ordenes abiertas pendientes de revisión',
      icon: ClipboardList,
      color: 'bg-emerald-500/15 text-emerald-200',
    },
    {
      label: 'Repuestos críticos',
      value: criticalItems.toString(),
      description: 'Artículos con stock bajo en depósito',
      icon: Package2,
      color: 'bg-orange-500/15 text-orange-200',
    },
    {
      label: 'En tránsito',
      value: inTransit.toString(),
      description: 'Envíos de repuestos al sector de depósito',
      icon: Truck,
      color: 'bg-sky-500/15 text-sky-200',
    },
    {
      label: 'Órdenes completadas',
      value: completedOrders.toString(),
      description: 'Solicitudes procesadas este mes',
      icon: Sparkles,
      color: 'bg-violet-500/15 text-violet-200',
    },
  ]

  const recentRequests = orders.slice(0, 3)
  const inventoryTrends = products
    .slice()
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/30">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Dashboard de pedidos</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Gestión de repuestos al depósito</h1>
            <p className="mt-4 max-w-2xl text-slate-400">
              Vigila los pedidos de repuestos, controla el stock crítico y administra el flujo de materiales del depósito en la planta agroindustrial.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-300">
            <ClipboardList className="h-5 w-5 text-emerald-300" />
            <span>Pedidos y solicitudes centralizadas</span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} className={`rounded-3xl border border-slate-800 p-6 ${card.color}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{card.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950/80 p-3 text-white shadow-sm shadow-slate-950/20">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400">{card.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Últimos pedidos recibidos</h2>
              <p className="mt-1 text-sm text-slate-400">Revisa las solicitudes recientes al sector de depósito.</p>
            </div>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Ver administración
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 space-y-4">
            {recentRequests.map((request) => (
              <div key={request.orderNumber} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{request.orderNumber}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{request.item}</p>
                    <p className="mt-1 text-sm text-slate-400">Sector: {request.sector}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-slate-300">ETA: {request.eta}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        request.status === 'Aprobada'
                          ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                          : request.status === 'Pendiente'
                          ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-200 border border-rose-500/30'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <div>
            <h2 className="text-2xl font-semibold text-white">Tendencias de inventario</h2>
            <p className="mt-2 text-sm text-slate-400">Monitorea los repuestos más críticos y prepara los próximos pedidos.</p>
          </div>
          <div className="space-y-4">
            {inventoryTrends.length > 0 ? (
              inventoryTrends.map((product) => {
                const ratio = Math.round(
                  Math.min(
                    100,
                    Math.max(0, (product.stock / Math.max(product.reorderThreshold * 2, 1)) * 100),
                  ),
                )
                return (
                  <div key={product._id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">{product.title}</p>
                    <p className="mt-1 text-lg font-semibold text-white">Stock {product.stock} unidades</p>
                    <div className="mt-3 h-3 rounded-full bg-slate-800">
                      <div className="h-3 rounded-full bg-orange-400" style={{ width: `${ratio}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Nivel {ratio}%</p>
                  </div>
                )
              })
            ) : (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-slate-400">
                Cargando tendencias de inventario...
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  )
}
