"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

import {
  ClipboardList,
} from "lucide-react";

export default function ClientOrdersPage() {

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

    const client =
      JSON.parse(
        localStorage.getItem(
          "client"
        ) || "{}"
      );

    if (!client?.id) {

      setLoading(false);

      return;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "work_orders"
        )
        .select(`
          *,
          service_types (
            name
          ),
          technicians (
            name
          )
        `)
        .eq(
          "company_id",
          client.id
        )
        .order(
          "scheduled_date",
          {
            ascending: false,
          }
        );

    setLoading(false);

    if (error) {

      console.log(error);

      return;
    }

    setOrders(
      data || []
    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <ClipboardList
            size={28}
          />

          <div>

            <h1 className="text-2xl font-bold text-gray-900">

              Órdenes de Servicio

            </h1>

            <p className="text-sm text-gray-500">

              Historial de servicios programados

            </p>

          </div>

        </div>

      </div>

      {/* EMPTY */}
      {!loading &&
        orders.length === 0 && (

        <div className="rounded-[24px] bg-white p-10 text-center shadow-sm">

          <h2 className="text-xl font-bold">

            No existen órdenes registradas

          </h2>

        </div>

      )}

      {/* TABLE */}
      {orders.length > 0 && (

        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                  <th className="px-4 py-3">

                    Fecha

                  </th>

                  <th className="px-4 py-3">

                    Servicio

                  </th>

                  <th className="px-4 py-3">

                    Técnico

                  </th>

                  <th className="px-4 py-3">

                    Estado

                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-4 py-4">

                        {
                          order.scheduled_date
                        }

                      </td>

                      <td className="px-4 py-4">

                        {
                          order
                            .service_types
                            ?.name
                        }

                      </td>

                      <td className="px-4 py-4">

                        {
                          order
                            .technicians
                            ?.name ||
                          "-"
                        }

                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                            order.status ===
                            "completed"

                              ? "bg-green-100 text-green-700"

                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {order.status ===
                          "completed"

                            ? "Completada"

                            : "Pendiente"}

                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );
}