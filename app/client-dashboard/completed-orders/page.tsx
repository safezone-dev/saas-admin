"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  CheckCircle,
  Eye,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
} from "lucide-react";

export default function ClientCompletedOrdersPage() {

  const router = useRouter();

  const [client, setClient] =
    useState<any>(null);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [selectedOrder,
    setSelectedOrder] =
    useState<any>(null);

  const [openModal,
    setOpenModal] =
    useState(false);

  useEffect(() => {

    const session =
      localStorage.getItem(
        "client"
      );

    if (!session) {

      router.push(
        "/client-login"
      );

      return;
    }

    const parsed =
      JSON.parse(session);

    setClient(parsed);

    loadOrders(parsed.id);

  }, []);

  async function loadOrders(
    companyId: string
  ) {

    const { data } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          technicians (
            name,
            phone
          ),
          rodent_forms (*)
        `)
        .eq(
          "company_id",
          companyId
        )
        .eq(
          "status",
          "completed"
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    setOrders(data || []);
  }

  function logout() {

    localStorage.removeItem(
      "client"
    );

    router.push(
      "/client-login"
    );
  }

  function getServiceName(
    order: any
  ) {

    return (
      order.service_name ||
      order.service ||
      order.service_type ||
      order.title ||
      "Servicio General"
    );
  }

  function openDetails(
    order: any
  ) {

    setSelectedOrder(order);

    setOpenModal(true);
  }

  function renderBoolean(
    value: boolean
  ) {

    if (value === true) {

      return (
        <div className="flex justify-center">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">

            ✓

          </div>

        </div>
      );
    }

    if (value === false) {

      return (
        <div className="flex justify-center">

          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">

            ✕

          </div>

        </div>
      );
    }

    return "-";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* OVERLAY */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col bg-black text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* HEADER */}
        <div className="border-b border-white/10 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-xl font-bold">
                Clientes
              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Portal empresarial
              </p>

            </div>

            <button
              className="lg:hidden"
              onClick={() =>
                setSidebarOpen(false)
              }
            >

              <X size={20} />

            </button>

          </div>

        </div>

        {/* MENU */}
        <div className="flex-1 space-y-2 p-4">

          <Link
            href="/client-dashboard"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
          >

            <LayoutDashboard size={18} />

            Dashboard

          </Link>

          <Link
            href="/client-dashboard/pending-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-white/10"
          >

            <Clock size={18} />

            Órdenes Pendientes

          </Link>

          <Link
            href="/client-dashboard/completed-orders"
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"
          >

            <CheckCircle size={18} />

            Órdenes Resueltas

          </Link>

        </div>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold"
          >

            <LogOut size={16} />

            Cerrar sesión

          </button>

        </div>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 lg:ml-[260px]">

        {/* TOPBAR */}
        <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-4 shadow-sm lg:px-6">

          <div className="flex items-center gap-3">

            <button
              className="lg:hidden"
              onClick={() =>
                setSidebarOpen(true)
              }
            >

              <Menu size={22} />

            </button>

            <div>

              <h1 className="text-lg font-bold text-gray-900">

                Órdenes Resueltas

              </h1>

              <p className="text-xs text-gray-500">

                Servicios finalizados

              </p>

            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="p-4 lg:p-6">

          {/* TABLE */}
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

            <div className="border-b border-gray-100 p-4">

              <h2 className="text-sm font-bold text-gray-900">

                Órdenes Completadas

              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px]">

                <thead className="bg-gray-50">

                  <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500">

                    <th className="p-3">
                      Servicio
                    </th>

                    <th className="p-3">
                      Técnico
                    </th>

                    <th className="p-3">
                      Teléfono
                    </th>

                    <th className="p-3">
                      Estado
                    </th>

                    <th className="p-3">
                      Fecha
                    </th>

                    <th className="p-3">
                      Acción
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map(
                    (order) => (

                      <tr
                        key={order.id}
                        className="border-t text-xs"
                      >

                        <td className="p-3 font-medium">

                          {
                            getServiceName(
                              order
                            )
                          }

                        </td>

                        <td className="p-3">

                          {
                            order.technicians
                              ?.name || "-"
                          }

                        </td>

                        <td className="p-3">

                          {
                            order.technicians
                              ?.phone || "-"
                          }

                        </td>

                        <td className="p-3">

                          <span className="rounded-xl bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">

                            Completado

                          </span>

                        </td>

                        <td className="p-3">

                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}

                        </td>

                        <td className="p-3">

                          <button
                            onClick={() =>
                              openDetails(
                                order
                              )
                            }
                            className="flex items-center gap-2 rounded-xl bg-blue-100 px-3 py-2 text-[11px] font-semibold text-blue-700"
                          >

                            <Eye size={14} />

                            Ver detalle

                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-8 text-center text-xs text-gray-500">

            Desarrollado por
            {" "}
            wiledwardmunoz

          </div>

        </div>

      </main>

      {/* MODAL */}
      {openModal && selectedOrder && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[95vh] w-full max-w-[98vw] overflow-y-auto rounded-[28px] bg-white p-6">

            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">

                  Detalle del Servicio

                </h2>

                <p className="mt-1 text-xs text-gray-500">

                  Información registrada por el técnico

                </p>

              </div>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm"
              >

                Cerrar

              </button>

            </div>

            {/* TABLA */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200">

              <table className="w-full min-w-[1400px] border-collapse">

                <thead className="bg-green-600 text-[11px] uppercase tracking-wide text-white">

                  <tr>

                    <th className="border border-green-700 px-4 py-4">
                      Estación
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Captura
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Rodenticida
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Evidencia
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Dispositivo
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Adhesivo
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Limpieza
                    </th>

                    <th className="border border-green-700 px-4 py-4">
                      Observaciones
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedOrder.rodent_forms?.map(
                    (
                      form: any,
                      index: number
                    ) => (

                      <tr
                        key={index}
                        className="bg-white text-xs"
                      >

                        {/* ESTACION */}
                        <td className="border px-4 py-4 font-semibold text-center">

                          {
                            form.station ||
                            form.station_number ||
                            form.station_name ||
                            "-"
                          }

                        </td>

                        {/* CAPTURA */}
                        <td className="border px-4 py-4">

                          <div className="space-y-2">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Presente
                              </span>

                              {renderBoolean(
                                form.present ||
                                form.rodent_present
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                No presente
                              </span>

                              {renderBoolean(
                                form.not_present ||
                                form.rodent_not_present
                              )}

                            </div>

                          </div>

                        </td>

                        {/* RODENTICIDA */}
                        <td className="border px-4 py-4">

                          <div className="space-y-2">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Aplicado
                              </span>

                              {renderBoolean(
                                form.applied ||
                                form.rodenticide_applied
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                No aplicado
                              </span>

                              {renderBoolean(
                                form.not_applied ||
                                form.rodenticide_not_applied
                              )}

                            </div>

                          </div>

                        </td>

                        {/* EVIDENCIA */}
                        <td className="border px-4 py-4">

                          <div className="space-y-2">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Consumo total
                              </span>

                              {renderBoolean(
                                form.total_consumption ||
                                form.consumption_total
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Consumo parcial
                              </span>

                              {renderBoolean(
                                form.partial_consumption ||
                                form.consumption_partial
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Deterioro
                              </span>

                              {renderBoolean(
                                form.deteriorated ||
                                form.damage
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Sin hallazgo
                              </span>

                              {renderBoolean(
                                form.no_findings ||
                                form.without_findings
                              )}

                            </div>

                          </div>

                        </td>

                        {/* DISPOSITIVO */}
                        <td className="border px-4 py-4">

                          <div className="space-y-2">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Funcional
                              </span>

                              {renderBoolean(
                                form.functional ||
                                form.device_functional
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Dañado
                              </span>

                              {renderBoolean(
                                form.damaged ||
                                form.device_damaged
                              )}

                            </div>

                          </div>

                        </td>

                        {/* ADHESIVO */}
                        <td className="border px-4 py-4">

                          <div className="space-y-2">

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Funcional
                              </span>

                              {renderBoolean(
                                form.adhesive_functional
                              )}

                            </div>

                            <div className="flex items-center justify-between gap-2">

                              <span className="text-[11px]">
                                Reemplazo
                              </span>

                              {renderBoolean(
                                form.adhesive_replacement ||
                                form.replacement
                              )}

                            </div>

                          </div>

                        </td>

                        {/* LIMPIEZA */}
                        <td className="border px-4 py-4 text-center">

                          {renderBoolean(
                            form.cleaning
                          )}

                        </td>

                        {/* OBSERVACIONES */}
                        <td className="border px-4 py-4">

                          <div className="max-w-[250px] whitespace-pre-wrap text-[11px]">

                            {
                              form.observations ||
                              form.notes ||
                              "-"
                            }

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}