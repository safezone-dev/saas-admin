"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function MothsReviewPage() {

  const params = useParams();

  const workOrderId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [workOrder, setWorkOrder] =
    useState<any>(null);

  const [records, setRecords] =
    useState<any[]>([]);

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

      if (orderData) {

        setWorkOrder(
          orderData
        );

      }

      const {
        data,
        error,
      } = await supabase
        .from(
          "monitoreo_polilleros"
        )
        .select("*")
        .eq(
          "orden_trabajo_id",
          workOrderId
        )
        .order(
          "numero_estacion",
          {
            ascending: true,
          }
        );

      console.log(
        "WORK ORDER ID:",
        workOrderId
      );

      console.log(
        "POLILLEROS:",
        data
      );

      console.log(
        "ERROR:",
        error
      );

      setRecords(
        data || []
      );

    } catch (error) {

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

              Monitoreo de Polilleros

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
              workOrder?.companies
                ?.company_name ||
              "-"
            }
          />

          <InfoCard
            title="Técnico"
            value={
              workOrder?.technicians
                ?.name ||
              "-"
            }
          />

          <InfoCard
            title="Servicio"
            value={
              workOrder?.service_types
                ?.name ||
              "-"
            }
          />

          <InfoCard
            title="Fecha"
            value={
              workOrder?.scheduled_date ||
              "-"
            }
          />

          <InfoCard
            title="Estado"
            value={
              workOrder?.status ||
              "-"
            }
          />

        </div>

        <div className="mb-4 rounded-xl bg-blue-50 p-4">

          Registros encontrados:
          {" "}
          {records.length}

        </div>

        {/* TABLA */}

        <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-4 py-3 text-left">
                    Estación
                  </th>

                  <th className="px-4 py-3 text-left">
                    Fecha
                  </th>

                  <th className="px-4 py-3 text-left">
                    Hora Inicio
                  </th>

                  <th className="px-4 py-3 text-left">
                    Hora Final
                  </th>

                  <th className="px-4 py-3 text-left">
                    Frecuencia
                  </th>

                  <th className="px-4 py-3 text-left">
                    Conteo
                  </th>

                  <th className="px-4 py-3 text-left">
                    Feromona
                  </th>

                  <th className="px-4 py-3 text-left">
                    Dispositivo
                  </th>

                  <th className="px-4 py-3 text-left">
                    Mantenimiento
                  </th>

                  <th className="px-4 py-3 text-left">
                    Observaciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {records.length === 0 && (

                  <tr>

                    <td
                      colSpan={10}
                      className="p-8 text-center"
                    >

                      No hay registros

                    </td>

                  </tr>

                )}

                {records.map(
                  (
                    item: any,
                    index: number
                  ) => (

                    <tr
                      key={index}
                      className="border-t"
                    >

                      <td className="px-4 py-3">

                        {item.numero_estacion}

                      </td>

                      <td className="px-4 py-3">

                        {item.fecha_registro}

                      </td>

                      <td className="px-4 py-3">

                        {item.hora_inicio}

                      </td>

                      <td className="px-4 py-3">

                        {item.hora_final}

                      </td>

                      <td className="px-4 py-3">

                        {item.frecuencia}

                      </td>

                      <td className="px-4 py-3">

                        {
                          item.conteo_insectos_voladores
                        }

                      </td>

                      <td className="px-4 py-3">

                        {item.feromona_aplica
                          ? "Aplicada"
                          : "No aplica"}

                      </td>

                      <td className="px-4 py-3">

                        {item.dispositivo_funcional
                          ? "Funcional"
                          : item.dispositivo_danado
                          ? "Dañado"
                          : "-"}

                      </td>

                      <td className="px-4 py-3">

                        {item.mantenimiento_aplica
                          ? "Sí"
                          : "No"}

                      </td>

                      <td className="px-4 py-3">

                        {item.observaciones ||
                          "-"}

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