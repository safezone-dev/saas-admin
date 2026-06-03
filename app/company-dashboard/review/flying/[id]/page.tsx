"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FlyingReviewPage() {

  const params = useParams();

  const workOrderId =
    params.id as string;

  const [loading,
    setLoading] =
    useState(true);

  const [workOrder,
    setWorkOrder] =
    useState<any>(null);

  const [monitor,
    setMonitor] =
    useState<any>(null);

  const [stations,
    setStations] =
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

      setWorkOrder(
        orderData
      );

      const {
        data: monitorData,
      } = await supabase
        .from(
          "monitoreo_insectos_voladores"
        )
        .select("*")
        .eq(
          "orden_trabajo_id",
          workOrderId
        )
        .single();

      if (
        monitorData
      ) {

        setMonitor(
          monitorData
        );

        const {
          data:
            stationsData,
        } = await supabase
          .from(
            "monitoreo_insectos_estaciones"
          )
          .select("*")
          .eq(
            "monitoreo_id",
            monitorData.id
          );

        setStations(
          stationsData || []
        );

      }

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

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">

              Monitoreo de Insectos Voladores

            </h1>

            <p className="text-sm text-gray-500">

              Información registrada por el técnico

            </p>

          </div>

          <Link
            href="/company-dashboard/completed-orders"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm"
          >

            <ArrowLeft size={16} />

            Regresar

          </Link>

        </div>

        {/* DATOS ORDEN */}

        <div className="mb-6 grid gap-4 md:grid-cols-5">

          <InfoCard
            title="Empresa"
            value={
              workOrder?.companies
                ?.company_name || "-"
            }
          />

          <InfoCard
            title="Técnico"
            value={
              workOrder?.technicians
                ?.name || "-"
            }
          />

          <InfoCard
            title="Servicio"
            value={
              workOrder?.service_types
                ?.name || "-"
            }
          />

          <InfoCard
            title="Fecha"
            value={
              workOrder?.scheduled_date || "-"
            }
          />

          <InfoCard
            title="Estado"
            value={
              workOrder?.status || "-"
            }
          />

        </div>

        {/* DATOS GENERALES */}

        <div className="mb-6 grid gap-4 md:grid-cols-4 lg:grid-cols-4">

          <InfoCard
            title="Fecha Aplicación"
            value={
              monitor?.fecha_aplicacion || "-"
            }
          />

          <InfoCard
            title="Hora Inicio"
            value={
              monitor?.hora_inicio || "-"
            }
          />

          <InfoCard
            title="Hora Final"
            value={
              monitor?.hora_final || "-"
            }
          />

          <InfoCard
            title="Frecuencia"
            value={
              monitor?.frecuencia || "-"
            }
          />

          <InfoCard
            title="Limpieza Equipo"
            value={
              monitor?.limpieza_equipo
                ? "Sí"
                : "No"
            }
          />

          <InfoCard
            title="Funcionamiento"
            value={
              monitor?.funcionamiento
                ? "Sí"
                : "No"
            }
          />

          <InfoCard
            title="Estado Bulbo"
            value={
              monitor?.estado_bulbo || "-"
            }
          />

          <InfoCard
            title="Cambio Adhesivo"
            value={
              monitor?.cambio_adhesivo
                ? "Sí"
                : "No"
            }
          />

          <InfoCard
            title="Conexión Eléctrica"
            value={
              monitor?.conexion_electrica || "-"
            }
          />

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
                    Palomilla
                  </th>

                  <th className="px-4 py-3 text-left">
                    Mosca Metálica
                  </th>

                  <th className="px-4 py-3 text-left">
                    Mosca Doméstica
                  </th>

                  <th className="px-4 py-3 text-left">
                    Mosca Fruta
                  </th>

                  <th className="px-4 py-3 text-left">
                    Mosquitos
                  </th>

                  <th className="px-4 py-3 text-left">
                    Escarabajos
                  </th>

                  <th className="px-4 py-3 text-left">
                    Hormigas Alas
                  </th>

                  <th className="px-4 py-3 text-left">
                    Observaciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {stations.length === 0 && (

                  <tr>

                    <td
                      colSpan={9}
                      className="p-8 text-center"
                    >

                      No hay registros

                    </td>

                  </tr>

                )}

                {stations.map(
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
                          station.numero_estacion
                        }
                      </td>

                      <td className="px-4 py-3">
                        {station.palomilla}
                      </td>

                      <td className="px-4 py-3">
                        {station.mosca_metalica}
                      </td>

                      <td className="px-4 py-3">
                        {station.mosca_domestica}
                      </td>

                      <td className="px-4 py-3">
                        {station.mosca_fruta}
                      </td>

                      <td className="px-4 py-3">
                        {station.mosquitos}
                      </td>

                      <td className="px-4 py-3">
                        {station.escarabajos}
                      </td>

                      <td className="px-4 py-3">
                        {station.hormigas_alas}
                      </td>

                      <td className="px-4 py-3">
                        {
                          station.observaciones
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