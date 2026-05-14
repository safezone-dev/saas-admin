"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  Building2,
  ClipboardList,
  CheckCircle,
  Clock,
  LogOut,
  LayoutDashboard,
  FileCheck,
  Menu,
  X,
} from "lucide-react";

export default function ClientDashboardPage() {

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

    const { data, error } =
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
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {

      console.log(error);

      return;
    }

    console.log(data);

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

  const pending =
    orders.filter(
      (item) =>
        item.status !==
        "completed"
    );

  const completed =
    orders.filter(
      (item) =>
        item.status ===
        "completed"
    );

  function getServiceName(
    order: any
  ) {

    return (
      order.service_name ||
      order.service ||
      order.service_type ||
      order.title ||
      order.type ||
      "Servicio General"
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
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

        {/* LOGO */}
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
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm"
          >

            <LayoutDashboard size={18} />

            Dashboard

          </Link>

          <Link
            href="/client-dashboard/pending-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10"
          >

            <ClipboardList size={18} />

            Órdenes pendientes

          </Link>

          <Link
            href="/client-dashboard/completed-orders"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition hover:bg-white/10"
          >

            <ClipboardList size={18} />

            Órdenes realizadas
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

                {client?.company_name}

              </h1>

              <p className="text-xs text-gray-500">

                Dashboard empresarial

              </p>

            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="p-4 lg:p-6">

          {/* COMPANY INFO */}
          <div className="mb-6 rounded-[28px] bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center gap-3">

              <div className="rounded-2xl bg-blue-100 p-3">

                <Building2
                  size={22}
                  className="text-blue-700"
                />

              </div>

              <div>

                <h2 className="text-lg font-bold text-gray-900">

                  Información Empresa

                </h2>

                <p className="text-xs text-gray-500">

                  Datos generales registrados

                </p>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <InfoCard
                title="Empresa"
                value={
                  client?.company_name ||
                  "-"
                }
              />

              <InfoCard
                title="Responsable"
                value={
                  client?.responsible_name ||
                  "-"
                }
              />

              <InfoCard
                title="Teléfono"
                value={
                  client?.company_phone ||
                  "-"
                }
              />

              <InfoCard
                title="WhatsApp"
                value={
                  client?.company_whatsapp ||
                  "-"
                }
              />

              <InfoCard
                title="Correo"
                value={
                  client?.company_email ||
                  "-"
                }
              />

              <InfoCard
                title="Cantón"
                value={
                  client?.canton ||
                  "-"
                }
              />

              <InfoCard
                title="Cédula Jurídica"
                value={
                  client?.juridical_id ||
                  "-"
                }
              />

              <InfoCard
                title="Dirección"
                value={
                  client?.address ||
                  "-"
                }
              />

            </div>

          </div>

          {/* METRICS */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <Card
              title="Total órdenes"
              value={orders.length}
              icon={
                <ClipboardList
                  size={20}
                />
              }
            />

            <Card
              title="Pendientes"
              value={pending.length}
              icon={
                <Clock size={20} />
              }
            />

            <Card
              title="Resueltas"
              value={completed.length}
              icon={
                <CheckCircle
                  size={20}
                />
              }
            />

            <Card
              title="Cantón"
              value={
                client?.canton ||
                "-"
              }
              icon={
                <Building2
                  size={20}
                />
              }
            />

          </div>

          {/* TABLE */}
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">

            <div className="border-b border-gray-100 p-4">

              <h2 className="text-sm font-bold text-gray-900">

                Órdenes de Servicio

              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1000px]">

                <thead className="bg-gray-50">

                  <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500">

                    <th className="p-3">
                      Servicio
                    </th>

                    <th className="p-3">
                      Técnico
                    </th>

                    <th className="p-3">
                      Teléfono Técnico
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

                          <span
                            className={`rounded-xl px-3 py-1 text-[11px] font-semibold ${
                              order.status ===
                              "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >

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

function Card({
  title,
  value,
  icon,
}: any) {

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">

          {title}

        </p>

        {icon}

      </div>

      <div className="mt-5">

        <h2 className="text-3xl font-bold text-gray-900">

          {value}

        </h2>

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: any) {

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">

        {title}

      </p>

      <p className="mt-2 break-words text-sm font-bold text-gray-900">

        {value}

      </p>

    </div>
  );
}