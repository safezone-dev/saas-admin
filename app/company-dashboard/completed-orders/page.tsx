"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  CheckCircle2,
  ArrowLeft,
  Eye,
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

    const { data, error } =
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

    if (error) {

      console.log(error);

    }

    if (data) {

      setOrders(data);

    }

    setLoading(false);
  }

  function getReviewLink(
    order: any
  ) {
  
    const service =
      order?.service_types
        ?.name;
  
    if (
      service ===
      "Monitoreo de Roedores"
    ) {
      return `/company-dashboard/review/rodents/${order.id}`;
    }
  
    if (
      service ===
      "Monitoreo de Polilleros"
    ) {
      return `/company-dashboard/review/moths/${order.id}`;
    }
  
    if (
      service ===
      "Monitoreo de Insectos Voladores"
    ) {
      return `/company-dashboard/review/flying/${order.id}`;
    }
  
    if (
      service ===
      "Monitoreo de Moscas"
    ) {
      return `/company-dashboard/review/flies/${order.id}`;
    }
  
    if (
      service ===
      "Monitoreo de Insectos Rastreros"
    ) {
      return `/company-dashboard/review/crawling/${order.id}`;
    }
  
    if (
      service ===
      "Hoja de Servicio"
    ) {
      return `/company-dashboard/review/service-sheet/${order.id}`;
    }

    if (
      service ===
      "Administración de Plaguicidas"
      ||
      service ===
      "Administracion de Plaguicidas"
      ||
      service ===
      "administración de plaguicidas"
      ||
      service ===
      "administracion de plaguicidas"
    ) {
      return `/company-dashboard/review/pesticides/${order.id}`;
    }
  
    return "#";
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 lg:p-5">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}
          <div>

            <h1 className="text-3xl font-bold text-gray-900">

              Órdenes Respondidas

            </h1>

            <p className="mt-1 text-sm text-gray-500">

              Historial de actividades completadas

            </p>

          </div>

          {/* BUTTON */}
          <Link
            href="/company-dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >

            <ArrowLeft size={16} />

            Regresar Dashboard

          </Link>

        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full table-auto">

              {/* HEAD */}
              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="min-w-[240px] px-4 py-3">

                    Empresa

                  </th>

                  <th className="min-w-[240px] px-4 py-3">

                    Servicio

                  </th>

                  <th className="min-w-[160px] px-4 py-3">

                    Fecha

                  </th>

                  <th className="min-w-[120px] px-4 py-3">

                    Estado

                  </th>

                  <th className="min-w-[180px] px-4 py-3 text-center">

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
                      className="px-4 py-10 text-center text-sm text-gray-500"
                    >

                      No hay órdenes respondidas

                    </td>

                  </tr>
                )}

                {orders.map(
                  (order: any) => (

                    <tr
                      key={order.id}
                      className="border-t border-gray-100 text-sm transition hover:bg-gray-50"
                    >

                      {/* EMPRESA */}
                      <td className="px-4 py-4 align-top">

                        <div className="font-semibold text-gray-900">

                          {
                            order.companies
                              ?.company_name
                          }

                        </div>

                      </td>

                      {/* SERVICIO */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {
                          order.service_types
                            ?.name
                        }

                      </td>

                      {/* FECHA */}
                      <td className="px-4 py-4 align-top text-gray-700">

                        {
                          order.scheduled_date
                        }

                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 align-top">

                        <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                          Respondido

                        </span>

                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4 align-top text-center">

                      <Link
  href={getReviewLink(order)}
  className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
>

  <Eye size={14} />

  Revisar

</Link>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}