"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
} from "lucide-react";

export default function ReviewPage() {

  const params = useParams();

  const workOrderId =
    params.id as string;

  const [stations,
    setStations] =
    useState<any[]>([]);

  const [workOrder,
    setWorkOrder] =
    useState<any>(null);

  const [formData,
    setFormData] =
    useState<any>(null);

  const [serviceType,
    setServiceType] =
    useState("");

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    // WORK ORDER
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

      const serviceName =
        orderData?.service_types
          ?.name || "";

      setServiceType(
        serviceName
      );

      // ROEDORES
      if (
        serviceName ===
        "Monitoreo de Roedores"
      ) {

        const { data } =
          await supabase
            .from(
              "rodent_monitoring_forms"
            )
            .select("*")
            .eq(
              "work_order_id",
              workOrderId
            )
            .single();

        setFormData(data);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">

      {/* TOP */}
      <div className="mb-8 flex items-start justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Revisión Servicio
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Información operativa registrada
          </p>

        </div>

        <a
          href="/company-dashboard/completed-orders"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-100"
        >

          <ArrowLeft size={18} />

          Regresar

        </a>

      </div>

      {/* HEADER INFO */}
      <div className="mb-8 grid gap-4 rounded-[30px] bg-white p-6 shadow-sm md:grid-cols-2 lg:grid-cols-5">

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
              ?.name || "-"
          }
        />

        <InfoCard
          title="Servicio"
          value={
            serviceType || "-"
          }
        />

        <InfoCard
          title="Fecha Asignada"
          value={
            workOrder
              ?.scheduled_date ||
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

      {/* DATOS DEL FORMULARIO */}
      <div className="mb-8 rounded-[30px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-xl font-bold">
          Datos registrados por el técnico
        </h2>

        {!formData ? (

<div className="rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-700">

  No se encontraron datos registrados.

</div>

) : (

<>
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

    <InfoCard
      title="Fecha Registro"
      value={
        formData?.register_date || "-"
      }
    />

    <InfoCard
      title="Hora Inicio"
      value={
        formData?.start_time || "-"
      }
    />

    <InfoCard
      title="Hora Final"
      value={
        formData?.end_time || "-"
      }
    />

    <InfoCard
      title="Sin Actividad"
      value={
        formData?.no_activity
          ? "Sí"
          : "No"
      }
    />

    <InfoCard
      title="Actividad Detectada"
      value={
        formData?.activity_detected
          ? "Sí"
          : "No"
      }
    />

    <InfoCard
      title="Cantidad Estaciones"
      value={
        Array.isArray(
          formData?.stations
        )
          ? formData.stations.length
          : "0"
      }
    />

  </div>

  {Array.isArray(
    formData?.stations
  ) &&
    formData.stations.length > 0 && (

      <div className="mt-8 overflow-hidden rounded-[30px] border border-gray-200">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-600">

                <th className="px-4 py-4">
                  Estación
                </th>

                <th className="px-4 py-4">
                  Estado
                </th>

                <th className="px-4 py-4">
                  Observaciones
                </th>

              </tr>

            </thead>

            <tbody>

              {formData.stations.map(
                (
                  station: any,
                  index: number
                ) => (

                  <tr
                    key={index}
                    className="border-b border-gray-100"
                  >

                    <td className="px-4 py-4">

                      {station.station_number ||
                        station.numero_estacion ||
                        index + 1}

                    </td>

                    <td className="px-4 py-4">

                      {station.status ||
                        "-"}

                    </td>

                    <td className="px-4 py-4">

                      {station.observations ||
                        station.observacion ||
                        "-"}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    )}

</>

)}

      </div>

      {/* TABLA ORIGINAL */}
      <div className="overflow-hidden rounded-[30px] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-gray-50">

              <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-600">

                <th className="px-4 py-4">
                  Información
                </th>

                <th className="px-4 py-4">
                  Valor
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td className="px-4 py-4">
                  Tipo Servicio
                </td>

                <td className="px-4 py-4">
                  {serviceType}
                </td>

              </tr>

              <tr>

                <td className="px-4 py-4">
                  ID Orden
                </td>

                <td className="px-4 py-4">
                  {workOrderId}
                </td>

              </tr>

            </tbody>

          </table>

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
    <div className="rounded-2xl bg-gray-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}