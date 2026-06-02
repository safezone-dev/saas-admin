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

    const { data: orderData } =
      await supabase
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
  
    if (!orderData) return;
  
    setWorkOrder(orderData);
  
    const serviceName =
      orderData?.service_types?.name || "";
  
    setServiceType(serviceName);
  
    let tableName = "";
    let fieldName = "";
  
    switch (serviceName) {
  
      case "Monitoreo de Roedores":
        tableName =
          "rodent_monitoring_forms";
        fieldName =
          "work_order_id";
        break;
  
      case "Monitoreo de Polilleros":
        tableName =
          "monitoreo_polilleros";
        fieldName =
          "orden_trabajo_id";
        break;
  
      case "Monitoreo de Insectos Voladores":
        tableName =
          "monitoreo_insectos_voladores";
        fieldName =
          "orden_trabajo_id";
        break;
  
      case "Monitoreo de Moscas":
        tableName =
          "monitoreo_moscas";
        fieldName =
          "orden_trabajo_id";
        break;
  
      case "Monitoreo de Insectos Rastreros":
        tableName =
          "monitoreo_insectos_rastreros";
        fieldName =
          "orden_trabajo_id";
        break;
  
      case "Hoja de Servicio":
        tableName =
          "service_sheets";
        fieldName =
          "work_order_id";
        break;
  
      default:
        return;
    }
  
    const {
      data,
      error,
    } = await supabase
      .from(tableName)
      .select("*")
      .eq(
        fieldName,
        workOrderId
      );
  
    console.log(
      tableName,
      data,
      error
    );
  
    setFormData(data);
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

        {!formData ||
formData.length === 0 ? (

  <div className="rounded-2xl bg-yellow-50 p-4 text-sm text-yellow-700">

    No se encontraron datos registrados.

  </div>

) : (

  <div className="space-y-6">

    {formData.map(
      (
        item: any,
        index: number
      ) => (

        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-200"
        >

          <div className="border-b bg-gray-50 px-4 py-3 font-semibold">

            Registro #{index + 1}

          </div>

          <table className="w-full">

            <tbody>

              {Object.entries(
                item
              ).map(
                ([
                  key,
                  value,
                ]) => (

                  <tr
                    key={key}
                    className="border-b border-gray-100"
                  >

                    <td className="w-[300px] bg-gray-50 px-4 py-3 font-semibold capitalize">

                      {key.replaceAll(
                        "_",
                        " "
                      )}

                    </td>

                    <td className="px-4 py-3">

                      {typeof value ===
                      "object"

                        ? (
                          <pre className="whitespace-pre-wrap text-sm">
                            {JSON.stringify(
                              value,
                              null,
                              2
                            )}
                          </pre>
                        )

                        : String(
                            value ??
                              "-"
                          )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )
    )}

  </div>

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