"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function CompletedOrdersPage() {

  const [orders,
    setOrders] =
    useState<any[]>([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {

    const technicianData =
      localStorage.getItem(
        "technician"
      );

    if (!technicianData) {
      setLoading(false);
      return;
    }

    const technician =
      JSON.parse(
        technicianData
      );

    const { data } =
      await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          service_types (
            name
          )
        `)
        .eq(
          "technician_id",
          technician.id
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

    if (data) {
      setOrders(data);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">

      {/* HEADER */}
      <div className="mb-6 rounded-[24px] bg-white p-5 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-green-100 p-4">

              <CheckCircle2
                size={22}
                className="text-green-700"
              />

            </div>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Órdenes Respondidas
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Historial de actividades completadas
              </p>

            </div>

          </div>

          {/* BACK */}
          <a
            href="/company-dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
          >

            <ArrowLeft size={16} />

            Regresar Dashboard

          </a>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            {/* HEAD */}
            <thead className="bg-gray-50">

              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">

                <th className="px-4 py-3">
                  Empresa
                </th>

                <th className="px-4 py-3">
                  Servicio
                </th>

                <th className="px-4 py-3">
                  Fecha
                </th>

                <th className="px-4 py-3">
                  Estado
                </th>

                <th className="px-4 py-3 text-center">
                  Acción
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {!loading &&
                orders.length === 0 && (
                <tr>

                  <td
                    colSpan={5}
                    className="p-8 text-center text-xs text-gray-500"
                  >
                    No hay órdenes respondidas
                  </td>

                </tr>
              )}

              {orders.map(
                (order: any) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 text-sm hover:bg-gray-50"
                  >

                    {/* EMPRESA */}
                    <td className="px-4 py-4 font-medium text-gray-900">

                      {
                        order.companies
                          ?.company_name
                      }

                    </td>

                    {/* SERVICIO */}
                    <td className="px-4 py-4 text-gray-600">

                      {
                        order.service_types
                          ?.name
                      }

                    </td>

                    {/* FECHA */}
                    <td className="px-4 py-4 text-gray-600">

                      {
                        order.scheduled_date
                      }

                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-4">

                      <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-700">
                        Respondido
                      </span>

                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-4 text-center">

                      <a
                        href={`/company-dashboard/review/${order.id}`}
                        className="inline-flex rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold text-white"
                      >
                        Revisar
                      </a>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}