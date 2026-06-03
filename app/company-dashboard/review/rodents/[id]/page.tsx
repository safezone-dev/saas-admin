"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
} from "lucide-react";

export default function RodentReviewPage() {

  const params =
    useParams();

  const workOrderId =
    params.id as string;

  const [loading,
    setLoading] =
    useState(true);

  const [workOrder,
    setWorkOrder] =
    useState<any>(null);

  const [formData,
    setFormData] =
    useState<any>(null);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      const {
        data: orderData,
      } = await supabase
        .from("work_orders")
        .select(`
          *,
          companies (
            company_name
          ),
          technicians (
            name
          ),
          service_types (
            name
          )
        `)
        .eq(
          "id",
          workOrderId
        )
        .single();

      if (
        orderData
      ) {

        setWorkOrder(
          orderData
        );
      }

      const {
        data,
      } = await supabase
        .from(
          "rodent_monitoring_forms"
        )
        .select("*")
        .eq(
          "work_order_id",
          workOrderId
        )
        .single();

      if (
        data
      ) {

        setFormData(
          data
        );
      }

    } catch (
      error
    ) {

      console.log(
        error
      );

    } finally {

      setLoading(
        false
      );

    }
  }

  if (loading) {

    return (
      <div className="p-8">

        Cargando...

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-6">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">

              Monitoreo de Roedores

            </h1>

            <p className="text-sm text-gray-500">

              Información registrada por el técnico

            </p>

          </div>

          <Link
            href="/company-dashboard/completed-orders"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm"
          >

            <ArrowLeft
              size={16}
            />

            Regresar

          </Link>

        </div>

        {/* DATOS ORDEN */}

        <div className="mb-6 grid gap-4 md:grid-cols-5">

          <InfoCard
            title="Empresa"
            value={
              workOrder
                ?.companies
                ?.company_name ||
              "-"
            }
          />

          <InfoCard
            title="Técnico"
            value={
              workOrder
                ?.technicians
                ?.name ||
              "-"
            }
          />

          <InfoCard
            title="Servicio"
            value={
              workOrder
                ?.service_types
                ?.name ||
              "-"
            }
          />

          <InfoCard
            title="Fecha"
            value={
              workOrder
                ?.scheduled_date ||
              "-"
            }
          />

          <InfoCard
            title="Estado"
            value={
              workOrder
                ?.status ||
              "-"
            }
          />

        </div>

        {/* DATOS GENERALES */}

        <div className="mb-6 grid gap-4 md:grid-cols-5">

          <InfoCard
            title="Fecha Registro"
            value={
              formData
                ?.register_date ||
              "-"
            }
          />

          <InfoCard
            title="Hora Inicio"
            value={
              formData
                ?.start_time ||
              "-"
            }
          />

          <InfoCard
            title="Hora Final"
            value={
              formData
                ?.end_time ||
              "-"
            }
          />

          <InfoCard
            title="Sin Actividad"
            value={
              formData
                ?.no_activity
                ? "Sí"
                : "No"
            }
          />

          <InfoCard
            title="Actividad Detectada"
            value={
              formData
                ?.activity_detected
                ? "Sí"
                : "No"
            }
          />

        </div>

        {/* ESTACIONES */}

        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left">

                    Estación

                  </th>

                  <th className="px-4 py-3 text-left">

                    Presencia

                  </th>

                  <th className="px-4 py-3 text-left">

                    Rodenticida

                  </th>

                  <th className="px-4 py-3 text-left">

                    Consumo

                  </th>

                  <th className="px-4 py-3 text-left">

                    Adhesivo

                  </th>

                  <th className="px-4 py-3 text-left">

                    Limpieza

                  </th>

                  <th className="px-4 py-3 text-left">

                    Observaciones

                  </th>

                </tr>

              </thead>

              <tbody>

                {formData?.stations?.map(
                  (
                    station: any,
                    index: number
                  ) => (

                    <tr
                      key={index}
                      className="border-t"
                    >

                      <td className="px-4 py-3">

                        {
                          station.station_number
                        }

                      </td>

                      <td className="px-4 py-3">

                        {station.rodent_present
                          ? "Presente"
                          : "No presente"}

                      </td>

                      <td className="px-4 py-3">

                        {station.bait_applied
                          ? "Aplicado"
                          : "No aplicado"}

                      </td>

                      <td className="px-4 py-3">

                        {station.total_consumption
                          ? "Total"
                          : station.partial_consumption
                          ? "Parcial"
                          : "-"}

                      </td>

                      <td className="px-4 py-3">

                        {station.adhesive_functional
                          ? "Funcional"
                          : station.adhesive_replaced
                          ? "Reemplazado"
                          : "-"}

                      </td>

                      <td className="px-4 py-3">

                        {station.cleaning
                          ? "Sí"
                          : "No"}

                      </td>

                      <td className="px-4 py-3">

                        {
                          station.observations
                        }

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

function InfoCard({
  title,
  value,
}: any) {

  return (

    <div className="rounded-xl bg-white p-4 shadow-sm">

      <p className="text-xs uppercase text-gray-500">

        {title}

      </p>

      <p className="mt-2 font-semibold">

        {value}

      </p>

    </div>

  );
}