import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { AlertTriangle, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/orders")({
	component: AdminOrders,
});

type Order = {
	_id: string;
	orderNumber: string;
	requestedBy: string;
	item: string;
	quantity: number;
	sector: string;
	status: string;
	eta: string;
};

function AdminOrders() {
	const orders = useQuery(anyApi.orders.list) as Order[] | undefined;
	const seedOrders = useMutation(anyApi.orders.seed);
	const [isSeeding, setIsSeeding] = useState(false);

	const handleSeedOrders = async () => {
		setIsSeeding(true);
		try {
			await seedOrders();
		} finally {
			setIsSeeding(false);
		}
	};

	const statusClasses = {
		Aprobada: "bg-emerald-500/15 text-emerald-200",
		Pendiente: "bg-amber-500/15 text-amber-200",
		Rechazada: "bg-rose-500/15 text-rose-200",
	};

	return (
		<div className="space-y-8">
			<section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm uppercase tracking-[0.24em] text-emerald-300">
							Administración de pedidos
						</p>
						<h1 className="mt-2 text-3xl font-semibold text-white">
							Control de solicitudes al depósito
						</h1>
						<p className="mt-3 max-w-2xl text-slate-400">
							Gestiona cada orden de repuestos, revisa el estado por sector y
							toma decisiones rápidas sobre aprobación y despacho.
						</p>
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
					>
						Nueva solicitud
						<CheckCircle2 className="h-4 w-4" />
					</button>
				</div>
			</section>

			<section className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h2 className="text-xl font-semibold text-white">
								Pedidos recientes
							</h2>
							<p className="text-sm text-slate-400">
								Ver y administrar solicitudes de repuestos por prioridad.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<button
								type="button"
								className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
							>
								Filtrar activos
							</button>
							<button
								type="button"
								className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
							>
								Últimos 7 días
							</button>
						</div>
					</div>

					<div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70">
						{orders === undefined ? (
							<div className="p-8 text-center text-slate-400">
								Cargando pedidos...
							</div>
						) : orders.length === 0 ? (
							<div className="p-8 text-center text-slate-300">
								<p className="mb-4 text-lg font-semibold text-white">
									No hay pedidos en Convex aún.
								</p>
								<button
									type="button"
									onClick={handleSeedOrders}
									disabled={isSeeding}
									className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSeeding
										? "Cargando datos..."
										: "Cargar pedidos de ejemplo"}
								</button>
							</div>
						) : (
							<table className="min-w-full divide-y divide-slate-800 text-sm text-slate-300">
								<thead className="bg-slate-900">
									<tr>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											ID pedido
										</th>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											Material
										</th>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											Sector
										</th>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											Cantidad
										</th>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											Estado
										</th>
										<th className="px-4 py-4 text-left font-medium text-slate-400">
											ETA
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-800 bg-slate-950">
									{orders.map((order) => (
										<tr
											key={order._id}
											className="transition hover:bg-slate-900/80"
										>
											<td className="px-4 py-4 font-semibold text-white">
												{order.orderNumber}
											</td>
											<td className="px-4 py-4">{order.item}</td>
											<td className="px-4 py-4">{order.sector}</td>
											<td className="px-4 py-4">{order.quantity}</td>
											<td className="px-4 py-4">
												<span
													className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
														statusClasses[
															order.status as keyof typeof statusClasses
														] ?? "bg-slate-700/40 text-slate-200"
													}`}
												>
													{order.status === "Aprobada" ? (
														<CheckCircle2 className="h-3.5 w-3.5" />
													) : order.status === "Pendiente" ? (
														<Circle className="h-3.5 w-3.5" />
													) : (
														<AlertTriangle className="h-3.5 w-3.5" />
													)}
													{order.status}
												</span>
											</td>
											<td className="px-4 py-4">{order.eta}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>

				<aside className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20">
					<div className="space-y-2">
						<h2 className="text-xl font-semibold text-white">Resumen rápido</h2>
						<p className="text-sm text-slate-400">
							Decisiones sobre stocks, aprobaciones y reservas para el sector de
							depósito.
						</p>
					</div>

					<div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
						<p className="text-sm uppercase tracking-[0.18em] text-slate-500">
							Repuestos en alerta
						</p>
						<div className="mt-4 space-y-4">
							<div className="rounded-3xl bg-slate-900/90 p-4">
								<p className="text-sm text-slate-300">Filtros hidráulicos</p>
								<p className="mt-1 text-lg font-semibold text-white">
									Stock 12 unidades
								</p>
							</div>
							<div className="rounded-3xl bg-slate-900/90 p-4">
								<p className="text-sm text-slate-300">Correas de transmisión</p>
								<p className="mt-1 text-lg font-semibold text-white">
									Stock 18 unidades
								</p>
							</div>
							<div className="rounded-3xl bg-slate-900/90 p-4">
								<p className="text-sm text-slate-300">Rodamientos 6206</p>
								<p className="mt-1 text-lg font-semibold text-white">
									Stock 9 unidades
								</p>
							</div>
						</div>
					</div>

					<div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
						<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
							Acciones
						</h3>
						<div className="mt-4 space-y-3">
							<button
								type="button"
								className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
							>
								Aprobar pedidos urgentes
							</button>
							<button
								type="button"
								className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
							>
								Generar orden de compra
							</button>
							<button
								type="button"
								className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
							>
								Cancelar solicitud
								<Trash2 className="ml-2 inline-block h-4 w-4" />
							</button>
						</div>
					</div>
				</aside>
			</section>
		</div>
	);
}
