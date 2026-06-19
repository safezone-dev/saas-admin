"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "@/lib/supabase";

import {
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function TechnicalReport({
  workOrder,
}: any) {

  const [report,
    setReport] =
    useState<any>(null);

  useEffect(() => {

    loadReport();

  }, []);

  async function loadReport() {

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "technical_service_reports"
        )
        .select("*")
        .eq(
          "work_order_id",
          workOrder.id
        )
        .single();

    if (error) {

      console.log(error);

      return;
    }

    setReport(data);
  }

  if (!report) {

    return (

      <div className="rounded-[24px] bg-white p-10 shadow-sm">

        Cargando reporte técnico...

      </div>

    );
  }

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">

            <FileText size={28} />

          </div>

          <div>

            <h1 className="text-2xl font-bold">

              Reporte de Servicio Técnico

            </h1>

            <p className="text-gray-500">

              {workOrder.technicians?.name}

            </p>

          </div>

        </div>

      </div>

      {/* INFORMACIÓN GENERAL */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-5 text-lg font-bold">

          Información General

        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <InfoField
            label="Fecha"
            value={
              report.service_date
            }
          />

          <InfoField
            label="Hora inicio"
            value={
              report.start_time
            }
          />

          <InfoField
            label="Hora final"
            value={
              report.end_time
            }
          />

          <InfoField
            label="Frecuencia"
            value={
              report.frequency
            }
          />

        </div>

      </div>

      {/* ACTIVIDADES */}
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm">

        <div className="border-b p-6">

          <h2 className="text-lg font-bold">

            Actividades Realizadas

          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">

                <th className="px-4 py-3">

                  Producto

                </th>

                <th className="px-4 py-3">

                  Área

                </th>

                <th className="px-4 py-3">

                  Área tratada

                </th>

                <th className="px-4 py-3">

                  Dosis

                </th>

                <th className="px-4 py-3">

                  Plaga

                </th>

                <th className="px-4 py-3">

                  Método

                </th>

              </tr>

            </thead>

            <tbody>

              {report.items?.map(
                (
                  item: any,
                  index: number
                ) => (

                  <tr
                    key={index}
                    className="border-t"
                  >

                    <td className="px-4 py-4">

                      {
                        item.product_used
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        item.area
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        item.treated_area
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        item.dosage
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        item.observed_pest
                      }

                    </td>

                    <td className="px-4 py-4">

                      {
                        item.application_method
                      }

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* OBSERVACIONES */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-bold">

          Observaciones Generales

        </h2>

        <p className="text-gray-700">

          {
            report.general_observations ||
            "-"
          }

        </p>

      </div>

      {/* NOTAS TÉCNICO */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-bold">

          Notas del Técnico

        </h2>

        <p className="text-gray-700">

          {
            report.technician_notes ||
            "-"
          }

        </p>

      </div>

      {/* ESTADO */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm">

        <div className="flex items-center gap-3">

          <CheckCircle2
            className="text-green-600"
          />

          <span className="font-semibold">

            Estado:

          </span>

          <span
            className={`rounded-xl px-3 py-1 text-sm font-semibold ${
              report.service_completed

                ? "bg-green-100 text-green-700"

                : "bg-yellow-100 text-yellow-700"
            }`}
          >

            {report.service_completed

              ? "Completado"

              : "Pendiente"}

          </span>

        </div>

      </div>

    </div>

  );
}

function InfoField({
  label,
  value,
}: any) {

  return (

    <div>

      <p className="text-sm text-gray-500">

        {label}

      </p>

      <p className="mt-1 font-semibold">

        {value || "-"}

      </p>

    </div>

  );
}