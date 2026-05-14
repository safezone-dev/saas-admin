"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  Clock,
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  FileCheck,
  LogOut,
  CheckCircle,
} from "lucide-react";

export default function ClientPendingOrdersPage() {

  const router = useRouter();

  const [client, setClient] =
    useState<any>(null);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [sidebarOpen,
    setSidebarOpen] =
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
          )
        `)
        .eq(
          "company_id",
          companyId
        )
        .neq(
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
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10"
          >

            <LayoutDashboard size={18} />

            Dashboard

          </Link>

          <Link
            href="/client-dashboard/pending-orders"
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"
          >

            <Clock size={18} />

            Órdenes Pendientes

          </Link>

          <Link
            href="/client-dashboard/completed-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10"
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
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm lg:px-6">

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

                Órdenes pendientes

              </h1>

              <p className="text-xs text-gray-500">

              Órdenes realizadas

              </p>

            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="p-4 lg:p-6">

          {/* BACK */}
          <Link
            href="/client-dashboard"
            className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold shadow-sm"
          >

            <ArrowLeft size={16} />

            Volver al Dashboard

          </Link>

          {/* TABLE */}
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

            <div className="border-b border-gray-100 p-4">

              <h2 className="text-sm font-bold text-gray-900">

                Lista de Órdenes Pendientes

              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

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

                          <span className="rounded-xl bg-yellow-100 px-3 py-1 text-[11px] font-semibold text-yellow-700">

                            {
                              order.status
                            }

                          </span>

                        </td>

                        <td className="p-3">

                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}

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

    </div>
  );
}