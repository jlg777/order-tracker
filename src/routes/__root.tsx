import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ConvexProvider from '../integrations/convex/provider'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Depósito Agroindustrial - Pedidos de Repuestos',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="bg-slate-950 text-slate-100">
        <ConvexProvider>
          <div className="min-h-screen bg-slate-950">
            <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
                <div>
                  <p className="text-lg font-semibold tracking-wide text-emerald-300">Depósito Agroindustrial</p>
                  <p className="text-sm text-slate-400">Panel de administración de pedidos y repuestos</p>
                </div>
                <nav className="flex items-center gap-3 text-sm text-slate-300">
                  <Link to="/" className="rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white">
                    Dashboard
                  </Link>
                  <Link to="/orders" className="rounded-lg px-3 py-2 transition hover:bg-slate-800 hover:text-white">
                    Pedidos
                  </Link>
                </nav>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
              {children}
            </main>
          </div>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ConvexProvider>
        <Scripts />
      </body>
    </html>
  )
}
